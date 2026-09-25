# CSDM Diagram Mapper

Browser-based SPA for creating, editing, and managing CSDM (Common Services Data Model) diagrams with live real-time auto-layout.

![CSDM Diagram Mapper Screenshot](<./Screenshot 2026-08-05 144238.png>)


## Quick Start (Local Development)

Use Node.js 22.12 or later in the Node 22 series, as declared in `package.json`.

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

## CSDM Models

Select Standard (5-level), Technical CSDM (6-level), or Extended CSDM (8-level)
in the data editor. Each model keeps its own saved rows, column labels, and
hidden levels. Switching models does not convert or replace another model's data.

Extended CSDM uses this top-to-bottom hierarchy and import column order:

| Level | Column | Color |
| --- | --- | --- |
| 1 | Business Capability | Purple |
| 2 | Business Service | Dark green |
| 3 | Business Service Offering | Light green |
| 4 | Service Instance | Orange |
| 5 | Technology Management Service | Dark orange |
| 6 | Technology Management Service Offering | Light orange |
| 7 | Business Application [HOST] | Dark blue |
| 8 | Business Application [APP] | Light blue |

For CSV/XLSX imports, select the model first and arrange columns in the order
above. The first row is treated as a header; header names are not matched.
For pasted CSV/TSV data, set the header-row checkbox to match your source.
The diagram, legend, Excel, Mermaid, and PNG exports use the selected model.

---

## Public Hosting on Azure Static Web Apps (Free)

This deployment is publicly accessible without visitor sign-in or VPN. Get
company approval before publishing. A private GitHub repository does not make
the website private: all shipped frontend code and sample data are downloadable.
Keep confidential spreadsheets, credentials, and local data out of the repository
and the build output.

### Create in Azure Portal

1. Push the intended application source, `package.json`, and `package-lock.json`
   to your GitHub repository's deployment branch. Local uncommitted changes are
   not deployed. Do not commit `node_modules` or `dist`.
2. In [Azure Portal](https://portal.azure.com), search for **Static Web Apps** and
   select **Create**.
3. Choose your approved subscription and resource group, enter a name such as
   `csdm-mapper-pilot`, and select the **Free** plan. If asked for a region,
   choose the nearest approved available region.
4. Select **GitHub** as the deployment source, sign in, authorise repository
   access, and select your organisation, repository, and deployment branch.
   A GitHub organisation administrator may need to approve access.
5. Enter these build settings (assuming this project is at the repository root):

   | Setting | Value |
   | --- | --- |
   | Build preset | React |
   | App location | `/` |
   | API location | Empty |
   | Output location | `dist` |

   Replace the React preset's `build` output with `dist`: this app uses Vite.
   The existing `npm run build` script creates the static output. The Node
   `engines` setting selects a compatible Node 22 runtime for Azure's builder.
6. Keep the default deployment-token option if prompted. Select **Review +
   create**, then **Create**. Do not add private endpoints or custom Entra
   authentication for this public pilot.
7. Azure creates a GitHub Actions workflow and deployment secret. Follow the
   deployment-status link from **Overview** and wait for the workflow to pass.
   Then open the HTTPS URL in **Overview**. No Docker, database, or API is needed.
8. Pull Azure's generated workflow into your local checkout before editing it.
   Keep one deployment workflow for this app; do not add a duplicate publisher.

Azure's **Sign in with GitHub** connects the repository for deployment, not
visitor login. Visitors need neither Azure nor GitHub accounts. Mandatory
visitor authentication would be a separate change to the hosting configuration.

### Validate and Operate

Before deployment, run `npm ci`, `npm run lint`, and `npm run build`. Use a fresh
build rather than an old `dist` folder from private-hosting experiments. There
is intentionally no Azure authentication configuration in `public` for this
pilot. No client-side URL router is used, so a blanket SPA fallback is unnecessary.

After deployment, test in an incognito browser off VPN: open the site, import
non-sensitive CSV/XLSX data, edit a diagram, reload, and export PNG, ZIP, Excel,
and Mermaid. Check Google Fonts is reachable on the users' network; the current
stylesheet still uses it. Check the browser network panel for failed assets.

If the build fails, open the failing GitHub Actions step. Check the deployed
branch, `/` app location, `dist` output, and Node version. If Azure's automatic
builder cannot supply a compatible runtime, build explicitly with Node 22 in
the generated workflow and upload `dist` with `skip_app_build: true`,
`app_location: dist`, and an empty `output_location` and `api_location`.

Commits to the configured branch redeploy automatically. Review changes before
merging; for rollback, revert the faulty application commit through your normal
review process and deploy again. Keep deployment tokens in GitHub secrets,
never in frontend code. Review dependency security findings before wider rollout.

The Azure Free hosting charge is GBP 0 within its quotas, including the default
hostname and HTTPS. It has no SLA or private endpoints; exceeding quotas can
make the site unavailable. GitHub Actions overages and purchased custom domains
are separate costs. Review current quotas in the Azure Portal.

Imports are processed in the browser and diagrams remain in browser localStorage.
There is no shared database, account-isolated storage, or cloud backup. Export
localhost data before moving to the hosted URL and import it there. Clearing
browser storage can remove saved work; exported spreadsheets do not necessarily
preserve every display preference.

See [Microsoft's Portal quickstart](https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal).

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
