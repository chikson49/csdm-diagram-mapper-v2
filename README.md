# CSDM Diagram Mapper

Browser-based SPA for creating, editing, and managing CSDM (Common Services Data Model) diagrams with live real-time auto-layout.

![CSDM Diagram Mapper Screenshot](<./Screenshot 2026-08-05 144238.png>)


## Quick Start (Local Development)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your web browser.

---

## Running with Docker

### Option A: Build and Run Image Locally
```bash
# Build the Docker image
docker build -t csdm-mapper .

# Run the container on port 8080
docker run -d -p 8080:80 --name csdm-app csdm-mapper
```
Then open `http://localhost:8080/`.

---

## Project Structure

- `src/components/` — UI Components (Data Editor, Diagram Canvas, Legend, Navbar)
- `src/hooks/` — Central data state hook (`useCsdmData.js`)
- `src/utils/` — Graph building, Dagre layout, file parsing, and image exporting
