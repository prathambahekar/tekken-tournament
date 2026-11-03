import React from 'react';
import { Fighter } from '../types';

interface FighterAvatarProps {
  fighter?: Fighter | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
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
  const displayText = fighter ? fighter.initials : name ? getInitials(name) : '?';
  const hue = fighter ? fighter.hue : name ? computeHue(name) : 220;

  const bgStyle = {
    backgroundColor: `hsl(${hue}, 44%, 26%)`,
    borderColor: `hsl(${hue}, 48%, 40%)`,
    color: '#ffffff',
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-display font-bold shrink-0 rounded-lg border shadow-xs select-none ${sizeMap[size]} ${className}`}
      style={bgStyle}
      title={fighter ? `${fighter.name} (${fighter.style})` : name || 'Player'}
    >
      <span className="tracking-tight uppercase">{displayText}</span>
    </div>
  );
};
