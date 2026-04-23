import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Loader2, Info, Search, List, Map as MapIcon, Utensils, Navigation, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';
import Map from './Map';
import { FoodPoint, GeocodeCache } from '../types';
import { fetchFoodPoints, getCache, setCache, geocodeAddress, sleep } from '../services/dataService';

interface MapPageProps {
  onBack: () => void;
}

export default function MapPage({ onBack }: MapPageProps) {
  const [points, setPoints] = useState<FoodPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    async function initData() {
      try {
        const rawPoints = await fetchFoodPoints();
        const cache = getCache();
        const updatedPoints: FoodPoint[] = [];
        const newCache: GeocodeCache = { ...cache };
        
        setPoints(rawPoints);
        
        let processedCount = 0;
        
        for (const point of rawPoints) {
          const cacheKey = `${point.address}, ${point.district}`;
          
          if (newCache[cacheKey]) {
            updatedPoints.push({
              ...point,
              lat: newCache[cacheKey].lat,
              lng: newCache[cacheKey].lng
            });
          } else {
            const coords = await geocodeAddress(point.address, point.district);
            if (coords) {
              newCache[cacheKey] = coords;
              updatedPoints.push({ ...point, ...coords });
              setCache(newCache);
            } else {
              updatedPoints.push(point);
            }
            await sleep(1000); 
          }
          
          processedCount++;
          setProgress(Math.round((processedCount / rawPoints.length) * 100));
          if (processedCount % 5 === 0) setPoints([...updatedPoints]);
        }
        setPoints(updatedPoints);
        setLoading(false);
      } catch (error) {
        console.error('Data initialization failed:', error);
        setLoading(false);
      }
    }
    initData();
  }, []);

  const findNearest = useCallback(() => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Tarayıcınız konum özelliğini desteklemiyor.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
        // Show notification or visual feedback
      },
      (error) => {
        console.error("Konum hatası:", error);
        alert("Konumunuza ulaşılamadı. Lütfen izinleri kontrol edin.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const processedPoints = useMemo(() => {
    let result = points.map(p => {
      if (userLocation && p.lat && p.lng) {
        return { ...p, distance: calculateDistance(userLocation[0], userLocation[1], p.lat, p.lng) };
      }
      return p;
    });

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (userLocation) {
      result.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    return result;
  }, [points, searchTerm, userLocation]);

  return (
    <div className="h-screen flex flex-col bg-orange-50 font-sans text-slate-800">
      {/* Header */}
      <header className="h-20 px-6 flex items-center justify-between bg-white border-b border-orange-100 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-orange-50 rounded-2xl transition-all text-orange-600 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter text-orange-900 block leading-none">İstYemek</span>
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-[0.2em]">Live Solidarity</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Aşevi, lokanta veya ilçe ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={findNearest}
            disabled={isLocating}
            className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4 text-orange-400" />}
            En Yakın Noktayı Bul
          </button>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button onClick={() => setViewMode('map')} className={`p-2 px-4 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-white shadow-md text-orange-500' : 'text-slate-500 hover:text-orange-600'}`}>
              <MapIcon className="w-4 h-4" /> <span className="hidden lg:inline">Harita</span>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 px-4 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-orange-500' : 'text-slate-500 hover:text-orange-600'}`}>
              <List className="w-4 h-4" /> <span className="hidden lg:inline">Liste</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] bg-orange-50/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-white p-12 rounded-[3rem] shadow-3xl border border-orange-100 max-w-md w-full">
                <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-8" />
                <h3 className="text-3xl font-black mb-4 tracking-tighter">İstYemek Verisi Yükleniyor</h3>
                <p className="text-slate-500 text-base mb-10 leading-relaxed font-medium">Şehrin her noktasındaki dayanışma noktaları koordinatlarıyla birlikte sisteme aktarılıyor...</p>
                <div className="w-full bg-orange-50 h-4 rounded-full overflow-hidden mb-4 border border-orange-100 p-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                </div>
                <div className="text-sm font-black text-orange-600 uppercase tracking-[0.3em]">%{progress} BİTTİ</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Info/Stats */}
        <div className="hidden lg:flex w-[420px] bg-white border-r border-orange-100 flex-col overflow-hidden shrink-0 shadow-2xl">
          <div className="p-8 flex-1 overflow-y-auto space-y-10">
            <section>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full uppercase tracking-widest mb-6 border border-orange-100">
                <Heart className="w-3 h-3 fill-orange-500" /> Şehir Raporu
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100/50">
                  <div className="text-4xl font-black text-orange-600 mb-1">{processedPoints.length}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dağıtım Noktası</div>
                </div>
                <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100/50">
                  <div className="text-4xl font-black text-green-600 mb-1">39</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İlçe Kapsamı</div>
                </div>
              </div>
            </section>
            
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" /> Yakındaki Noktalar
              </h4>
              <div className="space-y-4">
                {processedPoints.slice(0, 10).map((p, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={p.id} 
                    className="group cursor-pointer flex items-center space-x-4 p-4 hover:bg-orange-50 rounded-2xl transition-all border border-transparent hover:border-orange-100"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${p.type === 'Aşevi' ? 'bg-orange-100 text-orange-600' : p.type === 'Kent Lokantası' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">{p.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{p.district}</span>
                        {p.distance && <span className="text-[10px] font-bold text-orange-500">{(p.distance).toFixed(1)} km</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* View Section */}
        <div className="flex-1 relative bg-slate-100 p-4 md:p-8 flex flex-col">
          <div className="flex-1 bg-white rounded-[3rem] shadow-inner relative overflow-hidden ring-[12px] ring-white">
            {viewMode === 'map' ? (
              <Map points={processedPoints} />
            ) : (
              <div className="absolute inset-0 overflow-y-auto p-8 lg:p-12 space-y-8 bg-orange-50/20 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {processedPoints.map(p => (
                    <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-opacity group-hover:opacity-[0.08] ${p.type === 'Aşevi' ? 'text-orange-500' : 'text-blue-500'}`}>
                        <Utensils className="w-full h-full p-4" />
                      </div>
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${p.type === 'Aşevi' ? 'bg-orange-50 text-orange-600 border-orange-100' : p.type === 'Kent Lokantası' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          {p.type}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <MapPin className="w-3.5 h-3.5" />
                          {p.district}
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-3 leading-none tracking-tighter">{p.name}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-8 italic max-w-xs">{p.address}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Çalışma Saatleri</div>
                          <div className="text-xs font-bold text-slate-800">{p.hours || 'Belirtilmedi'}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Durum</div>
                          <div className={`text-xs font-extrabold ${p.isFree ? 'text-green-600' : 'text-blue-600'}`}>{p.isFree ? 'ÜCRETSİZ' : 'UYGUN FİYATLI'}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
                          <Navigation className="w-3 h-3 text-orange-400" /> Yol Tarifi
                        </button>
                        <a href={`tel:${p.phone}`} className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-orange-500/10">
                          <Phone className="w-5 h-5" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
