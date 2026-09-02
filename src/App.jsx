/**
 * App.jsx
 * Root component — hosts the split-panel layout with
 * DataEditor (left) and DiagramViewer (right).
 */

import { useRef, useCallback, useMemo, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Panel, Group, Separator } from 'react-resizable-panels';

import Navbar from './components/Navbar';
import DataEditor from './components/DataEditor';
import DiagramViewer from './components/DiagramViewer';
import { useCsdmData } from './hooks/useCsdmData';
import { exportAsPng } from './utils/exportDiagram';
import { exportAsMermaid } from './utils/mermaidExporter';

export default function App() {
  const {
    rows,
    updateCell,
    addRow,
    deleteRow,
    duplicateRow,
    setRows,
    resetRows,
    toggleRowHidden,
    showAllRows,
    setBusinessCapabilityHidden,
    toggleBusinessCapabilityHidden,
  } = useCsdmData();
  const [searchTerm, setSearchTerm] = useState('');
  const diagramRef = useRef(null);
  const visibleRows = useMemo(() => rows.filter((row) => !row.isHidden), [rows]);

  const handleExport = useCallback(
    async (type) => {
      if (type === 'mermaid') {
        exportAsMermaid(visibleRows);
        return;
      }
      if (!diagramRef.current) return;
      if (type === 'png') {
        await exportAsPng(diagramRef.current, () => window.__getReactFlowNodes?.() || []);
      }
    },
    [visibleRows]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Top Navigation */}
      <Navbar onExport={handleExport} />

      {/* Split Panel Layout */}
      <Group orientation="horizontal" style={{ flex: 1 }}>
        {/* Left: Data Editor */}
        <Panel defaultSize="40" minSize="25" maxSize="65">
          <DataEditor
            rows={rows}
            onUpdateCell={updateCell}
            onDeleteRow={deleteRow}
            onDuplicateRow={duplicateRow}
            onAddRow={addRow}
            onSetRows={setRows}
            onResetRows={resetRows}
            onToggleRowHidden={toggleRowHidden}
            onShowAllRows={showAllRows}
            onSetBusinessCapabilityHidden={setBusinessCapabilityHidden}
            onToggleBusinessCapabilityHidden={toggleBusinessCapabilityHidden}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </Panel>

        {/* Resize Handle */}
        <Separator />

        {/* Right: Diagram Viewer */}
        <Panel defaultSize="60" minSize="35">
          <ReactFlowProvider>
            <DiagramViewer rows={visibleRows} diagramRef={diagramRef} searchTerm={searchTerm} />
          </ReactFlowProvider>
        </Panel>
      </Group>
    </div>
  );
}
