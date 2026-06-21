# Talaria

Suite de logistica de ultima milla para gestion y seguimiento de entregas.

## Componentes

- `TalariaApi`: backend TypeScript (Hapi + TypeORM + PostgreSQL), puerto base `3006`.
- `TalariaFrond`: frontend React/Webpack, puerto base `9091`.
- `TalariaMovil`: app movil con Expo/React Native.
- `TalariaPublicity`: sitio publico estatico.

## Infraestructura

- `TalariaApi/Dockerfile` (Node 14, expone `3006`).
- `TalariaFrond/Dockerfile` (build React + Nginx, expone `9091`).
- `TalariaPublicity/Dockerfile` (Nginx estatico, expone `80`).
- Integraciones externas: Google Sheets, Google Maps, WhatsApp, Firebase.

## Despliegue validado (GCP)

- Proyecto `arctic-sum-359215`
  - `apidomiciliostypescript` -> `https://apidomiciliostypescript-xb252ymbgq-uc.a.run.app`
  - `appdomicios` -> `https://appdomicios-xb252ymbgq-uc.a.run.app`
  - `mera-vuelta-publicity` -> `https://mera-vuelta-publicity-xb252ymbgq-uc.a.run.app`
- Proyecto `emergent-enterprises` (integraciones)
  - `weebhooktalariaprizma-hermes` -> `https://weebhooktalariaprizma-hermes-6dalnsowyq-uc.a.run.app`
  - `webhook-reports-prizma-hermes` -> `https://webhook-reports-prizma-hermes-6dalnsowyq-uc.a.run.app`

## Arranque rapido por servicio

```bash
cd TalariaApi && npm install && npm run dev
cd ../TalariaFrond && npm install && npm run dev
cd ../TalariaMovil && npm install && npm run start
```

## Referencias

- API: `TalariaApi/README.md`
- Webhooks Nous: `TalariaApi/WEBHOOK_README.md`
- Frontend web: `TalariaFrond/README.md`
- Sitio publico: `TalariaPublicity/README.md`
