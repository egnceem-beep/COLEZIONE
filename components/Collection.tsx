
import React from 'react';
import { CarModel } from '../types';
import CarCard from './CarCard';

interface CollectionProps {
  cars: CarModel[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onCarClick: (car: CarModel) => void;
  onAddManual: () => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  totalCount: number;
  onSelectAll: () => void;
}

const Collection: React.FC<CollectionProps> = ({ 
  cars, 
  selectedIds, 
  onToggleSelection, 
  onCarClick, 
  onAddManual,
  searchTerm, 
  onSearch,
  totalCount,
  onSelectAll
}) => {
  // Verifica se todos os carros visíveis estão selecionados
  const areAllVisibleSelected = cars.length > 0 && cars.every(c => selectedIds.has(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex justify-between items-start sm:block">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Garage</h2>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {searchTerm ? `${cars.length} Risultati` : `${totalCount} Modellini`}
                </p>
                {cars.length > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <button 
                      onClick={onSelectAll}
                      className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline"
                    >
                      {areAllVisibleSelected ? 'Deseleziona Visibili' : 'Seleziona Tutti'}
                    </button>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={onAddManual}
              className="sm:hidden bg-violet-600 text-white p-3 rounded-2xl shadow-lg shadow-violet-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          
          <div className="flex gap-2 flex-grow max-w-2xl">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cerca per modello, marca o anno..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-50 focus:border-violet-300 transition-all placeholder:text-slate-300 shadow-sm"
              />
            </div>
            <button 
              onClick={onAddManual}
              className="hidden sm:flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              <span>Aggiungi</span>
            </button>
          </div>
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-300 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-1">{searchTerm ? 'Nessun Risultato' : 'Collezione Vuota'}</h2>
          <p className="text-slate-500 text-sm font-medium">
            {searchTerm ? 'Prova con termini diversi.' : 'Importa i dati o aggiungi un modello manualmente.'}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
             {searchTerm && (
              <button 
                onClick={() => onSearch('')}
                className="text-violet-600 font-black text-xs uppercase tracking-widest hover:underline"
              >
                Annulla ricerca
              </button>
            )}
            <button 
              onClick={onAddManual}
              className="bg-violet-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-100"
            >
              Aggiungi Modellino
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {cars.map(car => (
            <CarCard 
              key={car.id} 
              car={car} 
              isSelected={selectedIds.has(car.id)}
              onToggleSelection={onToggleSelection}
              onClick={onCarClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
