
import React, { useState } from 'react';
import { CarModel, ITALIAN_LABELS } from '../types';

interface ImportDataProps {
  onImport: (cars: CarModel[]) => void;
  cars: CarModel[];
}

const ImportData: React.FC<ImportDataProps> = ({ onImport, cars }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncCode, setSyncCode] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        // @ts-ignore
        if (typeof XLSX === 'undefined') throw new Error("Libreria XLSX non caricata.");
        
        // @ts-ignore
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // @ts-ignore
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!jsonData || jsonData.length === 0) throw new Error("La tabella è vuota.");

        const importedCars: CarModel[] = jsonData.map((row: any, i: number) => {
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => normalizedRow[key.trim()] = row[key]);

          const id = `import-${Date.now()}-${i}`;
          const car: any = { id };
          
          ITALIAN_LABELS.forEach(label => {
            car[label] = String(normalizedRow[label] || "");
          });
          
          car.imageUrl = `https://picsum.photos/seed/${encodeURIComponent(car.Modello || id)}/400/300`;
          return car as CarModel;
        });

        onImport(importedCars);
        setIsImporting(false);
      } catch (err: any) {
        setError(err.message || "Errore durante l'importazione.");
        setIsImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const generateSyncCode = () => {
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(cars))));
    setSyncCode(code);
    navigator.clipboard.writeText(code);
    alert("Codice di sincronizzazione copiato negli appunti! Incollalo in un altro dispositivo.");
  };

  const importFromCode = () => {
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(syncCode))));
      if (Array.isArray(decoded)) {
        onImport(decoded);
        setSyncCode('');
        alert("Sincronizzazione completata con successo!");
      }
    } catch (e) {
      alert("Codice non valido.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Gestione Dati</h2>

        <div className="space-y-8">
          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carica Excel (.xls, .xlsx)</h3>
             <p className="text-[11px] text-slate-400 italic">Le colonne devono essere: {ITALIAN_LABELS.slice(0, 5).join(', ')}...</p>
            <label className="group relative border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all">
              <svg className="w-10 h-10 text-slate-300 group-hover:text-violet-400 mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="bg-violet-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-100 transition-transform active:scale-95">Scegli File</span>
              <input type="file" className="hidden" accept=".xls,.xlsx" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sincronizzazione tra Dispositivi</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={generateSyncCode}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                Genera Codice per altro dispositivo
              </button>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Incolla codice qui..." 
                  value={syncCode}
                  onChange={(e) => setSyncCode(e.target.value)}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold"
                />
                <button 
                  onClick={importFromCode}
                  className="bg-sky-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase"
                >
                  Sincronizza
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportData;
