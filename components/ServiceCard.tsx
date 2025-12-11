import React from 'react';
import { Service } from '../types';
import { Check } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(service)}
      className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer mb-3
        ${isSelected 
          ? 'bg-white border-studio-pink shadow-md transform scale-[1.02]' 
          : 'bg-white/60 border-transparent hover:border-studio-pink/30 hover:bg-white'
        }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className={`font-serif text-lg ${isSelected ? 'text-studio-dark font-semibold' : 'text-studio-dark'}`}>
            {service.name}
          </h3>
          {service.description && (
            <p className="text-xs text-studio-gray mt-1 font-sans">{service.description}</p>
          )}
          <div className="mt-2 text-studio-gold font-bold font-sans">
            R$ {service.price.toFixed(2).replace('.', ',')}
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors
          ${isSelected ? 'bg-studio-pink border-studio-pink' : 'border-studio-gray/40'}`}>
          {isSelected && <Check size={14} className="text-white" />}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;