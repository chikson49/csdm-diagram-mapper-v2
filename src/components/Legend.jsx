/**
 * Legend.jsx
 * Floating legend overlay mapping CSDM layer colors to labels.
 */

export default function Legend({ columns = [] }) {
  return (
    <div className="legend-box">
      <h4>CSDM Diagram Legend</h4>
      {columns.map((item) => (
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
