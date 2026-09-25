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

  extended: {
    id: 'extended',
    label: 'Extended CSDM (8-level)',
    storageKey: 'csdm_vibe_mapper_grid_data_extended',
    columns: [
      { key: 'businessCapability',                  layer: 'capability',                          label: 'Business Capability',                    color: '#bb41ff' },
      { key: 'businessService',                     layer: 'service',                             label: 'Business Service',                       color: '#018002' },
      { key: 'serviceOffering',                     layer: 'offering',                            label: 'Business Service Offering',              color: '#6dac48' },
      { key: 'serviceInstance',                     layer: 'instance',                            label: 'Service Instance',                       color: '#ff9b01' },
      { key: 'technologyManagementService',         layer: 'technologyManagementService',         label: 'Technology Management Service',          color: '#c65d00' },
      { key: 'technologyManagementServiceOffering', layer: 'technologyManagementServiceOffering', label: 'Technology Management Service Offering', color: '#ffbf69', textColor: '#1a202c' },
      { key: 'businessApplicationHost',             layer: 'appHost',                             label: 'Business Application [HOST]',            color: '#1e40af' },
      { key: 'businessApplicationApp',              layer: 'appApp',                              label: 'Business Application [APP]',             color: '#60a5fa', textColor: '#1a202c' },
    ],
    sampleData: [
      {
        businessCapability: 'Retail Banking',
        businessService: 'Digital Banking',
        serviceOffering: 'Online Banking',
        serviceInstance: 'Online Banking - Production',
        technologyManagementService: 'Application Hosting',
        technologyManagementServiceOffering: 'Managed Java Hosting - Production',
        businessApplicationHost: 'Banking Host 01',
        businessApplicationApp: 'Customer Portal',
      },
      {
        businessCapability: 'Retail Banking',
        businessService: 'Digital Banking',
        serviceOffering: 'Online Banking',
        serviceInstance: 'Online Banking - Production',
        technologyManagementService: 'Application Hosting',
        technologyManagementServiceOffering: 'Managed Java Hosting - Production',
        businessApplicationHost: 'Banking Host 02',
        businessApplicationApp: 'Customer Portal',
      },
      {
        businessCapability: 'Retail Banking',
        businessService: 'Payments',
        serviceOffering: 'Domestic Transfers',
        serviceInstance: 'Payments - Production',
        technologyManagementService: 'Application Hosting',
        technologyManagementServiceOffering: 'Managed Java Hosting - Production',
        businessApplicationHost: 'Payments Host 01',
        businessApplicationApp: 'Payment Processor',
      },
      {
        businessCapability: 'Portfolio Management',
        businessService: 'Investment Reporting',
        serviceOffering: 'Portfolio Reports',
        serviceInstance: 'Reporting - Production',
        technologyManagementService: 'Analytics Hosting',
        technologyManagementServiceOffering: 'Managed Analytics - Production',
        businessApplicationHost: 'Reporting Host 01',
        businessApplicationApp: 'Portfolio Analytics',
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
