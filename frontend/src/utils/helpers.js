// frontend/src/utils/helpers.js

export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatUptime = (seconds) => {
  if (!seconds || seconds === 0) return '0s';

  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '< 1m';
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export const getStoragePercentage = (used, total) => {
  if (!total || total === 0) return 0;
  return ((used / total) * 100).toFixed(1);
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return '#4CAF50';
    case 'gossiping':
      return '#00C853';
    case 'offline':
      return '#9E9E9E';
    default:
      return '#BDBDBD';
  }
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const calculateHealthScore = (activeNodes, totalNodes) => {
  if (totalNodes === 0) return 0;
  return ((activeNodes / totalNodes) * 100).toFixed(1);
};

export const getLatencyClass = (latency) => {
  if (!latency) return 'unknown';
  if (latency < 50) return 'excellent';
  if (latency < 100) return 'good';
  if (latency < 200) return 'fair';
  return 'poor';
};

export const formatSOL = (amount) => {
  return `${(amount / 1000000000).toFixed(2)} SOL`;
};

export const truncateAddress = (address, start = 6, end = 4) => {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};