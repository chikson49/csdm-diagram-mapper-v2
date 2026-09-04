/**
 * DataEditor.jsx
 * Left panel container housing search bar, toolbar, and editable data grid.
 */

import { useMemo, useRef, useState } from 'react';
import DataGrid from './DataGrid';
import PasteModal from './PasteModal';
import { parseFile } from '../utils/fileParser';
import { exportTableToExcel } from '../utils/tableExporter';
import { CSDM_MODELS } from '../utils/csdmModels';

export default function DataEditor({
  rows,
  model,
  onSetModel,
  onUpdateCell,
  onDeleteRow,
  onDuplicateRow,
  onAddRow,
  onSetRows,
  onResetRows,
  onToggleRowHidden,
  onShowAllRows,
  onSetBusinessCapabilityHidden,
  onToggleBusinessCapabilityHidden,
  searchTerm,
  onSearchChange,
}) {
  const fileInputRef = useRef(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const hiddenRowCount = rows.filter((row) => row.isHidden).length;
  const capabilityGroups = useMemo(() => {
    const groups = new Map();

    for (const row of rows) {
      const name = String(row.businessCapability || '').trim();
      if (!name) continue;

      const existing = groups.get(name) || { name, total: 0, hidden: 0 };
      existing.total += 1;
      if (row.isHidden) {
        existing.hidden += 1;
      }
      groups.set(name, existing);
    }

    return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const parsed = await parseFile(file, model.columns);
      if (parsed.length > 0) {
        onSetRows(parsed);
      }
    } catch (err) {
      console.error('File import failed:', err);
      alert(`Import failed: ${err.message}`);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'white',
      }}
    >
      {/* Header */}
      <div style={{ padding: '18px 20px 0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1a202c',
            }}
          >
            CSDM Editor
          </h2>
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (confirm('Reset grid to default sample data?')) {
                onResetRows();
              }
            }}
            style={{ padding: '4px 10px', fontSize: '11.5px' }}
            title="Reset data to default mock sample"
          >
            Reset Sample Data
          </button>
        </div>
        <p
          style={{
            fontSize: '12.5px',
            color: '#64748b',
            margin: '4px 0 10px 0',
          }}
        >
          Interactive grid linked directly to live CSDM diagram visualization.
        </p>

        {/* Model Switcher */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {Object.values(CSDM_MODELS).map((m) => (
            <button
              key={m.id}
              className={m.id === model.id ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => {
                if (m.id === model.id) return;
                if (confirm(`Switch to "${m.label}" model? Your current grid stays saved for when you switch back.`)) {
                  onSetModel(m.id);
                }
              }}
              style={{ padding: '4px 10px', fontSize: '11.5px' }}
              title={`Switch to ${m.label}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Search / Filter Bar */}
        <div style={{ marginBottom: '14px', position: 'relative' }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: '12px', top: '10px' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search nodes or filter grid..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              background: '#f8fafc',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '7px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '0 20px 14px 20px',
          flexWrap: 'wrap',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload-input"
        />

        <button
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {isImporting ? 'Importing…' : 'Upload File (.xlsx, .csv)'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setIsPasteModalOpen(true)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Import via Paste
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => exportTableToExcel(rows, model.columns)}
          title="Export edited grid data to Excel file"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Data (.xlsx)
        </button>

        <button
          className="btn btn-secondary"
          onClick={onShowAllRows}
          disabled={hiddenRowCount === 0}
          title="Re-enable all hidden rows"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Show Hidden ({hiddenRowCount})
        </button>

        <button className="btn btn-primary" onClick={onAddRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Row
        </button>
      </div>

      {capabilityGroups.length > 0 && (
        <div className="capability-controls">
          <div className="capability-controls-header">
            <h3>Business Capability Visibility</h3>
            <span>{capabilityGroups.length} capabilities</span>
          </div>
          <div className="capability-control-list">
            {capabilityGroups.map((capability) => {
              const allHidden = capability.hidden === capability.total;
              const partiallyHidden = capability.hidden > 0 && !allHidden;

              return (
                <div key={capability.name} className="capability-control-item">
                  <div className="capability-control-meta">
                    <strong>{capability.name}</strong>
                    <span>
                      {capability.total - capability.hidden}/{capability.total} visible
                    </span>
                  </div>
                  <div className="capability-control-actions">
                    <button
                      className="btn btn-secondary capability-btn"
                      onClick={() => onSetBusinessCapabilityHidden(capability.name, true)}
                      disabled={allHidden}
                      title={`Hide all rows for ${capability.name}`}
                    >
                      Hide All
                    </button>
                    <button
                      className="btn btn-secondary capability-btn"
                      onClick={() => onSetBusinessCapabilityHidden(capability.name, false)}
                      disabled={capability.hidden === 0}
                      title={`Show all rows for ${capability.name}`}
                    >
                      Show All
                    </button>
                    <button
                      className="btn btn-secondary capability-btn"
                      onClick={() => onToggleBusinessCapabilityHidden(capability.name)}
                      title={
                        allHidden
                          ? `Show ${capability.name}`
                          : `Hide visible rows for ${capability.name}`
                      }
                    >
                      {allHidden ? 'Enable' : partiallyHidden ? 'Hide Rest' : 'Disable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid */}
      <DataGrid
        rows={rows}
        columns={model.columns}
        onUpdateCell={onUpdateCell}
        onDeleteRow={onDeleteRow}
        onDuplicateRow={onDuplicateRow}
        onToggleRowHidden={onToggleRowHidden}
        searchTerm={searchTerm}
      />

      {/* Paste Modal */}
      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImport={onSetRows}
        model={model}
      />
    </div>
  );
}
