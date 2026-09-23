import React, { useState } from 'react';
import { 
  FolderGit2, Send, CheckCircle2, ArrowUp
} from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { Logo } from '../general/Logo';

export const Footer: React.FC = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setMessageSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contato" className="pt-20 pb-12 border-t-4" style={{ backgroundColor: THEME_COLORS.bgDark, color: THEME_COLORS.textLight, borderColor: THEME_COLORS.primary }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-stone-800">
          
          {/* Brand & Mission using Reusable Logo */}
          <div className="lg:col-span-4 space-y-5">
            <Logo size="lg" theme="dark" showBadge />
            <p className="text-sm leading-relaxed font-medium text-stone-300">
              Ecossistema multiagente que transforma debates da Câmara dos Deputados em materiais didáticos alinhados à BNCC, mantendo o professor como protagonista.
            </p>
            
            <div className="pt-2 space-y-2.5 text-xs font-medium text-stone-300">
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" style={{ color: THEME_COLORS.secondary }} />
                <a
                  href="https://github.com/evil-ideias-em-rede"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  github.com/evil-ideias-em-rede
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links & Modules */}
          <div className="lg:col-span-3 space-y-4 pt-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest border-b border-stone-800 pb-2">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-stone-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Portal do Educador & Login</a></li>
              <li><a href="#sobre-iniciativa" className="hover:text-white transition-colors">Sobre a Iniciativa</a></li>
              <li><a href="#como-aprimorar" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#sobre-time" className="hover:text-white transition-colors">Equipe de Pesquisa</a></li>
              <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Quick Support Message Form */}
          <div className="lg:col-span-5 bg-stone-850 p-8 rounded-3xl border border-stone-800 shadow-sm" style={{ backgroundColor: '#2A1D4E' }}>
            <h4 className="text-lg font-black text-white tracking-tight mb-1">
              Entre em contato
            </h4>
            <p className="text-xs text-stone-400 mb-5 font-medium">
              Dúvidas sobre a plataforma, parcerias de pesquisa ou sugestões de temas?
            </p>

            {messageSent ? (
              <div className="p-4 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Mensagem enviada! Obrigado pelo contato.</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
                  />
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Como podemos te ajudar nas suas aulas?"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  style={{ backgroundColor: THEME_COLORS.primary }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primaryHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = THEME_COLORS.primary)}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-stone-400">
          <p>© 2026 Contraponto - Plataforma Educacional para o Ensino Básico. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Termos de Uso</span>
            <span className="hover:text-stone-300 cursor-pointer">Privacidade & LGPD</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 font-bold transition-colors"
              style={{ color: THEME_COLORS.textLight }}
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
