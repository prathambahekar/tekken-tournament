import fs from 'fs';
import path from 'path';

const RAW_ROSTER = [
  { id: 'akuma', name: 'Akuma', type: 'Guest', color1: '#8b0000', color2: '#ff2400', icon: 'fire' },
  { id: 'alisa', name: 'Alisa', type: 'Base', color1: '#ff69b4', color2: '#00ffff', icon: 'wing' },
  { id: 'anna', name: 'Anna', type: 'DLC', color1: '#800020', color2: '#e30b5c', icon: 'dagger' },
  { id: 'armor-king', name: 'Armor King', type: 'DLC', color1: '#2b2b2b', color2: '#9932cc', icon: 'skull' },
  { id: 'asuka', name: 'Asuka', type: 'Base', color1: '#1e3f66', color2: '#52b2bf', icon: 'fist' },
  { id: 'bob', name: 'Bob', type: 'Base', color1: '#b8860b', color2: '#ffd700', icon: 'fist' },
  { id: 'bryan', name: 'Bryan', type: 'Base', color1: '#2f4f4f', color2: '#ff4500', icon: 'target' },
  { id: 'claudio', name: 'Claudio', type: 'Base', color1: '#0047ab', color2: '#00ffff', icon: 'star' },
  { id: 'devil-jin', name: 'Devil Jin', type: 'Base', color1: '#1a0033', color2: '#9400d3', icon: 'wing' },
  { id: 'dragunov', name: 'Dragunov', type: 'Base', color1: '#2c3539', color2: '#708090', icon: 'target' },
  { id: 'eddy', name: 'Eddy', type: 'Base', color1: '#006400', color2: '#ffd700', icon: 'spin' },
  { id: 'eliza', name: 'Eliza', type: 'DLC', color1: '#4a0033', color2: '#dc143c', icon: 'bat' },
  { id: 'fahkumram', name: 'Fahkumram', type: 'DLC', color1: '#8b4513', color2: '#ff8c00', icon: 'lightning' },
  { id: 'feng', name: 'Feng', type: 'Base', color1: '#8b0000', color2: '#d4af37', icon: 'dragon' },
  { id: 'ganryu', name: 'Ganryu', type: 'DLC', color1: '#8b4513', color2: '#cd853f', icon: 'shield' },
  { id: 'geese', name: 'Geese', type: 'Guest', color1: '#b22222', color2: '#f0f8ff', icon: 'wind' },
  { id: 'gigas', name: 'Gigas', type: 'Base', color1: '#b22222', color2: '#ff1493', icon: 'gear' },
  { id: 'heihachi', name: 'Heihachi', type: 'Base', color1: '#363636', color2: '#ffd700', icon: 'lightning' },
  { id: 'hwoarang', name: 'Hwoarang', type: 'Base', color1: '#00008b', color2: '#ff4500', icon: 'kick' },
  { id: 'jack-7', name: 'Jack-7', type: 'Base', color1: '#1c1c1c', color2: '#00ff7f', icon: 'gear' },
  { id: 'jin', name: 'Jin', type: 'Base', color1: '#800000', color2: '#ffd700', icon: 'flame' },
  { id: 'josie', name: 'Josie', type: 'Base', color1: '#ffd700', color2: '#0047ab', icon: 'star' },
  { id: 'julia', name: 'Julia', type: 'DLC', color1: '#228b22', color2: '#ff7f50', icon: 'leaf' },
  { id: 'katarina', name: 'Katarina', type: 'Base', color1: '#4b0082', color2: '#ff1493', icon: 'kick' },
  { id: 'kazumi', name: 'Kazumi', type: 'Base', color1: '#ffffff', color2: '#dc143c', icon: 'tiger' },
  { id: 'kazuya', name: 'Kazuya', type: 'Base', color1: '#4b0082', color2: '#ff0000', icon: 'lightning' },
  { id: 'king', name: 'King', type: 'Base', color1: '#ff8c00', color2: '#ffd700', icon: 'jaguar' },
  { id: 'kunimitsu', name: 'Kunimitsu', type: 'DLC', color1: '#c71585', color2: '#ffd700', icon: 'fox' },
  { id: 'kuma', name: 'Kuma', type: 'Base', color1: '#5c4033', color2: '#d2691e', icon: 'claw' },
  { id: 'lars', name: 'Lars', type: 'Base', color1: '#191970', color2: '#ff4500', icon: 'lightning' },
  { id: 'law', name: 'Law', type: 'Base', color1: '#ffd700', color2: '#000000', icon: 'dragon' },
  { id: 'lee', name: 'Lee', type: 'Base', color1: '#4a0e4e', color2: '#c0c0c0', icon: 'rose' },
  { id: 'lei', name: 'Lei', type: 'DLC', color1: '#2e8b57', color2: '#ffa500', icon: 'dragon' },
  { id: 'leo', name: 'Leo', type: 'Base', color1: '#b8860b', color2: '#1e90ff', icon: 'fist' },
  { id: 'leroy', name: 'Leroy', type: 'DLC', color1: '#1a1a1a', color2: '#ffd700', icon: 'cane' },
  { id: 'lidia', name: 'Lidia', type: 'DLC', color1: '#ffffff', color2: '#dc143c', icon: 'eagle' },
  { id: 'lili', name: 'Lili', type: 'Base', color1: '#fff0f5', color2: '#c71585', icon: 'rose' },
  { id: 'lucky-chloe', name: 'Lucky Chloe', type: 'Base', color1: '#ff1493', color2: '#00ffff', icon: 'paw' },
  { id: 'marduk', name: 'Marduk', type: 'DLC', color1: '#8b0000', color2: '#2f4f4f', icon: 'fist' },
  { id: 'master-raven', name: 'Master Raven', type: 'Base', color1: '#1a0033', color2: '#00ced1', icon: 'sword' },
  { id: 'miguel', name: 'Miguel', type: 'Base', color1: '#8b0000', color2: '#d2691e', icon: 'flame' },
  { id: 'negan', name: 'Negan', type: 'Guest', color1: '#2b2b2b', color2: '#8b0000', icon: 'bat' },
  { id: 'nina', name: 'Nina', type: 'Base', color1: '#483d8b', color2: '#c0c0c0', icon: 'dagger' },
  { id: 'noctis', name: 'Noctis', type: 'Guest', color1: '#0a192f', color2: '#64ffda', icon: 'sword' },
  { id: 'panda', name: 'Panda', type: 'Base', color1: '#111111', color2: '#ff69b4', icon: 'claw' },
  { id: 'paul', name: 'Paul', type: 'Base', color1: '#b22222', color2: '#ffd700', icon: 'fist' },
  { id: 'shaheen', name: 'Shaheen', type: 'Base', color1: '#2e8b57', color2: '#d4af37', icon: 'falcon' },
  { id: 'steve', name: 'Steve', type: 'Base', color1: '#00008b', color2: '#dc143c', icon: 'fist' },
  { id: 'xiaoyu', name: 'Xiaoyu', type: 'Base', color1: '#ff8c00', color2: '#ff69b4', icon: 'fan' },
  { id: 'yoshimitsu', name: 'Yoshimitsu', type: 'Base', color1: '#008080', color2: '#ffd700', icon: 'sword' },
  { id: 'zafina', name: 'Zafina', type: 'DLC', color1: '#301934', color2: '#9400d3', icon: 'claw' }
];

function getIconSvg(icon, color) {
  switch (icon) {
    case 'flame':
      return `<path d="M100 35 C120 70 145 90 145 125 C145 155 125 175 100 175 C75 175 55 155 55 125 C55 95 85 75 90 55 C90 70 98 80 102 80 C108 80 112 65 100 35 Z" fill="${color}" opacity="0.9" />`;
    case 'lightning':
      return `<polygon points="105,25 65,105 98,105 85,175 140,85 108,85" fill="${color}" filter="drop-shadow(0 0 8px ${color})" />`;
    case 'jaguar':
      return `<circle cx="100" cy="100" r="45" fill="${color}" />
              <polygon points="70,55 85,75 60,80" fill="${color}" />
              <polygon points="130,55 115,75 140,80" fill="${color}" />
              <circle cx="85" cy="95" r="7" fill="#000" />
              <circle cx="115" cy="95" r="7" fill="#000" />
              <polygon points="100,105 92,120 108,120" fill="#000" />
              <path d="M85 130 Q100 140 115 130" stroke="#000" stroke-width="4" fill="none" />`;
    case 'sword':
      return `<polygon points="98,25 102,25 104,135 125,135 125,145 104,145 104,170 96,170 96,145 75,145 75,135 96,135" fill="${color}" />`;
    case 'wing':
      return `<path d="M50 140 C50 80 80 40 145 35 C125 65 110 95 120 125 C100 100 85 120 85 135 C75 125 65 135 50 140 Z" fill="${color}" />`;
    case 'dragon':
      return `<path d="M60 140 Q80 60 120 60 Q145 60 140 95 Q135 130 95 125 Q75 120 85 150 Q105 160 135 150" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round" />`;
    case 'skull':
      return `<path d="M70 70 C70 45 130 45 130 70 C130 95 120 110 120 130 L80 130 C80 110 70 95 70 70 Z" fill="${color}" />
              <circle cx="85" cy="78" r="8" fill="#111" />
              <circle cx="115" cy="78" r="8" fill="#111" />
              <rect x="88" y="115" width="4" height="15" fill="#111" />
              <rect x="98" y="115" width="4" height="15" fill="#111" />
              <rect x="108" y="115" width="4" height="15" fill="#111" />`;
    case 'tiger':
      return `<circle cx="100" cy="100" r="46" fill="${color}" />
              <path d="M80 65 L95 85 L85 90 M120 65 L105 85 L115 90 M100 60 L100 85" stroke="#000" stroke-width="4" stroke-linecap="round" fill="none" />
              <circle cx="85" cy="102" r="5" fill="#000" />
              <circle cx="115" cy="102" r="5" fill="#000" />`;
    case 'bat':
      return `<path d="M100 85 C120 50 155 55 170 85 C155 105 135 110 120 140 C110 115 100 125 100 125 C100 125 90 115 80 140 C65 110 45 105 30 85 C45 55 80 50 100 85 Z" fill="${color}" />`;
    default:
      // Stylized martial arts fighter fist
      return `<circle cx="100" cy="95" r="42" fill="${color}" opacity="0.3" />
              <path d="M80 85 C80 72 90 65 102 65 C115 65 125 72 125 85 L125 120 C125 135 115 145 100 145 C85 145 75 135 75 120 Z" fill="${color}" />
              <path d="M75 95 L125 95 M75 108 L125 108" stroke="#000" stroke-width="4" opacity="0.5" />`;
  }
}

const outDir = path.resolve('public/portraits');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

RAW_ROSTER.forEach((f) => {
  const initials = f.name.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="bg-${f.id}" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="${f.color2}" stop-opacity="0.35" />
      <stop offset="55%" stop-color="${f.color1}" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#090a0f" stop-opacity="0.98" />
    </radialGradient>
    <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5b81c" />
      <stop offset="50%" stop-color="#e8141c" />
      <stop offset="100%" stop-color="#800000" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="200" height="200" rx="16" fill="url(#bg-${f.id})" />

  <!-- Speed lines -->
  <g stroke="rgba(255,255,255,0.06)" stroke-width="2">
    <line x1="0" y1="20" x2="200" y2="180" />
    <line x1="0" y1="60" x2="200" y2="220" />
    <line x1="0" y1="-20" x2="200" y2="140" />
  </g>

  <!-- Silhouette Icon -->
  <g transform="translate(0, -6)">
    ${getIconSvg(f.icon, f.color2)}
  </g>

  <!-- Stylized Monogram / Portrait Badge -->
  <circle cx="100" cy="100" r="48" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="8 6" />

  <!-- Fighter Name Header Band -->
  <rect x="0" y="152" width="200" height="48" fill="#0c0d12" opacity="0.92" />
  <line x1="0" y1="152" x2="200" y2="152" stroke="url(#metal)" stroke-width="2.5" />

  <!-- Fighter Name Typography -->
  <text x="100" y="176" text-anchor="middle" font-family="'Chakra Petch', sans-serif" font-weight="700" font-size="16" letter-spacing="1" fill="#ffffff">
    ${f.name.toUpperCase()}
  </text>
  <text x="100" y="192" text-anchor="middle" font-family="'Chakra Petch', sans-serif" font-weight="600" font-size="10" letter-spacing="2" fill="${f.color2}">
    ${f.type.toUpperCase()} FIGHTER
  </text>

  <!-- Corner Border Accents -->
  <rect x="2" y="2" width="196" height="196" rx="14" fill="none" stroke="${f.color2}" stroke-width="1.5" opacity="0.4" />
</svg>`;

  fs.writeFileSync(path.join(outDir, `${f.id}.svg`), svg);
  // Also create .png symlink/copy or reference
  fs.writeFileSync(path.join(outDir, `${f.id}.png`), svg);
});

console.log(`Successfully generated portraits for ${RAW_ROSTER.length} fighters in public/portraits/`);
