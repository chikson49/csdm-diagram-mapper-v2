/**
 * Legend.jsx
 * Floating legend overlay mapping CSDM layer colors to labels.
 */

const LEGEND_ITEMS = [
  { layer: 'capability', color: '#bb41ff', label: 'Business Capability' },
  { layer: 'service',    color: '#018002', label: 'Business Service' },
  { layer: 'offering',   color: '#6dac48', label: 'Service Offering' },
  { layer: 'instance',   color: '#ff9b01', label: 'Service Instance' },
  { layer: 'app',        color: '#2e76b7', label: 'App/Platform/CI' },
];

export default function Legend() {
  return (
    <div className="legend-box">
      <h4>CSDM Diagram Legend</h4>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.layer} className="legend-item">
          <div
            className="legend-swatch"
            style={{ background: item.color }}
          />
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
