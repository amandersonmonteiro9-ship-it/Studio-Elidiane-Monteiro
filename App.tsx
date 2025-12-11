import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import Consultation from './pages/Consultation';

// Componente dedicado para configurar o modo cliente de forma segura
// Isso evita erros de parsing de URL e tela branca
const ClientAccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Define o modo cliente
    localStorage.setItem('userRole', 'client');
    // Redireciona imediatamente para a home, substituindo o histórico para o usuário não "voltar" para essa tela
    navigate('/', { replace: true });
  }, [navigate]);

  // Exibe um feedback visual rápido enquanto redireciona
  return (
    <div className="min-h-screen flex items-center justify-center bg-studio-beige">
      <div className="text-studio-pink animate-pulse font-serif">Acessando Studio Elidiane Monteiro...</div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-studio-beige">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/consultation" element={<Consultation />} />
          
          {/* Rota especial que configura o app para modo cliente */}
          <Route path="/access-client" element={<ClientAccess />} />

          {/* Rota pega-tudo: Se der erro 404 interno, joga para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
};

export default App;