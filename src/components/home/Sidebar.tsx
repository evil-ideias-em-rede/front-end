import React from 'react';
import { 
  Users, LayoutTemplate, BookOpen, UserRound,
  Plus, Home
} from 'lucide-react';
import { Logo } from '../general/Logo';
import { THEME_COLORS } from '../../constants/colors';
import { MOCK_TEACHER_PROFILE } from '../../data/mockData';
import { getStoredUser } from '../../api/client';

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
  const user = getStoredUser();
  const displayName = user?.name || user?.email || MOCK_TEACHER_PROFILE.name;
  const avatar = user?.picture_url;
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
      className="fixed inset-y-0 left-0 h-screen w-[5.5rem] flex flex-col justify-center z-30 select-none overflow-hidden backdrop-blur-xl"
      style={{
        backgroundColor: THEME_COLORS.bgDark,
        borderColor: THEME_COLORS.borderDark,
      }}
    >
      {/* Top Brand (symbol only) */}
      <div className="p-4 pb-2 mt-2 flex justify-center">
        <Logo variant="icon-only" size="sm" theme="dark" />
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
            style={{ color: THEME_COLORS.textLight }}
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
                  backgroundColor: isActive ? THEME_COLORS.textLight : 'rgba(226, 221, 240, 0.0)',
                  color: isActive ? THEME_COLORS.bgDark : THEME_COLORS.textLight,
                }}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span
                className="text-[10px] tracking-tight leading-tight text-center"
                style={{ color: THEME_COLORS.textLight }}
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
          title={`${displayName} — Configurações`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover shadow-sm"
              style={{
                borderColor: THEME_COLORS.primary,
                boxShadow:
                  activeMenu === 'settings'
                    ? `0 0 0 2px ${THEME_COLORS.bgDark}, 0 0 0 4px ${THEME_COLORS.primary}`
                    : undefined,
              }}
            />
          ) : (
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: THEME_COLORS.lightPrimary,
                color: THEME_COLORS.primary,
                boxShadow:
                  activeMenu === 'settings'
                    ? `0 0 0 2px ${THEME_COLORS.bgDark}, 0 0 0 4px ${THEME_COLORS.primary}`
                    : undefined,
              }}
            >
              <UserRound className="w-5 h-5" />
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
