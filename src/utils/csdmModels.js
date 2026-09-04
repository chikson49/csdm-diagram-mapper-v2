/**
 * csdmModels.js
 * Single source of truth for the CSDM level models (columns, colors,
 * sample data, storage keys) used across parsing, grid, diagram and exports.
 */

export const DEFAULT_MODEL_ID = 'standard';
export const ACTIVE_MODEL_STORAGE_KEY = 'csdm_active_model';

export const CSDM_MODELS = {
  standard: {
    id: 'standard',
    label: 'Standard (5-level)',
    storageKey: 'csdm_vibe_mapper_grid_data',
    columns: [
      { key: 'businessCapability', layer: 'capability', label: 'Business Capability', color: '#bb41ff' },
      { key: 'businessService',    layer: 'service',    label: 'Business Service',     color: '#018002' },
      { key: 'serviceOffering',    layer: 'offering',   label: 'Service Offering',     color: '#6dac48' },
      { key: 'serviceInstance',    layer: 'instance',   label: 'Service Instance',     color: '#ff9b01' },
      { key: 'appPlatform',        layer: 'app',        label: 'App/Platform/CI',      color: '#2e76b7' },
    ],
    sampleData: [
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
    ],
  },

  technical: {
    id: 'technical',
    label: 'Technical CSDM (6-level)',
    storageKey: 'csdm_vibe_mapper_grid_data_technical',
    columns: [
      { key: 'businessCapability',        layer: 'capability',  label: 'Business Capability',         color: '#bb41ff' },
      { key: 'businessService',           layer: 'service',     label: 'Business Service',             color: '#018002' },
      { key: 'serviceOffering',           layer: 'offering',    label: 'Service Offering',             color: '#6dac48' },
      { key: 'technicalService',          layer: 'techService', label: 'Technical Service',            color: '#ff9b01' },
      { key: 'technicalServiceOffering',  layer: 'techOffering',label: 'Technical Service Offering',   color: '#e07b00' },
      { key: 'ciGroup',                   layer: 'ci',          label: 'CI / Dynamic CI Group',        color: '#2e76b7' },
    ],
    sampleData: [
      {
        businessCapability: 'Portfolio Management',
        businessService: 'Retail Banking',
        serviceOffering: 'Standard Offering',
        technicalService: 'Database Hosting',
        technicalServiceOffering: 'Oracle Hosting - Prod',
        ciGroup: 'Oracle DB Cluster 01',
      },
      {
        businessCapability: 'Portfolio Management',
        businessService: 'Retail Banking',
        serviceOffering: 'Standard Offering',
        technicalService: 'Database Hosting',
        technicalServiceOffering: 'Oracle Hosting - Prod',
        ciGroup: 'Oracle DB Cluster 02',
      },
      {
        businessCapability: 'Retail Banking',
        businessService: 'Retail Banking',
        serviceOffering: 'Standard Offering',
        technicalService: 'App Hosting',
        technicalServiceOffering: 'Java App Hosting - Prod',
        ciGroup: 'App Server Group 01',
      },
    ],
  },
};
