"use client";
import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, Polyline} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const myIcon = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [38, 38],
});

const locations = [
  [45.785314628612255, 15.947685997481987],
  [45.800288668119755, 15.97164173205293],
  [45.79062923747965, 15.955108335425694]
]

const position = [45.800399, 15.977568];

export default function Maps({score}: {score: any}) {
  const [poly, setData] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [currentScrore, setCurrentScore] = useState(0);
  const [gameEnd, setGameEnd] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const fetchTwoCoordinates = async () => {

    const str = "http://router.project-osrm.org/route/v1/driving/"
    const end = "?overview=full&geometries=geojson"
    let stringdata;

    if(coordinates == undefined) return

    let lastTwoCoordinates = [];
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
    if(coordinates != undefined && coordinates.length > 1 && JSON.stringify(coordinates[0]) == JSON.stringify(latlng)) {
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