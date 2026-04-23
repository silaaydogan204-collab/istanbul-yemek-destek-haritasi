import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Loader2, Info, Search, List, Map as MapIcon, Utensils } from 'lucide-react';
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

  useEffect(() => {
    async function initData() {
      try {
        const rawPoints = await fetchFoodPoints();
        const cache = getCache();
        const updatedPoints: FoodPoint[] = [];
        const newCache: GeocodeCache = { ...cache };
        
        setPoints(rawPoints); // Set initial points for UI structure
        
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
            // Need to geocode
            const coords = await geocodeAddress(point.address, point.district);
            if (coords) {
              newCache[cacheKey] = coords;
              updatedPoints.push({
                ...point,
                lat: coords.lat,
                lng: coords.lng
              });
              // Save cache incrementally
              setCache(newCache);
            } else {
              updatedPoints.push(point);
            }
            // Sleep to respect rate limits if we just made a network request
            await sleep(1000); 
          }
          
          processedCount++;
          setProgress(Math.round((processedCount / rawPoints.length) * 100));
          
          // Update UI periodically during the slow geocoding process
          if (processedCount % 5 === 0 || processedCount === rawPoints.length) {
            setPoints([...updatedPoints]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Data initialization failed:', error);
        setLoading(false);
      }
    }

    initData();
  }, []);

  const filteredPoints = useMemo(() => {
    return points.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [points, searchTerm]);

  return (
    <div className="h-screen flex flex-col bg-orange-50 font-sans text-slate-800">
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-orange-100 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors text-orange-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-orange-900">İstYemek</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Mekan, ilçe veya adres ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-orange-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 bg-orange-50 p-1 rounded-full border border-orange-100">
          <button 
            onClick={() => setViewMode('map')}
            className={`p-2 px-4 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-orange-500 shadow-md text-white' : 'text-slate-500 hover:text-orange-600'}`}
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden md:inline">Harita</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 px-4 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-orange-500 shadow-md text-white' : 'text-slate-500 hover:text-orange-600'}`}
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Liste</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && progress < 100 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-orange-50/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-orange-100 max-w-sm w-full">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-2 text-slate-900">Noktalar Hazırlanıyor</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  Şehir genelindeki dayanışma noktaları haritaya aktarılıyor...
                </p>
                <div className="w-full bg-orange-50 h-3 rounded-full overflow-hidden mb-2 border border-orange-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                  />
                </div>
                <div className="text-xs font-black text-orange-600 uppercase tracking-widest leading-none">
                  %{progress}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div className="hidden md:flex w-[380px] bg-white border-r border-orange-100 flex-col overflow-hidden shrink-0">
          <div className="p-8 flex-1 overflow-y-auto space-y-8">
            <section>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider mb-4">
                İstatistikler
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                  <div className="text-4xl font-extrabold text-orange-600 leading-none mb-1">{filteredPoints.length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif Dağıtım Noktası</div>
                </div>
              </div>
            </section>
            
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Son Eklenenler</h4>
              <div className="space-y-4">
                {filteredPoints.slice(0, 8).map(p => (
                  <div key={p.id} className="group cursor-pointer flex items-center space-x-3 p-2 hover:bg-orange-50 rounded-xl transition-all border border-transparent hover:border-orange-100">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <MapIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">{p.name}</div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{p.district}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <div className="p-8 border-t border-orange-50">
            <div className="text-[10px] text-slate-300 font-mono tracking-widest">
              SYSTEM STATUS: CALIBRATED
            </div>
          </div>
        </div>

        {/* Main View Area */}
        <div className="flex-1 relative bg-slate-200 p-6 flex flex-col">
          <div className="flex-1 bg-blue-50 rounded-[2.5rem] shadow-inner relative overflow-hidden border-8 border-white">
            {viewMode === 'map' ? (
              <Map points={filteredPoints} />
            ) : (
              <div className="absolute inset-0 overflow-y-auto p-10 bg-white/50 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPoints.map(p => (
                    <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-xl hover:ring-4 hover:ring-orange-500/5 transition-all group lg:p-8"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100">
                          {p.district || 'İstanbul'}
                        </div>
                        <Utensils className="w-5 h-5 text-orange-200 group-hover:text-orange-500 transition-colors" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">{p.name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">{p.address}</p>
                      
                      {p.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İletişim</div>
                          <div className="text-sm font-bold text-slate-800">{p.phone}</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Custom Floating Details Badge */}
            <div className="absolute bottom-10 right-10 z-30 px-6 py-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white flex items-center space-x-4 pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered By</span>
              <div className="flex space-x-3">
                <span className="text-sm font-extrabold text-slate-800">OSM</span>
                <span className="text-sm font-extrabold text-slate-800">Leaflet</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
