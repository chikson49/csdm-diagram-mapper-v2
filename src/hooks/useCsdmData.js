/**
 * useCsdmData.js
 * Central state management hook for the CSDM grid data.
 * Includes LocalStorage auto-persistence and reset capability.
 */

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'csdm_vibe_mapper_grid_data';

function normalizeRow(row = {}) {
  return {
    businessCapability: row.businessCapability || '',
    businessService: row.businessService || '',
    serviceOffering: row.serviceOffering || '',
    serviceInstance: row.serviceInstance || '',
    appPlatform: row.appPlatform || '',
    isHidden: Boolean(row.isHidden),
  };
}

function normalizeRows(rows = []) {
  return rows.map((row) => normalizeRow(row));
}

function createEmptyRow() {
  return normalizeRow();
}

const INITIAL_DATA = [
  {
    businessCapability: 'Portfolio Management',
    businessService: 'Retail Banking',
    serviceOffering: 'Standard Offering',
    serviceInstance: 'Test Instance',
    appPlatform: 'Oracle DB',
  },
  {
    businessCapability: 'Portfolio Management',
    businessService: 'Retail Banking',
    serviceOffering: 'Standard Offering',
    serviceInstance: 'Test Instance 1',
    appPlatform: 'Oracle DB',
  },
  {
    businessCapability: 'Portfolio Management',
    businessService: '',
    serviceOffering: 'Standard Offering',
    serviceInstance: 'Test Instance 2',
    appPlatform: 'Oracle DB',
  },
  {
    businessCapability: 'Retail Banking',
    businessService: 'Retail Banking',
    serviceOffering: 'Standard Offering',
    serviceInstance: 'Test Instance',
    appPlatform: 'Oracle DB',
  },
  {
    businessCapability: 'Retail Banking',
    businessService: 'Retail Banking',
    serviceOffering: 'Standard Offering',
    serviceInstance: 'Test Instance 3',
    appPlatform: 'Oracle DB',
  },
];

function getSavedRows() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeRows(parsed);
      }
    }
  } catch (err) {
    console.error('Failed to load saved CSDM data:', err);
  }
  return normalizeRows(INITIAL_DATA);
}

export function useCsdmData() {
  const [rows, setRowsState] = useState(getSavedRows);

  // Auto-save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (err) {
      console.error('Failed to save CSDM data:', err);
    }
  }, [rows]);

  const updateCell = useCallback((rowIndex, key, value) => {
    setRowsState((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [key]: value };
      return updated;
    });
  }, []);

  const addRow = useCallback(() => {
    setRowsState((prev) => [...prev, createEmptyRow()]);
  }, []);

  const deleteRow = useCallback((rowIndex) => {
    setRowsState((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== rowIndex);
    });
  }, []);

  const duplicateRow = useCallback((rowIndex) => {
    setRowsState((prev) => {
      if (rowIndex < 0 || rowIndex >= prev.length) return prev;
      const copy = { ...prev[rowIndex] };
      const updated = [...prev];
      updated.splice(rowIndex + 1, 0, copy);
      return updated;
    });
  }, []);

  const setRows = useCallback((newRows) => {
    if (Array.isArray(newRows) && newRows.length > 0) {
      setRowsState(normalizeRows(newRows));
    }
  }, []);

  const resetRows = useCallback(() => {
    setRowsState(normalizeRows(INITIAL_DATA));
  }, []);

  const toggleRowHidden = useCallback((rowIndex) => {
    setRowsState((prev) => {
      if (rowIndex < 0 || rowIndex >= prev.length) return prev;
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        isHidden: !updated[rowIndex].isHidden,
      };
      return updated;
    });
  }, []);

  const showAllRows = useCallback(() => {
    setRowsState((prev) => prev.map((row) => ({ ...row, isHidden: false })));
  }, []);

  const setBusinessCapabilityHidden = useCallback((businessCapability, isHidden) => {
    const capability = String(businessCapability || '').trim();
    if (!capability) return;

    setRowsState((prev) =>
      prev.map((row) => {
        if (String(row.businessCapability || '').trim() !== capability) {
          return row;
        }
        return { ...row, isHidden };
      })
    );
  }, []);

  const toggleBusinessCapabilityHidden = useCallback((businessCapability) => {
    const capability = String(businessCapability || '').trim();
    if (!capability) return;

    setRowsState((prev) => {
      const matchingRows = prev.filter(
        (row) => String(row.businessCapability || '').trim() === capability
      );

      if (matchingRows.length === 0) return prev;

      const shouldHide = matchingRows.some((row) => !row.isHidden);

      return prev.map((row) => {
        if (String(row.businessCapability || '').trim() !== capability) {
          return row;
        }
        return { ...row, isHidden: shouldHide };
      });
    });
  }, []);

  return {
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
  };
}
