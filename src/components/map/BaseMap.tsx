import { MapContainer, TileLayer } from "react-leaflet";
import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";

interface BaseMapProps {
  center: [number, number];
  zoom?: number;
  children?: ReactNode;
}

export function BaseMap({ center, zoom = 12, children }: BaseMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
