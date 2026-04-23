export type PointType = 'Aşevi' | 'Kent Lokantası' | 'Dağıtım Noktası' | 'Diğer';

export interface FoodPoint {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  lat?: number;
  lng?: number;
  type: PointType;
  hours?: string;
  isFree?: boolean;
  notes?: string;
  distance?: number; // For "find nearest" feature
}

export interface GeocodeCache {
  [address: string]: {
    lat: number;
    lng: number;
  };
}
