import React, { useState } from 'react';
import { StandingsRow, MatchFixture, MatchResultValue, TournamentFormat } from '../types';
import { FighterAvatar } from './FighterAvatar';
import { LayoutGrid, ListOrdered } from 'lucide-react';

interface PointsTableTabProps {
  standings: StandingsRow[];
  fixtures: MatchFixture[];
  results: Record<string, MatchResultValue>;
  playerNames: string[];
  format?: TournamentFormat;
}

export const PointsTableTab: React.FC<PointsTableTabProps> = ({
  standings,
  fixtures,
  results,
  format = 'double',
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [mobileLeaderboardMode, setMobileLeaderboardMode] = useState<'cards' | 'table'>('cards');
  const [mobileGridMode, setMobileGridMode] = useState<'cards' | 'compact' | 'full'>('cards');
  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState<number>(() => {
    return standings[0]?.i ?? 0;
  });

  const totalMatches = fixtures.length;
  const playedMatches = Object.keys(results).length;
  const isSingle = format === 'single';

  // Helper to find match results between player A and player B sorted by round
  const getHeadToHeadResults = (playerA: number, playerB: number) => {
    const relevantFixtures = fixtures
      .filter((f) => (f.a === playerA && f.b === playerB) || (f.a === playerB && f.b === playerA))
      .sort((a, b) => a.rd - b.rd);

    return relevantFixtures.map((f) => {
      const res = results[f.id];
      if (!res) return { played: false, round: f.rd, win: false, score: '—', pts: 0 };

      const isAFirst = f.a === playerA;
      let win = false;
      let score = '—';
      let pts = 0;

      if (isAFirst) {
        if (res === 'a20') { win = true; score = '2–0'; pts = 3; }
        else if (res === 'a21') { win = true; score = '2–1'; pts = 2; }
        else if (res === 'b20') { win = false; score = '0–2'; pts = 0; }
        else if (res === 'b21') { win = false; score = '1–2'; pts = 0; }
      } else {
        if (res === 'b20') { win = true; score = '2–0'; pts = 3; }
        else if (res === 'b21') { win = true; score = '2–1'; pts = 2; }
        else if (res === 'a20') { win = false; score = '0–2'; pts = 0; }
        else if (res === 'a21') { win = false; score = '1–2'; pts = 0; }
      }

      return { played: true, round: f.rd, win, score, pts };
    });
  };

  const selectedPlayerRow = standings.find((s) => s.i === selectedPlayerIdx) || standings[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Tekken 7 Card Container */}
      <div className="bg-[var(--surface)] border border-[var(--border)] border-t-[3px] border-t-[#e51b24] rounded-lg p-4 sm:p-5 shadow-xl space-y-4">
        {/* Header with View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]/40">
          <div>
            <h3 className="font-display font-black italic tracking-wider text-[#ffb703] uppercase text-base sm:text-lg">
              POINTS TABLE
            </h3>
            <div className="text-xs text-[var(--text-3)] font-mono mt-0.5">
              {playedMatches} of {totalMatches} matches completed &mdash; {isSingle ? 'Single Round' : 'Double Round'}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex items-center p-0.5 bg-[var(--surface2)] rounded-md border border-[var(--border)] text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded transition-all inline-flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-[#e51b24] text-white font-bold shadow-xs'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded transition-all inline-flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-[#e51b24] text-white font-bold shadow-xs'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cross Grid</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: Leaderboard Table & Mobile Cards */}
        {viewMode === 'table' && (
          <div className="space-y-3">
            {/* Mobile Format Switcher for Leaderboard */}
            <div className="sm:hidden flex items-center justify-between p-1 bg-[var(--surface2)] rounded-lg border border-[var(--border)] text-xs">
              <span className="text-[11px] font-semibold text-[var(--text-3)] pl-2">
                Mobile View:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMobileLeaderboardMode('cards')}
                  className={`min-h-[34px] px-3 py-1 rounded-md font-semibold transition-all ${
                    mobileLeaderboardMode === 'cards'
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs border border-[var(--border)]'
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setMobileLeaderboardMode('table')}
                  className={`min-h-[34px] px-3 py-1 rounded-md font-semibold transition-all ${
                    mobileLeaderboardMode === 'table'
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs border border-[var(--border)]'
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  Full Table
                </button>
              </div>
            </div>

            {/* Mobile Mode: Leaderboard Cards */}
            {mobileLeaderboardMode === 'cards' && (
              <div className="sm:hidden space-y-2.5">
                {standings.map((row, index) => {
                  const isTop4 = index < 4;
                  const isLeader = index === 0 && row.p > 0;
                  const isCutoff = index === 3;

                  return (
                    <React.Fragment key={row.i}>
                      <div
                        className={`p-3 rounded-lg bg-[var(--surface)] border transition-all shadow-2xs ${
                          isLeader
                            ? 'border-[var(--amber)] ring-1 ring-[var(--amber)]/40'
                            : isTop4
                            ? 'border-[var(--border2)] bg-[var(--surface)]'
                            : 'border-[var(--border)] opacity-85'
                        }`}
                      >
                        {/* Top: Rank + Avatar + Name + PTS */}
                        <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-[var(--border)]/60">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Rank Badge */}
                            <div
                              className={`w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                index === 0
                                  ? 'bg-amber-400/20 text-[var(--amber)] border border-amber-400/40'
                                  : index === 1
                                  ? 'bg-zinc-300/20 text-zinc-300 border border-zinc-400/30'
                                  : index === 2
                                  ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30'
                                  : isTop4
                                  ? 'bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]'
                                  : 'bg-[var(--surface2)] text-[var(--text-3)] border border-[var(--border)]'
                              }`}
                            >
                              {row.status === 'Q' ? 'Q' : `#${index + 1}`}
                            </div>

                            <FighterAvatar fighter={row.fighter} name={row.name} size="sm" />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-[var(--text)] truncate">
                                  {row.name}
                                </span>
                                {isTop4 && (
                                  <span className="text-[9px] font-mono font-bold uppercase px-1 rounded bg-[var(--credit-bg)] text-[var(--credit)] shrink-0">
                                    Top 4
                                  </span>
                                )}
                              </div>
                              {row.fighter && (
                                <span className="text-[11px] text-[var(--text-3)] truncate block leading-tight">
                                  {row.fighter.name} · {row.fighter.style}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Points Display */}
                          <div className="text-right shrink-0">
                            <span className="font-display font-black text-base text-[var(--amber)] italic block leading-none">
                              {row.pts} <span className="text-xs font-mono font-normal not-italic text-[var(--text-3)]">PTS</span>
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Match Metrics Grid */}
                        <div className="grid grid-cols-4 gap-1.5 pt-2 text-center text-xs">
                          <div className="p-1 rounded bg-[var(--surface2)]/70">
                            <span className="text-[9px] text-[var(--text-3)] block font-mono">Played</span>
                            <span className="font-mono font-bold text-[var(--text)]">{row.p}</span>
                          </div>
                          <div className="p-1 rounded bg-[var(--surface2)]/70">
                            <span className="text-[9px] text-[var(--text-3)] block font-mono">Won</span>
                            <span className="font-mono font-bold text-[var(--credit)]">{row.w}</span>
                          </div>
                          <div className="p-1 rounded bg-[var(--surface2)]/70">
                            <span className="text-[9px] text-[var(--text-3)] block font-mono">Lost</span>
                            <span className="font-mono font-bold text-[var(--text-3)]">{row.l}</span>
                          </div>
                          <div className="p-1 rounded bg-[var(--surface2)]/70">
                            <span className="text-[9px] text-[var(--text-3)] block font-mono">Diff</span>
                            <span
                              className={`font-mono font-bold ${
                                row.diff > 0
                                  ? 'text-[var(--credit)]'
                                  : row.diff < 0
                                  ? 'text-[var(--debit)]'
                                  : 'text-[var(--text-3)]'
                              }`}
                            >
                              {row.diff > 0 ? `+${row.diff}` : row.diff}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Playoff Cutoff Indicator on Mobile */}
                      {isCutoff && standings.length > 4 && (
                        <div className="py-1 px-3 rounded-md bg-[var(--amber-bg)]/30 border border-[var(--amber-border)] text-center text-[10px] font-bold uppercase tracking-wider text-[var(--amber)]">
                          ▲ Top 4 Advance to Playoffs ▲
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                <div className="p-3 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[11px] text-[var(--text-3)] space-y-1">
                  <div className="flex justify-between">
                    <span>2–0 win: <strong className="text-[var(--credit)]">+3 pts</strong></span>
                    <span>2–1 win: <strong className="text-[var(--amber)]">+2 pts</strong></span>
                    <span>Loss: <strong className="text-[var(--text-3)]">0 pts</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Table View & Mobile Full Table View */}
            <div className={`${mobileLeaderboardMode === 'table' ? 'block' : 'hidden sm:block'} rounded-lg border border-[var(--border)] bg-[var(--surface2)]/40 overflow-hidden shadow-2xs`}>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-sm border-collapse min-w-[340px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-xs text-[var(--text-3)] font-semibold select-none">
                      <th className="py-2.5 px-3 text-center w-12 border-r border-[var(--border)]">#</th>
                      <th className="py-2.5 px-3 border-r border-[var(--border)]">Player</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Played">P</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Wins">W</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Losses">L</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Round Differential">Diff</th>
                      <th className="py-2.5 px-4 text-right font-bold text-[var(--text)]">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {standings.map((row, index) => {
                      const isCutoff = index === 3;
                      const isTop4 = index < 4;
                      const isLeader = index === 0 && row.p > 0;

                      return (
                        <React.Fragment key={row.i}>
                          <tr
                            className={`transition-colors hover:bg-[var(--surface2)]/60 ${
                              isTop4 ? 'bg-[var(--amber-bg)]/10' : ''
                            }`}
                          >
                            {/* Rank */}
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-xs border-r border-[var(--border)]">
                              {row.status === 'Q' ? (
                                <span className="text-[var(--credit)] font-bold" title="Qualified">Q</span>
                              ) : row.status === 'DQ' ? (
                                <span className="text-[var(--text-3)] opacity-60" title="Eliminated">DQ</span>
                              ) : (
                                <span className={isLeader ? 'text-[var(--amber)]' : 'text-[var(--text-3)]'}>
                                  {index + 1}
                                </span>
                              )}
                            </td>

                            {/* Player & Character */}
                            <td className="py-2.5 px-3 border-r border-[var(--border)]">
                              <div className="flex items-center gap-2.5">
                                <FighterAvatar fighter={row.fighter} name={row.name} size="xs" />
                                <div className="min-w-0">
                                  <span className="font-semibold text-sm text-[var(--text)] truncate block">
                                    {row.name}
                                  </span>
                                  {row.fighter && (
                                    <span className="text-[11px] text-[var(--text-3)] truncate block leading-tight">
                                      {row.fighter.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Stats */}
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs text-[var(--text-2)] font-mono border-r border-[var(--border)]">
                              {row.p}
                            </td>
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs font-semibold text-[var(--credit)] font-mono border-r border-[var(--border)]">
                              {row.w}
                            </td>
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs text-[var(--text-3)] font-mono border-r border-[var(--border)]">
                              {row.l}
                            </td>
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs font-mono border-r border-[var(--border)]">
                              <span
                                className={
                                  row.diff > 0
                                    ? 'text-[var(--credit)] font-semibold'
                                    : row.diff < 0
                                    ? 'text-[var(--debit)]'
                                    : 'text-[var(--text-3)]'
                                }
                              >
                                {row.diff > 0 ? `+${row.diff}` : row.diff}
                              </span>
                            </td>

                            {/* Points */}
                            <td className="py-2.5 px-4 text-right font-display font-extrabold text-sm tabular-nums text-[var(--amber)]">
                              {row.pts}
                            </td>
                          </tr>

                          {/* Playoff cutoff banner */}
                          {isCutoff && standings.length > 4 && (
                            <tr className="border-y-2 border-[var(--amber)]/40">
                              <td colSpan={7} className="p-0">
                                <div className="px-4 py-1.5 bg-[var(--surface2)] text-[10px] text-[var(--amber)] font-bold uppercase tracking-wider text-center">
                                  Top 4 Advance to Playoffs
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface2)] text-[11px] text-[var(--text-3)] flex items-center justify-between">
                <span>Top 4 qualify for double-elimination playoffs</span>
                <span>Win 2–0 = 3 pts · Win 2–1 = 2 pts · Loss = 0 pts</span>
              </div>
            </div>
          </div>
        )}

      {/* VIEW 2: Cross Grid with Mobile Zero-Scroll Options & Solid Table Lines */}
      {viewMode === 'grid' && (
        <div className="space-y-3">
          {/* Mobile Format Switcher */}
          <div className="sm:hidden flex items-center justify-between p-1 bg-[var(--surface2)] rounded-md border border-[var(--border)] text-xs">
            <span className="text-[11px] font-semibold text-[var(--text-3)] pl-2">
              Mobile View:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMobileGridMode('cards')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  mobileGridMode === 'cards'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                H2H Cards
              </button>
              <button
                type="button"
                onClick={() => setMobileGridMode('compact')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  mobileGridMode === 'compact'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                Fit Screen
              </button>
              <button
                type="button"
                onClick={() => setMobileGridMode('full')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  mobileGridMode === 'full'
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                Full Grid
              </button>
            </div>
          </div>

          {/* Mobile Mode A: Zero-Scroll Head-to-Head Cards */}
          {mobileGridMode === 'cards' && (
            <div className="sm:hidden space-y-3">
              {/* Player Selector Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-[var(--text-3)] px-1">
                  Select Competitor:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {standings.map((p, idx) => {
                    const isSelected = p.i === selectedPlayerIdx;
                    return (
                      <button
                        key={p.i}
                        type="button"
                        onClick={() => setSelectedPlayerIdx(p.i)}
                        className={`px-2.5 py-1 rounded-md border text-xs font-semibold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)] shadow-xs'
                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]'
                        }`}
                      >
                        <span className="font-mono text-[10px] opacity-75">#{idx + 1}</span>
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Player Stats Summary Card */}
              {selectedPlayerRow && (
                <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FighterAvatar fighter={selectedPlayerRow.fighter} name={selectedPlayerRow.name} size="sm" />
                    <div>
                      <span className="text-sm font-bold text-[var(--text)] block">
                        {selectedPlayerRow.name}
                      </span>
                      {selectedPlayerRow.fighter && (
                        <span className="text-[11px] text-[var(--text-3)] block">
                          {selectedPlayerRow.fighter.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-display font-bold text-[var(--amber)] block">
                      {selectedPlayerRow.pts} PTS
                    </span>
                    <span className="text-[10px] text-[var(--text-3)] font-mono block">
                      {selectedPlayerRow.w}W – {selectedPlayerRow.l}L ({selectedPlayerRow.p} played)
                    </span>
                  </div>
                </div>
              )}

              {/* Head to Head Rival Cards */}
              <div className="space-y-2">
                <div className="text-xs font-display font-bold uppercase tracking-wider text-[var(--text-3)] px-1">
                  Head-to-Head vs Rivals
                </div>
                {standings
                  .filter((rival) => rival.i !== selectedPlayerIdx)
                  .map((rival) => {
                    const h2h = getHeadToHeadResults(selectedPlayerIdx, rival.i);
                    const leg1 = h2h[0];
                    const leg2 = h2h[1];
                    const totalPtsAgainstRival = (leg1?.pts || 0) + (isSingle ? 0 : (leg2?.pts || 0));

                    return (
                      <div
                        key={rival.i}
                        className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <FighterAvatar fighter={rival.fighter} name={rival.name} size="xs" />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-[var(--text)] truncate block">
                                vs {rival.name}
                              </span>
                              {rival.fighter && (
                                <span className="text-[10px] text-[var(--text-3)] truncate block">
                                  {rival.fighter.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[var(--amber)]">
                            +{totalPtsAgainstRival} pts
                          </span>
                        </div>

                        {/* Match Badges (Single: 1 card, Double: 2 cards) */}
                        <div className={`grid ${isSingle ? 'grid-cols-1' : 'grid-cols-2'} gap-2 text-xs`}>
                          {/* Match / Leg 1 */}
                          <div className="p-2 rounded-md bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between">
                            <span className="text-[10px] text-[var(--text-3)] font-mono">{isSingle ? 'Match' : 'Leg 1'}</span>
                            {leg1 && leg1.played ? (
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                  leg1.win
                                    ? 'bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]'
                                    : 'bg-[var(--debit-bg)] text-[var(--debit)] border border-[var(--debit-border)]'
                                }`}
                              >
                                {leg1.win ? 'Won' : 'Lost'} {leg1.score}
                              </span>
                            ) : (
                              <span className="text-[10px] text-[var(--text-3)] italic">Pending</span>
                            )}
                          </div>

                          {/* Leg 2 (Only in Double) */}
                          {!isSingle && (
                            <div className="p-2 rounded-md bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between">
                              <span className="text-[10px] text-[var(--text-3)] font-mono">Leg 2</span>
                              {leg2 && leg2.played ? (
                                <span
                                  className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                    leg2.win
                                      ? 'bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]'
                                      : 'bg-[var(--debit-bg)] text-[var(--debit)] border border-[var(--debit-border)]'
                                  }`}
                                >
                                  {leg2.win ? 'Won' : 'Lost'} {leg2.score}
                                </span>
                              ) : (
                                <span className="text-[10px] text-[var(--text-3)] italic">Pending</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Mobile Mode B: Fit-Screen Compact Grid (With Solid Table Lines) */}
          {mobileGridMode === 'compact' && (
            <div className="sm:hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-2xs">
              <table className="w-full text-center text-xs table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-[10px] text-[var(--text-3)] font-mono font-bold">
                    <th className="py-2 px-1 text-left w-14 border-r border-[var(--border)]">Player</th>
                    {standings.map((col, idx) => (
                      <th key={col.i} className="py-2 px-0.5 border-r border-[var(--border)] text-center">
                        #{idx + 1}
                      </th>
                    ))}
                    <th className="py-2 px-1 w-9 text-right text-[var(--amber)]">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {standings.map((row, rowIdx) => (
                    <tr key={row.i} className="hover:bg-[var(--surface2)]/40">
                      {/* Name / Seed */}
                      <td className="py-2 px-1 text-left truncate text-[11px] font-bold text-[var(--text)] border-r border-[var(--border)]">
                        <span className="font-mono text-[9px] text-[var(--text-3)] mr-1">#{rowIdx + 1}</span>
                        <span>{row.name.slice(0, 4)}</span>
                      </td>

                      {/* Opponent columns */}
                      {standings.map((col) => {
                        if (row.i === col.i) {
                          return (
                            <td key={col.i} className="p-0.5 bg-[var(--surface2)]/50 border-r border-[var(--border)]">
                              <span className="text-[9px] text-[var(--text-3)] opacity-30 font-mono">\</span>
                            </td>
                          );
                        }

                        const h2h = getHeadToHeadResults(row.i, col.i);
                        const m1 = h2h[0];
                        const m2 = h2h[1];

                        return (
                          <td key={col.i} className="p-0.5 border-r border-[var(--border)] text-[9px] font-mono leading-tight">
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              {m1?.played ? (
                                <span className={`w-full py-0.5 rounded font-bold ${m1.win ? 'bg-[var(--credit-bg)] text-[var(--credit)]' : 'bg-[var(--debit-bg)] text-[var(--debit)]'}`}>
                                  {m1.score.replace('–', '')}
                                </span>
                              ) : (
                                <span className="text-[var(--text-3)] opacity-30">—</span>
                              )}
                              {!isSingle && (
                                m2?.played ? (
                                  <span className={`w-full py-0.5 rounded font-bold ${m2.win ? 'bg-[var(--credit-bg)] text-[var(--credit)]' : 'bg-[var(--debit-bg)] text-[var(--debit)]'}`}>
                                    {m2.score.replace('–', '')}
                                  </span>
                                ) : (
                                  <span className="text-[var(--text-3)] opacity-30">—</span>
                                )
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Points */}
                      <td className="py-2 px-1 font-mono font-bold text-[11px] text-right text-[var(--amber)]">
                        {row.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-2.5 border-t border-[var(--border)] bg-[var(--surface2)] text-[10px] text-[var(--text-3)] flex items-center justify-between">
                <span>{isSingle ? 'Single Round: Head-to-head match' : 'Top = Leg 1 · Bottom = Leg 2'}</span>
                <span className="font-semibold text-[var(--credit)]">Green: Win</span>
              </div>
            </div>
          )}

          {/* Full Grid Table (With Clear Solid Table Lines) */}
          <div className={`${mobileGridMode === 'full' ? 'block' : 'hidden sm:block'} rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-2xs`}>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-[var(--text-3)] select-none">
                    {/* Sticky Player Name Column Header */}
                    <th className="py-2.5 px-3 text-left font-semibold text-xs sticky left-0 bg-[var(--surface2)] z-20 min-w-[140px] sm:min-w-[160px] border-r border-[var(--border)] shadow-[1px_0_0_0_var(--border)]">
                      Player
                    </th>
                    {/* Column for each competitor */}
                    {standings.map((colPlayer, idx) => (
                      <th
                        key={colPlayer.i}
                        className="py-2.5 px-2 font-mono font-bold text-[11px] min-w-[72px] sm:min-w-[80px] border-r border-[var(--border)]"
                        title={colPlayer.name}
                      >
                        <div className="truncate max-w-[70px] sm:max-w-[76px] mx-auto text-[var(--text)]">
                          {idx + 1}. {colPlayer.name.split(' ')[0]}
                        </div>
                      </th>
                    ))}
                    {/* Totals */}
                    <th className="py-2.5 px-3 font-semibold min-w-[50px] border-r border-[var(--border)]">
                      W-L
                    </th>
                    <th className="py-2.5 px-3 font-bold text-[var(--amber)] min-w-[55px]">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {standings.map((rowPlayer, rowIdx) => (
                    <tr key={rowPlayer.i} className="hover:bg-[var(--surface2)]/40 transition-colors">
                      {/* Sticky Player Name Cell */}
                      <td className="py-2 px-3 text-left sticky left-0 bg-[var(--surface)] z-10 border-r border-[var(--border)] shadow-[1px_0_0_0_var(--border)]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[var(--text-3)] w-4 text-center shrink-0">
                            {rowIdx + 1}
                          </span>
                          <FighterAvatar fighter={rowPlayer.fighter} name={rowPlayer.name} size="xs" />
                          <span className="font-bold text-xs truncate max-w-[85px] sm:max-w-[100px] text-[var(--text)]">
                            {rowPlayer.name}
                          </span>
                        </div>
                      </td>

                      {/* Matrix Cells */}
                      {standings.map((colPlayer) => {
                        const isSelf = rowPlayer.i === colPlayer.i;

                        if (isSelf) {
                          return (
                            <td
                              key={colPlayer.i}
                              className="p-1 bg-[var(--surface2)]/60 border-r border-[var(--border)] select-none"
                              title="Same player"
                            >
                              <div className="h-9 rounded-md bg-[var(--surface3)]/50 flex items-center justify-center font-mono text-[var(--text-3)] text-xs opacity-40">
                                \
                              </div>
                            </td>
                          );
                        }

                        const h2h = getHeadToHeadResults(rowPlayer.i, colPlayer.i);
                        const m1 = h2h[0];
                        const m2 = h2h[1];

                        return (
                          <td
                            key={colPlayer.i}
                            className="p-1 border-r border-[var(--border)] tabular-nums font-mono text-[11px]"
                          >
                            <div className="flex flex-col gap-1 justify-center items-center h-full min-h-[36px]">
                              {/* Match 1 */}
                              {m1?.played ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-tight ${
                                    m1.win
                                      ? 'bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]'
                                      : 'bg-[var(--debit-bg)] text-[var(--debit)] border border-[var(--debit-border)]'
                                  }`}
                                  title={`${isSingle ? 'Match' : 'Leg 1'} (Rd ${m1.round}): ${m1.win ? 'Won' : 'Lost'} ${m1.score}`}
                                >
                                  {m1.score}
                                </span>
                              ) : (
                                <span className="text-[var(--text-3)] opacity-40 text-[10px]">—</span>
                              )}

                              {/* Match 2 (Only in Double Round Robin) */}
                              {!isSingle && (
                                m2?.played ? (
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-tight ${
                                      m2.win
                                        ? 'bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]'
                                        : 'bg-[var(--debit-bg)] text-[var(--debit)] border border-[var(--debit-border)]'
                                    }`}
                                    title={`Leg 2 (Rd ${m2.round}): ${m2.win ? 'Won' : 'Lost'} ${m2.score}`}
                                  >
                                    {m2.score}
                                  </span>
                                ) : (
                                  <span className="text-[var(--text-3)] opacity-40 text-[10px]">—</span>
                                )
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Record W-L */}
                      <td className="py-2 px-3 border-r border-[var(--border)] font-mono text-xs tabular-nums text-[var(--text-2)]">
                        {rowPlayer.w}–{rowPlayer.l}
                      </td>

                      {/* Total Points */}
                      <td className="py-2 px-3 font-display font-extrabold text-xs sm:text-sm tabular-nums text-[var(--amber)]">
                        {rowPlayer.pts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cross Grid Footer Legend */}
            <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface2)] text-[11px] text-[var(--text-3)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[var(--credit)] inline-block"></span>
                  <span>Win (Green)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[var(--debit)] inline-block"></span>
                  <span>Loss (Red)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[var(--text-3)] font-mono">—</span>
                  <span>Unplayed</span>
                </span>
              </div>
              <span>{isSingle ? 'Single round-robin shows direct match result' : 'Leg 1 (top badge) · Leg 2 (bottom badge)'}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
