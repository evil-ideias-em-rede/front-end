import React, { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Logo } from '../general/Logo';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'INÍCIO', href: '#hero' },
    { label: 'SOBRE A INICIATIVA', href: '#sobre-iniciativa' },
    { label: 'COMO ENSINAR', href: '#como-aprimorar' },
    { label: 'EQUIPE', href: '#sobre-time' },
    { label: 'CONTATO', href: '#contato' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F2F0F7]/95 backdrop-blur-md border-b border-[#E4D6FF] transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          
          {/* Left: Reusable Logo Component */}
          <Logo href="#hero" showBadge size="md" onClick={() => handleNavClick('#hero')} />

          {/* Center: Capsule Navbar */}
          <nav className="hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full border border-[#E4D6FF] bg-[#EAE0FF]/50 shadow-xs">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
                  idx === 0 
                    ? 'text-[#7C3AED] bg-[#F2F0F7] shadow-xs' 
                    : 'text-[#231942] hover:text-[#7C3AED] hover:bg-[#F2F0F7]/70'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Search / Auth CTA Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder="BUSCAR TEMAS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 pl-8 pr-4 py-2 rounded-full border border-[#E4D6FF] text-xs font-bold placeholder-stone-400 focus:outline-none focus:border-[#7C3AED] focus:w-56 transition-all bg-[#F2F0F7]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-xs font-extrabold text-[#231942] hover:text-[#7C3AED] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#AEF03D] hover:bg-[#93CC26] text-[#231942] text-xs font-extrabold uppercase tracking-wider shadow-md shadow-[#AEF03D]/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Criar Conta</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
