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

    // Request interceptor
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

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`✅ pRPC Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error(`❌ pRPC Response Error: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch all pNodes from gossip network
   */
  async getAllPNodes() {
    try {
      const response = await this.client.get(PRPC_CONFIG.ENDPOINTS.GOSSIP_NODES);
      
      // Transform data to our format
      const pNodes = this.transformPNodeData(response.data);
      
      return {
        success: true,
        data: pNodes,
        count: pNodes.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Failed to fetch pNodes: ${error.message}`);
      
      // Return mock data for development if API fails
      if (process.env.NODE_ENV === 'development') {
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
    // Adjust based on actual Xandeum API response structure
    if (Array.isArray(apiData)) {
      return apiData.map(node => this.transformSingleNode(node));
    }
    
    if (apiData.nodes) {
      return apiData.nodes.map(node => this.transformSingleNode(node));
    }
    
    return [];
  }

  /**
   * Transform single node data
   */
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
        ...node.metadata,
      },
    };
  }

  /**
   * Mock data for development/testing
   */
  getMockPNodes() {
    const mockNodes = [
      {
        id: 'pNode-001-ABC123',
        gossipStatus: 'active',
        storage: { used: 45000000000, total: 100000000000, available: 55000000000 },
        location: { country: 'Nigeria', region: 'West Africa', city: 'Lagos', coordinates: { lat: 6.5244, lon: 3.3792 } },
        uptime: 2592000,
        version: '1.2.3',
        lastSeen: new Date().toISOString(),
        metadata: { ip: '197.210.x.x', port: 8080, latency: 45 },
      },
      {
        id: 'pNode-002-DEF456',
        gossipStatus: 'gossiping',
        storage: { used: 78000000000, total: 200000000000, available: 122000000000 },
        location: { country: 'United States', region: 'North America', city: 'New York', coordinates: { lat: 40.7128, lon: -74.0060 } },
        uptime: 5184000,
        version: '1.2.3',
        lastSeen: new Date().toISOString(),
        metadata: { ip: '104.26.x.x', port: 8080, latency: 23 },
      },
      {
        id: 'pNode-003-GHI789',
        gossipStatus: 'active',
        storage: { used: 120000000000, total: 250000000000, available: 130000000000 },
        location: { country: 'Germany', region: 'Europe', city: 'Frankfurt', coordinates: { lat: 50.1109, lon: 8.6821 } },
        uptime: 7776000,
        version: '1.2.2',
        lastSeen: new Date().toISOString(),
        metadata: { ip: '185.45.x.x', port: 8080, latency: 67 },
      },
      {
        id: 'pNode-004-JKL012',
        gossipStatus: 'offline',
        storage: { used: 32000000000, total: 100000000000, available: 68000000000 },
        location: { country: 'Singapore', region: 'Asia', city: 'Singapore', coordinates: { lat: 1.3521, lon: 103.8198 } },
        uptime: 0,
        version: '1.2.1',
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
        metadata: { ip: '139.59.x.x', port: 8080, latency: null },
      },
      {
        id: 'pNode-005-MNO345',
        gossipStatus: 'active',
        storage: { used: 95000000000, total: 150000000000, available: 55000000000 },
        location: { country: 'Nigeria', region: 'West Africa', city: 'Abuja', coordinates: { lat: 9.0765, lon: 7.3986 } },
        uptime: 4320000,
        version: '1.2.3',
        lastSeen: new Date().toISOString(),
        metadata: { ip: '197.211.x.x', port: 8080, latency: 52 },
      },
    ];

    return {
      success: true,
      data: mockNodes,
      count: mockNodes.length,
      timestamp: new Date().toISOString(),
      note: 'Mock data - Development mode',
    };
  }
}

export default new PRPCService();