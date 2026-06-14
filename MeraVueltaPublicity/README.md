# MeraVuelta Publicity

Sitio publico estatico de MeraVuelta (landing/informacion comercial).

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
docker build -t meravuelta-publicity .
docker run -p 8080:80 meravuelta-publicity
```

## Nota de despliegue

Desplegado en GCP Cloud Run:
- Proyecto: `arctic-sum-359215`
- Servicio: `mera-vuelta-publicity`
- URL: `https://mera-vuelta-publicity-xb252ymbgq-uc.a.run.app`
