/**
 * layoutEngine.js
 * Uses @dagrejs/dagre to compute auto-layout positions
 * for React Flow nodes in a top-to-bottom tree orientation.
 */

import dagre from '@dagrejs/dagre';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 50;

/**
 * Compute layout positions for nodes using Dagre.
 * Returns a new array of nodes with updated position.x and position.y.
 *
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @returns {Array} - Nodes with computed positions
 */
export function layoutGraph(nodes, edges) {
  if (nodes.length === 0) return [];

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    nodesep: 80,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  });

  // Add nodes to dagre graph
  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  // Add edges to dagre graph
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  // Compute layout
  dagre.layout(g);

  // Map positions back to React Flow nodes
  return nodes.map((node) => {
    const dagreNode = g.node(node.id);
    return {
      ...node,
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
      },
    };
  });
}
