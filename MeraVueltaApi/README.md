# Talaria API

API de logistica de ultima milla para gestion de entregas y webhooks del ecosistema.

## Stack

- Node.js + TypeScript
- Hapi.js
- TypeORM + PostgreSQL
- Integraciones: Google Sheets, Google Maps, WhatsApp, Firebase

## Requisitos

- Node.js >= 18
- PostgreSQL

## Configuracion

```bash
cp .env.example .env
```

Variables clave:
- `PORT` (default `3006`)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PWD`
- `WEBHOOK_SECRET`
- `GOOGLE_SERVICE_CLIENT_EMAIL`, `GOOGLE_SERVICE_PRIVATE_KEY`

## Ejecucion

```bash
npm install
npm run dev
```

API local:
- `http://localhost:3006`

## Build

```bash
npm run build
npm run start
```

## Migraciones / TypeORM

```bash
npm run migration:run
npm run migration:revert
npm run migration:show
```

## Integracion Nous

Detalles de contrato de webhooks en:
- `WEBHOOK_README.md`

## Nota de despliegue

Este servicio esta desplegado en GCP Cloud Run:
- Proyecto: `arctic-sum-359215`
- Servicio: `apidomiciliostypescript`
- URL: `https://apidomiciliostypescript-xb252ymbgq-uc.a.run.app`
