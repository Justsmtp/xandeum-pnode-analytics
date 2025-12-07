/* eslint-disable react-refresh/only-export-components */
// frontend/src/context/PNodeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { pNodeAPI } from '../services/api';

const PNodeContext = createContext();

export const usePNodeContext = () => {
  const context = useContext(PNodeContext);
  if (!context) {
    throw new Error('usePNodeContext must be used within PNodeProvider');
  }
  return context;
};

export const PNodeProvider = ({ children }) => {
  const [pNodes, setPNodes] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPNodes = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pNodeAPI.getAllPNodes(refresh);
      setPNodes(data.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pNodes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await pNodeAPI.getStatistics();
      setStatistics(data.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  useEffect(() => {
    fetchPNodes();
    fetchStatistics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPNodes(true);
      fetchStatistics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    pNodes,
    statistics,
    loading,
    error,
    lastUpdated,
    refreshPNodes: () => fetchPNodes(true),
    fetchStatistics,
  };

  return <PNodeContext.Provider value={value}>{children}</PNodeContext.Provider>;
};