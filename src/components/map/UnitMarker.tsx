import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { ServiceMember, Unit } from "../../types/domain";

const unitIcon = L.divIcon({
  className: "unit-marker",
  html: '<div class="unit-marker-pin"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

interface UnitMarkerProps {
  unit: Unit;
  members: ServiceMember[];
}

export function UnitMarker({ unit, members }: UnitMarkerProps) {
  const readyCount = members.filter((m) => m.readinessStatus === "READY").length;

  return (
    <Marker position={[unit.latitude, unit.longitude]} icon={unitIcon}>
      <Popup>
        <div className="unit-popup">
          <h3>{unit.name}</h3>
          <p>
            {unit.branch} &middot; {unit.location}
          </p>
          <p>
            {members.length} assigned &middot; {readyCount} ready
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
