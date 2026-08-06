/**
 * PasteModal.jsx
 * Modal dialog for importing pasted TSV/CSV data.
 */

import { useState } from 'react';
import { parsePastedText } from '../utils/fileParser';

export default function PasteModal({ isOpen, onClose, onImport }) {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    const rows = parsePastedText(text);
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

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <h3>Import via Paste</h3>
        <p>
          Paste tab-separated or comma-separated data below. You can copy rows directly from
          Google Sheets, Excel, or any spreadsheet application. CSV text is also supported.
          Each row should have 5 columns:
          <strong> Business Capability, Business Service, Service Offering, Service Instance, App/Platform/CI</strong>.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Portfolio Management\tRetail Banking\tStandard Offering\tTest Instance\tOracle DB\nRetail Banking\tRetail Banking\tStandard Offering\tTest Instance 1\tOracle DB`}
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
