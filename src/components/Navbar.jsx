/**
 * Navbar.jsx
 * Fixed top navigation bar with title and action buttons.
 */

import { useState } from 'react';

export default function Navbar({ onExport }) {
  const [exportType, setExportType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type) => {
    setIsExporting(true);
    setExportType(type);
    try {
      await onExport(type);
    } catch (err) {
      console.error(`Export ${type} failed:`, err);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <nav
      style={{
        background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 50,
      }}
    >
      {/* Left side empty placeholder / brand icon area */}
      <div></div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          className="btn btn-navbar"
          onClick={() => handleExport('mermaid')}
          disabled={isExporting}
          style={{
            background: 'rgba(255,255,255,0.2)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Export Mermaid (.mmd)
        </button>
        <button
          className="btn btn-navbar"
          onClick={() => handleExport('png')}
          disabled={isExporting}
          style={{
            background: 'rgba(255,255,255,0.25)',
            opacity: isExporting && exportType === 'png' ? 0.7 : 1,
          }}
        >
          {isExporting && exportType === 'png' ? (
            <span style={{ animation: 'pulse-subtle 1s infinite' }}>Exporting…</span>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export PNG
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
