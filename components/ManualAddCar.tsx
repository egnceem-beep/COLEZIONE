
import React, { useState } from 'react';
import { CarModel, ITALIAN_LABELS } from '../types';

interface ManualAddCarProps {
  onSave: (car: CarModel) => void;
  onClose: () => void;
}

const ManualAddCar: React.FC<ManualAddCarProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<CarModel>>({
    Modello: '',
    "Marca della macchina": '',
    Anno: '',
    Scala: '1/43',
  });

  const handleChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Modello) {
      alert("Il nome del modello è obbligatorio.");
      return;
    }

    const id = `manual-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newCar: CarModel = {
      id,
      imageUrl: `https://picsum.photos/seed/${id}/400/300`,
      // Fill all standard labels with either form data or empty string
      ...ITALIAN_LABELS.reduce((acc, label) => ({
        ...acc,
        [label]: formData[label as keyof CarModel] || ''
      }), {} as any)
    };

    onSave(newCar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nuovo Modellino</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inserimento Manuale</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ITALIAN_LABELS.map((label) => (
              <div key={label} className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  {label} {label === 'Modello' && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="text"
                  value={(formData as any)[label] || ''}
                  onChange={(e) => handleChange(label, e.target.value)}
                  placeholder={`Inserisci ${label.toLowerCase()}...`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-300 transition-all placeholder:text-slate-300"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-[2] bg-violet-600 hover:bg-violet-700 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-100 transition-all"
            >
              Salva Modellino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualAddCar;
