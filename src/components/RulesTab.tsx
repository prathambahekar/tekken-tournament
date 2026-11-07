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
      num: '01',
      title: 'MATCH FORMAT (BEST OF 3)',
      icon: Flame,
      content: 'First to 2 rounds (Best of 3 rounds) wins the match fixture. Standard 60 seconds round timer on competitive Tekken 7 tournament regulations.',
    },
    {
      num: '02',
      title: 'POINTS ALLOCATION MATRIX',
      icon: Trophy,
      content: (
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-1">
            <span>2–0 CLEAN SWEEP:</span>
            <span className="font-bold text-white">+3 PTS</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-1">
            <span>2–1 DECISIVE WIN:</span>
            <span className="font-bold text-white">+2 PTS</span>
          </div>
          <div className="flex items-center justify-between">
            <span>MATCH LOSS:</span>
            <span className="text-[var(--text-3)]">0 PTS</span>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      title: isSingle ? 'SINGLE ROUND-ROBIN' : 'DOUBLE ROUND-ROBIN',
      icon: Scale,
      content: isSingle
        ? `Each competitor faces every rival once (${totalMatches} total fixtures across ${totalRounds} rounds). Direct head-to-head qualification.`
        : `Each competitor plays every rival twice across Leg 1 and Leg 2 (${totalMatches} total fixtures across ${totalRounds} rounds).`,
    },
    {
      num: '04',
      title: 'TIE-BREAKER PROTOCOL',
      icon: ShieldCheck,
      content: (
        <ol className="list-decimal list-inside space-y-1 text-xs font-mono text-[var(--text-2)]">
          <li>Championship Points (PTS)</li>
          <li>Total Match Victories (W)</li>
          <li>Round Difference (DIFF)</li>
          <li>Head-to-head record between tied competitors</li>
        </ol>
      ),
    },
    {
      num: '05',
      title: 'DOUBLE-ELIMINATION PLAYOFFS',
      icon: GitBranch,
      content: 'Top 4 seeds advance to the championship bracket. Semifinal losers enter the lower bracket for a second chance to contest the Grand Final.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Section Container: Sharp 1px Border & Deep Black Background */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--text-3)] font-semibold tracking-wider">
                05 //
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-[var(--ink-strong)] uppercase tracking-tight">
                TOURNAMENT PROTOCOL
              </h2>
            </div>
            <p className="text-xs text-[var(--text-3)] font-mono tracking-wide">
              SECTION 05 &mdash; COMPETITIVE REGULATIONS &middot; SCORING ARCHITECTURE &middot; TIEBREAK RULES
            </p>
          </div>

          <div className="text-xs font-mono text-[var(--text-3)] uppercase tracking-wider">
            {isSingle ? 'SINGLE ROUND RULES' : 'DOUBLE ROUND RULES'}
          </div>
        </div>

        {/* Numbered Rules Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.num}
                className="p-4 bg-[var(--surface2)] border border-[var(--border)] space-y-3 font-mono"
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white" />
                    <h3 className="font-bold text-xs text-[var(--ink-strong)] tracking-wider">
                      {rule.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-[var(--text-3)]">
                    RULE.{rule.num}
                  </span>
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
