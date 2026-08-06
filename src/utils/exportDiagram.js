/**
 * exportDiagram.js
 * Professional React Flow Image Exporter (matching Mermaid Live / React Flow Pro export pattern).
 * Calculates exact graph bounds, computes the optimal fitView viewport matrix,
 * renders at target pixel dimensions, and restores user camera position seamlessly.
 */

import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from '@xyflow/react';

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export the React Flow diagram content cleanly regardless of graph size.
 * Uses getNodesBounds + getViewportForBounds (the official React Flow & Mermaid exporter pattern).
 *
 * @param {HTMLElement} containerElement - Outer container element
 * @param {Array} getNodes - Function returning current React Flow nodes
 * @param {string} [filename='csdm-diagram.png']
 */
export async function exportAsPng(containerElement, getNodes, filename = 'csdm-diagram.png') {
  try {
    const nodes = typeof getNodes === 'function' ? getNodes() : [];
    const viewportNode = containerElement.querySelector('.react-flow__viewport');

    if (!viewportNode || !nodes || nodes.length === 0) {
      // Fallback: simple screenshot
      const fallbackUrl = await toPng(containerElement, {
        backgroundColor: '#fafbfc',
        pixelRatio: 2,
      });
      downloadDataUrl(fallbackUrl, filename);
      return;
    }

    // 1. Calculate exact node bounding box
    const nodesBounds = getNodesBounds(nodes);

    // 2. Define fixed export resolution dimensions (e.g. 1920x1080 or proportional to graph)
    const exportWidth = Math.max(1280, Math.ceil(nodesBounds.width + 160));
    const exportHeight = Math.max(900, Math.ceil(nodesBounds.height + 160));

    // 3. Compute exact viewport matrix (x, y, zoom) to center and fit content with padding
    const viewport = getViewportForBounds(
      nodesBounds,
      exportWidth,
      exportHeight,
      0.2, // minZoom
      2.0, // maxZoom
      0.1  // padding
    );

    const previousTransform = viewportNode.style.transform;
    const previousContainerWidth = containerElement.style.width;
    const previousContainerHeight = containerElement.style.height;

    // 4. Temporarily apply export viewport transform, then capture full container
    viewportNode.style.transform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;

    // Force export dimensions so overlays (like legend) are captured inside image bounds.
    containerElement.style.width = `${exportWidth}px`;
    containerElement.style.height = `${exportHeight}px`;

    let dataUrl;
    try {
      dataUrl = await toPng(containerElement, {
        backgroundColor: '#fafbfc',
        width: exportWidth,
        height: exportHeight,
        pixelRatio: 2, // 2x crisp HD scaling
        cacheBust: true,
        style: {
          width: `${exportWidth}px`,
          height: `${exportHeight}px`,
        },
        filter: (node) => {
          if (node.classList && node.classList.contains('react-flow__controls')) {
            return false;
          }
          return true;
        },
      });
    } finally {
      viewportNode.style.transform = previousTransform;
      containerElement.style.width = previousContainerWidth;
      containerElement.style.height = previousContainerHeight;
    }

    downloadDataUrl(dataUrl, filename);
  } catch (error) {
    console.error('Diagram export failed:', error);
    throw error;
  }
}
