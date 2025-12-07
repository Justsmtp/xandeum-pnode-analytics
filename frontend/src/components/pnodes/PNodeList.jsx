// frontend/src/components/pnodes/PNodeList.jsx
import React, { useState } from 'react';
import PNodeCard from './PNodeCard';
import PNodeTable from './PNodeTable';
import './PNodeList.css';

const PNodeList = ({ nodes }) => {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  return (
    <div className="pnode-list">
      <div className="view-controls">
        <button
          className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
          onClick={() => setViewMode('cards')}
        >
          <span>▦</span> Cards
        </button>
        <button
          className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => setViewMode('table')}
        >
          <span>☰</span> Table
        </button>
      </div>

      {viewMode === 'cards' ? (
        <div className="pnode-cards-grid">
          {nodes.map((node) => (
            <PNodeCard key={node.id} node={node} />
          ))}
        </div>
      ) : (
        <PNodeTable nodes={nodes} />
      )}

      {nodes.length === 0 && (
        <div className="no-nodes">
          <p>No pNodes found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default PNodeList;