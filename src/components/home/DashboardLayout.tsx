import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import type { SidebarMenuId } from './Sidebar';
import { HomePage } from './HomePage';
import { TurmasTab } from './TurmasTab';
import { TemplatesTab } from './TemplatesTab';
import { MateriaisTab } from './MateriaisTab';
import { SettingsPage } from '../settings/SettingsPage';
import { THEME_COLORS } from '../../constants/colors';
import { clearAuth, isAuthenticated } from '../../api/client';
import { useBackendData } from '../../context/BackendDataContext';

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<SidebarMenuId>('home');
  const { error: dataError } = useBackendData();

  useEffect(() => {
    if (!isAuthenticated()) navigate('/', { replace: true });
  }, [navigate]);

  const isTurmaDetail = location.pathname.startsWith('/home/turmas/');
  const isTemplateDetail = location.pathname.startsWith('/home/templates/');
  const isMaterialDetail = location.pathname.startsWith('/home/materiais/');
  const isEditor = location.pathname.startsWith('/home/editor');
  const isDetailPage = isTurmaDetail || isTemplateDetail || isMaterialDetail || isEditor;

  useEffect(() => {
    const p = location.pathname;
    if (p === '/home/turmas' || p.startsWith('/home/turmas/')) {
      setActiveMenu('turmas');
    } else if (p === '/home/templates' || p.startsWith('/home/templates/')) {
      setActiveMenu('templates');
    } else if (p === '/home/materiais' || p.startsWith('/home/materiais/')) {
      setActiveMenu('materiais');
    } else if (p === '/home') {
      setActiveMenu('home');
    }
  }, [location.pathname]);

  const handleSelectMenu = (menu: SidebarMenuId) => {
    setActiveMenu(menu);
    navigate('/home');
  };

  const backgroundArtwork = (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -top-20 -left-16 h-44 w-64 rotate-[-20deg] rounded-br-[5rem]" style={{ backgroundColor: THEME_COLORS.secondary }} />
      <div className="absolute -top-12 left-[22%] h-20 w-20 rounded-full" style={{ backgroundColor: THEME_COLORS.primary }} />
      <div className="absolute -top-28 right-[8%] h-56 w-56 rounded-full opacity-35" style={{ backgroundColor: THEME_COLORS.primary }} />
      <div className="absolute top-[28rem] -left-20 h-40 w-40 rounded-full opacity-30" style={{ backgroundColor: THEME_COLORS.primary }} />
      <div className="absolute top-[25rem] -right-10 h-32 w-32 rounded-full border-[22px] border-[#201436] bg-[#7C3AED] shadow-[0_0_0_6px_#F2F0F7]">
        <div className="absolute inset-[29%] rounded-full bg-[#F2F0F7]" />
      </div>
      <div className="absolute -bottom-16 -right-14 h-40 w-52 rotate-[-18deg] rounded-tl-[4rem]" style={{ backgroundColor: THEME_COLORS.secondary }} />
    </div>
  );

  return (
    <div 
      className="home-theme min-h-screen flex font-sans antialiased relative overflow-hidden"
      style={{ 
        backgroundColor: THEME_COLORS.bgDark, 
        color: THEME_COLORS.textDark 
      }}
    >
      {/* 1. Canva-style Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        onOpenNewIdea={() => {
          setActiveMenu('criar');
          navigate('/home/editor?type=brainstorm');
        }}
        onOpenSettings={() => {
          setActiveMenu('settings');
          navigate('/home');
        }}
      />

      {/* Reserva o espaço da sidebar, que fica fixa na viewport. */}
      <div aria-hidden="true" className="w-[5.5rem] shrink-0" />

      {/* Rota de detalhe da turma: renderiza fora do <main> para ocupar a página cheia
          mantendo a Sidebar global do app */}
      {isDetailPage ? (
        <div
          className="relative z-10 my-3 mr-3 h-[calc(100vh-1.5rem)] min-w-0 flex-grow overflow-hidden rounded-3xl shadow-2xl"
          style={{ backgroundColor: THEME_COLORS.bgLight }}
        >
          {!isEditor && backgroundArtwork}
          <div className="relative z-10 h-full"><Outlet /></div>
        </div>
      ) : (
        <main
              style={{
          backgroundColor: THEME_COLORS.bgLight,
        }}
        className="home-theme relative z-10 my-3 mr-3 flex-grow flex flex-col min-w-0 min-h-0 overflow-x-hidden rounded-3xl shadow-2xl">
          {backgroundArtwork}
          <div className="relative z-10 flex flex-grow flex-col min-w-0 min-h-0">

          {dataError && (
            <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 lg:mx-20">
              Não foi possível carregar os dados do backend: {dataError}
            </div>
          )}

          {/* Main View Router */}
          {(activeMenu === 'criar' || activeMenu === 'home') && <HomePage />}

          {activeMenu === 'turmas' && <TurmasTab />}

          {activeMenu === 'templates' && <TemplatesTab />}

          {activeMenu === 'materiais' && <MateriaisTab />}

          {activeMenu === 'settings' && <SettingsPage onLogout={() => { clearAuth(); navigate('/'); }} />}
          </div>
        </main>
      )}
    </div>
  );
};

export default DashboardLayout;
