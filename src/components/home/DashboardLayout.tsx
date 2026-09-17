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

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<SidebarMenuId>('criar');

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
      setActiveMenu('criar');
    }
  }, [location.pathname]);

  const handleSelectMenu = (menu: SidebarMenuId) => {
    setActiveMenu(menu);
    navigate('/home');
  };

  return (
    <div 
      className="min-h-screen flex font-sans antialiased relative"
      style={{ 
        backgroundColor: THEME_COLORS.bgLight, 
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

      {/* Rota de detalhe da turma: renderiza fora do <main> para ocupar a página cheia
          mantendo a Sidebar global do app */}
      {isDetailPage ? (
        <Outlet />
      ) : (
        <main
              style={{
          background: `linear-gradient(
            to bottom,
            #EBE8F3 -15%,
            ${THEME_COLORS.lightPrimary} 10%,
            ${THEME_COLORS.bgLight} 30%
          )`,
        }}
        className="flex-grow flex flex-col min-w-0 overflow-x-hidden">

          {/* Main View Router */}
          {(activeMenu === 'criar' || activeMenu === 'home') && <HomePage />}

          {activeMenu === 'turmas' && <TurmasTab />}

          {activeMenu === 'templates' && <TemplatesTab />}

          {activeMenu === 'materiais' && <MateriaisTab />}

          {activeMenu === 'settings' && <SettingsPage onLogout={() => navigate('/')} />}
        </main>
      )}
    </div>
  );
};

export default DashboardLayout;