import Papa from 'papaparse';
import { FoodPoint, GeocodeCache } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYYjcr9xi5IxIdmY94SgYg8XF65jhk9KrUJp9lGX6hmCfSKo_RBqiTy599yysuezLY31sExGeY2lj_/pub?output=csv';
const CACHE_KEY = 'istanbul_food_map_cache';

export async function fetchFoodPoints(): Promise<FoodPoint[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data as any[];
        const points: FoodPoint[] = data
          .filter(row => row['Mekan Adı'] || row['Adres']) // Basic filter for empty rows
          .map((row, index) => ({
            id: index.toString(),
            name: row['Mekan Adı'] || 'İsimsiz Mekan',
            district: row['İlçe'] || '',
            address: row['Adres'] || '',
            phone: row['Telefon'] || row['İletişim'] || '',
          }));
        resolve(points);
      },
      error: (error) => reject(error),
    });
  });
}

export function getCache(): GeocodeCache {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : {};
}

export function setCache(cache: GeocodeCache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export async function geocodeAddress(address: string, district: string): Promise<{ lat: number; lng: number } | null> {
  const fullAddress = `${address}, ${district}, Istanbul, Turkey`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'tr',
        'User-Agent': 'IstanbulFoodMapApp/1.0'
      }
    });
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Global delay function to respect API limits
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
