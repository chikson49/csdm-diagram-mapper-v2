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
 * @returns {string} Mermaid markdown syntax
 */
export function generateMermaidSyntax(rows) {
  const COLUMNS = [
    { key: 'businessCapability', prefix: 'cap', classType: 'capability' },
    { key: 'businessService',    prefix: 'srv', classType: 'service' },
    { key: 'serviceOffering',    prefix: 'off', classType: 'offering' },
    { key: 'serviceInstance',    prefix: 'ins', classType: 'instance' },
    { key: 'appPlatform',       prefix: 'app', classType: 'app' },
  ];

  const nodeMap = new Map(); // id -> { label, classType }
  const edgeSet = new Set(); // "source -> target"

  for (const row of rows) {
    let prevNodeId = null;

    for (const col of COLUMNS) {
      const value = (row[col.key] || '').trim();
      if (!value) continue;

      const nodeId = `${col.prefix}_${sanitizeId(value)}`;
      if (!nodeMap.has(nodeId)) {
        nodeMap.set(nodeId, {
          label: value,
          classType: col.classType,
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
  syntax += '    classDef capability fill:#bf40ff,stroke:#333,stroke-width:2px,color:#fff;\n';
  syntax += '    classDef service fill:#008000,stroke:#333,stroke-width:2px,color:#fff;\n';
  syntax += '    classDef offering fill:#70ad47,stroke:#333,stroke-width:2px,color:#fff;\n';
  syntax += '    classDef instance fill:#ff9900,stroke:#333,stroke-width:2px,color:#000;\n';
  syntax += '    classDef app fill:#2e75b6,stroke:#333,stroke-width:2px,color:#fff;\n\n';

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
 * @param {string} [filename='csdm-diagram.mmd']
 */
export function exportAsMermaid(rows, filename = 'csdm-diagram.mmd') {
  const syntax = generateMermaidSyntax(rows);
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
