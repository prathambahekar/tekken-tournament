import React, { useState } from 'react';
import { Fighter } from '../types';

interface FighterAvatarProps {
  fighter?: Fighter | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-11 h-11 text-sm',
  xl: 'w-14 h-14 text-base',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/[\s-]+/);
  if (parts.length > 1 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const FighterAvatar: React.FC<FighterAvatarProps> = ({
  fighter,
  name,
  size = 'sm',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const displayText = fighter ? fighter.initials : name ? getInitials(name) : '?';
  const portraitSrc = fighter ? `/portraits/${fighter.id}.svg` : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center font-mono font-bold shrink-0 overflow-hidden border border-[var(--border2)] bg-[var(--surface2)] text-[var(--text)] select-none tracking-tight rounded-none ${sizeMap[size]} ${className}`}
      title={fighter ? `${fighter.name} (${fighter.style})` : name || 'Player'}
    >
      {portraitSrc && !imgError ? (
        <img
          src={portraitSrc}
          alt={fighter?.name || 'Fighter'}
          className="w-full h-full object-cover filter contrast-105"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="leading-none uppercase">{displayText}</span>
      )}
    </div>
  );
};
