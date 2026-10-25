# E2C — Edge to Center

A React + Vite interactive demo for the E2C visual task-management concept.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Create a production build
```bash
npm run build
npm run preview
```

## Deploy to Vercel (GitHub method)
1. Create a new GitHub repository named `e2c-edge-to-center`.
2. Upload/push the contents of this folder to the repository root.
3. Sign in to Vercel and choose **Add New → Project**.
4. Import the GitHub repository.
5. Vercel should detect Vite automatically. Confirm:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
6. Click **Deploy**. Vercel will provide a public `*.vercel.app` URL.
7. Open the URL on a second device and test the demo before presenting.

## Demo scope
- Task and project changes are held in the current browser session's React state.
- This is a presentation prototype, not a multi-user workspace. Changes are not shared with teammates and may reset on refresh.
- No account system, database, or backend is included.
