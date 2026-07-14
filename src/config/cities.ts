export interface CityCoords {
  lat: number;
  long: number;
}

export const CITY_COORDS: Record<string, CityCoords> = {
  denver: { lat: 39.7392, long: -104.9903 },
};

export const lookupCity = (city: string): CityCoords | undefined =>
  CITY_COORDS[city.toLowerCase()];
