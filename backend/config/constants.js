// backend/config/constants.js
export const PRPC_CONFIG = {
  // Placeholder - Xandeum doesn't have public API yet
  BASE_URL: process.env.PRPC_BASE_URL || 'https://rpc.xandeum.network',
  
  // These endpoints don't exist yet - waiting for Xandeum API documentation
  ENDPOINTS: {
    GOSSIP_NODES: '/api/v1/pnodes',
    NODE_INFO: '/api/v1/pnode',
    NODE_METRICS: '/api/v1/metrics',
    VALIDATORS: '/api/v1/validators',
    NETWORK_STATUS: '/api/v1/status',
  },
  
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  CACHE_TTL: 30000,
  
  // Enable mock mode until API is available
  USE_MOCK_DATA: true,
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

// pNode specifications from Xandeum documentation
export const PNODE_SPECS = {
  MIN_CPU_CORES: 4,
  MIN_RAM_GB: 4,
  MIN_STORAGE_GB: 80,
  MIN_NETWORK_GBPS: 1,
  REQUIRED_PORTS: [3000, 4000, 5000, 8000],
  OS: 'Ubuntu 24.04 LTS',
};