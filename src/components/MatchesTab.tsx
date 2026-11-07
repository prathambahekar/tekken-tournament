import React, { useState } from 'react';
import { MatchFixture, MatchResultValue, TournamentFormat } from '../types';
import { ROSTER_MAP } from '../data/roster';
import { FighterAvatar } from './FighterAvatar';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface MatchesTabProps {
  names: string[];
  chars: (string | null)[];
  fixtures: MatchFixture[];
  results: Record<string, MatchResultValue>;
  totalRounds: number;
  format?: TournamentFormat;
  onSetResult: (matchId: string, result: MatchResultValue | null) => void;
}

export const MatchesTab: React.FC<MatchesTabProps> = ({
  names,
  chars,
  fixtures,
  results,
  totalRounds,
  format = 'double',
  onSetResult,
}) => {
  const [activeRound, setActiveRound] = useState<number>(1);

  const totalMatches = fixtures.length;
  const playedCount = Object.keys(results).length;

  // Filter fixtures by active round
  const roundFixtures = fixtures.filter((f) => f.rd === activeRound);
  const isRoundComplete = roundFixtures.length > 0 && roundFixtures.every((f) => !!results[f.id]);

  // Determine resting player for this round (if odd player count)
  const activeRoundPlayers = new Set<number>();
  roundFixtures.forEach((f) => {
    activeRoundPlayers.add(f.a);
    activeRoundPlayers.add(f.b);
  });
  const restingPlayerIndex = names.findIndex((_, idx) => !activeRoundPlayers.has(idx));
  const restingPlayerName = restingPlayerIndex !== -1 ? names[restingPlayerIndex] : null;

  // Handle score toggle
  const handleScoreClick = (matchId: string, value: MatchResultValue) => {
    if (results[matchId] === value) {
      onSetResult(matchId, null); // Undo
    } else {
      onSetResult(matchId, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Section Container: Sharp 1px Border & Deep Black Background */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-4 sm:p-6 space-y-6">
        {/* Section Header with Numbered Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--text-3)] font-semibold tracking-wider">
                03 //
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-[var(--ink-strong)] uppercase tracking-tight">
                FIXTURES & ROUNDS
              </h2>
            </div>
            <p className="text-xs text-[var(--text-3)] font-mono tracking-wide">
              SECTION 03 &mdash; ROUND {String(activeRound).padStart(2, '0')} OF {String(totalRounds).padStart(2, '0')} &middot; {playedCount} OF {totalMatches} FIXTURES COMPLETED
            </p>
          </div>

          <div className="text-xs font-mono text-[var(--text-3)] tracking-wider">
            {format === 'single' ? 'SINGLE ROUND-ROBIN' : 'DOUBLE ROUND-ROBIN'}
          </div>
        </div>

        {/* Round Selector Bar: Sharp Technical Chips */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveRound((prev) => Math.max(1, prev - 1))}
            disabled={activeRound <= 1}
            className="w-9 h-9 border border-[var(--border)] bg-[var(--surface2)] text-[var(--text-2)] hover:text-[var(--text)] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors"
            title="Previous round"
            aria-label="Previous round"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar scroll-smooth">
            {Array.from({ length: totalRounds }, (_, i) => i + 1).map((r) => {
              const rFixtures = fixtures.filter((f) => f.rd === r);
              const rDone = rFixtures.length > 0 && rFixtures.every((f) => !!results[f.id]);
              const isActive = activeRound === r;

              return (
                <button
                  key={r}
                  onClick={() => setActiveRound(r)}
                  className={`min-w-[44px] h-9 px-2 border font-mono font-bold text-xs shrink-0 transition-colors flex items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)] font-black'
                      : rDone
                      ? 'bg-[var(--surface2)] text-[var(--ink-strong)] border-[var(--border2)]'
                      : 'bg-[var(--bg)] text-[var(--text-3)] hover:text-[var(--text)] border-[var(--border)]'
                  }`}
                  title={`Round ${r}${rDone ? ' (Finished)' : ''}`}
                >
                  <span>RD.{String(r).padStart(2, '0')}</span>
                  {rDone && <Check className="w-3 h-3 text-[var(--credit)]" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveRound((prev) => Math.min(totalRounds, prev + 1))}
            disabled={activeRound >= totalRounds}
            className="w-9 h-9 border border-[var(--border)] bg-[var(--surface2)] text-[var(--text-2)] hover:text-[var(--text)] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors"
            title="Next round"
            aria-label="Next round"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Round Status Subheader */}
        <div className="flex items-center justify-between gap-2 px-1 pb-1 border-b border-[var(--border)]/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--ink-strong)] tracking-wide">
              ROUND {String(activeRound).padStart(2, '0')} FIXTURES
            </span>
            <span className="text-[var(--text-3)]">·</span>
            {isRoundComplete ? (
              <span className="text-[var(--credit)] font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> ALL FIXTURES DECIDED
              </span>
            ) : (
              <span className="text-[var(--text-3)]">
                {roundFixtures.filter((f) => !!results[f.id]).length} OF {roundFixtures.length} SCORED
              </span>
            )}
          </div>

          {restingPlayerName && (
            <div className="text-[var(--text-2)]">
              <span className="text-[var(--text-3)]">BYE:</span> {restingPlayerName.toUpperCase()}
            </div>
          )}
        </div>

        {/* Match Cards List: Swiss Brutalist Technical Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {roundFixtures.map((fixture) => {
            const res = results[fixture.id]; // e.g. "a20", "a21", "b20", "b21"
            const winnerSide = res ? res[0] : null;

            const pA = {
              index: fixture.a,
              name: names[fixture.a] || `Player ${fixture.a + 1}`,
              fighter: chars[fixture.a] ? ROSTER_MAP[chars[fixture.a]!] : null,
            };

            const pB = {
              index: fixture.b,
              name: names[fixture.b] || `Player ${fixture.b + 1}`,
              fighter: chars[fixture.b] ? ROSTER_MAP[chars[fixture.b]!] : null,
            };

            return (
              <div
                key={fixture.id}
                className="p-3.5 border border-[var(--border)] bg-[var(--surface2)] space-y-3"
              >
                {/* Match ID Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-3)] border-b border-[var(--border)] pb-1.5">
                  <span className="tracking-widest uppercase">
                    MATCH {fixture.id.toUpperCase()}
                  </span>
                  <span>
                    {fixture.leg ? `LEG ${fixture.leg}` : 'SINGLE MATCH'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {/* Fighter A */}
                  <div
                    className={`p-3 border transition-colors flex flex-col justify-between gap-2.5 ${
                      winnerSide === 'a'
                        ? 'border-[var(--ink-strong)] bg-[var(--bg)]'
                        : winnerSide === 'b'
                        ? 'border-[var(--border)] opacity-60 bg-[var(--bg)]'
                        : 'border-[var(--border)] bg-[var(--bg)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FighterAvatar fighter={pA.fighter} name={pA.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-sm truncate text-[var(--ink-strong)] font-sans">
                          {pA.name}
                        </span>
                        {pA.fighter && (
                          <span className="block text-[11px] text-[var(--text-3)] truncate font-mono">
                            {pA.fighter.name}
                          </span>
                        )}
                      </div>
                      {winnerSide === 'a' && (
                        <span className="text-[9px] font-mono font-bold text-black bg-white px-1 py-0.5 shrink-0">
                          WIN
                        </span>
                      )}
                    </div>

                    {/* Score Buttons for A */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[var(--border)] font-mono">
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'a20')}
                        className={`min-h-[38px] px-2 text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                          res === 'a20'
                            ? 'bg-white text-black border-white'
                            : 'bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface3)] border-[var(--border)]'
                        }`}
                        title="Won 2-0 (+3 pts)"
                      >
                        <span>2–0</span>
                        <span className="text-[10px] opacity-60">(+3)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'a21')}
                        className={`min-h-[38px] px-2 text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                          res === 'a21'
                            ? 'bg-white text-black border-white'
                            : 'bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface3)] border-[var(--border)]'
                        }`}
                        title="Won 2-1 (+2 pts)"
                      >
                        <span>2–1</span>
                        <span className="text-[10px] opacity-60">(+2)</span>
                      </button>
                    </div>
                  </div>

                  {/* VS Badge */}
                  <div className="justify-self-center my-0 flex items-center justify-center">
                    <div className="w-8 h-8 border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center font-mono font-bold text-[10px] text-[var(--text-3)]">
                      VS
                    </div>
                  </div>

                  {/* Fighter B */}
                  <div
                    className={`p-3 border transition-colors flex flex-col justify-between gap-2.5 ${
                      winnerSide === 'b'
                        ? 'border-[var(--ink-strong)] bg-[var(--bg)]'
                        : winnerSide === 'a'
                        ? 'border-[var(--border)] opacity-60 bg-[var(--bg)]'
                        : 'border-[var(--border)] bg-[var(--bg)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FighterAvatar fighter={pB.fighter} name={pB.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-sm truncate text-[var(--ink-strong)] font-sans">
                          {pB.name}
                        </span>
                        {pB.fighter && (
                          <span className="block text-[11px] text-[var(--text-3)] truncate font-mono">
                            {pB.fighter.name}
                          </span>
                        )}
                      </div>
                      {winnerSide === 'b' && (
                        <span className="text-[9px] font-mono font-bold text-black bg-white px-1 py-0.5 shrink-0">
                          WIN
                        </span>
                      )}
                    </div>

                    {/* Score Buttons for B */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[var(--border)] font-mono">
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'b20')}
                        className={`min-h-[38px] px-2 text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                          res === 'b20'
                            ? 'bg-white text-black border-white'
                            : 'bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface3)] border-[var(--border)]'
                        }`}
                        title="Won 2-0 (+3 pts)"
                      >
                        <span>2–0</span>
                        <span className="text-[10px] opacity-60">(+3)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'b21')}
                        className={`min-h-[38px] px-2 text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                          res === 'b21'
                            ? 'bg-white text-black border-white'
                            : 'bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface3)] border-[var(--border)]'
                        }`}
                        title="Won 2-1 (+2 pts)"
                      >
                        <span>2–1</span>
                        <span className="text-[10px] opacity-60">(+2)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
