import type { LatLngExpression } from 'leaflet';

// Normaliza las coordenadas a formato [lat, lng]
const normalizeCoordinates = (pos: LatLngExpression): [number, number] => {
  if (Array.isArray(pos)) {
    return pos as [number, number];
  } else {
    return [pos.lat, pos.lng];
  }
};

// Haversine formula corregida
export const calculateHaversineDistance = (pos1: LatLngExpression, pos2: LatLngExpression): number => {
  const [lat1, lon1] = normalizeCoordinates(pos1);
  const [lat2, lon2] = normalizeCoordinates(pos2);
  
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distancia en kilómetros
  
  return distance;
};

// Corrección para la distancia simple
export const calculateSimpleDistance = (pos1: LatLngExpression, pos2: LatLngExpression): number => {
  const [lat1, lng1] = normalizeCoordinates(pos1);
  const [lat2, lng2] = normalizeCoordinates(pos2);
  
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
};