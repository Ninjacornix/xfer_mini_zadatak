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
  [45.80558722631532,15.982263269620503],
[45.80288301947747,15.963337909878629],
[45.80837334869255,15.980495327006762],
[45.80850072738114,15.995897327348327],
[45.81195492948553,15.973242598480482],
[45.8057143263365,15.977592140846657],
[45.80594132625922,15.986604498488177],
[45.83237666115715,15.976691289777696],
[45.79610951577996,15.975742318012871],
[45.79548945991166,15.9703800977984],
[45.79241624579775,15.967861347682009],
[45.81211290914488,15.96958332477637],
[45.81162173438676,15.980496712637809],
[45.81346763078366,15.964666740763082],
[45.802724329106006,16.003157316624034],
[45.795073239739295,15.994602926999647],
[45.79990519258438,16.005837855444053],
[45.81013895081581,16.01665331155555],
[45.806549668816736,15.96734899780046],
[45.79725974121769,15.98327812700002],
[45.80082872326693,15.972206727349096],
[45.8083857438019,15.974887229508193],
[45.796905204948686,15.966347649076924],
[45.798759579112165,15.988631511629247],
[45.80956913438709,15.986231721951883],
[45.81201944150146,15.977190199960305],
[45.809514113031256,15.96220512011199],
[45.811162252465344,15.998046648877349],
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

    const str = "https://routing.openstreetmap.de/routed-car/route/v1/driving/";
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

    if(coordinates != undefined && coordinates.length > 1 && coordinates.length == 30 && JSON.stringify(coordinates[0]) == JSON.stringify(latlng)) {
      setCoordinates([...coordinates, latlng]);
      setGameEnd(true);
      alert("Game end");
    } else if(coordinates.length > 0) {
      for(let i = 0; i < coordinates.length; i++) {
        if(JSON.stringify(coordinates[i]) == JSON.stringify(latlng)) {
          return
        }
      }
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

  useEffect(() => {
    if(score.score == 0){
      const dat = Array.from(document.getElementsByClassName('leaflet-marker-pane')[0].childNodes);
      for(let i = 0; i < dat.length; i++) {
        (dat[i] as HTMLElement).style.cursor = "pointer";
        (document.getElementsByClassName('leaflet-marker-icon')[i] as HTMLImageElement).src = "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png";
      }
    }
  }
  , [score.score]);

  return (
    <MapContainer center={position} zoomControl={false} doubleClickZoom={false} zoom={13} scrollWheelZoom={true} style={{height: "100%", width: "100%"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?markers"
      />

      {locations.map((l, index) => (
      <Marker position={l}
        icon={myIcon}
        key={l[0]} eventHandlers={{
        click: () => {

          if(disabled) return
          if(gameEnd) return

          if(document.getElementsByClassName('leaflet-marker-pane')[0].childNodes[index] != undefined){
            (document.getElementsByClassName('leaflet-marker-pane')[0].childNodes[index] as HTMLElement).style.cursor = "default";
            console.log(document.getElementsByClassName('leaflet-marker-pane')[0].childNodes[index]);
            (document.getElementsByClassName('leaflet-marker-icon')[index] as HTMLImageElement).src = "https://cdn3.iconfinder.com/data/icons/flat-pro-basic-set-1-1/32/location-gray-512.png";
          }

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
