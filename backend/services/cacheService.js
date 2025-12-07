// backend/services/cacheService.js
import { PRPC_CONFIG } from '../config/constants.js';
import { logger } from '../utils/logger.js';

class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = PRPC_CONFIG.CACHE_TTL;
  }

  /**
   * Get cached data
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if cache expired
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      logger.info(`🗑️ Cache expired for key: ${key}`);
      return null;
    }

    logger.info(`✅ Cache hit for key: ${key}`);
    return cached.data;
  }

  /**
   * Set cache data
   */
  set(key, data, customTTL = null) {
    const ttl = customTTL || this.ttl;
    const expiry = Date.now() + ttl;

    this.cache.set(key, {
      data,
      expiry,
      timestamp: Date.now(),
    });

    logger.info(`💾 Cache set for key: ${key} (TTL: ${ttl}ms)`);
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.info(`🗑️ Cache deleted for key: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    logger.info(`🗑️ Cache cleared. ${size} entries removed.`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      ttl: this.ttl,
    };
  }
}

export default new CacheService();