
// frontend/src/hooks/usePNodes.js
import { useState, useMemo } from 'react';
import { usePNodeContext } from '../context/PNodeContext';

export const usePNodes = () => {
  const { pNodes, loading, error, refreshPNodes } = usePNodeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const filteredPNodes = useMemo(() => {
    let filtered = [...pNodes];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(node =>
        node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.location?.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(node => node.gossipStatus === statusFilter);
    }

    // Region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(node => node.location?.region === regionFilter);
    }

    return filtered;
  }, [pNodes, searchQuery, statusFilter, regionFilter]);

  return {
    pNodes: filteredPNodes,
    allPNodes: pNodes,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    regionFilter,
    setRegionFilter,
    refreshPNodes,
  };
};