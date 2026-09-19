import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { SettingsHeader } from './SettingsHeader';
import { PersonalDataTab } from './PersonalDataTab';
import { NotificationsTab } from './NotificationsTab';
import type { SettingsTabId } from './types';
import { THEME_COLORS } from '../../constants/colors';
import { currentUser, getStoredUser } from '../../api/client';
import type { AuthUser } from '../../api/client';

interface SettingsPageProps {
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const [activeTab] = useState<SettingsTabId>('profile');
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  useEffect(() => {
    void currentUser().then(setUser).catch(() => undefined);
  }, []);

  return (
    <div
      className="
        mt-12
        p-8
        lg:px-20
        lg:py-6
        space-y-6
        max-w-7xl
        mx-auto
        w-full
        template-page-in
      "
    >
      <SettingsHeader
        user={user}
        onPictureChange={(picture_url) => setUser((current) => current ? { ...current, picture_url } : current)}
      />

      <div className="pt-2">
        {activeTab === 'profile' && user && (
          <PersonalDataTab user={user} onUserChange={setUser} />
        )}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>

      <div
        className=""
        style={{ borderColor: THEME_COLORS.borderLight }}
      >
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 mx-2" />
          <span>Sair da Conta (Logout)</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
