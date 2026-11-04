import React from 'react';
import { TournamentFormat } from '../types';
import { Trophy, ShieldCheck, Flame, Scale, GitBranch } from 'lucide-react';

interface RulesTabProps {
  playerCount: number;
  format?: TournamentFormat;
}

export const RulesTab: React.FC<RulesTabProps> = ({ playerCount, format = 'double' }) => {
  const isSingle = format === 'single';
  const totalMatches = isSingle
    ? (playerCount * (playerCount - 1)) / 2
    : playerCount * (playerCount - 1);
  const totalRounds = isSingle
    ? playerCount + (playerCount % 2) - 1
    : 2 * (playerCount + (playerCount % 2) - 1);

  const rules = [
    {
      title: 'Match Format',
      icon: Flame,
      color: 'text-[var(--debit)]',
      content: 'First to 2 rounds (Best of 3 rounds) wins the match fixture. 60 seconds round timer on standard Tekken 7 settings.',
    },
    {
      title: 'Points System',
      icon: Trophy,
      color: 'text-[var(--amber)]',
      content: (
        <div className="space-y-1 text-xs text-[var(--text-2)]">
          <div className="flex items-center justify-between">
            <span>2–0 Sweep:</span>
            <span className="font-bold text-[var(--credit)]">+3 Pts</span>
          </div>
          <div className="flex items-center justify-between">
            <span>2–1 Close Win:</span>
            <span className="font-bold text-[var(--amber)]">+2 Pts</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Match Loss:</span>
            <span className="font-medium text-[var(--text-3)]">0 Pts</span>
          </div>
        </div>
      ),
    },
    {
      title: isSingle ? 'Single Round Robin' : 'Double Round Robin',
      icon: Scale,
      color: 'text-[var(--credit)]',
      content: isSingle
        ? `Each competitor plays every rival once (${totalMatches} total fixtures across ${totalRounds} rounds).`
        : `Each competitor plays every rival twice across Leg 1 and Leg 2 (${totalMatches} total fixtures across ${totalRounds} rounds).`,
    },
    {
      title: 'Tie-Breakers',
      icon: ShieldCheck,
      color: 'text-[var(--text)]',
      content: (
        <ol className="list-decimal list-inside space-y-0.5 text-xs text-[var(--text-2)]">
          <li>Championship Points (PTS)</li>
          <li>Match Victories (W)</li>
          <li>Round Difference (RD)</li>
          <li>Head-to-head record</li>
        </ol>
      ),
    },
    {
      title: 'Playoff Double-Elimination',
      icon: GitBranch,
      color: 'text-[var(--amber)]',
      content: 'Top 4 seeds qualify. Semifinal losers enter the lower bracket for a second chance to reach the Grand Final.',
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Tekken 7 Card Container */}
      <div className="bg-[var(--surface)] border border-[var(--border)] border-t-[3px] border-t-[#e51b24] rounded-lg p-4 sm:p-5 shadow-xl space-y-4">
        <div className="pb-2 border-b border-[var(--border)]/40">
          <h3 className="font-display font-black italic tracking-wider text-[#ffb703] uppercase text-base sm:text-lg">
            RULES
          </h3>
          <div className="text-xs text-[var(--text-3)] font-mono mt-0.5">
            Standard rules for {isSingle ? 'single round-robin' : 'double round-robin'} scoring and double-elimination playoffs
          </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[var(--surface)] space-y-2 border border-[var(--border)]"
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${rule.color}`} />
                <h3 className="font-display font-bold text-sm text-[var(--text)]">
                  {rule.title}
                </h3>
              </div>
              <div className="text-xs text-[var(--text-2)] leading-relaxed">
                {rule.content}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
