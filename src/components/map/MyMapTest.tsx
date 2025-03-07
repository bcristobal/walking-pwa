import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
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

// Joystick Component
const Joystick = ({ onMove }: { onMove: (lat: number, lng: number) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const maxDistance = 50; // Maximum distance from center in pixels
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const calculatePosition = useCallback((clientX: number, clientY: number) => {
    const joystickElement = document.getElementById('joystick-container');
    if (!joystickElement) return;
    
    const rect = joystickElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let x = clientX - centerX;
    let y = clientY - centerY;
    
    // Calculate distance from center
    const distance = Math.sqrt(x * x + y * y);
    
    // Limit the movement within the maxDistance
    if (distance > maxDistance) {
      x = (x / distance) * maxDistance;
      y = (y / distance) * maxDistance;
    }
    
    // Convert to joystick position (50 is center)
    const posX = 50 + x;
    const posY = 50 + y;
    
    setPosition({ x: posX, y: posY });
    
    // Calculate movement direction and intensity
    const normalizedX = x / maxDistance; // -1 to 1
    const normalizedY = y / maxDistance; // -1 to 1
    
    // Adjust these values to control the sensitivity
    const latChange = -normalizedY * 0.0001; // Negative because Y is inverted
    const lngChange = normalizedX * 0.0001;
    
    onMove(latChange, lngChange);
  }, [onMove, maxDistance]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    calculatePosition(e.clientX, e.clientY);
  }, [isDragging, calculatePosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    calculatePosition(e.touches[0].clientX, e.touches[0].clientY);
  }, [isDragging, calculatePosition]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 50, y: 50 }); // Reset to center
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMouseMove, handleEnd, handleTouchMove]);
  
  return (
    <div 
      id="joystick-container" 
      className={style.joystickContainer}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div 
        className={style.joystickKnob} 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      />
    </div>
  );
};

const MyMap = () => {
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);
  const [usingJoystick, setUsingJoystick] = useState(false);
  const [positionHistory, setPositionHistory] = useState<LatLngExpression[]>([]);
  const [trackingActive, setTrackingActive] = useState(true);
  const [totalDistance, setTotalDistance] = useState(0); // Total distance in kilometers
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const minimumDistanceThreshold = 0.00001; // Minimum distance to record a new point
  const updateIntervalMs = 1000; // Minimum time between updates in milliseconds

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition: LatLngExpression = [latitude, longitude];
        
        // Only update from geolocation if not using joystick
        if (!usingJoystick) {
          setCurrentPosition(newPosition);
          
          // Add to position history if tracking is active
          if (trackingActive) {
            addToPositionHistory(newPosition);
          }
        }
        
        console.log("latitude:" + latitude + " and longitude: " + longitude);
        console.log("Accuracy: " + position.coords.accuracy);
        console.log("Speed: " + position.coords.speed);
      },
      (error) => {
        console.error("Error obtaining location", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [usingJoystick, trackingActive]);

  // Haversine formula to calculate distance between two coordinates in kilometers
  const calculateHaversineDistance = (pos1: LatLngExpression, pos2: LatLngExpression): number => {
    const [lat1, lon1] = pos1 as number[];
    const [lat2, lon2] = pos2 as number[];
    
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  };

  // Function to calculate distance between two points (simple version for threshold checks)
  const calculateDistance = (pos1: LatLngExpression, pos2: LatLngExpression): number => {
    const [lat1, lng1] = pos1 as number[];
    const [lat2, lng2] = pos2 as number[];
    
    // Simple Euclidean distance - sufficient for small distances
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
  };

  // Add position to history if it's significantly different from the last one
  const addToPositionHistory = (newPosition: LatLngExpression) => {
    const currentTime = Date.now();
    
    // Check if we have any previous positions and if enough time has passed
    if (
      positionHistory.length === 0 || 
      (currentTime - lastUpdateTimeRef.current >= updateIntervalMs)
    ) {
      // If we have a previous position, check if we've moved enough to record
      if (positionHistory.length > 0) {
        const lastPosition = positionHistory[positionHistory.length - 1];
        const distance = calculateDistance(lastPosition, newPosition);
        
        if (distance < minimumDistanceThreshold) {
          return; // Don't record if we haven't moved enough
        }
        
        // Calculate distance in kilometers and add to total
        const segmentDistance = calculateHaversineDistance(lastPosition, newPosition);
        setTotalDistance(prev => prev + segmentDistance);
      }
      
      setPositionHistory(prev => [...prev, newPosition]);
      lastUpdateTimeRef.current = currentTime;
    }
  };

  const handleJoystickMove = useCallback((latChange: number, lngChange: number) => {
    setUsingJoystick(true);
    
    setCurrentPosition((prev) => {
      if (!prev) return prev;
      const [lat, lng] = prev as number[];
      const newPosition: LatLngExpression = [lat + latChange, lng + lngChange];
      
      // Add to position history if tracking is active
      if (trackingActive) {
        addToPositionHistory(newPosition);
      }
      
      return newPosition;
    });
  }, [trackingActive]);

  // Function to toggle tracking
  const toggleTracking = () => {
    setTrackingActive(prev => !prev);
  };

  // Function to clear tracking history
  const clearTrackingHistory = () => {
    setPositionHistory([]);
    setTotalDistance(0);
  };

  // Default position (Warsaw, Poland)
  const defaultPosition: LatLngExpression = [52.22977, 21.01178];

  // Set initial position if geolocation not available
  useEffect(() => {
    if (!currentPosition) {
      setCurrentPosition(defaultPosition);
    }
  }, [currentPosition]);

  return (
    <div className={style.mapWrapper}>
      <MapContainer 
        className={style.mapContainer} 
        center={currentPosition || defaultPosition} 
        zoom={16}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentPosition && <MapUpdater position={currentPosition} />}
        
        {/* Polyline to show the tracking path */}
        {positionHistory.length > 1 && (
          <Polyline
            positions={positionHistory}
            color="#3388ff"
            weight={5}
            opacity={0.7}
          />
        )}
        
        {currentPosition && (
          <Marker position={currentPosition}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Distance counter */}
      <div className={style.distanceCounter}>
        <div className={style.distanceLabel}>Distancia total:</div>
        <div className={style.distanceValue}>
          {totalDistance.toFixed(3)} km
        </div>
      </div>
      
      {/* Joystick Control */}
      <div className={style.controls}>
        <Joystick onMove={handleJoystickMove} />
        <div className={style.controlInfo}>
          {usingJoystick ? "Control manual activo" : "GPS activo"}
        </div>
      </div>
      
      {/* Controls for tracking */}
      <div className={style.trackingControls}>
        <button 
          className={`${style.controlButton} ${trackingActive ? style.active : ''}`}
          onClick={toggleTracking}
        >
          {trackingActive ? "Trazado ON" : "Trazado OFF"}
        </button>
        <button 
          className={style.controlButton}
          onClick={clearTrackingHistory}
        >
          Borrar trazado
        </button>
      </div>
      
      <button 
        className={style.startButton}
        onClick={() => {
          setUsingJoystick(false);
          if (currentPosition) {
            addToPositionHistory(currentPosition);
          }
        }}
      >
        Empezar
      </button>
    </div>
  );
};

export default MyMap;