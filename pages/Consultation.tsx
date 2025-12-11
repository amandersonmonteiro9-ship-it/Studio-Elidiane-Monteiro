import React from 'react';
import { Camera, Send } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const Consultation: React.FC = () => {
  const handleStartConsultation = () => {
    const msg = `Olá Studio Elidiane! 🌸%0A%0AGostaria de uma avaliação online.%0AEstou enviando a foto do meu cabelo agora...`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen">
      <h1 className="font-serif text-2xl text-studio-dark mb-6">Avaliação Online</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-md border border-studio-pink/20 text-center">
        <div className="w-20 h-20 bg-studio-beige rounded-full mx-auto flex items-center justify-center mb-4">
          <Camera size={40} className="text-studio-pinkDark" strokeWidth={1.5} />
        </div>
        
        <h2 className="font-serif text-xl mb-2 text-studio-dark">Envie sua Foto</h2>
        <p className="text-sm text-studio-gray font-sans mb-6 leading-relaxed">
          Quer saber qual o melhor tratamento para você? <br/>
          Envie uma foto do seu cabelo atual e nossa especialista fará uma análise personalizada pelo WhatsApp.
        </p>

        <ul className="text-left text-xs text-studio-gray space-y-2 mb-8 bg-studio-beige/30 p-4 rounded-lg">
          <li className="flex items-center gap-2">✨ Foto em local bem iluminado</li>
          <li className="flex items-center gap-2">✨ Cabelo solto e natural</li>
          <li className="flex items-center gap-2">✨ Mostre a raiz e as pontas</li>
        </ul>

        <button 
          onClick={handleStartConsultation}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Send size={18} />
          <span className="font-bold">Enviar Foto no WhatsApp</span>
        </button>
        
        <p className="text-[10px] text-gray-400 mt-4">
          Ao clicar, você será redirecionada para o WhatsApp do Studio. Basta anexar a foto na conversa.
        </p>
      </div>
    </div>
  );
};

export default Consultation;