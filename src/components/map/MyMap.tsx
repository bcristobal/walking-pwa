import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import style from "./myMap.module.css";

// Import components
import { MapUpdater } from './MapUpdater';
import { StatsPanel } from './StatsPanel';
import { ControlButton } from './ControlButton';
import { RouteTracker } from './RouteTracker';

// Import hooks
import { useGPSTracking } from './useGPSTracking';
import { useTimer } from './useTimer';

const MyMap = () => {
  const [isTracking, setIsTracking] = useState(false);
  const { currentPosition, positionHistory, totalDistance, resetTracking } = useGPSTracking(isTracking);
  const { elapsedTime, resetTimer } = useTimer(isTracking);

  // Default position (Warsaw, Poland)
  const defaultPosition: LatLngExpression = [52.22977, 21.01178];

  // Toggle tracking on/off
  const toggleTracking = () => {
    if (isTracking) {
      // Stop tracking
      setIsTracking(false);
    } else {
      // Start tracking
      setIsTracking(true);
      resetTracking();
      resetTimer();
    }
  };

  return (
    <div className={style.mapWrapper}>
      <MapContainer 
        className={style.mapContainer} 
        center={currentPosition || defaultPosition} 
        zoom={16}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentPosition && <MapUpdater position={currentPosition} />}
        
        {/* Route tracker */}
        <RouteTracker positionHistory={positionHistory} />
        
        {/* Current position marker */}
        {currentPosition && (
          <Marker position={currentPosition}>
            <Popup>Estás aquí</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Stats panel */}
      <StatsPanel distance={totalDistance} elapsedTime={elapsedTime} />
      
      {/* Control button */}
      <ControlButton isTracking={isTracking} onClick={toggleTracking} />
    </div>
  );
};

export default MyMap;