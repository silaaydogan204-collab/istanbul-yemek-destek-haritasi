import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Utensils, Database, Mail, ExternalLink, ShieldCheck, Heart, Map as MapIcon } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("İstanbul Dayanışma Haritası Geri Bildirim");
    const body = encodeURIComponent("Merhaba, proje hakkında geri bildirim paylaşmak istiyorum.");
    window.location.href = `mailto:silanuraydogan23@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-orange-50 text-slate-800 font-sans selection:bg-orange-200">
      {/* Navigation */}
      <nav className="sticky top-4 z-50 px-6 max-w-7xl mx-auto h-16 flex items-center justify-between bg-white/80 backdrop-blur-md border border-orange-100 rounded-2xl shadow-lg mt-4">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-orange-900">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <span className="hidden sm:inline">İstYemek</span>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-8 text-xs sm:text-sm font-bold text-slate-600">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-3 py-2 hover:text-orange-500 transition-colors cursor-pointer">Anasayfa</button>
          <button onClick={onStart} className="px-3 py-2 text-orange-600 hover:text-orange-700 transition-colors cursor-pointer">Harita</button>
          <button onClick={() => document.getElementById('data-sources')?.scrollIntoView({ behavior: 'smooth' })} className="px-3 py-2 hover:text-orange-500 transition-colors cursor-pointer">Veri Seviyesi</button>
          <button onClick={handleContact} className="hidden md:flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full hover:bg-orange-600 shadow-md transition-all active:scale-95 cursor-pointer border-none">
            <Mail className="w-4 h-4" />
            Bize Ulaş
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-[0.2em] mb-8 border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Güncel Veri Seti
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-10">
            Şehirde <br/>
            <span className="text-orange-500 italic">Dayanışma</span> <br/>
            Haritası.
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-lg leading-relaxed">
            İstanbul'un 39 ilçesindeki aşevleri, kent lokantaları ve ücretsiz yemek dağıtım noktaları artık tek bir platformda. Erişilebilir, şeffaf ve güncel koordinatlarla.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStart}
              className="group flex items-center justify-center gap-3 bg-orange-500 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-orange-500/30 hover:bg-orange-600 transition-all hover:-translate-y-1 cursor-pointer"
            >
              Haritaya Git
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleContact}
              className="flex items-center justify-center gap-3 bg-white border-2 border-orange-100 text-slate-700 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-orange-50 transition-all cursor-pointer"
            >
              Geri Bildirim Paylaş
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="w-full aspect-square rounded-[4rem] bg-gradient-to-br from-orange-400 to-orange-700 shadow-3xl shadow-orange-500/20 flex items-center justify-center relative overflow-hidden group">
            {/* Visual element representing a map/solidarity */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute w-[150%] h-[150%] border-[20px] border-white/5 rounded-full"
            />
            
            <div className="z-10 flex flex-col items-center text-center px-12">
              <div className="w-32 h-32 bg-white rounded-4xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                <MapIcon className="w-16 h-16 text-orange-500" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">Dayanışma Güç Verir</h3>
              <p className="text-orange-100 font-medium">İstanbul genelinde her gün <br/> 300.000+ porsiyon yemek paylaşılıyor.</p>
            </div>

            {/* Floating stats */}
            <div className="absolute top-12 right-12 bg-white p-6 rounded-3xl shadow-2xl border border-orange-50 animate-bounce-slow">
              <div className="text-4xl font-black text-orange-500">39</div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">İlçe Kapsamı</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Data Sources Section */}
      <section id="data-sources" className="bg-white py-24 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Veri Kaynaklarımız</h2>
              <p className="text-slate-500 text-lg max-w-xl">Platformuzun doğruluk payını artırmak için farklı resmi ve yerel kaynaklardan yararlanıyoruz.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-orange-400 tracking-[0.3em]">
              <Database className="w-5 h-5" />
              Verified Sources
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Google Sheets Veri Seti', desc: 'Güncel dağıtım noktalarının dinamik listesi', link: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYYjcr9xi5IxIdmY94SgYg8XF65jhk9KrUJp9lGX6hmCfSKo_RBqiTy599yysuezLY31sExGeY2lj_/pub?output=csv' },
              { title: 'İstanbul B. Belediyesi', desc: 'Resmi Aşevleri ve Kent Lokantaları verisi', link: 'https://www.ibb.istanbul' },
              { title: 'Açık Veri Kaynakları', desc: 'Şehir rehberleri ve topluluk paylaşımları', link: 'https://data.ibb.gov.tr/' },
              { title: 'Saha Araştırması', desc: 'Gönüllüler tarafından yerinde teyit edilen bilgiler', link: '#' }
            ].map((source, i) => (
              <motion.a
                key={i}
                href={source.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2rem] border border-orange-50 bg-orange-50/30 hover:bg-white hover:shadow-2xl hover:border-orange-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{source.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{source.desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-widest">
                  Kaynağı Gör <ExternalLink className="w-3 h-3" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center gap-3 font-black text-3xl tracking-tighter mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <span>İstYemek</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Bu proje, İstanbul’daki aşevleri ve yemek dağıtım noktalarına erişimi kolaylaştırmak amacıyla geliştirilmiştir. Toplumsal dayanışma için açık veri gücüne güveniyoruz.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 md:justify-end">
              <button 
                onClick={handleContact}
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/5 cursor-pointer"
              >
                <Mail className="w-5 h-5 text-orange-500" />
                Bize Ulaşın
              </button>
              <button onClick={onStart} className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-orange-500/20">
                <MapIcon className="w-5 h-5" />
                Haritayı Aç
              </button>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-slate-500 font-medium tracking-tight">
            <p>&copy; 2024 İstanbul Yemek Dayanışma Projesi. Tüm hakları saklıdır.</p>
            <div className="flex gap-10">
              <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSYYjcr9xi5IxIdmY94SgYg8XF65jhk9KrUJp9lGX6hmCfSKo_RBqiTy599yysuezLY31sExGeY2lj_/pub?output=csv" target="_blank" className="hover:text-white transition-colors">Açık Veri</a>
              <a href="https://www.ibb.istanbul" target="_blank" className="hover:text-white transition-colors">İBB Destek</a>
              <a href="https://www.openstreetmap.org" target="_blank" className="hover:text-white transition-colors">OSM contributors</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
