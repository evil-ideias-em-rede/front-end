import React, { useEffect, useState } from 'react';
import { File } from 'lucide-react';
import { THEME_COLORS } from '../../constants/colors';
import { fetchMaterialThumbnail } from '../../api/client';

interface PreviewThumbnailProps {
  id: string;
  className?: string;
}

export const PreviewThumbnail: React.FC<PreviewThumbnailProps> = ({ id, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    setImageUrl(null);

    const load = async () => {
      try {
        const blob = await fetchMaterialThumbnail(id);
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch {
        if (active) setImageUrl(null);
      }
    };

    void load();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className ?? ''}`}
      style={{ backgroundColor: '#fff' }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Prévia da primeira página"
          className="w-full h-full object-contain p-3"
          draggable={false}
        />
      ) : (
        <File className="w-8 h-8" style={{ color: THEME_COLORS.primary }} />
      )}
    </div>
  );
};

export default PreviewThumbnail;
