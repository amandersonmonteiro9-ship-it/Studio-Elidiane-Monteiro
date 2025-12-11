import React, { useEffect, useState } from 'react';
import { Calendar, Home, UserCog, Camera, Lock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(true); // Padrão agora é TRUE (Cliente) por segurança
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Verifica o papel do usuário a cada mudança de rota
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    // Se NÃO for explicitamente 'admin', tratamos como cliente (segurança por padrão)
    setIsClient(role !== 'admin');
  }, [location]);

  const handleAdminLogin = () => {
    setShowLoginModal(true);
  };

  const confirmLogin = () => {
    // Define explicitamente como admin
    localStorage.setItem('userRole', 'admin');
    setShowLoginModal(false);
    // Vai para o painel admin
    navigate('/admin');
  };

  const isActive = (path: string) => location.pathname === path ? 'text-studio-dark scale-110' : 'text-studio-gray hover:text-studio-pink';

  return (
    <>
      {/* Modal de Confirmação de Acesso Admin */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-xs w-full animate-fade-in border border-studio-pink/20">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-studio-beige rounded-full flex items-center justify-center">
                <Lock size={24} className="text-studio-dark" />
              </div>
            </div>
            <h3 className="font-serif text-lg font-bold text-studio-dark mb-2 text-center">Acesso Administrativo</h3>
            <p className="text-sm text-studio-gray mb-6 text-center">
              Deseja acessar o painel de gerenciamento do Studio?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmLogin}
                className="flex-1 py-3 bg-studio-dark text-white rounded-lg font-bold text-sm hover:bg-black transition-colors"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-studio-pink/20 shadow-lg z-50 h-16 pb-safe">
        <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
          <Link to="/" className={`flex flex-col items-center transition-all duration-300 ${isActive('/')}`}>
            <Home size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-sans mt-1">Início</span>
          </Link>
          
          {/* Mostra Agenda (Calendar) apenas se for ADMIN (isClient false) */}
          {!isClient && (
            <Link to="/booking" className={`flex flex-col items-center transition-all duration-300 ${isActive('/booking')}`}>
              <Calendar size={24} strokeWidth={1.5} />
              <span className="text-[10px] font-sans mt-1">Agenda</span>
            </Link>
          )}

          <Link to="/consultation" className={`flex flex-col items-center transition-all duration-300 ${isActive('/consultation')}`}>
            <Camera size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-sans mt-1">Avaliar</span>
          </Link>

          {/* Se Admin: Mostra botão Admin. Se Cliente: Mostra Login */}
          {!isClient ? (
            <Link to="/admin" className={`flex flex-col items-center transition-all duration-300 ${isActive('/admin')}`}>
              <UserCog size={24} strokeWidth={1.5} />
              <span className="text-[10px] font-sans mt-1">Admin</span>
            </Link>
          ) : (
            <button 
              onClick={handleAdminLogin}
              className="flex flex-col items-center transition-all duration-300 text-studio-gray hover:text-studio-dark"
            >
              <Lock size={24} strokeWidth={1.5} />
              <span className="text-[10px] font-sans mt-1">Login</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;