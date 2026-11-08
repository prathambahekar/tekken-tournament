import React from 'react';
import { ActiveTab } from '../types';
import { Users, Trophy, Swords, GitBranch } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  completedMatches: number;
  totalMatches: number;
  hasChampion: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  completedMatches,
  totalMatches,
  hasChampion,
}) => {
  const tabs: {
    id: ActiveTab;
    num: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | boolean;
  }[  ] = [
    { id: 'players', num: '01', label: 'Roster', icon: Users },
    { id: 'table', num: '02', label: 'Table', icon: Trophy },
    {
      id: 'matches',
      num: '03',
      label: 'Matches',
      icon: Swords,
      badge:
        totalMatches > 0
          ? `${completedMatches}/${totalMatches}`
          : undefined,
    },
    {
      id: 'knockout',
      num: '04',
      label: 'Playoffs',
      icon: GitBranch,
      badge: hasChampion ? 'WIN' : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-t border-[var(--border)] pb-safe select-none"
    >
      <div className="grid grid-cols-4 h-16 items-center divide-x divide-[var(--border)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
                isActive
                  ? 'bg-[var(--surface2)] text-[var(--ink-strong)]'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              {/* Active Top Line Indicator */}
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--ink-strong)]" />
              )}

              {/* Icon & Tech Badge */}
              <div className="relative flex items-center justify-center">
                <Icon className="w-4 h-4" />
                {tab.badge && (
                  <span
                    className={`absolute -top-2 -right-3 text-[8px] font-mono font-bold px-1 border ${
                      tab.badge === 'WIN'
                        ? 'border-[var(--ink-strong)] text-[var(--ink-strong)]'
                        : isActive
                        ? 'border-[var(--ink-strong)] bg-[var(--ink-strong)] text-[var(--accent-contrast)]'
                        : 'border-[var(--border2)] bg-[var(--surface3)] text-[var(--text-2)]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Minimalist Tech Label with Number */}
              <span className={`text-[10px] font-mono tracking-wider mt-1 leading-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
