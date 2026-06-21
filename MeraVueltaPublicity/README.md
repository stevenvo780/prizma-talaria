# Talaria Publicity

Sitio publico estatico de Talaria (landing/informacion comercial).

## Stack

- HTML + CSS + JavaScript
- Nginx para despliegue en contenedor

## Ejecucion local rapida

Con servidor simple:

```bash
python3 -m http.server 8080
```

Abrir:
- `http://localhost:8080`

## Docker

```bash
docker build -t talaria-publicity .
docker run -p 8080:80 talaria-publicity
```

## Nota de despliegue

Desplegado en Vercel/Cloud Run:
- URL: `https://talaria.prisma-enterprise.cloud`
