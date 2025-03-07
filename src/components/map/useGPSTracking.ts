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
  
  // Aumentado el umbral para reducir ruido de GPS
  const minimumDistanceThreshold = 0.00005; // Aproximadamente 5-10 metros en coordenadas
  const updateIntervalMs = 2000; // Aumentado a 2 segundos para mejor precisión
  const accuracyThreshold = 20; // Solo considera lecturas con precisión menor a 20 metros

  // Inicializar GPS y seguir posición
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    // Obtener posición inicial
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition: LatLngExpression = [latitude, longitude];
        setCurrentPosition(newPosition);
        
        // Solo inicializa el historial de posiciones si estamos rastreando
        if (isTracking && positionHistory.length === 0) {
          setPositionHistory([newPosition]);
        }
      },
      (error) => {
        console.error("Error obtaining initial location", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Solo observar la posición cuando el seguimiento está activo
    if (isTracking) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newPosition: LatLngExpression = [latitude, longitude];
          
          setCurrentPosition(newPosition);
          
          // Solo añade a la historia si la precisión es aceptable
          if (accuracy <= accuracyThreshold) {
            addToPositionHistory(newPosition);
          }
          
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          console.log(`Accuracy: ${accuracy} meters`);
          if (position.coords.speed !== null) {
            console.log(`Speed: ${position.coords.speed} m/s`);
          }
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
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

  // Añadir posición al historial si es significativamente diferente de la última
  const addToPositionHistory = (newPosition: LatLngExpression) => {
    const currentTime = Date.now();
    
    setPositionHistory(prevHistory => {
      // Si no hay posiciones previas, simplemente añade esta
      if (prevHistory.length === 0) {
        lastUpdateTimeRef.current = currentTime;
        return [newPosition];
      }
      
      // Comprueba si ha pasado suficiente tiempo desde la última actualización
      if (currentTime - lastUpdateTimeRef.current < updateIntervalMs) {
        return prevHistory;
      }
      
      const lastPosition = prevHistory[prevHistory.length - 1];
      const distance = calculateSimpleDistance(lastPosition, newPosition);
      
      // No registrar si no nos hemos movido lo suficiente
      if (distance < minimumDistanceThreshold) {
        return prevHistory;
      }
      
      // Calcular distancia en kilómetros y añadir al total
      const segmentDistance = calculateHaversineDistance(lastPosition, newPosition);
      
      // Solo actualizamos si la distancia es razonable (evita saltos grandes)
      if (segmentDistance < 1.0) { // Limita saltos a 1km como máximo
        setTotalDistance(prev => prev + segmentDistance);
        lastUpdateTimeRef.current = currentTime;
        return [...prevHistory, newPosition];
      }
      
      return prevHistory;
    });
  };

  const resetTracking = () => {
    setPositionHistory([]);
    setTotalDistance(0);
    lastUpdateTimeRef.current = Date.now();
  };

  return {
    currentPosition,
    positionHistory,
    totalDistance,
    addToPositionHistory,
    resetTracking
  };
};