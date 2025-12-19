// frontend/src/services/solanaService.js
import axios from 'axios';

const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

class SolanaService {
  constructor() {
    this.rpcUrl = SOLANA_RPC_URL;
  }

  async makeRPCCall(method, params = []) {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      });
      return response.data.result;
    } catch (error) {
      console.error(`Solana RPC error (${method}):`, error);
      throw error;
    }
  }

  async getEpochInfo() {
    return await this.makeRPCCall('getEpochInfo');
  }

  async getRecentPerformanceSamples(limit = 1) {
    return await this.makeRPCCall('getRecentPerformanceSamples', [limit]);
  }

  async getBlockHeight() {
    return await this.makeRPCCall('getBlockHeight');
  }

  async getVoteAccounts() {
    return await this.makeRPCCall('getVoteAccounts');
  }

  async getClusterNodes() {
    return await this.makeRPCCall('getClusterNodes');
  }

  async getTPS() {
    try {
      const samples = await this.getRecentPerformanceSamples(1);
      if (samples && samples.length > 0) {
        const sample = samples[0];
        return Math.floor(sample.numTransactions / sample.samplePeriodSecs);
      }
      return 0;
    } catch (error) {
      console.error('Error getting TPS:', error);
      return 0;
    }
  }
}

export default new SolanaService();