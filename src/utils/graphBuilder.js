/**
 * graphBuilder.js
 * Converts table row data into deduplicated nodes and edges
 * for React Flow rendering, including search matching flags.
 */

const COLUMNS = [
  { key: 'businessCapability', layer: 'capability', label: 'Business Capability' },
  { key: 'businessService',    layer: 'service',    label: 'Business Service' },
  { key: 'serviceOffering',    layer: 'offering',   label: 'Service Offering' },
  { key: 'serviceInstance',    layer: 'instance',   label: 'Service Instance' },
  { key: 'appPlatform',       layer: 'app',        label: 'App/Platform/CI' },
];

/**
 * Build a graph (nodes + edges) from the table rows.
 * Deduplicates nodes with the same layer::value key and
 * connects missing intermediate levels directly.
 *
 * @param {Array<Object>} rows - Array of row objects
 * @param {string} [searchTerm=''] - Active filter query
 * @returns {{ nodes: Array, edges: Array }}
 */
export function buildGraph(rows, searchTerm = '') {
  const nodeMap = new Map();   // id -> node
  const edgeSet = new Set();   // "source->target" for dedup
  const edges = [];

  const query = (searchTerm || '').trim().toLowerCase();

  for (const row of rows) {
    let prevNodeId = null;

    for (const col of COLUMNS) {
      const value = (row[col.key] || '').trim();
      if (!value) continue;

      const nodeId = `${col.layer}::${value}`;
      const isMatch = Boolean(query && value.toLowerCase().includes(query));

      // Deduplicate nodes
      if (!nodeMap.has(nodeId)) {
        nodeMap.set(nodeId, {
          id: nodeId,
          type: 'csdmNode',
          data: {
            label: value,
            layer: col.layer,
            isMatch,
          },
          position: { x: 0, y: 0 },
        });
      } else if (isMatch) {
        nodeMap.get(nodeId).data.isMatch = true;
      }

      // Create edge from parent to this node
      if (prevNodeId) {
        const edgeKey = `${prevNodeId}->${nodeId}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            id: edgeKey,
            source: prevNodeId,
            target: nodeId,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          });
        }
      }

      prevNodeId = nodeId;
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
}
