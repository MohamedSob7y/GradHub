# GradHub Frontend

React SPA — to be initialized with Vite.

## Folder structure

```
src/
├── auth/           ← Login, Register pages + hooks + authApi.ts
├── student-profile/← Student profile + CV upload pages + hooks
├── projects/       ← Project form, detail pages + hooks
├── recruiter/      ← Browse projects, company profile pages + hooks
├── messaging/      ← Inbox, conversation thread pages + hooks
└── shared/         ← Shared components, hooks, axios instance, TypeScript types
```

## Getting started (once initialized)

```bash
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` by default, which matches the
`AllowedOrigins` setting in the API's `appsettings.json`.
