import { Fighter } from '../types';

export const RAW_ROSTER: Array<Omit<Fighter, 'initials' | 'hue'>> = [
  { id: 'akuma', name: 'Akuma', type: 'Guest', style: 'Satsui no Hado / Ansatsuken', origin: 'Japan (Street Fighter)' },
  { id: 'alisa', name: 'Alisa', type: 'Base', style: 'Thruster-assisted High Mobility', origin: 'Russia' },
  { id: 'anna', name: 'Anna', type: 'DLC', style: 'Assassination Martial Arts', origin: 'Ireland' },
  { id: 'armor-king', name: 'Armor King', type: 'DLC', style: 'Pro Wrestling / Lucha Libre', origin: 'Unknown' },
  { id: 'asuka', name: 'Asuka', type: 'Base', style: 'Kazama Style Traditional Martial Arts', origin: 'Japan' },
  { id: 'bob', name: 'Bob', type: 'Base', style: 'Freestyle Karate', origin: 'USA' },
  { id: 'bryan', name: 'Bryan', type: 'Base', style: 'Kickboxing', origin: 'USA' },
  { id: 'claudio', name: 'Claudio', type: 'Base', style: 'Sirius Exorcism Sorcery', origin: 'Italy' },
  { id: 'devil-jin', name: 'Devil Jin', type: 'Base', style: 'Advanced Mishima Karate', origin: 'Japan' },
  { id: 'dragunov', name: 'Dragunov', type: 'Base', style: 'Commando Sambo', origin: 'Russia' },
  { id: 'eddy', name: 'Eddy', type: 'Base', style: 'Capoeira', origin: 'Brazil' },
  { id: 'eliza', name: 'Eliza', type: 'DLC', style: 'Vampiric Dark Arts', origin: 'Unknown' },
  { id: 'fahkumram', name: 'Fahkumram', type: 'DLC', style: 'Muay Thai', origin: 'Thailand' },
  { id: 'feng', name: 'Feng', type: 'Base', style: 'Chinese Kenpo / God Fist', origin: 'China' },
  { id: 'ganryu', name: 'Ganryu', type: 'DLC', style: 'Sumo Wrestling', origin: 'Japan' },
  { id: 'geese', name: 'Geese', type: 'Guest', style: 'Ancient Kobujutsu / Hakkyokuseiken', origin: 'USA (Fatal Fury)' },
  { id: 'gigas', name: 'Gigas', type: 'Base', style: 'Destructive Cybernetic Brawling', origin: 'Unknown' },
  { id: 'heihachi', name: 'Heihachi', type: 'Base', style: 'Mishima Style Fighting Karate', origin: 'Japan' },
  { id: 'hwoarang', name: 'Hwoarang', type: 'Base', style: 'Taekwondo', origin: 'South Korea' },
  { id: 'jack-7', name: 'Jack-7', type: 'Base', style: 'Brute Cybernetic Force', origin: 'Russia' },
  { id: 'jin', name: 'Jin', type: 'Base', style: 'Traditional Karate', origin: 'Japan' },
  { id: 'josie', name: 'Josie', type: 'Base', style: 'Eskrima & Kickboxing', origin: 'Philippines' },
  { id: 'julia', name: 'Julia', type: 'DLC', style: 'Xin Yi Liu He Quan & Baji Quan', origin: 'USA' },
  { id: 'katarina', name: 'Katarina', type: 'Base', style: 'Savate', origin: 'Brazil' },
  { id: 'kazumi', name: 'Kazumi', type: 'Base', style: 'Hachijo Style Karate', origin: 'Japan' },
  { id: 'kazuya', name: 'Kazuya', type: 'Base', style: 'Mishima Style Fighting Karate', origin: 'Japan' },
  { id: 'king', name: 'King', type: 'Base', style: 'Pro Wrestling & Lucha Libre', origin: 'Mexico' },
  { id: 'kunimitsu', name: 'Kunimitsu', type: 'DLC', style: 'Manji Ninjutsu / Dagger Art', origin: 'Japan' },
  { id: 'kuma', name: 'Kuma', type: 'Base', style: 'Heihachi Bear Karate', origin: 'Japan' },
  { id: 'lars', name: 'Lars', type: 'Base', style: 'Tekken Force Military Combat', origin: 'Sweden' },
  { id: 'law', name: 'Law', type: 'Base', style: 'Jeet Kune Do', origin: 'USA' },
  { id: 'lee', name: 'Lee', type: 'Base', style: 'Mishima Karate & Martial Arts', origin: 'Japan' },
  { id: 'lei', name: 'Lei', type: 'DLC', style: 'Five Form Kung Fu / Drunken Master', origin: 'Hong Kong' },
  { id: 'leo', name: 'Leo', type: 'Base', style: 'Baji Quan', origin: 'Germany' },
  { id: 'leroy', name: 'Leroy', type: 'DLC', style: 'Wing Chun', origin: 'USA' },
  { id: 'lidia', name: 'Lidia', type: 'DLC', style: 'Traditional Polish Shotokan Karate', origin: 'Poland' },
  { id: 'lili', name: 'Lili', type: 'Base', style: 'Gymnastic Street Brawling', origin: 'Monaco' },
  { id: 'lucky-chloe', name: 'Lucky Chloe', type: 'Base', style: 'Freestyle Dance & Acrobatics', origin: 'Unknown' },
  { id: 'marduk', name: 'Marduk', type: 'DLC', style: 'Vale Tudo', origin: 'Australia' },
  { id: 'master-raven', name: 'Master Raven', type: 'Base', style: 'Ninjutsu', origin: 'Unknown' },
  { id: 'miguel', name: 'Miguel', type: 'Base', style: 'Unorthodox Street Brawling', origin: 'Spain' },
  { id: 'negan', name: 'Negan', type: 'Guest', style: 'Lucille Bat Brutality', origin: 'USA (Walking Dead)' },
  { id: 'nina', name: 'Nina', type: 'Base', style: 'Assassination Martial Arts & Koppojutsu', origin: 'Ireland' },
  { id: 'noctis', name: 'Noctis', type: 'Guest', style: 'Lucian Royal Weapon Warping', origin: 'Lucis (Final Fantasy)' },
  { id: 'panda', name: 'Panda', type: 'Base', style: 'Heihachi Bear Karate', origin: 'China' },
  { id: 'paul', name: 'Paul', type: 'Base', style: 'Integrated Martial Arts based on Judo', origin: 'USA' },
  { id: 'shaheen', name: 'Shaheen', type: 'Base', style: 'Military Close Quarters Combat', origin: 'Saudi Arabia' },
  { id: 'steve', name: 'Steve', type: 'Base', style: 'Orthodox Boxing', origin: 'United Kingdom' },
  { id: 'xiaoyu', name: 'Xiaoyu', type: 'Base', style: 'Baguazhang & Piguazhang', origin: 'China' },
  { id: 'yoshimitsu', name: 'Yoshimitsu', type: 'Base', style: 'Advanced Manji Ninjutsu', origin: 'Japan' },
  { id: 'zafina', name: 'Zafina', type: 'DLC', style: 'Ancient Assassination Arts / Azazel', origin: 'Middle East' }
];

function getInitials(name: string): string {
  const parts = name.split(/[\s-]+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function computeHue(id: string): number {
  let h = 0;
  for (let k = 0; k < id.length; k++) {
    h = (h * 31 + id.charCodeAt(k)) % 360;
  }
  return h;
}

export const ROSTER: Fighter[] = RAW_ROSTER.map((c) => ({
  ...c,
  initials: getInitials(c.name),
  hue: computeHue(c.id),
}));

export const ROSTER_MAP: Record<string, Fighter> = ROSTER.reduce((acc, f) => {
  acc[f.id] = f;
  return acc;
}, {} as Record<string, Fighter>);
