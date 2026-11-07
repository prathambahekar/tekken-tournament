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
  const tabs: { id: ActiveTab; num: string; label: string }[] = [
    { id: 'players', num: '01', label: 'ROSTER' },
    { id: 'rules', num: '02', label: 'PROTOCOL' },
    { id: 'table', num: '03', label: 'STANDINGS' },
    { id: 'matches', num: '04', label: 'MATCHES' },
    { id: 'knockout', num: '05', label: 'PLAYOFFS' },
  ];

  return (
    <header className="w-full pt-4 sm:pt-6 pb-2 border-b border-[var(--border)] transition-colors select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Minimalist Tech Header */}
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="space-y-1.5 min-w-0">
            {/* Swiss Brutalist Title */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-display font-black text-2xl sm:text-3xl text-[var(--ink-strong)] tracking-tighter uppercase">
                TEKKEN 7
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase px-1.5 py-0.5 border border-[var(--border2)] text-[var(--text)] tracking-widest">
                TOURNAMENT ENGINE
              </span>
              <span className="font-mono text-[10px] text-[var(--text-3)] uppercase tracking-wider hidden sm:inline">
                BUILD 7.0
              </span>
            </div>

            {/* Editorial Metadata Stream */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-3)] font-mono tracking-wide">
              <span>{playerCount} COMPETITORS</span>
              <span className="text-[var(--border2)]">/</span>
              <span>{completedMatches} OF {totalMatches} FIXTURES</span>
              <span className="text-[var(--border2)]">/</span>
              <span className="uppercase">{format === 'single' ? 'SINGLE ROUND-ROBIN' : 'DOUBLE ROUND-ROBIN'}</span>
              {championName && (
                <>
                  <span className="text-[var(--border2)]">/</span>
                  <span className="text-[var(--ink-strong)] font-bold">CHAMPION: {championName.toUpperCase()}</span>
                </>
              )}
            </div>
          </div>

          {/* Theme Switcher: Sharp Square Box */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)] active:scale-95 flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[var(--ink-strong)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--text)]" />
              )}
            </button>
          </div>
        </div>

        {/* Numbered Editorial Tab Bar (Desktop) */}
        <nav
          aria-label="Tournament Navigation"
          className="hidden md:flex items-center gap-0 overflow-x-auto no-scrollbar pt-1 select-none border-t border-[var(--border)]"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 text-xs font-mono tracking-wider transition-colors shrink-0 border-r border-[var(--border)] flex items-center gap-2 ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                    : 'bg-transparent text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
                }`}
              >
                <span className={isActive ? 'opacity-70' : 'text-[var(--text-3)]'}>[{tab.num}]</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
