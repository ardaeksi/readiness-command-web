import { motion } from "framer-motion";
import { BRANCH_COLORS, BRANCH_LABELS, READINESS_COLORS, READINESS_LABELS, READINESS_ORDER } from "../../constants/readiness";
import { initials, titleCase } from "../../utils/format";
import type { ReadinessStatus, ServiceMember, Unit } from "../../types/domain";

interface BaseDetailModalProps {
  unit: Unit;
  members: ServiceMember[];
  onClose: () => void;
}

export function BaseDetailModal({ unit, members, onClose }: BaseDetailModalProps) {
  const counts = members.reduce<Partial<Record<ReadinessStatus, number>>>((acc, member) => {
    acc[member.readinessStatus] = (acc[member.readinessStatus] ?? 0) + 1;
    return acc;
  }, {});

  const branchColor = BRANCH_COLORS[unit.branch];

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="base-modal"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="base-modal-banner" style={{ background: `linear-gradient(135deg, ${branchColor}, #0c2f4f)` }}>
          <span className="base-modal-branch-badge" style={{ background: branchColor }}>
            {BRANCH_LABELS[unit.branch].charAt(0)}
          </span>
          <div>
            <h2>{unit.name}</h2>
            <p>
              {BRANCH_LABELS[unit.branch]} &middot; {unit.location}
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="base-modal-body">
          <div className="base-modal-stats">
            <div className="base-modal-stat">
              <span className="base-modal-stat-count">{members.length}</span>
              <span className="base-modal-stat-label">Total Assigned</span>
            </div>
            {READINESS_ORDER.map((status) => (
              <div key={status} className="base-modal-stat">
                <span className="base-modal-stat-count" style={{ color: READINESS_COLORS[status] }}>
                  {counts[status] ?? 0}
                </span>
                <span className="base-modal-stat-label">{READINESS_LABELS[status]}</span>
              </div>
            ))}
          </div>

          <h3>Roster</h3>
          <div className="roster-list">
            {members.length === 0 && <p className="empty-state">No personnel assigned to this base.</p>}
            {members.map((member) => (
              <div key={member.id} className="roster-row">
                <span className="roster-avatar" style={{ background: READINESS_COLORS[member.readinessStatus] }}>
                  {initials(member.firstName, member.lastName)}
                </span>
                <div className="roster-info">
                  <span className="roster-name">
                    {titleCase(member.rank)} {member.firstName} {member.lastName}
                  </span>
                  <span className="roster-status">{READINESS_LABELS[member.readinessStatus]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
