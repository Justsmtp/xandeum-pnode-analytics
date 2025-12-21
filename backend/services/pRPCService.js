// backend/services/pRPCService.js
import axios from 'axios';
import { PRPC_CONFIG, PNODE_SPECS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

class PRPCService {
  constructor() {
    this.useMockData = process.env.USE_MOCK_DATA === 'true' || process.env.PRPC_API_AVAILABLE === 'false';
    
    if (this.useMockData) {
      logger.warn('⚠️  Xandeum API not available - using realistic mock data');
      logger.info('💡 Mock data simulates real pNode behavior based on Xandeum specs');
      logger.info('🔗 API will be integrated when available - check https://xandeum.network/docs');
    }

    this.client = axios.create({
      baseURL: PRPC_CONFIG.BASE_URL,
      timeout: PRPC_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        logger.info(`📡 pRPC Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error(`❌ pRPC Request Error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`✅ pRPC Response: ${response.status}`);
        return response;
      },
      (error) => {
        logger.error(`❌ pRPC Response Error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    // Initialize mock data generator
    this.mockDataGenerator = new MockPNodeGenerator();
  }

  async getAllPNodes() {
    // Always use mock data until API is available
    if (this.useMockData) {
      return this.mockDataGenerator.generateRealtimePNodes();
    }

    // Real API call (when available)
    try {
      const response = await this.client.get(PRPC_CONFIG.ENDPOINTS.GOSSIP_NODES);
      const pNodes = this.transformPNodeData(response.data);
      
      return {
        success: true,
        data: pNodes,
        count: pNodes.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`API call failed, falling back to mock data: ${error.message}`);
      return this.mockDataGenerator.generateRealtimePNodes();
    }
  }

  async getPNodeById(nodeId) {
    if (this.useMockData) {
      return this.mockDataGenerator.getPNodeById(nodeId);
    }

    try {
      const response = await this.client.get(
        `${PRPC_CONFIG.ENDPOINTS.NODE_INFO}/${nodeId}`
      );
      
      return {
        success: true,
        data: this.transformSingleNode(response.data),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Failed to fetch pNode ${nodeId}: ${error.message}`);
      throw error;
    }
  }

  transformPNodeData(apiData) {
    if (Array.isArray(apiData)) {
      return apiData.map(node => this.transformSingleNode(node));
    }
    
    if (apiData.nodes || apiData.pnodes) {
      return (apiData.nodes || apiData.pnodes).map(node => this.transformSingleNode(node));
    }
    
    return [];
  }

  transformSingleNode(node) {
    return {
      id: node.id || node.nodeId || node.pubkey,
      gossipStatus: node.gossipStatus || node.status || 'unknown',
      storage: {
        used: node.storage?.used || node.storageUsed || 0,
        total: node.storage?.total || node.storageTotal || 0,
        available: node.storage?.available || node.storageAvailable || 0,
      },
      location: {
        country: node.location?.country || node.country || 'Unknown',
        region: node.location?.region || node.region || 'Unknown',
        city: node.location?.city || node.city || 'Unknown',
        coordinates: node.location?.coordinates || null,
      },
      uptime: node.uptime || 0,
      version: node.version || 'unknown',
      lastSeen: node.lastSeen || new Date().toISOString(),
      metadata: {
        ip: node.ip || node.ipAddress || null,
        port: node.port || null,
        latency: node.latency || null,
        specs: {
          cpu: node.specs?.cpu || PNODE_SPECS.MIN_CPU_CORES,
          ram: node.specs?.ram || PNODE_SPECS.MIN_RAM_GB,
          storage: node.specs?.storage || PNODE_SPECS.MIN_STORAGE_GB,
        },
        ...node.metadata,
      },
    };
  }
}

// Mock Data Generator - Simulates Real pNode Behavior
class MockPNodeGenerator {
  constructor() {
    this.nodes = [];
    this.lastUpdate = Date.now();
    this.initializeNodes();
  }

  initializeNodes() {
    const locations = [
      { region: 'West Africa', country: 'Nigeria', cities: ['Lagos', 'Abuja', 'Port Harcourt'], lat: 6.5244, lon: 3.3792 },
      { region: 'North America', country: 'United States', cities: ['New York', 'San Francisco', 'Miami'], lat: 40.7128, lon: -74.0060 },
      { region: 'Europe', country: 'Germany', cities: ['Frankfurt', 'Berlin', 'Munich'], lat: 50.1109, lon: 8.6821 },
      { region: 'Asia', country: 'Singapore', cities: ['Singapore'], lat: 1.3521, lon: 103.8198 },
      { region: 'South America', country: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro'], lat: -23.5505, lon: -46.6333 },
      { region: 'Oceania', country: 'Australia', cities: ['Sydney', 'Melbourne'], lat: -33.8688, lon: 151.2093 },
    ];

    // Generate 20 realistic pNodes
    for (let i = 0; i < 20; i++) {
      const location = locations[i % locations.length];
      const city = location.cities[Math.floor(Math.random() * location.cities.length)];
      
      this.nodes.push({
        id: `pNode-${String(i + 1).padStart(3, '0')}-${this.generateNodeHash()}`,
        gossipStatus: this.randomStatus(),
        storage: this.generateStorage(),
        location: {
          country: location.country,
          region: location.region,
          city: city,
          coordinates: {
            lat: location.lat + (Math.random() - 0.5) * 2,
            lon: location.lon + (Math.random() - 0.5) * 2,
          },
        },
        uptime: Math.floor(Math.random() * 10000000),
        version: `xandminer-${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
        lastSeen: new Date().toISOString(),
        metadata: {
          ip: this.generateIP(),
          port: 5000, // Xandeum uses port 5000
          latency: Math.floor(Math.random() * 150) + 20,
          specs: {
            cpu: PNODE_SPECS.MIN_CPU_CORES + Math.floor(Math.random() * 4),
            ram: PNODE_SPECS.MIN_RAM_GB + Math.floor(Math.random() * 12),
            storage: PNODE_SPECS.MIN_STORAGE_GB + Math.floor(Math.random() * 400),
          },
          ports: {
            gui: 3000,
            daemon: 4000,
            udp: 5000,
            stats: 8000,
          },
        },
      });
    }
  }

  generateRealtimePNodes() {
    // Simulate real-time changes
    const now = Date.now();
    if (now - this.lastUpdate > 5000) { // Update every 5 seconds
      this.updateNodes();
      this.lastUpdate = now;
    }

    return {
      success: true,
      data: this.nodes,
      count: this.nodes.length,
      timestamp: new Date().toISOString(),
      note: 'Realistic mock data - Simulates Xandeum pNode behavior. Real API coming soon.',
      apiStatus: 'Mock data - API in development',
    };
  }

  updateNodes() {
    this.nodes.forEach(node => {
      // Randomly update node status (5% chance)
      if (Math.random() < 0.05) {
        node.gossipStatus = this.randomStatus();
      }

      // Update storage (simulate growth)
      if (node.gossipStatus === 'active') {
        node.storage.used += Math.floor(Math.random() * 1000000000);
        node.storage.available = node.storage.total - node.storage.used;
      }

      // Update uptime
      if (node.gossipStatus !== 'offline') {
        node.uptime += 5;
      }

      // Update latency
      node.metadata.latency = Math.floor(Math.random() * 150) + 20;

      // Update last seen
      node.lastSeen = new Date().toISOString();
    });
  }

  getPNodeById(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    
    if (!node) {
      return {
        success: false,
        error: 'pNode not found',
      };
    }

    return {
      success: true,
      data: node,
      timestamp: new Date().toISOString(),
    };
  }

  generateNodeHash() {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  generateIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  generateStorage() {
    const minStorage = PNODE_SPECS.MIN_STORAGE_GB * 1024 * 1024 * 1024;
    const total = minStorage + Math.floor(Math.random() * 400 * 1024 * 1024 * 1024);
    const used = Math.floor(Math.random() * total * 0.7);
    
    return {
      used,
      total,
      available: total - used,
    };
  }

  randomStatus() {
    const statuses = ['active', 'active', 'active', 'gossiping', 'offline'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}

export default new PRPCService();