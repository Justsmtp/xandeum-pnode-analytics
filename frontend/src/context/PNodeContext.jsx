/* eslint-disable react-refresh/only-export-components */
// frontend/src/context/PNodeContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pNodeAPI } from '../services/api';

const PNodeContext = createContext(undefined);

export function PNodeProvider({ children }) {
  const [pNodes, setPNodes] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch pNodes data
  const fetchPNodes = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      setConnectionStatus('connecting');

      console.log('🔍 Fetching pNodes from backend...');
      
      const response = await pNodeAPI.getAllPNodes(true);
      
      console.log('✅ pNodes data received:', response);

      // Handle different response formats
      const nodes = response.data || response.pnodes || response;
      
      if (Array.isArray(nodes)) {
        setPNodes(nodes);
        setConnectionStatus('connected');
        setLastUpdated(new Date());
        console.log(`✅ Loaded ${nodes.length} pNodes`);
      } else {
        console.error('❌ Invalid data format:', response);
        throw new Error('Invalid data format received from API');
      }
    } catch (err) {
      console.error('❌ Failed to fetch pNodes:', err);
      setError(err.message || 'Failed to load pNode data');
      setConnectionStatus('disconnected');
      
      // Set empty array on error so UI doesn't break
      setPNodes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      console.log('🔍 Fetching statistics...');
      const stats = await pNodeAPI.getStatistics();
      console.log('✅ Statistics received:', stats);
      setStatistics(stats);
    } catch (err) {
      console.error('⚠️ Failed to fetch statistics:', err);
      // Don't set error here, just log it
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await fetchPNodes(true);
      await fetchStatistics();
    };

    loadData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPNodes(false); // Don't show loading on auto-refresh
      fetchStatistics();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPNodes, fetchStatistics]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    await fetchPNodes(true);
    await fetchStatistics();
  }, [fetchPNodes, fetchStatistics]);

  const value = {
    pNodes,
    statistics,
    loading,
    error,
    connectionStatus,
    lastUpdated,
    refreshData,
    fetchPNodes,
    fetchStatistics,
  };

  return (
    <PNodeContext.Provider value={value}>
      {children}
    </PNodeContext.Provider>
  );
}

// Custom hook to use the context
export function usePNodeContext() {
  const context = useContext(PNodeContext);
  if (context === undefined) {
    throw new Error('usePNodeContext must be used within a PNodeProvider');
  }
  return context;
}

// Export the context as default for backwards compatibility
export default PNodeContext;