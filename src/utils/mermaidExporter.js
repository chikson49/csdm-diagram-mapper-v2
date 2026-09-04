/**
 * mermaidExporter.js
 * Generates and downloads Mermaid diagram syntax (.mmd / markdown) from CSDM table data,
 * complete with CSDM layer classDef styling definitions.
 */

function sanitizeId(str) {
  return str.replace(/[^a-zA-Z0-9_]/g, '_');
}

function sanitizeLabel(str) {
  return str.replace(/"/g, '\\"');
}

/**
 * Generate Mermaid syntax text with classDef styling definitions from CSDM row data.
 *
 * @param {Array<Object>} rows - CSDM table rows
 * @param {Array<{key: string, layer: string, color: string}>} columns - Active model's columns, in order
 * @returns {string} Mermaid markdown syntax
 */
export function generateMermaidSyntax(rows, columns) {
  const nodeMap = new Map(); // id -> { label, classType }
  const edgeSet = new Set(); // "source -> target"

  for (const row of rows) {
    let prevNodeId = null;

    for (const col of columns) {
      const value = (row[col.key] || '').trim();
      if (!value) continue;

      const nodeId = `${col.layer}_${sanitizeId(value)}`;
      if (!nodeMap.has(nodeId)) {
        nodeMap.set(nodeId, {
          label: value,
          classType: col.layer,
        });
      }

      if (prevNodeId) {
        edgeSet.add(`${prevNodeId} --> ${nodeId}`);
      }

      prevNodeId = nodeId;
    }
  }

  // Construct Mermaid string
  let syntax = 'graph TB\n';

  // Add Nodes
  nodeMap.forEach((info, id) => {
    syntax += `    ${id}["${sanitizeLabel(info.label)}"]\n`;
  });

  syntax += '\n';

  // Add Edges
  edgeSet.forEach((edge) => {
    syntax += `    ${edge}\n`;
  });

  syntax += '\n';

  // Add Class Definitions for Color Styling
  for (const col of columns) {
    syntax += `    classDef ${col.layer} fill:${col.color},stroke:#333,stroke-width:2px,color:#fff;\n`;
  }
  syntax += '\n';

  // Apply Class Assignments to Nodes
  nodeMap.forEach((info, id) => {
    syntax += `    class ${id} ${info.classType};\n`;
  });

  return syntax;
}

/**
 * Download the generated Mermaid syntax as a .mmd file.
 *
 * @param {Array<Object>} rows - CSDM table rows
 * @param {Array<{key: string, layer: string, color: string}>} columns - Active model's columns, in order
 * @param {string} [filename='csdm-diagram.mmd']
 */
export function exportAsMermaid(rows, columns, filename = 'csdm-diagram.mmd') {
  const syntax = generateMermaidSyntax(rows, columns);
  const blob = new Blob([syntax], { type: 'text/vnd.mermaid;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

