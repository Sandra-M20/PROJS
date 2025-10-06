export async function getCoordinates(address) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
  );
  const data = await response.json();
  return data[0]; // returns lat, lon
}