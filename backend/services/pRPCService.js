import axios from 'axios';
import dns from 'dns/promises';
import { PRPC_CONFIG } from '../config/constants.js';
import { logger } from '../utils/logger.js';

class PRPCService {
  constructor() {
    this.baseURL = PRPC_CONFIG.BASE_URL;

    this.client = axios.create({
      baseURL: this.baseURL,
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
   * Ensure DNS is resolvable before request
   */
  async assertDNS() {
    const url = new URL(this.baseURL);
    await dns.lookup(url.hostname);
  }

  /**
   * Fetch all pNodes (LIVE ONLY)
   */
  async getAllPNodes() {
    try {
      await this.assertDNS();

      const response = await this.client.get(
        PRPC_CONFIG.ENDPOINTS.GOSSIP_NODES
      );

      const pNodes = this.transformPNodeData(response.data);

      return {
        success: true,
        source: 'prpc-live',
        data: pNodes,
        count: pNodes.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`❌ LIVE pRPC FAILED: ${error.message}`);

      throw new Error(
        'Live pRPC unavailable. Check BASE_URL, DNS, or network access.'
      );
    }
  }

  /**
   * Fetch a single pNode
   */
  async getPNodeById(nodeId) {
    await this.assertDNS();

    const response = await this.client.get(
      `${PRPC_CONFIG.ENDPOINTS.NODE_INFO}/${nodeId}`
    );

    return {
      success: true,
      source: 'prpc-live',
      data: this.transformSingleNode(response.data),
      timestamp: new Date().toISOString(),
    };
  }

  /* ---------------- Data Transformers ---------------- */

  transformPNodeData(apiData) {
    if (Array.isArray(apiData)) {
      return apiData.map((node) => this.transformSingleNode(node));
    }

    if (apiData?.nodes) {
      return apiData.nodes.map((node) => this.transformSingleNode(node));
    }

    return [];
  }

  transformSingleNode(node) {
    return {
      id: node.id || node.nodeId || node.pubkey,
      gossipStatus: node.gossipStatus || node.status || 'unknown',
      storage: {
        used: node.storage?.used || 0,
        total: node.storage?.total || 0,
        available: node.storage?.available || 0,
      },
      location: {
        country: node.location?.country || 'Unknown',
        region: node.location?.region || 'Unknown',
        city: node.location?.city || 'Unknown',
      },
      uptime: node.uptime || 0,
      version: node.version || 'unknown',
      lastSeen: node.lastSeen || new Date().toISOString(),
      metadata: {
        ip: node.ip || null,
        port: node.port || null,
        latency: node.latency || null,
      },
    };
  }
}

export default new PRPCService();
