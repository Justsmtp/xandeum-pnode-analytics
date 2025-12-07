//  frontend/src/utils/helpers.js

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format uptime in seconds to human readable format
 */
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

/**
 * Format date to relative time
 */
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

/**
 * Calculate storage percentage
 */
export const getStoragePercentage = (used, total) => {
  if (!total || total === 0) return 0;
  return ((used / total) * 100).toFixed(1);
};

/**
 * Get status color
 */
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