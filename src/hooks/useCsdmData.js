/**
 * useCsdmData.js
 * Central state management hook for the CSDM grid data.
 * Includes LocalStorage auto-persistence, reset capability, and
 * switching between CSDM level models (e.g. standard vs technical).
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { CSDM_MODELS, DEFAULT_MODEL_ID, ACTIVE_MODEL_STORAGE_KEY } from '../utils/csdmModels';

function normalizeRow(row = {}, columns) {
  const normalized = { isHidden: Boolean(row.isHidden) };
  for (const col of columns) {
    normalized[col.key] = row[col.key] || '';
  }
  return normalized;
}

function normalizeRows(rows = [], columns) {
  return rows.map((row) => normalizeRow(row, columns));
}

function createEmptyRow(columns) {
  return normalizeRow({}, columns);
}

function getInitialModelId() {
  try {
    const saved = localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY);
    if (saved && CSDM_MODELS[saved]) return saved;
  } catch (err) {
    console.error('Failed to load saved CSDM model:', err);
  }
  return DEFAULT_MODEL_ID;
}

function getSavedRows(model) {
  try {
    const saved = localStorage.getItem(model.storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeRows(parsed, model.columns);
      }
    }
  } catch (err) {
    console.error('Failed to load saved CSDM data:', err);
  }
  return normalizeRows(model.sampleData, model.columns);
}

export function useCsdmData() {
  const [modelId, setModelId] = useState(getInitialModelId);
  const model = useMemo(() => CSDM_MODELS[modelId], [modelId]);
  const [rows, setRowsState] = useState(() => getSavedRows(model));

  // Auto-save changes to localStorage (per-model)
  useEffect(() => {
    try {
      localStorage.setItem(model.storageKey, JSON.stringify(rows));
    } catch (err) {
      console.error('Failed to save CSDM data:', err);
    }
  }, [rows, model.storageKey]);

  const setModel = useCallback((newModelId) => {
    if (!CSDM_MODELS[newModelId] || newModelId === modelId) return;
    try {
      localStorage.setItem(ACTIVE_MODEL_STORAGE_KEY, newModelId);
    } catch (err) {
      console.error('Failed to save active CSDM model:', err);
    }
    setModelId(newModelId);
    setRowsState(getSavedRows(CSDM_MODELS[newModelId]));
  }, [modelId]);

  const updateCell = useCallback((rowIndex, key, value) => {
    setRowsState((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [key]: value };
      return updated;
    });
  }, []);

  const addRow = useCallback(() => {
    setRowsState((prev) => [...prev, createEmptyRow(model.columns)]);
  }, [model.columns]);

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
      setRowsState(normalizeRows(newRows, model.columns));
    }
  }, [model.columns]);

  const resetRows = useCallback(() => {
    setRowsState(normalizeRows(model.sampleData, model.columns));
  }, [model.columns, model.sampleData]);

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
    model,
    setModel,
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
