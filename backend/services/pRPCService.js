// backend/services/pRPCService.js
import axios from 'axios';
import { PRPC_CONFIG } from '../config/constants.js';
import { logger } from '../utils/logger.js';

class PRPCService {
  constructor() {
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
        logger.info(`🔗 Full URL: ${PRPC_CONFIG.BASE_URL}${config.url}`);
        return config;
      },
      (error) => {
        logger.error(`❌ pRPC Request Error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`✅ pRPC Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error(`❌ pRPC Response Error: ${error.message}`);
        if (error.code === 'ENOTFOUND') {
          logger.error(`❌ DNS Error: Cannot resolve ${PRPC_CONFIG.BASE_URL}`);
          logger.error(`💡 Check if the domain exists and your network connection is active`);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Test connection to pRPC endpoint
   */
  async testConnection() {
    try {
      logger.info(`🔍 Testing connection to: ${PRPC_CONFIG.BASE_URL}`);
      
      // Try to fetch network status or health endpoint
      const response = await this.client.get('/status', { timeout: 5000 });
      
      logger.success(`✅ Connection successful!`);
      return { success: true, data: response.data };
    } catch (error) {
      logger.error(`❌ Connection test failed: ${error.message}`);
      
      if (error.code === 'ENOTFOUND') {
        logger.error(`💡 The domain ${PRPC_CONFIG.BASE_URL} does not exist`);
        logger.error(`💡 Please check the Xandeum documentation for the correct API URL`);
      } else if (error.code === 'ECONNREFUSED') {
        logger.error(`💡 Connection refused - the server might be down`);
      } else if (error.response?.status === 404) {
        logger.error(`💡 Endpoint not found - check the API path`);
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetch all pNodes from gossip network
   */
  async getAllPNodes() {
    try {
      logger.info(`📡 Fetching all pNodes from ${PRPC_CONFIG.BASE_URL}${PRPC_CONFIG.ENDPOINTS.GOSSIP_NODES}`);
      
      const response = await this.client.get(PRPC_CONFIG.ENDPOINTS.GOSSIP_NODES);
      
      const pNodes = this.transformPNodeData(response.data);
      
      logger.success(`✅ Successfully fetched ${pNodes.length} pNodes`);
      
      return {
        success: true,
        data: pNodes,
        count: pNodes.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`❌ Failed to fetch pNodes: ${error.message}`);
      
      // Always return mock data in development
      if (process.env.NODE_ENV === 'development') {
        logger.warn(`⚠️  Using mock data for development`);
        return this.getMockPNodes();
      }
      
      throw new Error(`pRPC API Error: ${error.message}`);
    }
  }

  /**
   * Fetch specific pNode information
   */
  async getPNodeById(nodeId) {
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

  /**
   * Transform API response to our data model
   */
  transformPNodeData(apiData) {
    if (Array.isArray(apiData)) {
      return apiData.map(node => this.transformSingleNode(node));
    }
    
    if (apiData.nodes) {
      return apiData.nodes.map(node => this.transformSingleNode(node));
    }
    
    if (apiData.result && Array.isArray(apiData.result)) {
      return apiData.result.map(node => this.transformSingleNode(node));
    }
    
    logger.warn(`⚠️  Unexpected API response structure`);
    return [];
  }

  /**
   * Transform single node data
   */
  transformSingleNode(node) {
    return {
      id: node.id || node.nodeId || node.pubkey || node.identity,
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
        ...node.metadata,
      },
    };
  }

  /**
   * Generate dynamic mock data for development/testing
   */
  getMockPNodes() {
    const regions = [
      { name: 'West Africa', country: 'Nigeria', cities: ['Lagos', 'Abuja', 'Port Harcourt'] },
      { name: 'North America', country: 'United States', cities: ['New York', 'San Francisco', 'Miami'] },
      { name: 'Europe', country: 'Germany', cities: ['Frankfurt', 'Berlin', 'Munich'] },
      { name: 'Asia', country: 'Singapore', cities: ['Singapore', 'Jurong', 'Woodlands'] },
      { name: 'Oceania', country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane'] },
    ];

    const statuses = ['active', 'gossiping', 'active', 'active', 'offline'];
    
    const mockNodes = Array.from({ length: 15 }, (_, i) => {
      const region = regions[i % regions.length];
      const city = region.cities[Math.floor(Math.random() * region.cities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: `pNode-${String(i + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        gossipStatus: status,
        storage: {
          used: Math.floor(Math.random() * 150000000000),
          total: 100000000000 + Math.floor(Math.random() * 150000000000),
          available: Math.floor(Math.random() * 100000000000),
        },
        location: {
          country: region.country,
          region: region.name,
          city: city,
          coordinates: {
            lat: Math.random() * 180 - 90,
            lon: Math.random() * 360 - 180,
          },
        },
        uptime: Math.floor(Math.random() * 10000000),
        version: `1.${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 5)}`,
        lastSeen: status === 'offline' 
          ? new Date(Date.now() - 3600000).toISOString()
          : new Date().toISOString(),
        metadata: {
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          port: 8080,
          latency: status === 'offline' ? null : Math.floor(Math.random() * 100) + 20,
        },
      };
    });

    logger.warn(`⚠️  Returning ${mockNodes.length} mock pNodes`);

    return {
      success: true,
      data: mockNodes,
      count: mockNodes.length,
      timestamp: new Date().toISOString(),
      note: 'Mock data - Development mode (Real API unavailable)',
    };
  }
}

export default new PRPCService();