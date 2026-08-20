/**
 * fileParser.js
 * Parses .xlsx and .csv files into row objects
 * using the `xlsx` library.
 */

import * as XLSX from 'xlsx';

// Expected column headers (case-insensitive matching)
const COLUMN_MAP = {
  'business capability': 'businessCapability',
  'business service': 'businessService',
  'service offering': 'serviceOffering',
  'service instance': 'serviceInstance',
  'app/platform/ci': 'appPlatform',
  'app': 'appPlatform',
  'platform': 'appPlatform',
  'ci': 'appPlatform',
};

// Fallback: map by column index if headers don't match
const COLUMN_KEYS_BY_INDEX = [
  'businessCapability',
  'businessService',
  'serviceOffering',
  'serviceInstance',
  'appPlatform',
];

function mapHeadersToColumnKeys(headers) {
  return headers.map((header, index) => {
    if (index === headers.length - 1) {
      return 'appPlatform';
    }

    return COLUMN_MAP[header] || null;
  });
}

/**
 * Parse an uploaded file (.xlsx or .csv) into an array of row objects.
 *
 * @param {File} file - The uploaded file
 * @returns {Promise<Array<Object>>} - Array of row objects
 */
export async function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Take the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to array of arrays
        const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rawRows.length === 0) {
          resolve([]);
          return;
        }

        // Try to detect header row
        const firstRow = rawRows[0].map((cell) => String(cell || '').toLowerCase().trim());
        const hasHeaders = firstRow.some((cell) => COLUMN_MAP[cell]);

        let dataRows;
        let columnMapping;

        if (hasHeaders) {
          // Map headers to our column keys
          columnMapping = mapHeadersToColumnKeys(firstRow);
          dataRows = rawRows.slice(1);
        } else {
          // No recognizable headers, map by index
          columnMapping = COLUMN_KEYS_BY_INDEX;
          dataRows = rawRows;
        }

        const rows = dataRows
          .filter((row) => row.some((cell) => cell != null && String(cell).trim() !== ''))
          .map((row) => {
            const obj = {
              businessCapability: '',
              businessService: '',
              serviceOffering: '',
              serviceInstance: '',
              appPlatform: '',
            };

            for (let i = 0; i < Math.min(row.length, columnMapping.length); i++) {
              const key = columnMapping[i];
              if (key) {
                obj[key] = String(row[i] || '').trim();
              }
            }

            return obj;
          });

        resolve(rows);
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function parseDelimitedLine(line, delimiter) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // Escaped quote inside quoted value
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  cells.push(current.trim());
  return cells;
}

function isHeaderRow(cells) {
  const normalized = cells.map((c) => String(c || '').toLowerCase().trim());
  return normalized.some((cell) => COLUMN_MAP[cell]);
}

function createEmptyRowObject() {
  return {
    businessCapability: '',
    businessService: '',
    serviceOffering: '',
    serviceInstance: '',
    appPlatform: '',
  };
}

/**
 * Parse pasted tab-separated or comma-separated text into row objects.
 *
 * @param {string} text - TSV or CSV text
 * @returns {Array<Object>} - Array of row objects
 */
export function parsePastedText(text) {
  if (!text || !text.trim()) return [];

  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const lines = normalizedText.split('\n').filter((line) => line.trim() !== '');

  if (lines.length === 0) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const parsedRows = lines.map((line) => parseDelimitedLine(line, delimiter));

  let dataRows = parsedRows;
  let columnMapping = COLUMN_KEYS_BY_INDEX;

  if (parsedRows.length > 0 && isHeaderRow(parsedRows[0])) {
    const normalizedHeaders = parsedRows[0].map((header) => String(header || '').toLowerCase().trim());
    columnMapping = mapHeadersToColumnKeys(normalizedHeaders);
    dataRows = parsedRows.slice(1);
  }

  return dataRows
    .map((cells) => {
      const row = createEmptyRowObject();

      for (let i = 0; i < Math.min(cells.length, columnMapping.length); i++) {
        const key = columnMapping[i];
        if (!key) continue;
        row[key] = String(cells[i] || '').trim();
      }

      return row;
    })
    .filter((row) => Object.values(row).some((v) => v !== ''));
}
