import React, { useState, useEffect } from 'react';
import { WELCOME_MESSAGES, SERVICES } from '../constants';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { getBeautyConsultation } from '../services/geminiService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Random welcome message
    setWelcomeMsg(WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);
  }, []);

  const handleConsultAi = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    const response = await getBeautyConsultation(aiQuery);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const handleBookingStart = () => {
    if (selectedService) {
      // Pass the selected service to the booking page via state or context
      // For simplicity in this structure, we pass via state in navigate
      navigate('/booking', { state: { preSelectedServiceId: selectedService.id } });
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-3xl text-studio-dark mb-1 tracking-wide">
          Studio <span className="text-studio-pinkDark font-semibold">Elidiane Monteiro</span>
        </h1>
        <p className="font-sans text-sm text-studio-gray italic mt-2 px-6">
          "{welcomeMsg}"
        </p>
      </header>

      {/* AI Assistant Section */}
      <div className="bg-gradient-to-r from-studio-pink/10 to-white p-4 rounded-2xl mb-8 border border-studio-pink/20 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-studio-gold" size={18} />
          <h2 className="font-serif text-lg text-studio-dark">Consultora Virtual</h2>
        </div>
        <div className="space-y-3">
          {!aiResponse ? (
            <>
              <p className="text-xs text-studio-gray font-sans">
                Não sabe o que fazer? Descreva como quer se sentir e nossa IA sugere o ideal!
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ex: Quero mudar radicalmente..."
                  className="flex-1 text-sm p-2 rounded-lg border border-studio-pink/30 focus:outline-none focus:border-studio-pink bg-white"
                />
                <button 
                  onClick={handleConsultAi}
                  disabled={isAiLoading}
                  className="bg-studio-pink text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isAiLoading ? '...' : 'Enviar'}
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <p className="text-sm text-studio-dark italic bg-white p-3 rounded-lg border border-studio-pink/10">
                "{aiResponse}"
              </p>
              <button 
                onClick={() => { setAiResponse(''); setAiQuery(''); }}
                className="text-xs text-studio-pinkDark underline mt-2"
              >
                Nova consulta
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="font-serif text-xl mb-4 text-studio-dark pl-1 border-l-4 border-studio-pink">Nossos Serviços</h2>
      
      <div className="space-y-2">
        {SERVICES.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            isSelected={selectedService?.id === service.id}
            onSelect={setSelectedService}
          />
        ))}
      </div>

      {selectedService && (
        <div className="fixed bottom-20 left-0 w-full px-4 z-40 flex justify-center">
          <div className="max-w-md w-full">
            <button
              onClick={handleBookingStart}
              className="w-full bg-studio-dark text-white font-sans py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <span>Agendar {selectedService.name}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;