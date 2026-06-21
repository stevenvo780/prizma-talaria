# Talaria Frond

Frontend web de Talaria para operacion de pedidos y seguimiento de entregas.

## Stack

- React 17
- Webpack
- Redux
- Integracion con mapas y mensajeria

## Configuracion

```bash
cp .env.example .env
```

Variables principales:
- `REACT_APP_BACK_END`
- `REACT_APP_MAPBOX_API`
- `REACT_APP_URL_WHATSAPP`

## Ejecucion

```bash
npm install
npm run dev
```

Servidor local:
- `http://localhost:9091`

## Produccion local

```bash
npm run build
npm start
```

## Nota de despliegue

El frontend web esta desplegado en Vercel:
- URL: `https://talaria.prisma-enterprise.cloud`

## Relacion con otros componentes

- API: `../MeraVueltaApi/README.md`
- App movil: `../MeraVueltaMovil/README.md`
- Sitio publico: `../MeraVueltaPublicity/README.md`

