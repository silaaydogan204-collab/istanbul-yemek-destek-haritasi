import { motion } from 'motion/react';
import { ChevronRight, Utensils } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-orange-50 text-slate-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto h-16 bg-white/80 backdrop-blur-md border-b border-orange-100 mt-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 font-sans text-2xl font-bold tracking-tight text-orange-900">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span>İstYemek</span>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium text-slate-600">
          <button onClick={onStart} className="text-orange-600 hover:text-orange-700 transition-colors cursor-pointer">Harita</button>
          <button className="hover:text-orange-500 transition-colors cursor-pointer">Hakkımızda</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 shadow-sm transition-all cursor-pointer">Gönüllü Ol</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
            Güncel Veri: 2024
          </div>
          
          <h1 className="font-sans text-6xl md:text-7xl leading-tight mb-8 font-extrabold text-slate-900">
            İstanbul <br/>
            <span className="text-orange-500 font-black italic">Dayanışma</span> Haritası
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
            Şehrin 39 ilçesinde faaliyet gösteren aşevleri ve yemek dağıtım noktalarına tek bir noktadan ulaşın.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group flex items-center gap-3 bg-orange-500 text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all cursor-pointer"
          >
            Haritayı Keşfet
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <div className="flex items-center space-x-4 p-4 bg-orange-100/50 rounded-2xl border border-orange-200/50">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-orange-600">42</div>
              <div>
                <p className="font-bold text-slate-800">Aktif Aşevi</p>
                <p className="text-slate-500 italic text-xs">Belediye & Vakıf Destekli</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-green-600">18</div>
              <div>
                <p className="font-bold text-slate-800">Mobil Mutfak</p>
                <p className="text-slate-500 italic text-xs">Dinamik Rota Takibi</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 w-full aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl shadow-orange-900/10 border-8 border-white p-4 bg-slate-100 flex items-center justify-center">
            <img 
              src="/hero-image.svg" 
              alt="İstanbul Dayanışma Haritası" 
              className="w-full h-full object-cover rounded-[2.5rem]"
              onError={(e) => {
                // Final fallback if even the local SVG fails (highly unlikely)
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-orange-400', 'to-orange-600');
              }}
            />
          </div>
          
          <div className="absolute -bottom-8 -left-8 z-30 p-8 bg-white rounded-3xl shadow-xl border border-orange-50">
            <div className="text-[10px] text-slate-400 font-mono tracking-tighter">
              NOMINATIM CACHE: ACTIVE (154 ADDR)
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto px-8 pb-12 opacity-40 text-xs flex justify-between items-center">
        <p>&copy; 2024 İstanbul Yemek Dayanışma Projesi.</p>
        <div className="flex space-x-4">
          <span>Açık Veri</span>
          <span>OpenStreetMap</span>
        </div>
      </footer>
    </div>
  );
}
