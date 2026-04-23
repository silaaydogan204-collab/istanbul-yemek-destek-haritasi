import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Utensils, MapPin, Phone } from 'lucide-react';
import { FoodPoint } from '../types';

// Fix for default marker icons in React Leaflet using CDN URLs
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  points: FoodPoint[];
  center?: [number, number];
  zoom?: number;
}

export default function Map({ points, center = [41.0082, 28.9784], zoom = 11 }: MapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => (
        point.lat && point.lng ? (
          <Marker key={point.id} position={[point.lat, point.lng]}>
            <Tooltip 
              direction="top" 
              offset={[0, -32]} 
              opacity={1}
              className="custom-tooltip"
            >
              <div className="bg-slate-900 text-white px-3 py-1 text-xs rounded-lg shadow-xl font-bold tracking-tight border border-slate-800">
                {point.name}
              </div>
            </Tooltip>
            <Popup className="custom-popup">
              <div className="w-64 -m-1 font-sans">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 leading-tight text-base">{point.name}</h3>
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-wider">{point.district}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-slate-600 border-t border-orange-50 pt-3">
                  <div className="flex items-start">
                    <MapPin className="w-3 h-3 mr-2 text-slate-400 mt-0.5 shrink-0" />
                    <p className="leading-relaxed">{point.address}</p>
                  </div>
                  {point.phone && (
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-2 text-slate-400 shrink-0" />
                      <p className="font-bold">{point.phone}</p>
                    </div>
                  )}
                </div>
                
                <button className="mt-4 w-full py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-colors">
                  Yol Tarifi Al
                </button>
              </div>
            </Popup>
          </Marker>
        ) : null
      ))}
    </MapContainer>
  );
}
