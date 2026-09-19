import React, { useRef } from 'react';
import { Camera, User } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { getStoredUser } from '../../api/client';
import type { AuthUser } from '../../api/client';

interface SettingsHeaderProps {
  title?: string;
  subtitle?: string;
  user?: AuthUser | null;
  onPictureChange?: (picture: string | null) => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title = 'Configurações',
  subtitle = 'Gerencie seus dados pessoais e notificações',
  user: providedUser,
  onPictureChange,
}) => {
  const user = providedUser ?? getStoredUser();
  const displayName = user?.name || user?.email || 'Professor';
  const avatar = user?.picture_url || null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 4 * 1024 * 1024) {
      window.alert('A foto deve ter no máximo 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onPictureChange?.(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-b pb-6" style={{ borderColor: THEME_COLORS.borderLight }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-22 h-22 rounded-full shrink-0 cursor-pointer group"
          title="Trocar foto"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-22 h-22 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: THEME_COLORS.primary }}
            />
          ) : (
            <span
              className="w-22 h-22 rounded-full border-2 shadow-sm flex items-center justify-center"
              style={{ borderColor: THEME_COLORS.primary, backgroundColor: THEME_COLORS.lightPrimary, color: THEME_COLORS.primary }}
            >
              <User className="w-9 h-9" />
            </span>
          )}
          <span className="absolute inset-0 rounded-full bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePicture} className="hidden" />
        </button>
        <div>
          <h1
            className="text-3xl xl:text-4xl font-black tracking-tight"
            style={{ color: THEME_COLORS.textDark }}
          >
            {title}
          </h1>
          <p className="mt-2 text-xs font-medium text-stone-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
