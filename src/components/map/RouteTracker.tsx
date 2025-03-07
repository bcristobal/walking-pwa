import React from 'react';
import { Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

interface RouteTrackerProps {
  positionHistory: LatLngExpression[];
}

export const RouteTracker = ({ positionHistory }: RouteTrackerProps) => {
  if (positionHistory.length <= 1) return null;
  
  return (
    <Polyline
      positions={positionHistory}
      color="#3388ff"
      weight={5}
      opacity={0.7}
    />
  );
};