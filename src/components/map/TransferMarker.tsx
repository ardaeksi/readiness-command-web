import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import { animate } from "framer-motion";
import L from "leaflet";

const travelIcon = L.divIcon({
  className: "transfer-marker",
  html: '<div class="transfer-marker-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface TransferMarkerProps {
  from: [number, number];
  to: [number, number];
  durationSeconds?: number;
  onComplete?: () => void;
}

export function TransferMarker({ from, to, durationSeconds = 1.8, onComplete }: TransferMarkerProps) {
  const [position, setPosition] = useState<[number, number]>(from);

  useEffect(() => {
    const controls = animate(0, 1, {
      duration: durationSeconds,
      ease: "easeInOut",
      onUpdate: (t) => {
        setPosition([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
      },
      onComplete,
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from[0], from[1], to[0], to[1], durationSeconds]);

  return <Marker position={position} icon={travelIcon} />;
}
