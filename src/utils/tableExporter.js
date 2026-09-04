/**
 * tableExporter.js
 * Utility to export CSDM table data back to .xlsx or .csv files.
 */

import * as XLSX from 'xlsx';

/**
 * Export table rows to an Excel (.xlsx) file.
 *
 * @param {Array<Object>} rows - Grid rows
 * @param {Array<{key: string, label: string}>} columns - Active model's columns, in order
 * @param {string} [filename='csdm-data.xlsx']
 */
export function exportTableToExcel(rows, columns, filename = 'csdm-data.xlsx') {
  const data = rows.map((r) => columns.map((col) => r[col.key] || ''));

  // Prepend headers
  data.unshift(columns.map((col) => col.label));

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = columns.map(() => ({ wch: 22 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CSDM Data');

  XLSX.writeFile(workbook, filename);
}
