import L from 'leaflet';
import {Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

interface MyMarkerProps {
  /** The position of the marker */
  position: LatLngExpression;
}

var icon = L.icon({
  iconUrl: "blue_point.png",
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

export default function MyMarker ({position}: MyMarkerProps) {
  return (
    <Marker
      position={position}
      icon={icon}
    >

    </Marker>
  )
}