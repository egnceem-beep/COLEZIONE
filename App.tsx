
import React, { useState, useEffect, useCallback } from 'react';
import { CarModel, ViewType } from './types';
import Collection from './components/Collection';
import ImportData from './components/ImportData';
import CarDetail from './components/CarDetail';
import Reports from './components/Reports';
import ManualAddCar from './components/ManualAddCar';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('collection');
  const [activeCar, setActiveCar] = useState<CarModel | null>(null);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarIds, setSelectedCarIds] = useState<Set<string>>(new Set());

  // Inicialização robusta do estado a partir do LocalStorage
  const [collection, setCollection] = useState<CarModel[]>(() => {
    const saved = localStorage.getItem('miniature_collection');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Errore nel caricamento dei dati locali");
      return [];
    }
  });

  // Salva automaticamente no LocalStorage sempre que a coleção mudar
  useEffect(() => {
    setIsSyncing(true);
    localStorage.setItem('miniature_collection', JSON.stringify(collection));
    const timer = setTimeout(() => setIsSyncing(false), 800);
    return () => clearTimeout(timer);
  }, [collection]);

  const handleImport = (newCars: CarModel[]) => {
    setCollection(prev => [...newCars, ...prev]);
    setActiveView('collection');
  };

  const handleAddManualCar = (newCar: CarModel) => {
    setCollection(prev => [newCar, ...prev]);
    setIsAddingManual(false);
  };

  const toggleCarSelection = useCallback((id: string) => {
    setSelectedCarIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredCollection = collection.filter(car => {
    const term = searchTerm.toLowerCase();
    return (
      car.Modello.toLowerCase().includes(term) ||
      car["Marca della macchina"].toLowerCase().includes(term) ||
      car.Anno.toLowerCase().includes(term)
    );
  });

  const selectAllVisible = () => {
    const allVisibleIds = filteredCollection.map(c => c.id);
    const areAllVisibleSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedCarIds.has(id));

    setSelectedCarIds(prev => {
      const next = new Set(prev);
      if (areAllVisibleSelected) {
        allVisibleIds.forEach(id => next.delete(id));
      } else {
        allVisibleIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const deleteSelected = () => {
    if (selectedCarIds.size === 0) return;
    if (window.confirm(`Eliminare definitivamente ${selectedCarIds.size} modellini?`)) {
      setCollection(prev => prev.filter(car => !selectedCarIds.has(car.id)));
      setSelectedCarIds(new Set());
    }
  };

  const deleteIndividual = (id: string) => {
    if (window.confirm("Eliminare questo modellino dalla collezione?")) {
      setCollection(prev => prev.filter(car => car.id !== id));
      setSelectedCarIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setActiveCar(null);
    }
  };

  const updateCarPhoto = (id: string, url: string) => {
    setCollection(prev => prev.map(c => c.id === id ? { ...c, imageUrl: url } : c));
    if (activeCar?.id === id) {
      setActiveCar(prev => prev ? { ...prev, imageUrl: url } : null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-violet-100 cursor-pointer" onClick={() => setActiveView('collection')}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1h-4z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-none">
                Garage<span className="text-sky-500">Cloud</span>
              </h1>
              <div className="flex items-center mt-1">
                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  {isSyncing ? 'Sincronizzando...' : 'Dati Salvati'}
                </span>
              </div>
            </div>
          </div>
          
          <nav className="hidden sm:flex space-x-2">
            <button onClick={() => setActiveView('collection')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] ${activeView === 'collection' ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}>Collezione</button>
            <button onClick={() => setActiveView('import')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] ${activeView === 'import' ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}>Dati & Sinc</button>
            <button onClick={() => setActiveView('reports')} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] ${activeView === 'reports' ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}>Stat</button>
          </nav>
        </div>
      </header>

      {selectedCarIds.size > 0 && activeView === 'collection' && (
        <div className="bg-rose-600 text-white sticky top-[65px] z-30 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="font-black text-[11px] uppercase tracking-widest">{selectedCarIds.size} Selezionati</span>
              <button onClick={() => setSelectedCarIds(new Set())} className="text-[9px] font-black uppercase hover:underline">Annulla</button>
            </div>
            <button onClick={deleteSelected} className="bg-white text-rose-600 px-5 py-2 rounded-xl font-black text-[10px] uppercase shadow-md active:scale-95 transition-transform">
              Rimuovi Selezione
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow pb-24">
        {activeView === 'collection' && (
          <Collection 
            cars={filteredCollection} 
            selectedIds={selectedCarIds}
            onToggleSelection={toggleCarSelection}
            onCarClick={setActiveCar}
            onAddManual={() => setIsAddingManual(true)}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            totalCount={collection.length}
            onSelectAll={selectAllVisible}
          />
        )}
        {activeView === 'import' && <ImportData onImport={handleImport} cars={collection} />}
        {activeView === 'reports' && <Reports cars={collection} onCarClick={setActiveCar} />}
      </main>

      {activeCar && (
        <CarDetail 
          car={activeCar} 
          onClose={() => setActiveCar(null)} 
          onUpdatePhoto={updateCarPhoto}
          onDelete={deleteIndividual}
        />
      )}

      {isAddingManual && (
        <ManualAddCar 
          onSave={handleAddManualCar}
          onClose={() => setIsAddingManual(false)}
        />
      )}

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-between items-center z-40">
        <button onClick={() => setActiveView('collection')} className={`flex flex-col items-center space-y-1 ${activeView === 'collection' ? 'text-violet-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <span className="text-[9px] font-black uppercase tracking-tight">Auto</span>
        </button>
        <button onClick={() => setActiveView('import')} className={`flex flex-col items-center space-y-1 ${activeView === 'import' ? 'text-violet-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          <span className="text-[9px] font-black uppercase tracking-tight">Dati</span>
        </button>
        <button onClick={() => setActiveView('reports')} className={`flex flex-col items-center space-y-1 ${activeView === 'reports' ? 'text-violet-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="text-[9px] font-black uppercase tracking-tight">Stat</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
