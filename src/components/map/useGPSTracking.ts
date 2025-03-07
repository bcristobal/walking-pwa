import { useState, useEffect, useRef } from 'react';
import type { LatLngExpression } from 'leaflet';
import { calculateSimpleDistance, calculateHaversineDistance } from './DistanceCalculator';

interface GPSTrackingResult {
  currentPosition: LatLngExpression | null;
  positionHistory: LatLngExpression[];
  totalDistance: number;
  addToPositionHistory: (position: LatLngExpression) => void;
  resetTracking: () => void;
}

export const useGPSTracking = (isTracking: boolean): GPSTrackingResult => {
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);
  const [positionHistory, setPositionHistory] = useState<LatLngExpression[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const watchIdRef = useRef<number | null>(null);
  
  const minimumDistanceThreshold = 0.00001; // Minimum distance to record a new point
  const updateIntervalMs = 1000; // Minimum time between updates in milliseconds

  // Initialize GPS and track position
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error obtaining initial location", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Only watch position when tracking is active
    if (isTracking) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition: LatLngExpression = [latitude, longitude];
          
          setCurrentPosition(newPosition);
          addToPositionHistory(newPosition);
          
          console.log("latitude:" + latitude + " and longitude: " + longitude);
          console.log("Accuracy: " + position.coords.accuracy);
          if (position.coords.speed !== null) {
            console.log("Speed: " + position.coords.speed);
          }
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
      
      watchIdRef.current = watchId;
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isTracking]);

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
        const distance = calculateSimpleDistance(lastPosition, newPosition);
        
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

  const resetTracking = () => {
    setPositionHistory([]);
    setTotalDistance(0);
  };

  return {
    currentPosition,
    positionHistory,
    totalDistance,
    addToPositionHistory,
    resetTracking
  };
};