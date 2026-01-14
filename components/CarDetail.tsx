
import React, { useState } from 'react';
import { CarModel, ITALIAN_LABELS } from '../types';
import { searchCarImage } from '../services/geminiService';

interface CarDetailProps {
  car: CarModel;
  onClose: () => void;
  onUpdatePhoto: (id: string, newUrl: string) => void;
  onDelete: (id: string) => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, onClose, onUpdatePhoto, onDelete }) => {
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  const handleGoogleSearch = () => {
    const query = `${car.Modello} ${car["Marca della macchina"]} original car ${car.Anno}`;
    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, '_blank');
  };

  const handleAISearch = async () => {
    setIsSearchingAI(true);
    try {
      const resultUrl = await searchCarImage(
        car.Modello, 
        car.Colore || "", 
        car["Marca della macchina"] || ""
      );
      if (resultUrl) {
        onUpdatePhoto(car.id, resultUrl);
      }
    } catch (error) {
      alert("Errore nella ricerca AI. Riprova più tardi.");
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onUpdatePhoto(car.id, evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Action Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <button 
            onClick={onClose} 
            className="flex items-center text-slate-500 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            Chiudi
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scheda Tecnica</span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onDelete(car.id);
            }}
            className="bg-rose-50 text-rose-500 p-2.5 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
            title="Elimina questo modellino"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[85vh]">
          {/* Hero Image Section */}
          <div className="relative aspect-video bg-slate-200 overflow-hidden shadow-inner">
            <img 
              src={car.imageUrl || `https://picsum.photos/seed/${car.id}/800/400`} 
              alt={car.Modello} 
              className="w-full h-full object-cover"
            />
            {isSearchingAI && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="font-black text-xs uppercase tracking-widest">IA sta cercando l'auto reale...</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <h1 className="text-2xl font-black text-white leading-tight mb-1">{car.Modello}</h1>
              <div className="flex items-center space-x-2">
                <span className="bg-sky-500 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{car.Anno}</span>
                <span className="text-sky-300 font-bold text-[10px] uppercase tracking-widest">{car["Marca della macchina"]}</span>
              </div>
            </div>
          </div>

          {/* Improved Action Buttons Group */}
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleAISearch}
                disabled={isSearchingAI}
                className="flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>Ricerca Auto AI</span>
              </button>
              <label className="flex items-center justify-center space-x-2 bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition-all active:scale-95">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span>Carica Foto</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
            
            <button 
              onClick={handleGoogleSearch}
              className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-400 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.02 1.024-2.304 1.896-5.184 1.896-4.576 0-8.256-3.712-8.256-8.272s3.68-8.272 8.256-8.272c2.48 0 4.272.984 5.616 2.264l2.312-2.312C19.168 1.888 16.4 0 12.48 0 5.632 0 0 5.632 0 12.48S5.632 24.96 12.48 24.96c3.6 0 6.64-1.184 8.848-3.512 2.272-2.328 3.08-5.584 3.08-8.168 0-.816-.072-1.584-.192-2.328h-11.736z"/></svg>
              <span>Altre Immagini su Google</span>
            </button>
          </div>

          {/* Data Grid */}
          <div className="px-6 pb-12">
            <div className="grid grid-cols-2 gap-3">
              {ITALIAN_LABELS.map((label) => (
                <div key={label} className={`bg-slate-50 p-4 rounded-2xl border border-slate-100 ${label === 'Osservazione' ? 'col-span-2' : ''}`}>
                  <label className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-300 block mb-1">{label}</label>
                  <p className={`font-bold text-slate-700 leading-tight ${label === 'Osservazione' ? 'text-[12px] italic' : 'text-[11px] truncate'}`}>
                    {car[label] || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
