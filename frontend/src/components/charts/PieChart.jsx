/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
// frontend/src/components/charts/PieChart.jsx
import React, { useMemo, useState } from 'react';
import './PieChart.css';
import { formatBytes } from '../../utils/helpers';

const PieChart = ({ data, title, subtitle }) => {
  const [activeSegment, setActiveSegment] = useState(null);
  
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const segments = useMemo(() => {
    let currentAngle = 0;
    const colors = ['#00C853', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9'];
    
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const segment = {
        ...item,
        percentage: percentage.toFixed(1),
        startAngle: currentAngle,
        angle: angle,
        color: colors[index % colors.length],
      };
      currentAngle += angle;
      return segment;
    });
  }, [data, total]);

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'L', x, y,
      'Z'
    ].join(' ');
  };

  return (
    <div className="pie-chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="pie-chart-content">
        <svg className="pie-chart-svg" viewBox="0 0 200 200">
          {segments.map((segment, index) => {
            const isActive = activeSegment === index;
            const scale = isActive ? 1.05 : 1;
            
            return (
              <g 
                key={index}
                transform={`scale(${scale}) translate(${isActive ? -2.5 : 0}, ${isActive ? -2.5 : 0})`}
                style={{ transformOrigin: '100px 100px', transition: 'transform 0.3s' }}
              >
                <path
                  d={createArc(100, 100, 80, segment.startAngle, segment.startAngle + segment.angle)}
                  fill={segment.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="pie-segment"
                  onMouseEnter={() => setActiveSegment(index)}
                  onMouseLeave={() => setActiveSegment(null)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            );
          })}
          
          <circle cx="100" cy="100" r="50" fill="#FFFFFF" />
          <text x="100" y="95" textAnchor="middle" className="pie-center-value">
            {data.length}
          </text>
          <text x="100" y="110" textAnchor="middle" className="pie-center-label">
            Types
          </text>
        </svg>

        <div className="pie-legend">
          {segments.map((segment, index) => (
            <div 
              key={index} 
              className={`legend-item ${activeSegment === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveSegment(index)}
              onMouseLeave={() => setActiveSegment(null)}
            >
              <div className="legend-color" style={{ background: segment.color }}></div>
              <div className="legend-text">
                <div className="legend-label">{segment.label}</div>
                <div className="legend-value">{segment.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;