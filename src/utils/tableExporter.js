/**
 * tableExporter.js
 * Utility to export CSDM table data back to .xlsx or .csv files.
 */

import * as XLSX from 'xlsx';

const COLUMN_HEADERS = [
  'Business Capability',
  'Business Service',
  'Service Offering',
  'Service Instance',
  'App/Platform/CI',
];

/**
 * Export table rows to an Excel (.xlsx) file.
 *
 * @param {Array<Object>} rows - Grid rows
 * @param {string} [filename='csdm-data.xlsx']
 */
export function exportTableToExcel(rows, filename = 'csdm-data.xlsx') {
  const data = rows.map((r) => [
    r.businessCapability || '',
    r.businessService || '',
    r.serviceOffering || '',
    r.serviceInstance || '',
    r.appPlatform || '',
  ]);

  // Prepend headers
  data.unshift(COLUMN_HEADERS);

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 24 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CSDM Data');

  XLSX.writeFile(workbook, filename);
}
