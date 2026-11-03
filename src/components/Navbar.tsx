import React from 'react';
import { ActiveTab } from '../types';
import { Moon, Sun, Flame, Trophy, Users, Swords, Award, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  playerCount: number;
  completedMatches: number;
  totalMatches: number;
  championName?: string | null;
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
}) => {
  const tabs = [
    { id: 'players' as ActiveTab, label: 'Players', count: playerCount, icon: Users },
    { id: 'table' as ActiveTab, label: 'Standings', icon: Trophy },
    {
      id: 'matches' as ActiveTab,
      label: 'Round Robin',
      status: `${completedMatches}/${totalMatches}`,
      icon: Swords,
    },
    {
      id: 'knockout' as ActiveTab,
      label: 'Playoffs Bracket',
      badge: championName ? 'Champion' : undefined,
      icon: Award,
    },
    { id: 'rules' as ActiveTab, label: 'Rules Hub', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Flame className="w-5 h-5 fill-amber-200 text-amber-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-wider uppercase text-[var(--text)] whitespace-nowrap">
                Tekken 7 <span className="text-[var(--debit)]">Home</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-[var(--text-3)] -mt-1">
                Tournament Manager
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[var(--surface2)] text-[var(--text)] border border-[var(--border)] shadow-xs'
                      : 'text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--amber)]' : 'text-[var(--text-3)]'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-xs px-1.5 py-0.2 rounded-md bg-[var(--surface3)] text-[var(--text-2)] tabular-nums font-mono">
                      {tab.count}
                    </span>
                  )}
                  {tab.status !== undefined && (
                    <span className="text-xs px-1.5 py-0.2 rounded-md bg-[var(--surface3)] text-[var(--text-2)] tabular-nums font-mono">
                      {tab.status}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-[var(--credit-bg)] text-[var(--credit)] uppercase tracking-wider">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action / Theme Switch */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border2)] transition-colors"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 -mx-4 px-4 border-t border-[var(--border)] no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                    : 'bg-[var(--surface2)] text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
