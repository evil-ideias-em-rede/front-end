import React from 'react';
import { 
  Users, LayoutTemplate, BookOpen, 
  Plus, Home
} from 'lucide-react';
import { Logo } from '../general/Logo';
import { THEME_COLORS } from '../../constants/colors';
import { MOCK_TEACHER_PROFILE } from '../../data/mockData';

export type SidebarMenuId =
  | 'criar'
  | 'settings'
  | 'home'
  | 'turmas'
  | 'templates'
  | 'materiais';

interface SidebarProps {
  activeMenu: SidebarMenuId;
  onSelectMenu: (menu: SidebarMenuId) => void;
  onOpenNewIdea: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  onOpenNewIdea,
  onOpenSettings,
}) => {
  const menuItems = [
    {
      id: 'home' as SidebarMenuId,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'turmas' as SidebarMenuId,
      label: 'Turmas',
      icon: Users,
    },
    {
      id: 'templates' as SidebarMenuId,
      label: 'Templates',
      icon: LayoutTemplate,
    },
    {
      id: 'materiais' as SidebarMenuId,
      label: 'Materiais',
      icon: BookOpen,
    },
  ];

  return (
    <aside
      className="h-screen sticky top-0 w-20 shrink-0 border-r flex flex-col justify-center z-30 select-none relative"
      style={{
        backgroundColor: 'transparent',
        borderColor: THEME_COLORS.borderLight,
      }}
    >
      {/* Top Brand (symbol only) */}
      <div className="p-4 pb-2 mt-2 flex justify-center">
        <Logo variant="icon-only" size="sm" />
      </div>

      {/* Create / New Action Button (fixed, same as the other items) */}
      <div className="px-3 pb-1 pt-3">
        <button
          type="button"
          onClick={onOpenNewIdea}
          className="w-full flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all cursor-pointer"
          title="Criar novo plano de aula ou debate"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md shadow-[#7C3AED]/20 transition-transform hover:scale-105"
            style={{ backgroundColor: THEME_COLORS.primary }}
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <span
            className="text-[10px] tracking-tight leading-tight"
            style={{ color: THEME_COLORS.textDark }}
          >
            Criar
          </span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow px-3  space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectMenu(item.id)}
              className="w-full flex flex-col items-center gap-0.5 py-2 rounded-lg transition-all cursor-pointer hover:bg-black/[0.05]"
              title={item.label}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${
                  isActive ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: isActive ? THEME_COLORS.primary : 'rgba(226, 221, 240, 0.0)',
                  color: isActive ? THEME_COLORS.textLight : THEME_COLORS.gray,
                }}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span
                className={`text-[10px] tracking-tight leading-tight text-center ${
                  isActive ? 'text-[#7C3AED]' : ''
                }`}
                style={{ color: isActive ? THEME_COLORS.primary : THEME_COLORS.textDark }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Trigger opens the Settings screen */}
      <div className="p-4 flex justify-center" style={{ borderColor: THEME_COLORS.borderLight }}>
        <button
          type="button"
          onClick={onOpenSettings}
          className="relative rounded-full transition-transform hover:scale-105 cursor-pointer"
          title={`${MOCK_TEACHER_PROFILE.name} — Configurações`}
        >
          <img
            src={MOCK_TEACHER_PROFILE.avatar}
            alt={MOCK_TEACHER_PROFILE.name}
            className="w-10 h-10 rounded-full object-cover shadow-sm"
            style={{
              borderColor: THEME_COLORS.primary,
              boxShadow:
                activeMenu === 'settings'
                  ? `0 0 0 2px ${THEME_COLORS.bgLight}, 0 0 0 4px ${THEME_COLORS.primary}`
                  : undefined,
            }}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;