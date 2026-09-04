/**
 * DiagramViewer.jsx
 * Right panel hosting the React Flow canvas with auto-layouted CSDM diagram.
 * Supports search highlighting and click-to-highlight node lineage.
 */

import { useMemo, useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CsdmNode from './CsdmNode';
import Legend from './Legend';
import { buildGraph } from '../utils/graphBuilder';
import { layoutGraph } from '../utils/layoutEngine';

const nodeTypes = { csdmNode: CsdmNode };

/**
 * Traverse graph to find all ancestors (upstream) and descendants (downstream) of selectedNodeId.
 */
function getLineageNodeIds(selectedNodeId, edges) {
  if (!selectedNodeId) return new Set();

  const lineage = new Set([selectedNodeId]);

  // Ancestors (upstream)
  const queueUp = [selectedNodeId];
  while (queueUp.length > 0) {
    const current = queueUp.shift();
    for (const edge of edges) {
      if (edge.target === current && !lineage.has(edge.source)) {
        lineage.add(edge.source);
        queueUp.push(edge.source);
      }
    }
  }

  // Descendants (downstream)
  const queueDown = [selectedNodeId];
  while (queueDown.length > 0) {
    const current = queueDown.shift();
    for (const edge of edges) {
      if (edge.source === current && !lineage.has(edge.target)) {
        lineage.add(edge.target);
        queueDown.push(edge.target);
      }
    }
  }

  return lineage;
}

function DiagramCanvas({ rows, searchTerm, columns }) {
  const { fitView, getNodes } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Expose getNodes globally for export utility
  window.__getReactFlowNodes = getNodes;
  // test
  // Build and layout graph whenever rows or searchTerm changes
  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    const { nodes, edges } = buildGraph(rows, searchTerm, columns);
    const positioned = layoutGraph(nodes, edges);
    return { layoutedNodes: positioned, layoutedEdges: edges };
  }, [rows, searchTerm, columns]);

  // Calculate lineage node set if a node is clicked
  const lineageSet = useMemo(() => {
    return getLineageNodeIds(selectedNodeId, layoutedEdges);
  }, [selectedNodeId, layoutedEdges]);

  // Prepare nodes with lineage/selection/dimmed states
  const decoratedNodes = useMemo(() => {
    return layoutedNodes.map((node) => {
      const isSelected = node.id === selectedNodeId;
      const isLineage = lineageSet.has(node.id) && !isSelected;
      const isDimmed = selectedNodeId !== null && !lineageSet.has(node.id);

      return {
        ...node,
        data: {
          ...node.data,
          isSelected,
          isLineage,
          isDimmed,
        },
      };
    });
  }, [layoutedNodes, selectedNodeId, lineageSet]);

  // Prepare edges with active lineage highlighting
  const decoratedEdges = useMemo(() => {
    return layoutedEdges.map((edge) => {
      const isLineageEdge =
        selectedNodeId !== null &&
        lineageSet.has(edge.source) &&
        lineageSet.has(edge.target);

      const isDimmedEdge = selectedNodeId !== null && !isLineageEdge;

      return {
        ...edge,
        style: {
          stroke: isLineageEdge ? '#10b981' : '#94a3b8',
          strokeWidth: isLineageEdge ? 3.5 : 2,
          opacity: isDimmedEdge ? 0.15 : 1,
        },
        animated: isLineageEdge,
      };
    });
  }, [layoutedEdges, selectedNodeId, lineageSet]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useMemo(() => {
    setNodes(decoratedNodes);
    setEdges(decoratedEdges);
    setTimeout(() => {
      fitView({ padding: 0.15, duration: 300 });
    }, 50);
  }, [decoratedNodes, decoratedEdges, setNodes, setEdges, fitView]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.2}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
    >
      <Controls position="bottom-left" />
      <Background color="#e2e8f0" gap={20} size={1} />
    </ReactFlow>
  );
}

export default function DiagramViewer({ rows, diagramRef, searchTerm, columns }) {
  return (
    <div
      ref={diagramRef}
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        background: '#fafbfc',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '14px 20px',
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(250,251,252,0.95) 0%, rgba(250,251,252,0) 100%)',
          pointerEvents: 'none',
        }}
      >
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#1a202c',
          }}
        >
          Live CSDM Diagram
        </h2>
      </div>

      {/* React Flow Canvas */}
      <DiagramCanvas rows={rows} searchTerm={searchTerm} columns={columns} />

      {/* Legend overlay */}
      <Legend columns={columns} />
    </div>
  );
}
