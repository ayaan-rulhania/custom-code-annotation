# Custom Language Annotation App

This repository contains a TypeScript React frontend and a TypeScript Node.js (Express) backend that together enable users to upload keywords for a custom language, select an annotation style, annotate files, and generate a downloadable TypeScript annotator script.

Quick start:

- Frontend:
  - cd frontend
  - npm install
  - npm run dev

- Backend (TypeScript):
  - cd backend/ts
  - npm install
  - npm run dev

The frontend expects the backend service to be available under `/api/*`. The Vite dev server is configured to proxy these requests to `http://localhost:4567`.
