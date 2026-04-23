import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FoodPoint } from '../types';
import { Utensils, MapPin, Clock, Phone, Navigation, Info, ExternalLink } from 'lucide-react';

// Custom Marker Creators
const createCustomIcon = (type: string) => {
  let color = '#F97316'; // orange-500 (Default/Aşevi)
  if (type === 'Kent Lokantası') color = '#3B82F6'; // blue-500
  if (type === 'Dağıtım Noktası') color = '#22C55E'; // green-500

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 10px;
        border: 3px solid white;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

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
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {points.map((point) => {
        if (!point.lat || !point.lng) return null;
        
        return (
          <Marker 
            key={point.id} 
            position={[point.lat, point.lng]}
            icon={createCustomIcon(point.type)}
          >
            <Tooltip direction="top" offset={[0, -32]} opacity={1}>
              <div className="px-2 py-1">
                <div className="font-black text-slate-900 text-xs tracking-tight">{point.name}</div>
                <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{point.district}</div>
              </div>
            </Tooltip>
            
            <Popup className="custom-popup">
              <div className="w-64 font-sans text-slate-800">
                <div className="mb-4">
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${point.type === 'Aşevi' ? 'bg-orange-100 text-orange-600' : point.type === 'Kent Lokantası' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {point.type}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tighter">{point.name}</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                    <p className="text-xs font-medium text-slate-600 leading-relaxed italic">{point.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-xs font-bold text-slate-700">{point.hours || 'Belirtilmedi'}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className={`text-xs font-black italic ${point.isFree ? 'text-green-600' : 'text-blue-600'}`}>
                      {point.isFree ? 'TAMAMEN ÜCRETSİZ' : 'AİDAT / UYGUN FİYATLI'}
                    </p>
                  </div>

                  {point.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <p className="text-xs font-bold text-slate-800">{point.phone}</p>
                    </div>
                  )}

                  {point.notes && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-medium text-slate-500 italic">
                      {point.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`}
                    target="_blank"
                    className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-orange-400" /> Yol Tarifi
                  </a>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
