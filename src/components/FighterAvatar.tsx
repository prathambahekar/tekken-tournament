import React, { useState } from 'react';
import { Fighter } from '../types';

interface FighterAvatarProps {
  fighter?: Fighter | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[9px] rounded',
  sm: 'w-8 h-8 text-xs rounded-md',
  md: 'w-9 h-9 text-xs rounded-md',
  lg: 'w-11 h-11 text-sm rounded-lg',
  xl: 'w-14 h-14 text-base rounded-lg',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/[\s-]+/);
  if (parts.length > 1 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function computeHue(str: string): number {
  let h = 0;
  for (let k = 0; k < str.length; k++) {
    h = (h * 31 + str.charCodeAt(k)) % 360;
  }
  return h;
}

export const FighterAvatar: React.FC<FighterAvatarProps> = ({
  fighter,
  name,
  size = 'sm',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const displayText = fighter ? fighter.initials : name ? getInitials(name) : '?';
  const hue = fighter ? fighter.hue : name ? computeHue(name) : 220;

  const bgStyle = {
    backgroundColor: `hsl(${hue}, 48%, 28%)`,
    borderColor: `hsl(${hue}, 52%, 42%)`,
    color: '#ffffff',
  };

  const portraitSrc = fighter ? `/portraits/${fighter.id}.svg` : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold shrink-0 overflow-hidden border shadow-xs select-none tracking-tight ${sizeMap[size]} ${className}`}
      style={bgStyle}
      title={fighter ? `${fighter.name} (${fighter.style})` : name || 'Player'}
    >
      {portraitSrc && !imgError ? (
        <img
          src={portraitSrc}
          alt={fighter?.name || 'Fighter'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="leading-none uppercase">{displayText}</span>
      )}
    </div>
  );
};
