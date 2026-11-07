import React from 'react';
import { ActiveTab } from '../types';
import { Users, BookOpen, Trophy, Swords, GitBranch } from 'lucide-react';

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
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | boolean;
  }[] = [
    { id: 'players', label: 'Players', icon: Users },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'table', label: 'Standings', icon: Trophy },
    {
      id: 'matches',
      label: 'Matches',
      icon: Swords,
      badge:
        totalMatches > 0
          ? `${completedMatches}/${totalMatches}`
          : undefined,
    },
    {
      id: 'knockout',
      label: 'Playoffs',
      icon: GitBranch,
      badge: hasChampion ? '🏆' : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.15)] select-none"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#e51b24]'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              {/* Active Top Bar Indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#e51b24] rounded-b-sm shadow-[0_0_8px_rgba(229,27,36,0.8)]" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#e51b24]' : ''
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-mono font-bold px-1 rounded-full ${
                      tab.badge === '🏆'
                        ? 'bg-transparent text-sm -top-2'
                        : isActive
                        ? 'bg-[#e51b24] text-white'
                        : 'bg-[var(--surface3)] text-[var(--text-2)]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-display font-bold italic tracking-wide mt-1 leading-tight ${
                  isActive ? 'text-[var(--text)]' : 'text-[var(--text-3)]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
