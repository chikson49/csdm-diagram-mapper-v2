/**
 * fileParser.js
 * Parses .xlsx and .csv files, and pasted TSV/CSV text, into row objects
 * by mapping columns positionally to the active model's column keys
 * (header text is not matched since it may vary between sheets).
 */

import * as XLSX from 'xlsx';

function createEmptyRowObject(columns) {
  const obj = {};
  for (const col of columns) {
    obj[col.key] = '';
  }
  return obj;
}

function rowCellsToObject(cells, columns) {
  const obj = createEmptyRowObject(columns);
  for (let i = 0; i < Math.min(cells.length, columns.length); i++) {
    obj[columns[i].key] = String(cells[i] ?? '').trim();
  }
  return obj;
}

/**
 * Parse an uploaded file (.xlsx or .csv) into an array of row objects.
 * The first row is always treated as a header row and skipped; remaining
 * rows are mapped positionally to `columns`.
 *
 * @param {File} file - The uploaded file
 * @param {Array<{key: string}>} columns - Active model's columns, in order
 * @returns {Promise<Array<Object>>} - Array of row objects
 */
export async function parseFile(file, columns) {
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

        // First row is always a header row and gets skipped
        const dataRows = rawRows.slice(1);

        const rows = dataRows
          .filter((row) => row.some((cell) => cell != null && String(cell).trim() !== ''))
          .map((row) => rowCellsToObject(row, columns));

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

/**
 * Parse pasted tab-separated or comma-separated text into row objects,
 * mapping columns positionally to `columns`.
 *
 * @param {string} text - TSV or CSV text
 * @param {Array<{key: string}>} columns - Active model's columns, in order
 * @param {{hasHeaderRow?: boolean}} [options] - Whether the first line is a header row to skip
 * @returns {Array<Object>} - Array of row objects
 */
export function parsePastedText(text, columns, { hasHeaderRow = true } = {}) {
  if (!text || !text.trim()) return [];

  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const lines = normalizedText.split('\n').filter((line) => line.trim() !== '');

  if (lines.length === 0) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const parsedRows = lines.map((line) => parseDelimitedLine(line, delimiter));

  const dataRows = hasHeaderRow ? parsedRows.slice(1) : parsedRows;

  return dataRows
    .map((cells) => rowCellsToObject(cells, columns))
    .filter((row) => Object.values(row).some((v) => v !== ''));
}
