# CSDM Diagram Mapper — Changelog

All changes made during implementation are logged here in reverse chronological order.

---

## [2026-08-05 14:03] — Mermaid ClassDef Color Styling Export
- **Action**: Updated [`mermaidExporter.js`](file:///c:/D/CSDM%20trial/src/utils/mermaidExporter.js) to append CSDM layer `classDef` color definitions and node class assignments (`class nodeID layerType;`) to exported `.mmd` files:
  - `classDef capability fill:#bf40ff,stroke:#333,stroke-width:2px,color:#fff;`
  - `classDef service fill:#008000,stroke:#333,stroke-width:2px,color:#fff;`
  - `classDef offering fill:#70ad47,stroke:#333,stroke-width:2px,color:#fff;`
  - `classDef instance fill:#ff9900,stroke:#333,stroke-width:2px,color:#000;`
  - `classDef app fill:#2e75b6,stroke:#333,stroke-width:2px,color:#fff;`
- **Files Modified**: `src/utils/mermaidExporter.js`

---

## [2026-08-05 13:57] — Professional Image Exporter Architecture
- **Action**: Upgraded `exportDiagram.js` to adopt full graph bounding box camera matrix transform.
