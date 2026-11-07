import React, { useState } from 'react';
import { MatchFixture, MatchResultValue, TournamentFormat } from '../types';
import { ROSTER_MAP } from '../data/roster';
import { FighterAvatar } from './FighterAvatar';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Tekken 7 Card Container */}
      <div className="bg-[var(--surface)] border border-[var(--border)] border-t-[3px] border-t-[#e51b24] rounded-lg p-4 sm:p-5 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-3 pb-2 border-b border-[var(--border)]/40">
          <div>
            <h3 className="font-display font-black italic tracking-wider text-[#ffb703] uppercase text-base sm:text-lg">
              ROUND ROBIN MATCHES
            </h3>
            <div className="text-xs text-[var(--text-3)] font-mono mt-0.5">
              {playedCount} of {totalMatches} completed &mdash; Round {activeRound} of {totalRounds}
            </div>
          </div>
        </div>

        {/* Round Selector Chips */}
        {/* Round Selector Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveRound((prev) => Math.max(1, prev - 1))}
            disabled={activeRound <= 1}
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg sm:rounded-md flex items-center justify-center bg-[var(--surface2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] active:bg-[var(--surface3)] disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-colors"
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
                  className={`min-w-[42px] sm:min-w-8 h-10 sm:h-8 px-2 rounded-lg sm:rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all active:scale-95 ${
                    isActive
                      ? 'bg-[#e51b24] text-white shadow-xs'
                      : rDone
                      ? 'bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]'
                      : 'bg-[var(--surface2)] text-[var(--text-3)] hover:text-[var(--text)] border border-[var(--border)]'
                  }`}
                  title={`Round ${r}${rDone ? ' (Finished)' : ''}`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveRound((prev) => Math.min(totalRounds, prev + 1))}
            disabled={activeRound >= totalRounds}
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg sm:rounded-md flex items-center justify-center bg-[var(--surface2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] active:bg-[var(--surface3)] disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-colors"
            title="Next round"
            aria-label="Next round"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Round Status & Bye Player Banner */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-[var(--text)]">
              Round {activeRound}
            </span>
            {isRoundComplete ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--credit-bg)] text-[var(--credit)]">
                <CheckCircle className="w-3 h-3" /> Done
              </span>
            ) : (
              <span className="text-xs text-[var(--text-3)] font-mono">
                {roundFixtures.filter((f) => !!results[f.id]).length}/{roundFixtures.length} scored
              </span>
            )}
          </div>

          {restingPlayerName && (
            <div className="text-xs text-[var(--text-2)]">
              <span className="text-[var(--amber)] font-medium">Resting:</span> {restingPlayerName}
            </div>
          )}
        </div>

        {/* Match Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xs transition-all space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2">
                  {/* Fighter A */}
                  <div
                    className={`p-2.5 rounded-lg transition-all flex flex-col justify-between gap-2 ${
                      winnerSide === 'a'
                        ? 'bg-[var(--credit-bg)] ring-1 ring-[var(--credit)]'
                        : winnerSide === 'b'
                        ? 'opacity-65 bg-[var(--surface2)]'
                        : 'bg-[var(--surface2)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FighterAvatar fighter={pA.fighter} name={pA.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-sm truncate text-[var(--text)]">
                          {pA.name}
                        </span>
                        {pA.fighter && (
                          <span className="block text-[11px] text-[var(--text-3)] truncate">
                            {pA.fighter.name}
                          </span>
                        )}
                      </div>
                      {winnerSide === 'a' && (
                        <span className="text-[10px] font-mono font-bold text-[var(--credit)] px-1.5 py-0.5 rounded bg-[var(--credit-bg)] shrink-0">
                          WIN
                        </span>
                      )}
                    </div>

                    {/* Score Buttons for A */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'a20')}
                        className={`min-h-[44px] sm:min-h-[34px] px-2 rounded-md text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 ${
                          res === 'a20'
                            ? 'bg-[var(--credit)] text-white shadow-xs'
                            : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface3)] border border-[var(--border)]'
                        }`}
                        title="Won 2-0 (+3 pts)"
                      >
                        <span>2–0</span>
                        <span className="text-[10px] opacity-75 font-mono">(+3)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'a21')}
                        className={`min-h-[44px] sm:min-h-[34px] px-2 rounded-md text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 ${
                          res === 'a21'
                            ? 'bg-[var(--credit)] text-white shadow-xs'
                            : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface3)] border border-[var(--border)]'
                        }`}
                        title="Won 2-1 (+2 pts)"
                      >
                        <span>2–1</span>
                        <span className="text-[10px] opacity-75 font-mono">(+2)</span>
                      </button>
                    </div>
                  </div>

                  {/* VS Badge */}
                  <div className="justify-self-center my-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-md bg-[var(--surface3)] flex items-center justify-center font-display font-bold text-[10px] text-[var(--debit)]">
                      VS
                    </div>
                  </div>

                  {/* Fighter B */}
                  <div
                    className={`p-2.5 rounded-lg transition-all flex flex-col justify-between gap-2 ${
                      winnerSide === 'b'
                        ? 'bg-[var(--credit-bg)] ring-1 ring-[var(--credit)]'
                        : winnerSide === 'a'
                        ? 'opacity-65 bg-[var(--surface2)]'
                        : 'bg-[var(--surface2)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FighterAvatar fighter={pB.fighter} name={pB.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-sm truncate text-[var(--text)]">
                          {pB.name}
                        </span>
                        {pB.fighter && (
                          <span className="block text-[11px] text-[var(--text-3)] truncate">
                            {pB.fighter.name}
                          </span>
                        )}
                      </div>
                      {winnerSide === 'b' && (
                        <span className="text-[10px] font-mono font-bold text-[var(--credit)] px-1.5 py-0.5 rounded bg-[var(--credit-bg)] shrink-0">
                          WIN
                        </span>
                      )}
                    </div>

                    {/* Score Buttons for B */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'b20')}
                        className={`min-h-[44px] sm:min-h-[34px] px-2 rounded-md text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 ${
                          res === 'b20'
                            ? 'bg-[var(--credit)] text-white shadow-xs'
                            : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface3)] border border-[var(--border)]'
                        }`}
                        title="Won 2-0 (+3 pts)"
                      >
                        <span>2–0</span>
                        <span className="text-[10px] opacity-75 font-mono">(+3)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScoreClick(fixture.id, 'b21')}
                        className={`min-h-[44px] sm:min-h-[34px] px-2 rounded-md text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 ${
                          res === 'b21'
                            ? 'bg-[var(--credit)] text-white shadow-xs'
                            : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface3)] border border-[var(--border)]'
                        }`}
                        title="Won 2-1 (+2 pts)"
                      >
                        <span>2–1</span>
                        <span className="text-[10px] opacity-75 font-mono">(+2)</span>
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
