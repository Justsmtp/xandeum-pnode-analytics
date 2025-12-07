export const PRPC_CONFIG = {
  BASE_URL: process.env.PRPC_BASE_URL || 'https://api.xandeum.network',
  ENDPOINTS: {
    GOSSIP_NODES: '/v1/gossip/nodes',
    NODE_INFO: '/v1/node/info',
    NODE_METRICS: '/v1/node/metrics',
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: 30000, // 30 seconds
};

export const NODE_STATUS = {
  ACTIVE: 'active',
  GOSSIPING: 'gossiping',
  OFFLINE: 'offline',
  UNKNOWN: 'unknown',
};

export const REGIONS = [
  'North America',
  'Europe',
  'Asia',
  'South America',
  'Africa',
  'Oceania',
  'Unknown'
];