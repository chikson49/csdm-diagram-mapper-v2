/**
 * CsdmNode.jsx
 * Custom React Flow node component for CSDM entities.
 * Supports search match highlighting and lineage selection state.
 */

import { Handle, Position } from '@xyflow/react';

export default function CsdmNode({ data }) {
  const isSelected = data.isSelected;
  const isLineage = data.isLineage;
  const isDimmed = data.isDimmed;
  const isMatch = data.isMatch;

  let extraStyle = {};
  if (isSelected) {
    extraStyle = {
      boxShadow: '0 0 0 4px #3b82f6, 0 8px 24px rgba(0,0,0,0.3)',
      transform: 'scale(1.06)',
      zIndex: 100,
    };
  } else if (isLineage) {
    extraStyle = {
      boxShadow: '0 0 0 3px #10b981, 0 6px 18px rgba(0,0,0,0.2)',
      transform: 'scale(1.02)',
      zIndex: 50,
    };
  } else if (isDimmed) {
    extraStyle = {
      opacity: 0.25,
      filter: 'grayscale(60%)',
    };
  }

  return (
    <div
      className={`csdm-node ${data.layer} ${isMatch ? 'search-match' : ''}`}
      style={extraStyle}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: '2px solid rgba(255,255,255,0.9)',
          width: 8,
          height: 8,
        }}
      />

      {data.label}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: '2px solid rgba(255,255,255,0.9)',
          width: 8,
          height: 8,
        }}
      />
    </div>
  );
}
