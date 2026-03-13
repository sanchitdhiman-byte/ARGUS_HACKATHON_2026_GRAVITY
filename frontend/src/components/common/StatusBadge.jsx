import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#6b7280';
  const label = STATUS_LABELS[status] || status?.replace(/_/g, ' ') || 'Unknown';

  return (
    <span
      className="badge"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        borderColor: `${color}40`,
      }}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
