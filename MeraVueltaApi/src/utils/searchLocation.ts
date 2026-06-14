import axios from 'axios';

export async function getLocation(direction: string): Promise<{ longitude: number, latitude: number } | null> {
  const directionModificada = direction
    .replace(/\//g, ',')
    .replace(/#/g, 'No')
    .replace(/\s+/g, ' ')
    .trim();
  const directionCodificada = encodeURI(directionModificada);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${directionCodificada}&key=${process.env.GOOGLE_API_KEY}`;

  const position = await axios.get(url)
    .then((response) => {
      if (response.status == 200) {
        const resultado = response.data;
        const primerResultado = resultado.results[0];
        if (primerResultado) {
          const coordenadas = primerResultado.geometry.location;
          return { 'longitude': coordenadas.lng, 'latitude': coordenadas.lat };
        } else {
          return null;
        }
      }
      else {
        console.error(`Error al obtener las coordenadas: ${response.status}`);
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return position;
}
