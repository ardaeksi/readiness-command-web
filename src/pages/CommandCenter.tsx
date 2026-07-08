import { useCallback, useEffect, useState } from "react";
import { BaseMap } from "../components/map/BaseMap";
import { UnitMarker } from "../components/map/UnitMarker";
import { TransferMarker } from "../components/map/TransferMarker";
import { ReadinessSummary } from "../components/dashboard/ReadinessSummary";
import { PendingRequestsPanel } from "../components/dashboard/PendingRequestsPanel";
import { fetchUnits } from "../api/units";
import { fetchServiceMembers } from "../api/serviceMembers";
import { approveAssignmentRequest, denyAssignmentRequest, fetchAssignmentRequests } from "../api/assignmentRequests";
import type { AssignmentRequest, ServiceMember, Unit } from "../types/domain";

interface ActiveTransfer {
  from: [number, number];
  to: [number, number];
}

const DEFAULT_CENTER: [number, number] = [35.1391, -79.006];

export function CommandCenter() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [members, setMembers] = useState<ServiceMember[]>([]);
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [busyRequestId, setBusyRequestId] = useState<number | null>(null);
  const [activeTransfer, setActiveTransfer] = useState<ActiveTransfer | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [unitsData, membersData, requestsData] = await Promise.all([
        fetchUnits(),
        fetchServiceMembers(),
        fetchAssignmentRequests("PENDING"),
      ]);
      setUnits(unitsData);
      setMembers(membersData);
      setRequests(requestsData);
      setStatusMessage(null);
    } catch {
      setStatusMessage(
        "Could not reach the API. If this is the first run, open " +
          `${import.meta.env.VITE_API_BASE_URL ?? "https://localhost:8443"}/api/units ` +
          "directly and accept the self-signed certificate warning, then reload this page."
      );
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (request: AssignmentRequest) => {
    const fromUnit = units.find((unit) => unit.id === request.fromUnitId);
    const toUnit = units.find((unit) => unit.id === request.toUnitId);

    setBusyRequestId(request.id);
    try {
      await approveAssignmentRequest(request.id);
      if (fromUnit && toUnit) {
        setActiveTransfer({
          from: [fromUnit.latitude, fromUnit.longitude],
          to: [toUnit.latitude, toUnit.longitude],
        });
      }
      await loadData();
    } catch {
      setStatusMessage("Could not approve the request. It may have already been decided.");
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleDeny = async (request: AssignmentRequest) => {
    setBusyRequestId(request.id);
    try {
      await denyAssignmentRequest(request.id);
      await loadData();
    } catch {
      setStatusMessage("Could not deny the request. It may have already been decided.");
    } finally {
      setBusyRequestId(null);
    }
  };

  const membersByUnit = (unitId: number) => members.filter((member) => member.unitId === unitId);

  const mapCenter: [number, number] = units.length > 0 ? [units[0].latitude, units[0].longitude] : DEFAULT_CENTER;

  return (
    <div className="command-center">
      <header className="command-header">
        <h1>Readiness Command</h1>
        <p>Personnel readiness &amp; assignment tracking</p>
      </header>

      {statusMessage && <div className="status-banner">{statusMessage}</div>}

      <div className="command-body">
        <div className="map-panel">
          <BaseMap center={mapCenter}>
            {units.map((unit) => (
              <UnitMarker key={unit.id} unit={unit} members={membersByUnit(unit.id)} />
            ))}
            {activeTransfer && (
              <TransferMarker
                from={activeTransfer.from}
                to={activeTransfer.to}
                onComplete={() => setActiveTransfer(null)}
              />
            )}
          </BaseMap>
        </div>

        <aside className="dashboard-panel">
          <ReadinessSummary members={members} />
          <PendingRequestsPanel
            requests={requests}
            onApprove={handleApprove}
            onDeny={handleDeny}
            busyRequestId={busyRequestId}
          />
        </aside>
      </div>
    </div>
  );
}
