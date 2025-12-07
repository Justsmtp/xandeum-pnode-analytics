import pRPCService from '../services/pRPCService.js';
import cacheService from '../services/cacheService.js';
import PNode from '../models/PNode.js';
import { logger } from '../utils/logger.js';

const CACHE_KEY = 'all_pnodes';

export const getAllPNodes = async (req, res, next) => {
  try {
    const { refresh } = req.query;

    // Check cache unless refresh requested
    if (!refresh) {
      const cached = cacheService.get(CACHE_KEY);
      if (cached) {
        return res.json({
          success: true,
          cached: true,
          ...cached,
        });
      }
    }

    // Fetch from pRPC
    const result = await pRPCService.getAllPNodes();

    // Save to MongoDB (upsert)
    if (result.success && result.data) {
      await Promise.all(
        result.data.map(node =>
          PNode.findOneAndUpdate(
            { nodeId: node.id },
            {
              nodeId: node.id,
              gossipStatus: node.gossipStatus,
              storage: node.storage,
              location: node.location,
              uptime: node.uptime,
              version: node.version,
              lastSeen: node.lastSeen,
              metadata: node.metadata,
            },
            { upsert: true, new: true }
          )
        )
      );
    }

    // Cache result
    cacheService.set(CACHE_KEY, result);

    res.json({
      success: true,
      cached: false,
      ...result,
    });
  } catch (error) {
    logger.error(`getAllPNodes error: ${error.message}`);
    next(error);
  }
};

export const getPNodeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try cache first
    const cacheKey = `pnode_${id}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return res.json({ success: true, cached: true, ...cached });
    }

    // Try database
    let node = await PNode.findOne({ nodeId: id });

    // If not in DB, fetch from pRPC
    if (!node) {
      const result = await pRPCService.getPNodeById(id);
      if (result.success) {
        node = await PNode.findOneAndUpdate(
          { nodeId: id },
          { ...result.data, nodeId: id },
          { upsert: true, new: true }
        );
      }
    }

    if (!node) {
      return res.status(404).json({
        success: false,
        message: 'pNode not found',
      });
    }

    const response = {
      success: true,
      data: node,
      timestamp: new Date().toISOString(),
    };

    cacheService.set(cacheKey, response);

    res.json({ ...response, cached: false });
  } catch (error) {
    logger.error(`getPNodeById error: ${error.message}`);
    next(error);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const nodes = await PNode.find({});

    const stats = {
      total: nodes.length,
      active: nodes.filter(n => n.gossipStatus === 'active').length,
      gossiping: nodes.filter(n => n.gossipStatus === 'gossiping').length,
      offline: nodes.filter(n => n.gossipStatus === 'offline').length,
      byRegion: {},
      totalStorage: {
        used: 0,
        total: 0,
        available: 0,
      },
      averageUptime: 0,
    };

    nodes.forEach(node => {
      // Region stats
      const region = node.location?.region || 'Unknown';
      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;

      // Storage stats
      stats.totalStorage.used += node.storage?.used || 0;
      stats.totalStorage.total += node.storage?.total || 0;
      stats.totalStorage.available += node.storage?.available || 0;

      // Uptime
      stats.averageUptime += node.uptime || 0;
    });

    if (nodes.length > 0) {
      stats.averageUptime = Math.floor(stats.averageUptime / nodes.length);
    }

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`getStatistics error: ${error.message}`);
    next(error);
  }
};
