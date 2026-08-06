/**
 * DataGrid.jsx
 * Spreadsheet-like editable table with search matching,
 * inline editing, and per-row delete buttons.
 */

const COLUMNS = [
  { key: 'businessCapability', label: 'Business Capability' },
  { key: 'businessService',    label: 'Business Service' },
  { key: 'serviceOffering',    label: 'Service Offering' },
  { key: 'serviceInstance',    label: 'Service Instance' },
  { key: 'appPlatform',       label: 'App/Platform/CI' },
];

export default function DataGrid({ rows, onUpdateCell, onDeleteRow, onToggleRowHidden, searchTerm = '' }) {
  const query = (searchTerm || '').trim().toLowerCase();

  return (
    <div className="data-grid-wrapper">
      <table className="data-grid">
        <thead>
          <tr>
            <th style={{ width: '40px', textAlign: 'center' }}>#</th>
            {COLUMNS.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th style={{ width: '40px' }} title="Hide/Unhide Row"></th>
            <th style={{ width: '40px' }} title="Delete Row"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isHidden = Boolean(row.isHidden);
            const isRowMatch =
              query &&
              COLUMNS.some(
                (col) =>
                  row[col.key] &&
                  row[col.key].toLowerCase().includes(query)
              );

            return (
              <tr
                key={rowIndex}
                style={{
                  background: isRowMatch ? '#fef3c7' : undefined,
                  opacity: isHidden ? 0.55 : 1,
                }}
                className={isHidden ? 'row-hidden' : undefined}
              >
                <td className="row-num">{rowIndex + 1}</td>
                {COLUMNS.map((col) => {
                  const val = row[col.key] || '';
                  const isCellMatch = query && val.toLowerCase().includes(query);

                  return (
                    <td
                      key={col.key}
                      style={{
                        background: isCellMatch ? '#fde68a' : undefined,
                      }}
                    >
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => onUpdateCell(rowIndex, col.key, e.target.value)}
                        placeholder={col.label}
                        spellCheck={false}
                        style={{
                          fontWeight: isCellMatch ? 700 : undefined,
                          color: isCellMatch ? '#92400e' : undefined,
                        }}
                      />
                    </td>
                  );
                })}
                <td className="action-cell">
                  <button
                    className="row-visibility-btn"
                    onClick={() => onToggleRowHidden(rowIndex)}
                    title={isHidden ? 'Unhide row (show in diagram)' : 'Hide row (remove from diagram)'}
                    aria-label={isHidden ? `Unhide row ${rowIndex + 1}` : `Hide row ${rowIndex + 1}`}
                  >
                    {isHidden ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.76 21.76 0 0 1-3.3 4.46" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </td>
                <td className="action-cell">
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteRow(rowIndex)}
                    title="Delete row"
                    aria-label={`Delete row ${rowIndex + 1}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
