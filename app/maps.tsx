"use client";
import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, Polyline} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const myIcon = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [38, 38],
});

const locations: [number, number][] = [
  [45.80850072738114,15.995897327348327],
  [45.8127078082012,15.965822569960194],
  [45.7957979116309,15.994046466360633],
  [45.83237666115715,15.976691289777696],
  [45.79241624579775,15.967861347682009],
  [45.790769337332456,15.962603669275117],
  [45.81308553008886,15.985218298487208],
  [45.79529545617052,15.966862987204482],
  [45.79208453798948,15.962314998140384],
  [45.79301777983297,15.96999731858222],
  [45.81346763078366,15.964666740763082],
  [45.802724329106006,16.003157316624034],
  [45.79477036242666,15.964455359288154],
  [45.795073239739295,15.994602926999647],
  [45.79990519258438,16.005837855444053],
  [45.81152737281019,15.997271997794591],
  [45.81013895081581,16.01665331155555],
  [45.7906664749969,15.962517897448157],
  [45.8031305900108,15.96356649572598],
  [45.79605451972534,15.96458844280814],
  [45.81469737831795,15.965038984815903],
  [45.79535766682832,15.967443600671858],
  [45.813597181124806,15.964735335581835],
  [45.796905204948686,15.966347649076924],
  [45.81274526135703,15.992717206633596],
  [45.809514113031256,15.96220512011199],
  [45.811162252465344,15.998046648877349],
  [45.81330322791377,15.997261164280657],
  [45.78081263901853,15.964095642314463],
  [45.80786913033796,16.00886497431401]
]

const position: [number, number] = [45.800399, 15.977568];

export default function Maps({score}: {score: any}) {
  const [poly, setData] = useState<any>([]);
  const [coordinates, setCoordinates] = useState<any>([]);
  const [currentScrore, setCurrentScore] = useState(0);
  const [gameEnd, setGameEnd] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const fetchTwoCoordinates = async () => {

    const str = "http://34.154.16.199/route/v1/driving/"
    const end = "?overview=full&geometries=geojson"
    let stringdata;

    if(coordinates == undefined) return

    let lastTwoCoordinates: string[][] = [];
    if(coordinates.length > 1) {
      lastTwoCoordinates.push(coordinates[coordinates.length - 2]);
      lastTwoCoordinates.push(coordinates[coordinates.length - 1]);
    } else {
      lastTwoCoordinates.push(coordinates[0]);
    }

    for(let i = 0; i < lastTwoCoordinates.length; i++) {
      if(i == 0) {
        stringdata = lastTwoCoordinates[i][0] + "," + lastTwoCoordinates[i][1];
      } else {
        stringdata += ";" + lastTwoCoordinates[i][0] + "," + lastTwoCoordinates[i][1];
      }
    }

    const response = await fetch(str + stringdata + end);
    const data = await response.json();
    let polyline = [];
    for(let i = 0; i < data.routes[0].geometry.coordinates.length; i++) {
      polyline.push([data.routes[0].geometry.coordinates[i][1], data.routes[0].geometry.coordinates[i][0]]);
    }

    let dist = 0;

    for(let i = 0; i < data.routes[0].legs.length; i++) {
      dist += data.routes[0].legs[i].distance;
    }

    setCurrentScore(currentScrore + dist);
    setData([...poly, polyline]);
    score.gameFinished(currentScrore + dist);
  };


  const handleClick = (position: any) => {
    if(position == "") return
    if(gameEnd) return
    if(disabled) return
    let latlng = [position[1], position[0]];
    if(coordinates != undefined && coordinates.length > 1 && coordinates.length == 29 && JSON.stringify(coordinates[0]) == JSON.stringify(latlng)) {
      setCoordinates([...coordinates, latlng]);
      setGameEnd(true);
      console.log("gameEnd");
    } else if(coordinates.length > 0) {
      setCoordinates([...coordinates, latlng]);
    } else {
      setCoordinates([latlng]);
    }
  }

  useEffect(() => {
    if(coordinates.length > 1) {
      fetchTwoCoordinates();
    }
  }
  , [coordinates]);

  useEffect(() => { 
    if(score.remove) {
      setData([]);
      setGameEnd(false);
      setCoordinates([]);
      setCurrentScore(0);
    }
  }
  , [score.remove]);

  useEffect(() => {
    if(score.user != "") {
      setDisabled(false);
    }
  } , [score.user]);

  return (
    <MapContainer center={position} zoomControl={false} doubleClickZoom={false} zoom={14} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?markers"
      />

      {locations.map((l) => (
      <Marker position={l} icon={myIcon} key={l[0]} eventHandlers={{
        click: () => {
          handleClick(l);
        }
      }} />
      ))}

      <FeatureGroup>
        <Polyline pathOptions={{color: 'red'}} positions={poly} />
      </FeatureGroup>

    </MapContainer>
  );
}
