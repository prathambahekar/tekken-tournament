import React, { useState } from 'react';
import { StandingsRow, MatchFixture, MatchResultValue } from '../types';
import { FighterAvatar } from './FighterAvatar';
import { Trophy, HelpCircle, Grid, Table2 } from 'lucide-react';

interface PointsTableTabProps {
  standings: StandingsRow[];
  fixtures: MatchFixture[];
  results: Record<string, MatchResultValue>;
  playerNames: string[];
}

export const PointsTableTab: React.FC<PointsTableTabProps> = ({
  standings,
  fixtures,
  results,
  playerNames,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('table');
  const totalMatches = fixtures.length;
  const playedMatches = Object.keys(results).length;
  const remainingMatches = totalMatches - playedMatches;
  const isComplete = remainingMatches === 0 && totalMatches > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight text-[var(--text)]">
            Standings
          </h2>
          <div className="flex items-center gap-2 text-xs text-[var(--text-3)] mt-0.5">
            {isComplete ? (
              <span className="text-[var(--credit)] font-semibold">
                All {totalMatches} fixtures concluded · Top 4 seeded to Playoffs
              </span>
            ) : (
              <>
                <span>{playedMatches} of {totalMatches} played</span>
                <span aria-hidden="true">·</span>
                <span>{remainingMatches} remaining</span>
                <span aria-hidden="true">·</span>
                <span>Top 4 qualify</span>
              </>
            )}
          </div>
        </div>

        {/* View Switcher: Table vs Cross Matrix */}
        <div className="inline-flex items-center p-0.5 bg-[var(--surface2)] rounded-lg border border-[var(--border)] self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'table'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--text-3)] hover:text-[var(--text)]'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'matrix'
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs'
                : 'text-[var(--text-3)] hover:text-[var(--text)]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Cross Grid Matrix</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Standings Table */
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface2)] text-xs uppercase tracking-wider text-[var(--text-3)] font-display font-bold select-none">
                  <th className="py-3 px-4 text-center w-14">#</th>
                  <th className="py-3 px-4 min-w-[200px]">Competitor</th>
                  <th className="py-3 px-3 text-center" title="Matches Played">P</th>
                  <th className="py-3 px-3 text-center" title="Matches Won">W</th>
                  <th className="py-3 px-3 text-center" title="Matches Lost">L</th>
                  <th className="py-3 px-3 text-center hidden md:table-cell" title="Win Rate">Win %</th>
                  <th className="py-3 px-3 text-center hidden sm:table-cell" title="Rounds For">RF</th>
                  <th className="py-3 px-3 text-center hidden sm:table-cell" title="Rounds Against">RA</th>
                  <th className="py-3 px-3 text-center" title="Round Differential">Diff</th>
                  <th className="py-3 px-5 text-right font-bold text-[var(--text)]">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] font-sans">
                {standings.map((row, index) => {
                  const isCutoff = index === 3;
                  const isPlayoffSpot = index < 4;
                  const isLeader = index === 0 && row.p > 0;
                  const winRate = row.p > 0 ? Math.round((row.w / row.p) * 100) : 0;

                  return (
                    <React.Fragment key={row.i}>
                      <tr
                        className={`transition-colors hover:bg-[var(--surface2)]/70 ${
                          isPlayoffSpot ? 'bg-[var(--amber-bg)]/20' : ''
                        }`}
                      >
                        {/* Rank / Status */}
                        <td className="py-3.5 px-4 text-center font-display font-bold">
                          {row.status === 'Q' ? (
                            <span
                              className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]"
                              title="Qualified for Knockout Playoffs"
                            >
                              Q
                            </span>
                          ) : row.status === 'DQ' ? (
                            <span
                              className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-[var(--debit-bg)] text-[var(--debit)] border border-[var(--debit-border)]"
                              title="Eliminated from Top 4"
                            >
                              DQ
                            </span>
                          ) : (
                            <span
                              className={`tabular-nums text-sm ${
                                isLeader ? 'text-[var(--amber)]' : 'text-[var(--text-3)]'
                              }`}
                            >
                              {index + 1}
                            </span>
                          )}
                        </td>

                        {/* Player Name and Fighter */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <FighterAvatar fighter={row.fighter} name={row.name} size="sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-sm text-[var(--text)] truncate">
                                  {row.name}
                                </span>
                                {isLeader && (
                                  <span className="text-xs text-[var(--amber)]" title="Tournament Leader">
                                    👑
                                  </span>
                                )}
                              </div>
                              {row.fighter && (
                                <span className="text-[11px] text-[var(--text-3)] truncate block leading-tight">
                                  {row.fighter.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* P / W / L */}
                        <td className="py-3.5 px-3 text-center tabular-nums text-[var(--text-2)]">
                          {row.p}
                        </td>
                        <td className="py-3.5 px-3 text-center tabular-nums font-semibold text-[var(--credit)]">
                          {row.w}
                        </td>
                        <td className="py-3.5 px-3 text-center tabular-nums text-[var(--text-3)]">
                          {row.l}
                        </td>

                        {/* Win % */}
                        <td className="py-3.5 px-3 text-center tabular-nums text-xs text-[var(--text-3)] hidden md:table-cell">
                          {row.p > 0 ? `${winRate}%` : '—'}
                        </td>

                        {/* RF / RA */}
                        <td className="py-3.5 px-3 text-center tabular-nums text-xs text-[var(--text-3)] hidden sm:table-cell">
                          {row.rf}
                        </td>
                        <td className="py-3.5 px-3 text-center tabular-nums text-xs text-[var(--text-3)] hidden sm:table-cell">
                          {row.ra}
                        </td>

                        {/* Diff */}
                        <td className="py-3.5 px-3 text-center tabular-nums font-semibold font-mono text-xs">
                          <span
                            className={
                              row.diff > 0
                                ? 'text-[var(--credit)]'
                                : row.diff < 0
                                ? 'text-[var(--debit)]'
                                : 'text-[var(--text-3)]'
                            }
                          >
                            {row.diff > 0 ? `+${row.diff}` : row.diff}
                          </span>
                        </td>

                        {/* Points */}
                        <td className="py-3.5 px-5 text-right font-display font-extrabold text-base tabular-nums text-[var(--amber)]">
                          {row.pts}
                        </td>
                      </tr>

                      {/* Cutoff Line indicator after rank 4 */}
                      {isCutoff && standings.length > 4 && (
                        <tr>
                          <td colSpan={10} className="p-0">
                            <div className="flex items-center justify-between px-4 py-1.5 bg-[var(--debit-bg)] border-y border-[var(--debit-border)] text-[11px] font-bold uppercase tracking-wider text-[var(--debit)]">
                              <span>▲ Top 4 Advance to Knockout Playoffs</span>
                              <span>▼ Elimination Zone</span>
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

          {/* Table Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-[var(--border)] bg-[var(--surface2)] text-xs text-[var(--text-3)]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]">
                  Q
                </span>{' '}
                Mathematically Qualified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-[var(--debit-bg)] text-[var(--debit)] border border-[var(--debit-border)]">
                  DQ
                </span>{' '}
                Eliminated from Top 4
              </span>
            </div>

            <div className="text-[11px]">
              Scoring: <span className="text-[var(--text)] font-semibold">2–0 Win = 3 Pts</span> ·{' '}
              <span className="text-[var(--text)] font-semibold">2–1 Win = 2 Pts</span> · Loss = 0 Pts
            </div>
          </div>
        </div>
      ) : (
        /* Cross Matrix Grid View */
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs overflow-x-auto">
          <div className="mb-3 text-xs text-[var(--text-2)] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[var(--amber)]" />
            <span>
              Cross Grid shows head-to-head match results between row player vs column player across both legs.
            </span>
          </div>

          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2.5 border border-[var(--border)] bg-[var(--surface2)] text-left font-display text-[var(--text-3)] text-[11px] font-bold uppercase tracking-wider min-w-[130px]">
                  Player
                </th>
                {playerNames.map((name, j) => (
                  <th
                    key={j}
                    className="p-2.5 border border-[var(--border)] bg-[var(--surface2)] text-center min-w-[90px] max-w-[120px]"
                    title={`#${j + 1} ${name}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="font-bold text-xs text-[var(--text)] truncate max-w-[100px] block">
                        {name}
                      </span>
                      <span className="text-[10px] text-[var(--text-3)] font-mono">
                        #{j + 1}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playerNames.map((rowName, i) => (
                <tr key={i} className="hover:bg-[var(--surface2)]/40 transition-colors">
                  <td className="p-2.5 border border-[var(--border)] bg-[var(--surface2)] text-left whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--text-3)] font-mono">
                        #{i + 1}
                      </span>
                      <span className="font-semibold text-xs text-[var(--text)]">
                        {rowName}
                      </span>
                    </div>
                  </td>
                  {playerNames.map((_, j) => {
                    if (i === j) {
                      return (
                        <td
                          key={j}
                          className="p-2 border border-[var(--border)] bg-[var(--surface3)]/50 text-[var(--text-3)] font-mono select-none"
                        >
                          —
                        </td>
                      );
                    }

                    // Find fixtures between i and j (min/max format)
                    const x = Math.min(i, j);
                    const y = Math.max(i, j);
                    const f1 = fixtures.find((f) => f.id === `${x}-${y}-1`);
                    const f2 = fixtures.find((f) => f.id === `${x}-${y}-2`);

                    const r1 = f1 ? results[f1.id] : undefined;
                    const r2 = f2 ? results[f2.id] : undefined;

                    const renderScore = (f: MatchFixture | undefined, res: MatchResultValue | undefined) => {
                      if (!res || !f) return <span className="text-[var(--text-3)]">·</span>;
                      const winnerIndex = res[0] === 'a' ? f.a : f.b;
                      const scoreStr = res.slice(1) === '21' ? '2–1' : '2–0';
                      const iWon = winnerIndex === i;
                      return (
                        <span
                          className={`font-semibold ${
                            iWon ? 'text-[var(--credit)]' : 'text-[var(--debit)]'
                          }`}
                        >
                          {iWon ? 'W' : 'L'} ({scoreStr})
                        </span>
                      );
                    };

                    return (
                      <td key={j} className="p-2 border border-[var(--border)] text-[11px] tabular-nums font-mono">
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <span className="leading-tight">{renderScore(f1, r1)}</span>
                          <span className="leading-tight">{renderScore(f2, r2)}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
