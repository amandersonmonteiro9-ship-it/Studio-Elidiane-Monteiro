import React, { useEffect, useState } from 'react';
import { Calendar, Home, UserCog, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Estados para o login com senha
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verifica o papel do usuário a cada mudança de rota
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setIsClient(role !== 'admin');
  }, [location]);

  const handleOpenLogin = () => {
    setPassword('');
    setError('');
    setShowLoginModal(true);
  };

  const handleLoginSubmit = () => {
    if (password === '12deJunho@') {
      localStorage.setItem('userRole', 'admin');
      setIsClient(false);
      setShowLoginModal(false);
      navigate('/admin');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setPassword('');
    setError('');
  };

  const isActive = (path: string) => location.pathname === path ? 'text-studio-dark scale-110' : 'text-studio-gray hover:text-studio-pink';

  return (
    <>
      {/* Modal de Login com Senha */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-xs w-full border border-studio-pink/20">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-studio-beige rounded-full flex items-center justify-center">
                <Lock size={24} className="text-studio-dark" />
              </div>
            </div>
            
            <h3 className="font-serif text-lg font-bold text-studio-dark mb-1 text-center">Área Restrita</h3>
            <p className="text-xs text-studio-gray mb-4 text-center">
              Acesso exclusivo para administração.
            </p>

            <div className="mb-4 relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full p-3 pr-10 rounded-lg border border-gray-200 text-sm focus:border-studio-pink outline-none transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit()}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center mb-4 font-bold">{error}</p>
            )}

            <div className="flex gap-3">
              <button 
                onClick={handleCloseModal}
                className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLoginSubmit}
                className="flex-1 py-3 bg-studio-dark text-white rounded-lg font-bold text-sm hover:bg-black transition-colors"
              >
                Entrar
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
          
          {/* Mostra Agenda apenas se for ADMIN */}
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
              onClick={handleOpenLogin}
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