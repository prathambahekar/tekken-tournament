import React from 'react';
import { ActiveTab, TournamentFormat } from '../types';
import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  playerCount: number;
  completedMatches: number;
  totalMatches: number;
  championName?: string | null;
  format?: TournamentFormat;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  playerCount,
  completedMatches,
  totalMatches,
  championName,
  format = 'double',
}) => {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'players', label: 'Players' },
    { id: 'rules', label: 'Rules' },
    { id: 'table', label: 'Points table' },
    { id: 'matches', label: 'Round robin' },
    { id: 'knockout', label: 'Knockout' },
  ];

  const formatText =
    format === 'single'
      ? `Single round robin for ${playerCount} players, then a top-4 knockout with a second chance.`
      : `Double round robin for ${playerCount} players, then a top-4 knockout with a second chance.`;

  return (
    <header className="w-full pt-3 sm:pt-6 pb-2 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Branding Section matching Tekken 7 Screenshot */}
        <div className="flex items-center sm:items-start justify-between gap-3 mb-2 sm:mb-4">
          <div className="space-y-1 select-none min-w-0">
            {/* TEKKEN 7 Logo */}
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black italic text-2xl sm:text-4xl text-[var(--text)] tracking-wider">
                TEKKEN
              </span>
              <span className="font-display font-black italic text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-500 to-[#e51b24] drop-shadow-[0_0_16px_rgba(229,27,36,0.65)] leading-none">
                7
              </span>
              <span className="inline-block bg-[#e51b24] text-white font-display font-black italic text-[10px] sm:text-xs uppercase px-2 sm:px-3 py-0.5 tracking-wider -skew-x-12 shadow-[0_0_12px_rgba(229,27,36,0.5)] ml-1">
                HOME TOURNAMENT
              </span>
            </div>

            {/* Desktop Subtitle */}
            <p className="hidden sm:block text-xs sm:text-sm text-[var(--text-3)] font-sans max-w-2xl leading-relaxed pt-0.5">
              {formatText}
            </p>

            {/* Mobile Tournament Badge Info */}
            <div className="flex sm:hidden items-center gap-2 text-[11px] text-[var(--text-3)] font-mono">
              <span>{playerCount} Fighters</span>
              <span>·</span>
              <span>{format === 'single' ? 'Single RR' : 'Double RR'}</span>
              {championName && (
                <>
                  <span>·</span>
                  <span className="text-[var(--amber)] font-bold">🏆 {championName}</span>
                </>
              )}
            </div>
          </div>

          {/* Theme Toggle Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg sm:rounded-md border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)] active:scale-95 flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text)] transition-all shadow-xs"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#ffb703]" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Bar matching Tekken 7 Screenshot (Desktop only - Mobile uses bottom nav) */}
        <nav
          aria-label="Tournament Navigation"
          className="hidden md:flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pt-1 select-none"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-display italic tracking-wide transition-all whitespace-nowrap rounded-t-xs sm:rounded-t-sm shrink-0 ${
                  isActive
                    ? 'bg-[#e51b24] text-white font-black shadow-[0_0_14px_rgba(229,27,36,0.55)] border-b-[3px] border-[#ffb703]'
                    : 'bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] border border-[var(--border)] border-b-transparent font-bold'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

