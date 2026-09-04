/**
 * PasteModal.jsx
 * Modal dialog for importing pasted TSV/CSV data.
 */

import { useState } from 'react';
import { parsePastedText } from '../utils/fileParser';

export default function PasteModal({ isOpen, onClose, onImport, model }) {
  const [text, setText] = useState('');
  const [hasHeaderRow, setHasHeaderRow] = useState(true);

  if (!isOpen) return null;

  const columns = model.columns;

  const handleImport = () => {
    const rows = parsePastedText(text, columns, { hasHeaderRow });
    if (rows.length > 0) {
      onImport(rows);
      setText('');
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sampleLines = model.sampleData
    .slice(0, 2)
    .map((row) => columns.map((col) => row[col.key] || '').join('\t'));
  const placeholder = hasHeaderRow
    ? [columns.map((col) => col.label).join('\t'), ...sampleLines].join('\n')
    : sampleLines.join('\n');

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <h3>Import via Paste</h3>
        <p>
          Paste tab-separated or comma-separated data below. You can copy rows directly from
          Google Sheets, Excel, or any spreadsheet application. CSV text is also supported.
          Each row should have {columns.length} columns:
          <strong> {columns.map((col) => col.label).join(', ')}</strong>.
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={hasHeaderRow}
            onChange={(e) => setHasHeaderRow(e.target.checked)}
          />
          First row contains headers
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setText('');
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!text.trim()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
}
