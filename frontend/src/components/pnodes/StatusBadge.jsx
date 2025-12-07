// frontend/src/components/pnodes/StatusBadge.jsx
import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { label: 'Active', className: 'status-active' };
      case 'gossiping':
        return { label: 'Gossiping', className: 'status-gossiping' };
      case 'offline':
        return { label: 'Offline', className: 'status-offline' };
      default:
        return { label: 'Unknown', className: 'status-unknown' };
    }
  };

  const { label, className } = getStatusInfo(status);

  return (
    <span className={`status-badge ${className}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  );
};

export default StatusBadge;
