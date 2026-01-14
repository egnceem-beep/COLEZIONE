
import React, { useState } from 'react';
import { CarModel } from '../types';

interface ReportsProps {
  cars: CarModel[];
  onCarClick: (car: CarModel) => void;
}

type ReportCategory = 
  | "Anno" 
  | "Marca della macchina" 
  | "Modello" 
  | "Colore" 
  | "Tipo" 
  | "Piloti" 
  | "Marca dello modellino" 
  | "Colezione" 
  | "Stato";

const CATEGORIES: ReportCategory[] = [
  "Anno",
  "Marca della macchina",
  "Modello",
  "Colore",
  "Tipo",
  "Piloti",
  "Marca dello modellino",
  "Colezione",
  "Stato"
];

const Reports: React.FC<ReportsProps> = ({ cars, onCarClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const total = cars.length;

  const getGroupedData = (category: ReportCategory) => {
    const groups: Record<string, CarModel[]> = {};
    cars.forEach(car => {
      const value = String(car[category] || 'Non specificato').trim();
      if (!groups[value]) groups[value] = [];
      groups[value].push(car);
    });

    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  };

  if (selectedCategory) {
    const groupedData = getGroupedData(selectedCategory);

    return (
      <div className="max-w-2xl mx-auto p-4 pb-24 animate-in fade-in duration-300">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => { setSelectedCategory(null); setExpandedGroup(null); }}
            className="flex items-center text-violet-600 font-black text-[10px] uppercase tracking-widest"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            Menu Statistiche
          </button>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{selectedCategory}</h2>
        </div>

        <div className="space-y-3">
          {groupedData.map(([value, items]) => (
            <div key={value} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button 
                onClick={() => setExpandedGroup(expandedGroup === value ? null : value)}
                className="w-full px-5 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center font-black text-xs">
                    {items.length}
                  </span>
                  <span className="font-bold text-slate-700 text-xs text-left">{value}</span>
                </div>
                <svg className={`w-4 h-4 text-slate-300 transition-transform ${expandedGroup === value ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {expandedGroup === value && (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => onCarClick(item)}
                      className="bg-white p-3 rounded-xl border border-slate-200/50 flex items-center space-x-3 cursor-pointer hover:border-sky-300 hover:shadow-sm transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-95 transition-transform">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0 text-left">
                        <p className="font-black text-[11px] text-slate-800 truncate group-hover:text-violet-600 transition-colors">{item.Modello}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item["Marca della macchina"]}</p>
                      </div>
                      <div className="text-[9px] font-black text-sky-500 bg-sky-50 px-2 py-1 rounded-md">
                        {item.Scala}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Statistiche</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analisi della Garage Cloud</p>
      </div>
      
      {/* Hero Stat Card */}
      <div className="bg-gradient-to-br from-violet-600 to-sky-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-violet-200 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-violet-100 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 opacity-80">Totale Modellini</p>
          <p className="text-7xl font-black tracking-tighter">{total}</p>
          <div className="flex items-center mt-6 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-2xl border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Sincronizzato Cloud</span>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-violet-200 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rapporto per</p>
                <p className="text-sm font-black text-slate-800 tracking-tight">{cat}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reports;
