# MeraVuelta

Suite de logistica de ultima milla para gestion y seguimiento de entregas.

## Componentes

- `MeraVueltaApi`: backend TypeScript (Hapi + TypeORM + PostgreSQL), puerto base `3006`.
- `MeraVueltaFrond`: frontend React/Webpack, puerto base `9091`.
- `MeraVueltaMovil`: app movil con Expo/React Native.
- `MeraVueltaPublicity`: sitio publico estatico.

## Infraestructura

- `MeraVueltaApi/Dockerfile` (Node 14, expone `3006`).
- `MeraVueltaFrond/Dockerfile` (build React + Nginx, expone `9091`).
- `MeraVueltaPublicity/Dockerfile` (Nginx estatico, expone `80`).
- Integraciones externas: Google Sheets, Google Maps, WhatsApp, Firebase.

## Despliegue validado (GCP)

- Proyecto `arctic-sum-359215`
  - `apidomiciliostypescript` -> `https://apidomiciliostypescript-xb252ymbgq-uc.a.run.app`
  - `appdomicios` -> `https://appdomicios-xb252ymbgq-uc.a.run.app`
  - `mera-vuelta-publicity` -> `https://mera-vuelta-publicity-xb252ymbgq-uc.a.run.app`
- Proyecto `emergent-enterprises` (integraciones)
  - `weebhookmeravueltatotalpedidos` -> `https://weebhookmeravueltatotalpedidos-6dalnsowyq-uc.a.run.app`
  - `webhook-reports-totalpedidos` -> `https://webhook-reports-totalpedidos-6dalnsowyq-uc.a.run.app`

## Arranque rapido por servicio

```bash
cd MeraVueltaApi && npm install && npm run dev
cd ../MeraVueltaFrond && npm install && npm run dev
cd ../MeraVueltaMovil && npm install && npm run start
```

## Referencias

- API: `MeraVueltaApi/README.md`
- Webhooks HubCentral: `MeraVueltaApi/WEBHOOK_README.md`
- Frontend web: `MeraVueltaFrond/README.md`
- Sitio publico: `MeraVueltaPublicity/README.md`
