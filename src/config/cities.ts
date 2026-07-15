import axios from "axios";

export interface CityCoords {
  lat: number;
  long: number;
  label?: string;
}

// Local fast-path cache. First hit for these skips the geocoding round-trip.
export const CITY_COORDS: Record<string, CityCoords> = {
  denver: { lat: 39.7392, long: -104.9903, label: "Denver, CO" },
  "new york": { lat: 40.7128, long: -74.006, label: "New York, NY" },
  london: { lat: 51.5074, long: -0.1278, label: "London, UK" },
  tokyo: { lat: 35.6762, long: 139.6503, label: "Tokyo, JP" },
  seattle: { lat: 47.6062, long: -122.3321, label: "Seattle, WA" },
  chicago: { lat: 41.8781, long: -87.6298, label: "Chicago, IL" },
};

// In-memory geocoding cache — persists for the tab's lifetime, avoids
// re-hitting the API when the user toggles between the same few cities.
const geocodeCache = new Map<string, CityCoords>();

const normalize = (name: string) => name.trim().toLowerCase();

/**
 * Resolve a city name → lat/long. Falls back to OpenWeather's geocoding
 * endpoint when the name isn't in the local cache, so any city works
 * without hand-maintaining coordinates.
 */
export const resolveCity = async (
  name: string,
  apiKey: string | undefined,
): Promise<CityCoords> => {
  const key = normalize(name);
  const local = CITY_COORDS[key];
  if (local) return local;

  const cached = geocodeCache.get(key);
  if (cached) return cached;

  if (!apiKey) {
    throw new Error(`No API key set — cannot look up "${name}"`);
  }

  const response = await axios.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    { params: { q: name, limit: 1, appid: apiKey } },
  );
  const hit = response.data?.[0];
  if (!hit) {
    throw new Error(`City not found: ${name}`);
  }
  const coords: CityCoords = {
    lat: hit.lat,
    long: hit.lon,
    label: [hit.name, hit.state, hit.country].filter(Boolean).join(", "),
  };
  geocodeCache.set(key, coords);
  return coords;
};
