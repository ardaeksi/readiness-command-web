import type { ReadinessStatus, ServiceMember } from "../../types/domain";

const STATUS_LABELS: Record<ReadinessStatus, string> = {
  READY: "Ready",
  LIMITED: "Limited",
  NOT_READY: "Not Ready",
  ON_LEAVE: "On Leave",
  DEPLOYED: "Deployed",
};

const STATUS_COLORS: Record<ReadinessStatus, string> = {
  READY: "#2ecc71",
  LIMITED: "#f1c40f",
  NOT_READY: "#e74c3c",
  ON_LEAVE: "#95a5a6",
  DEPLOYED: "#3498db",
};

const STATUS_ORDER: ReadinessStatus[] = ["READY", "LIMITED", "NOT_READY", "ON_LEAVE", "DEPLOYED"];

interface ReadinessSummaryProps {
  members: ServiceMember[];
}

export function ReadinessSummary({ members }: ReadinessSummaryProps) {
  const counts = members.reduce<Partial<Record<ReadinessStatus, number>>>((acc, member) => {
    acc[member.readinessStatus] = (acc[member.readinessStatus] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="readiness-summary">
      <h2>Readiness Summary</h2>
      <div className="readiness-tiles">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="readiness-tile" style={{ borderColor: STATUS_COLORS[status] }}>
            <span className="readiness-tile-count" style={{ color: STATUS_COLORS[status] }}>
              {counts[status] ?? 0}
            </span>
            <span className="readiness-tile-label">{STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
