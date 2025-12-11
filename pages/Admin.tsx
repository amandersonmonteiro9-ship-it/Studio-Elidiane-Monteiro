import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlockedDate } from '../types';
import { Lock, Unlock, Trash2, Share2, Check, Copy, Eye, AlertTriangle, Rocket, Shield, Smartphone, Globe, Cloud, X } from 'lucide-react';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [dateToBlock, setDateToBlock] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [clientLink, setClientLink] = useState('');
  const [adminLink, setAdminLink] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [showTestConfirm, setShowTestConfirm] = useState(false);

  useEffect(() => {
    // Carregar dados
    const stored = localStorage.getItem('blockedDates');
    if (stored) setBlockedDates(JSON.parse(stored));

    // Verificar se já está publicado (baseado na URL)
    const hostname = window.location.hostname;
    const isLive = !hostname.includes('bolt.new') && !hostname.includes('stackblitz') && !hostname.includes('localhost');
    setIsPublished(isLive);

    // Gerar links
    try {
      const currentUrl = new URL(window.location.href);
      const origin = currentUrl.origin; 
      let pathname = currentUrl.pathname.replace('/index.html', '');
      if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
      const baseUrl = `${origin}${pathname}`;
      
      setClientLink(`${baseUrl}/#/access-client`);
      setAdminLink(`${baseUrl}/#/admin`);
    } catch (e) {
      setClientLink(`${window.location.origin}/#/access-client`);
      setAdminLink(`${window.location.origin}/#/admin`);
    }
  }, []);

  const saveBlockedDates = (newDates: BlockedDate[]) => {
    setBlockedDates(newDates);
    localStorage.setItem('blockedDates', JSON.stringify(newDates));
  };

  const handleBlock = () => {
    if (!dateToBlock) return;
    if (blockedDates.some(b => b.date === dateToBlock)) {
      alert('Esta data já está bloqueada.');
      return;
    }
    const newDates = [...blockedDates, { date: dateToBlock, reason: 'Admin blocked' }];
    saveBlockedDates(newDates);
    setDateToBlock('');
  };

  const handleUnblock = (date: string) => {
    const newDates = blockedDates.filter(b => b.date !== date);
    saveBlockedDates(newDates);
  };

  const copyToClipboard = (text: string, isAdmin: boolean) => {
    if (!isAdmin && !isPublished) {
      setShowDeployGuide(true); // Abre o guia se tentar copiar link de rascunho
      return;
    }
    // Lógica de cópia...
    const setCopiedState = isAdmin ? setCopiedAdmin : setCopied;
    const copyText = () => {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(copyText).catch(() => fallbackCopy(isAdmin));
    } else {
      fallbackCopy(isAdmin);
    }
  };

  const fallbackCopy = (isAdmin: boolean) => {
    const id = isAdmin ? 'admin-link-input' : 'client-link-input';
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.select();
      document.execCommand('copy');
    }
  };

  const shareViaWhatsApp = () => {
    if (!isPublished) {
      setShowDeployGuide(true);
      return;
    }
    const text = `Olá! Agende seu horário no Studio Elidiane Monteiro pelo nosso site: ${clientLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const confirmClientMode = () => {
    localStorage.setItem('userRole', 'client');
    navigate('/', { replace: true });
  };

  return (
    <div className="pb-24 pt-0 min-h-screen bg-studio-beige relative">
      
      {/* CABEÇALHO NOVO DO ADMIN */}
      <div className="bg-studio-dark text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <h1 className="font-serif text-2xl mb-1">Painel Gerencial</h1>
        <p className="text-xs text-gray-400 mb-4">Studio Elidiane Monteiro</p>
        
        {/* STATUS DO SITE */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isPublished ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <div>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Status do Site</p>
              <p className={`font-bold ${isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                {isPublished ? 'Online (Público)' : 'Modo Rascunho'}
              </p>
            </div>
          </div>

          {!isPublished && (
            <button 
              onClick={() => setShowDeployGuide(true)}
              className="bg-studio-gold hover:bg-yellow-600 text-studio-dark text-xs font-bold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <Rocket size={14} />
              PUBLICAR
            </button>
          )}
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        
        {/* Links Section */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="font-sans font-bold text-lg mb-4 flex items-center gap-2 text-studio-dark border-b pb-2">
            <Share2 size={18} /> Links de Acesso
          </h2>
          
          <div className="mb-4">
            <label className="text-xs font-bold text-studio-gray mb-1 block">Link para Clientes (Enviar no Zap)</label>
            <div className="flex gap-2">
              <input 
                id="client-link-input"
                type="text" 
                readOnly 
                value={clientLink} 
                className="flex-1 bg-studio-beige/50 text-xs p-3 rounded-lg border border-gray-200 text-studio-gray font-mono truncate"
              />
              <button 
                onClick={() => copyToClipboard(clientLink, false)}
                className={`px-3 rounded-lg border flex items-center justify-center ${
                  isPublished ? 'bg-studio-pink text-white border-studio-pink' : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {!isPublished && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> Precisa publicar para funcionar</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-studio-gray mb-1 block">Link da Dona (Admin)</label>
            <div className="flex gap-2">
              <input 
                id="admin-link-input"
                type="text" 
                readOnly 
                value={adminLink} 
                className="flex-1 bg-studio-beige/50 text-xs p-3 rounded-lg border border-gray-200 text-studio-dark font-mono truncate"
              />
              <button 
                onClick={() => copyToClipboard(adminLink, true)}
                className="px-3 rounded-lg border border-studio-gray/30 text-studio-gray hover:bg-gray-50"
              >
                {copiedAdmin ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={shareViaWhatsApp}
              className={`py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 text-white shadow-sm ${
                isPublished ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <Smartphone size={16} />
              Enviar Zap
            </button>
            <button 
              onClick={() => setShowTestConfirm(true)}
              className="py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 bg-studio-pink/10 text-studio-pinkDark hover:bg-studio-pink/20"
            >
              <Eye size={16} />
              Testar App
            </button>
          </div>
        </div>

        {/* Bloqueio de Datas */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="font-sans font-bold text-lg mb-4 flex items-center gap-2 text-studio-dark border-b pb-2">
            <Lock size={18} className="text-studio-pink" /> Bloquear Agenda
          </h2>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="date" 
              value={dateToBlock}
              onChange={(e) => setDateToBlock(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-gray-200 outline-none focus:border-studio-pink text-sm"
            />
            <button 
              onClick={handleBlock}
              className="bg-studio-dark text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-black"
            >
              Bloquear
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {blockedDates.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-2">Nenhuma data bloqueada.</p>
            ) : (
              blockedDates.sort((a,b) => a.date.localeCompare(b.date)).map((item) => (
                <div key={item.date} className="flex justify-between items-center p-2 bg-studio-beige/30 rounded border border-gray-100">
                  <span className="font-mono text-xs text-studio-dark font-bold">{item.date.split('-').reverse().join('/')}</span>
                  <button 
                    onClick={() => handleUnblock(item.date)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL GUIA DE PUBLICAÇÃO (DEPLOY) --- */}
      {showDeployGuide && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-6 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full relative">
            <button 
              onClick={() => setShowDeployGuide(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-studio-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Rocket size={32} className="text-studio-gold" />
              </div>
              <h2 className="font-serif text-xl font-bold text-studio-dark">Como Publicar o App</h2>
              <p className="text-sm text-gray-500 mt-1">Siga os 2 passos abaixo:</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                <div className="text-sm text-gray-600 text-left">
                   Olhe para o <strong>topo da tela do seu computador</strong> (barra preta superior).
                </div>
              </div>

              <div className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                <div className="text-sm text-gray-600 text-left">
                   Clique no botão <strong>Deploy</strong> (ou ícone de Nuvem <Cloud size={12} className="inline"/>).
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-[11px] text-yellow-800 text-center">
              Após clicar lá em cima, o sistema vai gerar o link oficial (ex: <code>netlify.app</code>).
            </div>

            <button 
              onClick={() => setShowDeployGuide(false)}
              className="w-full mt-6 bg-studio-dark text-white py-3 rounded-xl font-bold text-sm hover:bg-black"
            >
              Entendi, vou clicar lá!
            </button>
          </div>
          
          {/* Seta animada apontando para cima (simulação) */}
          <div className="absolute top-10 right-10 text-white animate-bounce hidden md:block">
            <p className="text-lg font-handwriting mb-2">O botão está aqui em cima! ↗</p>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE TESTE */}
      {showTestConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-xs w-full animate-fade-in">
            <h3 className="font-serif text-lg font-bold text-studio-dark mb-2">Simular Cliente</h3>
            <p className="text-sm text-studio-gray mb-6">
              Isso vai abrir o app no seu dispositivo atual. <br/>
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowTestConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-500 font-bold text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmClientMode}
                className="flex-1 py-3 bg-studio-pink text-white rounded-lg font-bold text-sm hover:bg-studio-pinkDark"
              >
                Ver App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;