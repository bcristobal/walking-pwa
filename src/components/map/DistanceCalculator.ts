import type { LatLngExpression } from 'leaflet';

// Haversine formula to calculate distance between two coordinates in kilometers
export const calculateHaversineDistance = (pos1: LatLngExpression, pos2: LatLngExpression): number => {
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

// Simple Euclidean distance - sufficient for small distances/threshold checks
export const calculateSimpleDistance = (pos1: LatLngExpression, pos2: LatLngExpression): number => {
  const [lat1, lng1] = pos1 as number[];
  const [lat2, lng2] = pos2 as number[];
  
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
};