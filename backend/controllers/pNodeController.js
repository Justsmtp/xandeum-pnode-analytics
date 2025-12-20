import pRPCService from '../services/pRPCService.js';
import cacheService from '../services/cacheService.js';
import PNode from '../models/PNode.js';
import { logger } from '../utils/logger.js';

const CACHE_KEY = 'all_pnodes';

/**
 * GET /api/pnodes
 */
export const getAllPNodes = async (req, res, next) => {
  try {
    const { refresh } = req.query;

    // 1️⃣ Serve from cache unless refresh requested
    if (!refresh) {
      const cached = cacheService.get(CACHE_KEY);
      if (cached) {
        return res.json({
          success: true,
          cached: true,
          source: 'cache',
          ...cached,
        });
      }
    }

    let result = null;

    // 2️⃣ Try fetching from Xandeum pRPC
    try {
      result = await pRPCService.getAllPNodes();
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        logger.warn(
          '🌐 Xandeum API unreachable (DNS) — falling back to database'
        );
      } else {
        logger.error(`❌ pRPC fetch failed: ${error.message}`);
      }
    }

    // 3️⃣ If external fetch failed → fallback to DB
    if (!result || !result.success || !Array.isArray(result.data)) {
      const nodes = await PNode.find({});

      const fallbackResponse = {
        success: true,
        source: 'database',
        data: nodes,
        timestamp: new Date().toISOString(),
      };

      cacheService.set(CACHE_KEY, fallbackResponse);

      return res.json({
        cached: false,
        ...fallbackResponse,
      });
    }

    // 4️⃣ External fetch succeeded → upsert MongoDB
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

    const successResponse = {
      success: true,
      source: 'external',
      data: result.data,
      timestamp: new Date().toISOString(),
    };

    // 5️⃣ Cache successful response
    cacheService.set(CACHE_KEY, successResponse);

    return res.json({
      cached: false,
      ...successResponse,
    });
  } catch (error) {
    logger.error(`getAllPNodes fatal error: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/pnodes/:id
 */
export const getPNodeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `pnode_${id}`;

    // 1️⃣ Cache first
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        cached: true,
        source: 'cache',
        ...cached,
      });
    }

    // 2️⃣ DB lookup
    let node = await PNode.findOne({ nodeId: id });

    // 3️⃣ If not found → try pRPC
    if (!node) {
      try {
        const result = await pRPCService.getPNodeById(id);
        if (result?.success && result.data) {
          node = await PNode.findOneAndUpdate(
            { nodeId: id },
            { ...result.data, nodeId: id },
            { upsert: true, new: true }
          );
        }
      } catch (error) {
        logger.warn(`pRPC getPNodeById failed: ${error.message}`);
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
      source: 'database',
      data: node,
      timestamp: new Date().toISOString(),
    };

    cacheService.set(cacheKey, response);

    return res.json({
      cached: false,
      ...response,
    });
  } catch (error) {
    logger.error(`getPNodeById error: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/pnodes/stats
 */
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
      const region = node.location?.region || 'Unknown';
      stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;

      stats.totalStorage.used += node.storage?.used || 0;
      stats.totalStorage.total += node.storage?.total || 0;
      stats.totalStorage.available += node.storage?.available || 0;

      stats.averageUptime += node.uptime || 0;
    });

    if (nodes.length > 0) {
      stats.averageUptime = Math.floor(
        stats.averageUptime / nodes.length
      );
    }

    return res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`getStatistics error: ${error.message}`);
    next(error);
  }
};
