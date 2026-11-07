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
    <div className="space-y-6">
      {/* Editorial Section Container: Sharp 1px Border & Deep Black Background */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-4 sm:p-6 space-y-6">
        {/* Section Header with Numbered Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--text-3)] font-semibold tracking-wider">
                02 //
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-[var(--ink-strong)] uppercase tracking-tight">
                TOURNAMENT STANDINGS
              </h2>
            </div>
            <p className="text-xs text-[var(--text-3)] font-mono tracking-wide">
              SECTION 02 &mdash; {playedMatches} OF {totalMatches} FIXTURES COMPLETED &middot; {isSingle ? 'SINGLE' : 'DOUBLE'} ROUND-ROBIN
            </p>
          </div>

          {/* View Mode Toggle: Sharp Square Segmented Control */}
          <div className="inline-flex border border-[var(--border)] bg-[var(--surface2)] text-xs font-mono self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 transition-colors inline-flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>[01] LEADERBOARD</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 transition-colors border-l border-[var(--border)] inline-flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>[02] CROSS MATRIX</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: Leaderboard Table & Mobile Cards */}
        {viewMode === 'table' && (
          <div className="space-y-4">
            {/* Mobile Format Switcher for Leaderboard */}
            <div className="sm:hidden flex items-center justify-between p-1 bg-[var(--surface2)] border border-[var(--border)] text-xs font-mono">
              <span className="text-[11px] text-[var(--text-3)] pl-2 uppercase">
                LAYOUT:
              </span>
              <div className="flex items-center border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setMobileLeaderboardMode('cards')}
                  className={`px-3 py-1 transition-colors ${
                    mobileLeaderboardMode === 'cards'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  CARDS
                </button>
                <button
                  type="button"
                  onClick={() => setMobileLeaderboardMode('table')}
                  className={`px-3 py-1 transition-colors border-l border-[var(--border)] ${
                    mobileLeaderboardMode === 'table'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  TABLE
                </button>
              </div>
            </div>

            {/* Mobile Mode: Leaderboard Cards */}
            {mobileLeaderboardMode === 'cards' && (
              <div className="sm:hidden space-y-2">
                {standings.map((row, index) => {
                  const isTop4 = index < 4;
                  const isLeader = index === 0 && row.p > 0;
                  const isCutoff = index === 3;

                  return (
                    <React.Fragment key={row.i}>
                      <div
                        className={`p-3 bg-[var(--surface2)] border transition-colors ${
                          isLeader
                            ? 'border-[var(--ink-strong)]'
                            : isTop4
                            ? 'border-[var(--border2)]'
                            : 'border-[var(--border)] opacity-85'
                        }`}
                      >
                        {/* Top: Rank + Avatar + Name + PTS */}
                        <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-[var(--border)]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Rank Badge: Square Monospace */}
                            <div
                              className={`w-7 h-7 flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                                index === 0
                                  ? 'bg-white text-black border-white'
                                  : isTop4
                                  ? 'border-[var(--border2)] text-[var(--ink-strong)]'
                                  : 'border-[var(--border)] text-[var(--text-3)]'
                              }`}
                            >
                              {row.status === 'Q' ? 'Q' : `#${index + 1}`}
                            </div>

                            <FighterAvatar fighter={row.fighter} name={row.name} size="sm" />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-[var(--ink-strong)] truncate">
                                  {row.name}
                                </span>
                                {isTop4 && (
                                  <span className="text-[9px] font-mono uppercase px-1 border border-[var(--border2)] text-[var(--ink-strong)] shrink-0">
                                    TOP 4
                                  </span>
                                )}
                              </div>
                              {row.fighter && (
                                <span className="text-[11px] text-[var(--text-3)] truncate block font-mono">
                                  {row.fighter.name} · {row.fighter.style}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Points Display */}
                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-lg text-[var(--ink-strong)] block leading-none tabular-nums">
                              {row.pts} <span className="text-xs font-normal text-[var(--text-3)]">PTS</span>
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Match Metrics Grid */}
                        <div className="grid grid-cols-4 gap-1 pt-2 text-center text-xs font-mono">
                          <div className="p-1 bg-[var(--bg)] border border-[var(--border)]">
                            <span className="text-[9px] text-[var(--text-3)] block uppercase">PLD</span>
                            <span className="font-bold text-[var(--text)] tabular-nums">{row.p}</span>
                          </div>
                          <div className="p-1 bg-[var(--bg)] border border-[var(--border)]">
                            <span className="text-[9px] text-[var(--text-3)] block uppercase">WON</span>
                            <span className="font-bold text-[var(--ink-strong)] tabular-nums">{row.w}</span>
                          </div>
                          <div className="p-1 bg-[var(--bg)] border border-[var(--border)]">
                            <span className="text-[9px] text-[var(--text-3)] block uppercase">LOST</span>
                            <span className="font-bold text-[var(--text-3)] tabular-nums">{row.l}</span>
                          </div>
                          <div className="p-1 bg-[var(--bg)] border border-[var(--border)]">
                            <span className="text-[9px] text-[var(--text-3)] block uppercase">DIFF</span>
                            <span className="font-bold text-[var(--text)] tabular-nums">
                              {row.diff > 0 ? `+${row.diff}` : row.diff}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Playoff Cutoff Indicator on Mobile */}
                      {isCutoff && standings.length > 4 && (
                        <div className="py-1 px-3 border border-dashed border-[var(--border2)] text-center text-[10px] font-mono uppercase tracking-widest text-[var(--text-2)]">
                          --- TOP 4 ADVANCE TO PLAYOFFS ---
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                <div className="p-3 bg-[var(--surface2)] border border-[var(--border)] text-[11px] font-mono text-[var(--text-3)] flex justify-between">
                  <span>WIN 2–0: <strong>+3 PTS</strong></span>
                  <span>WIN 2–1: <strong>+2 PTS</strong></span>
                  <span>LOSS: <strong>0 PTS</strong></span>
                </div>
              </div>
            )}

            {/* Desktop Table View & Mobile Full Table View: High-Contrast Monospace */}
            <div className={`${mobileLeaderboardMode === 'table' ? 'block' : 'hidden sm:block'} border border-[var(--border)] bg-[var(--bg)] overflow-hidden`}>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-sm border-collapse min-w-[340px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-xs font-mono text-[var(--text-3)] uppercase select-none tracking-wider">
                      <th className="py-2.5 px-3 text-center w-12 border-r border-[var(--border)]">#</th>
                      <th className="py-2.5 px-3 border-r border-[var(--border)]">COMPETITOR</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Played">P</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Wins">W</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Losses">L</th>
                      <th className="py-2.5 px-2 text-center border-r border-[var(--border)]" title="Round Differential">DIFF</th>
                      <th className="py-2.5 px-4 text-right font-bold text-[var(--ink-strong)]">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] font-mono">
                    {standings.map((row, index) => {
                      const isCutoff = index === 3;
                      const isTop4 = index < 4;
                      const isLeader = index === 0 && row.p > 0;

                      return (
                        <React.Fragment key={row.i}>
                          <tr
                            className={`transition-colors hover:bg-[var(--surface2)] ${
                              isTop4 ? 'bg-[var(--surface2)]/40' : ''
                            }`}
                          >
                            {/* Rank */}
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-xs border-r border-[var(--border)]">
                              {row.status === 'Q' ? (
                                <span className="font-bold text-[var(--ink-strong)]" title="Qualified">Q</span>
                              ) : row.status === 'DQ' ? (
                                <span className="text-[var(--text-3)] opacity-60" title="Eliminated">DQ</span>
                              ) : (
                                <span className={isLeader ? 'text-[var(--ink-strong)] font-black' : 'text-[var(--text-3)]'}>
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                              )}
                            </td>

                            {/* Player & Character */}
                            <td className="py-2.5 px-3 border-r border-[var(--border)]">
                              <div className="flex items-center gap-2.5">
                                <FighterAvatar fighter={row.fighter} name={row.name} size="xs" />
                                <div className="min-w-0">
                                  <span className="font-bold text-sm text-[var(--ink-strong)] truncate block font-sans">
                                    {row.name}
                                  </span>
                                  {row.fighter && (
                                    <span className="text-[11px] text-[var(--text-3)] truncate block font-mono">
                                      {row.fighter.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Stats */}
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs text-[var(--text)] border-r border-[var(--border)]">
                              {row.p}
                            </td>
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs font-bold text-[var(--ink-strong)] border-r border-[var(--border)]">
                              {row.w}
                            </td>
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs text-[var(--text-3)] border-r border-[var(--border)]">
                              {row.l}
                            </td>
                            <td className="py-2.5 px-2 text-center tabular-nums text-xs border-r border-[var(--border)]">
                              <span
                                className={
                                  row.diff > 0
                                    ? 'text-[var(--ink-strong)] font-bold'
                                    : 'text-[var(--text-3)]'
                                }
                              >
                                {row.diff > 0 ? `+${row.diff}` : row.diff}
                              </span>
                            </td>

                            {/* Points */}
                            <td className="py-2.5 px-4 text-right font-black text-sm tabular-nums text-[var(--ink-strong)]">
                              {row.pts}
                            </td>
                          </tr>

                          {/* Playoff cutoff banner */}
                          {isCutoff && standings.length > 4 && (
                            <tr className="border-y border-[var(--border2)]">
                              <td colSpan={7} className="p-0">
                                <div className="px-4 py-1.5 bg-[var(--surface3)] text-[10px] font-mono text-[var(--ink-strong)] uppercase tracking-widest text-center">
                                  --- ADVANCE TO PLAYOFF BRACKET (TOP 4 SEEDS) ---
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
              <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface2)] text-[11px] font-mono text-[var(--text-3)] flex items-center justify-between">
                <span>TOP 4 SEEDS QUALIFY FOR DOUBLE-ELIMINATION PLAYOFFS</span>
                <span>WIN 2–0 = 3 PTS &middot; WIN 2–1 = 2 PTS &middot; LOSS = 0 PTS</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Cross Grid with Mobile Zero-Scroll Options & Solid Table Lines */}
        {viewMode === 'grid' && (
          <div className="space-y-4">
            {/* Mobile Format Switcher */}
            <div className="sm:hidden flex items-center justify-between p-1 bg-[var(--surface2)] border border-[var(--border)] text-xs font-mono">
              <span className="text-[11px] text-[var(--text-3)] pl-2 uppercase">
                LAYOUT:
              </span>
              <div className="flex items-center border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setMobileGridMode('cards')}
                  className={`px-2.5 py-1 transition-colors ${
                    mobileGridMode === 'cards'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  H2H
                </button>
                <button
                  type="button"
                  onClick={() => setMobileGridMode('compact')}
                  className={`px-2.5 py-1 transition-colors border-l border-[var(--border)] ${
                    mobileGridMode === 'compact'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  FIT
                </button>
                <button
                  type="button"
                  onClick={() => setMobileGridMode('full')}
                  className={`px-2.5 py-1 transition-colors border-l border-[var(--border)] ${
                    mobileGridMode === 'full'
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                      : 'text-[var(--text-3)] hover:text-[var(--text)]'
                  }`}
                >
                  FULL
                </button>
              </div>
            </div>

            {/* Mobile Mode A: Zero-Scroll Head-to-Head Cards */}
            {mobileGridMode === 'cards' && (
              <div className="sm:hidden space-y-3">
                {/* Player Selector Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-[var(--text-3)] uppercase tracking-wider block">
                    SELECT COMPETITOR:
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                    {standings.map((p, idx) => {
                      const isSelected = p.i === selectedPlayerIdx;
                      return (
                        <button
                          key={p.i}
                          type="button"
                          onClick={() => setSelectedPlayerIdx(p.i)}
                          className={`px-2.5 py-1 border text-xs font-mono shrink-0 transition-colors flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)] font-bold'
                              : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]'
                          }`}
                        >
                          <span className="opacity-60">#{idx + 1}</span>
                          <span>{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Player Stats Summary Card */}
                {selectedPlayerRow && (
                  <div className="p-3 bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2.5">
                      <FighterAvatar fighter={selectedPlayerRow.fighter} name={selectedPlayerRow.name} size="sm" />
                      <div>
                        <span className="text-sm font-bold text-[var(--ink-strong)] block font-sans">
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
                      <span className="text-sm font-bold text-[var(--ink-strong)] block tabular-nums">
                        {selectedPlayerRow.pts} PTS
                      </span>
                      <span className="text-[10px] text-[var(--text-3)] block tabular-nums">
                        {selectedPlayerRow.w}W – {selectedPlayerRow.l}L ({selectedPlayerRow.p} PLD)
                      </span>
                    </div>
                  </div>
                )}

                {/* Head to Head Rival Cards */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">
                    HEAD-TO-HEAD VS RIVALS
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
                          className="p-3 bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-2.5 font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <FighterAvatar fighter={rival.fighter} name={rival.name} size="xs" />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-[var(--ink-strong)] truncate block font-sans">
                                  vs {rival.name}
                                </span>
                                {rival.fighter && (
                                  <span className="text-[10px] text-[var(--text-3)] truncate block">
                                    {rival.fighter.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-[var(--ink-strong)] tabular-nums">
                              +{totalPtsAgainstRival} PTS
                            </span>
                          </div>

                          {/* Match Badges */}
                          <div className={`grid ${isSingle ? 'grid-cols-1' : 'grid-cols-2'} gap-2 text-xs`}>
                            {/* Leg 1 */}
                            <div className="p-2 bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between">
                              <span className="text-[10px] text-[var(--text-3)] uppercase">{isSingle ? 'MATCH' : 'LEG 1'}</span>
                              {leg1 && leg1.played ? (
                                <span
                                  className={`px-2 py-0.5 border font-bold text-[11px] ${
                                    leg1.win
                                      ? 'border-[var(--ink-strong)] bg-white text-black'
                                      : 'border-[var(--border)] text-[var(--text-3)]'
                                  }`}
                                >
                                  {leg1.win ? 'WON' : 'LOST'} {leg1.score}
                                </span>
                              ) : (
                                <span className="text-[10px] text-[var(--text-3)]">PENDING</span>
                              )}
                            </div>

                            {/* Leg 2 */}
                            {!isSingle && (
                              <div className="p-2 bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between">
                                <span className="text-[10px] text-[var(--text-3)] uppercase">LEG 2</span>
                                {leg2 && leg2.played ? (
                                  <span
                                    className={`px-2 py-0.5 border font-bold text-[11px] ${
                                      leg2.win
                                        ? 'border-[var(--ink-strong)] bg-white text-black'
                                        : 'border-[var(--border)] text-[var(--text-3)]'
                                    }`}
                                  >
                                    {leg2.win ? 'WON' : 'LOST'} {leg2.score}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-[var(--text-3)]">PENDING</span>
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

            {/* Mobile Mode B: Compact Matrix */}
            {mobileGridMode === 'compact' && (
              <div className="sm:hidden border border-[var(--border)] bg-[var(--surface)] overflow-hidden font-mono">
                <table className="w-full text-center text-xs table-fixed border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-[10px] text-[var(--text-3)] uppercase font-bold">
                      <th className="py-2 px-1 text-left w-14 border-r border-[var(--border)]">PLR</th>
                      {standings.map((col, idx) => (
                        <th key={col.i} className="py-2 px-0.5 border-r border-[var(--border)] text-center">
                          #{idx + 1}
                        </th>
                      ))}
                      <th className="py-2 px-1 w-9 text-right text-[var(--ink-strong)]">
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {standings.map((row, rowIdx) => (
                      <tr key={row.i} className="hover:bg-[var(--surface2)]/40">
                        <td className="py-2 px-1 text-left truncate text-[11px] font-bold text-[var(--ink-strong)] border-r border-[var(--border)]">
                          <span className="text-[9px] text-[var(--text-3)] mr-1">#{rowIdx + 1}</span>
                          <span>{row.name.slice(0, 4)}</span>
                        </td>

                        {standings.map((col) => {
                          if (row.i === col.i) {
                            return (
                              <td key={col.i} className="p-0.5 bg-[var(--surface2)]/50 border-r border-[var(--border)]">
                                <span className="text-[9px] text-[var(--text-3)] opacity-30">\</span>
                              </td>
                            );
                          }

                          const h2h = getHeadToHeadResults(row.i, col.i);
                          const m1 = h2h[0];
                          const m2 = h2h[1];

                          return (
                            <td key={col.i} className="p-0.5 border-r border-[var(--border)] text-[9px] leading-tight">
                              <div className="flex flex-col items-center justify-center gap-0.5">
                                {m1?.played ? (
                                  <span className={`w-full py-0.5 font-bold ${m1.win ? 'bg-white text-black' : 'text-[var(--text-3)]'}`}>
                                    {m1.score.replace('–', '')}
                                  </span>
                                ) : (
                                  <span className="text-[var(--text-3)] opacity-30">—</span>
                                )}
                                {!isSingle && (
                                  m2?.played ? (
                                    <span className={`w-full py-0.5 font-bold ${m2.win ? 'bg-white text-black' : 'text-[var(--text-3)]'}`}>
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

                        <td className="py-2 px-1 font-bold text-[11px] text-right text-[var(--ink-strong)]">
                          {row.pts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Desktop Full Cross-Grid Table: Precision Technical Alignment */}
            <div className={`${mobileGridMode === 'full' ? 'block' : 'hidden sm:block'} border border-[var(--border)] bg-[var(--surface)] overflow-hidden font-mono`}>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-[var(--text-3)] uppercase select-none tracking-wider text-[11px]">
                      <th className="py-2.5 px-3 text-left font-bold sticky left-0 bg-[var(--surface2)] z-20 min-w-[140px] sm:min-w-[160px] border-r border-[var(--border)]">
                        COMPETITOR
                      </th>
                      {standings.map((colPlayer, idx) => (
                        <th
                          key={colPlayer.i}
                          className="py-2.5 px-2 font-bold min-w-[72px] sm:min-w-[80px] border-r border-[var(--border)]"
                          title={colPlayer.name}
                        >
                          <div className="truncate max-w-[70px] sm:max-w-[76px] mx-auto text-[var(--ink-strong)]">
                            #{idx + 1} {colPlayer.name.split(' ')[0]}
                          </div>
                        </th>
                      ))}
                      <th className="py-2.5 px-3 font-bold min-w-[50px] border-r border-[var(--border)]">
                        W-L
                      </th>
                      <th className="py-2.5 px-3 font-bold text-[var(--ink-strong)] min-w-[55px]">
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {standings.map((rowPlayer, rowIdx) => (
                      <tr key={rowPlayer.i} className="hover:bg-[var(--surface2)]/40 transition-colors">
                        <td className="py-2 px-3 text-left sticky left-0 bg-[var(--surface)] z-10 border-r border-[var(--border)]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--text-3)] w-4 text-center shrink-0">
                              {rowIdx + 1}
                            </span>
                            <FighterAvatar fighter={rowPlayer.fighter} name={rowPlayer.name} size="xs" />
                            <span className="font-bold text-xs truncate max-w-[85px] sm:max-w-[100px] text-[var(--ink-strong)] font-sans">
                              {rowPlayer.name}
                            </span>
                          </div>
                        </td>

                        {standings.map((colPlayer) => {
                          const isSelf = rowPlayer.i === colPlayer.i;

                          if (isSelf) {
                            return (
                              <td
                                key={colPlayer.i}
                                className="p-1 bg-[var(--surface2)]/60 border-r border-[var(--border)] select-none"
                              >
                                <div className="h-9 bg-[var(--bg)] flex items-center justify-center text-[var(--text-3)] text-xs opacity-40">
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
                              className="p-1 border-r border-[var(--border)] tabular-nums text-[11px]"
                            >
                              <div className="flex flex-col gap-1 justify-center items-center h-full min-h-[36px]">
                                {m1?.played ? (
                                  <span
                                    className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                                      m1.win
                                        ? 'bg-white text-black border-white'
                                        : 'text-[var(--text-3)] border-[var(--border)]'
                                    }`}
                                  >
                                    {m1.score}
                                  </span>
                                ) : (
                                  <span className="text-[var(--text-3)] opacity-40 text-[10px]">—</span>
                                )}

                                {!isSingle && (
                                  m2?.played ? (
                                    <span
                                      className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                                        m2.win
                                          ? 'bg-white text-black border-white'
                                          : 'text-[var(--text-3)] border-[var(--border)]'
                                      }`}
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

                        <td className="py-2 px-3 border-r border-[var(--border)] text-xs tabular-nums text-[var(--text)]">
                          {rowPlayer.w}–{rowPlayer.l}
                        </td>

                        <td className="py-2 px-3 font-black text-xs sm:text-sm tabular-nums text-[var(--ink-strong)]">
                          {rowPlayer.pts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cross Grid Footer Legend */}
              <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface2)] text-[11px] font-mono text-[var(--text-3)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="px-1 py-0.2 bg-white text-black text-[9px] font-bold">WIN</span>
                    <span>Direct Leg Victory</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[var(--text-3)] font-mono">—</span>
                    <span>Unplayed</span>
                  </span>
                </div>
                <span>{isSingle ? 'SINGLE ROUND: 1 HEAD-TO-HEAD MATCH' : 'DOUBLE ROUND: TOP = LEG 1 · BOTTOM = LEG 2'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
