
import React from 'react';
import { CarModel } from '../types';

interface CarCardProps {
  car: CarModel;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onClick: (car: CarModel) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isSelected, onToggleSelection, onClick }) => {
  return (
    <div 
      className={`group relative bg-white rounded-[2rem] shadow-sm border-2 transition-all duration-300 overflow-hidden cursor-pointer ${isSelected ? 'border-violet-600 ring-4 ring-violet-50' : 'border-white hover:border-sky-100 hover:shadow-lg hover:shadow-sky-50'}`}
      onClick={() => onClick(car)}
    >
      <div 
        className="absolute top-2 left-2 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection(car.id);
          }}
          className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 scale-105' : 'bg-white/70 backdrop-blur-md border-white/50'}`}
        >
          {isSelected && (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
        <img 
          src={car.imageUrl || `https://picsum.photos/seed/${car.id}/400/300`} 
          alt={car.Modello} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
        />
        <div className="absolute bottom-3 right-3 bg-violet-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
          {car.Scala}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-black text-slate-800 text-[14px] truncate leading-tight mb-1">{car.Modello}</h3>
        <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">{car["Marca della macchina"]}</p>
      </div>
    </div>
  );
};

export default CarCard;
