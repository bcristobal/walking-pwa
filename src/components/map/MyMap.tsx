import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import style from "./myMap.module.css";

const MapUpdater = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
};

const MyMap = () => {
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
        console.log("latutude:" + latitude + " and longitude: " + longitude)
        console.log("Accuracy: " + position.coords.accuracy)
        console.log("Speed: " + position.coords.speed)
        
      },
      (error) => {
        console.error("Error obtaining location", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className={style.mapWrapper}>
      <MapContainer className={style.mapContainer} center={currentPosition || [52.22977, 21.01178]} zoom={16}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentPosition && <MapUpdater position={currentPosition} />}
        {currentPosition && (
          <Marker position={currentPosition}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>
      <button className={style.startButton}>Empezar</button>
    </div>
  );
};

export default MyMap;
