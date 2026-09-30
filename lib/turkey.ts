import data from './data/il-ilce.json';

/**
 * Türkiye il/ilçe listesi: 81 il, 973 ilçe.
 * Kaynak: turkey-neighbourhoods paketi (MIT lisansı), Türkçe alfabeye göre sıralı.
 */
const LIST = data as [string, string[]][];
const MAP = new Map(LIST);

export const CITIES: string[] = LIST.map(([city]) => city);

export function districtsOf(city: string): string[] {
  return MAP.get(city) ?? [];
}

export function isValidLocation(city: string, district: string): boolean {
  return MAP.get(city)?.includes(district) ?? false;
}
