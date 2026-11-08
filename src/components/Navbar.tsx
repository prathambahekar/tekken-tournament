import React from 'react';
import { ActiveTab } from '../types';
import { BookOpen, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
}) => {
  const tabs: { id: ActiveTab; num: string; label: string }[] = [
    { id: 'players', num: '01', label: 'ROSTER' },
    { id: 'table', num: '02', label: 'STANDINGS' },
    { id: 'matches', num: '03', label: 'MATCHES' },
    { id: 'knockout', num: '04', label: 'PLAYOFFS' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full pt-4 sm:pt-6 pb-2 bg-[var(--bg)]/95 backdrop-blur-md transition-colors select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Minimalist Tech Header */}
        <div className="flex items-start justify-between gap-3 pb-4">
          <div className="space-y-2 min-w-0">
            {/* Swiss Brutalist Title */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-display font-black text-2xl sm:text-3xl text-[var(--ink-strong)] tracking-tighter uppercase">
                TEKKEN 7
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase px-1.5 py-0.5 border border-[var(--accent-border-soft)] text-[var(--accent-ink)] tracking-widest">
                HOME TOURNAMENT
              </span>
            </div>

          </div>

          {/* Theme Switcher: Sharp Square Box */}
          <div className="shrink-0 flex items-center gap-2 pt-0.5">
            <button
              onClick={() => onTabChange('rules')}
              className={`w-9 h-9 border border-[var(--border)] flex items-center justify-center transition-colors ${
                activeTab === 'rules'
                  ? 'bg-[var(--accent-blue)] text-black border-[var(--accent-blue)]'
                  : 'bg-[var(--surface)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue-soft)]'
              }`}
              title="Open Protocol"
              aria-label="Open tournament protocol"
              aria-current={activeTab === 'rules' ? 'page' : undefined}
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 border border-[var(--accent-gold-border)] bg-[var(--accent-gold-soft)] hover:bg-[var(--accent-gold)] active:scale-95 flex items-center justify-center text-[var(--accent-gold-ink)] hover:text-black transition-colors"
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
          className="tekken-nav hidden md:flex items-center gap-0 overflow-x-auto no-scrollbar pt-1 select-none"
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
                    ? tab.id === 'players'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                      : tab.id === 'table'
                      ? 'bg-[var(--accent-blue)] text-black font-bold'
                      : tab.id === 'matches'
                      ? 'bg-[var(--accent-teal)] text-black font-bold'
                      : 'bg-[var(--accent-gold)] text-black font-bold'
                    : 'bg-transparent text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
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
