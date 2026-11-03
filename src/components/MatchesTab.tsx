import React, { useState } from 'react';
import { MatchFixture, MatchResultValue } from '../types';
import { ROSTER_MAP } from '../data/roster';
import { FighterAvatar } from './FighterAvatar';
import { ChevronLeft, ChevronRight, CheckCircle, Sparkles, Filter } from 'lucide-react';

interface MatchesTabProps {
  names: string[];
  chars: (string | null)[];
  fixtures: MatchFixture[];
  results: Record<string, MatchResultValue>;
  totalRounds: number;
  onSetResult: (matchId: string, result: MatchResultValue | null) => void;
  onQuickSimulateRemaining: () => void;
}

export const MatchesTab: React.FC<MatchesTabProps> = ({
  names,
  chars,
  fixtures,
  results,
  totalRounds,
  onSetResult,
  onQuickSimulateRemaining,
}) => {
  const [activeRound, setActiveRound] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  const totalMatches = fixtures.length;
  const playedCount = Object.keys(results).length;
  const progressPercent = totalMatches > 0 ? Math.round((playedCount / totalMatches) * 100) : 0;

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight text-[var(--text)]">
            Round Robin
          </h2>
          <div className="flex items-center gap-2 text-xs text-[var(--text-3)] mt-0.5">
            <span>{playedCount} of {totalMatches} completed</span>
            <span aria-hidden="true">·</span>
            <span>{progressPercent}%</span>
            <span aria-hidden="true">·</span>
            <span>Leg {activeRound > totalRounds / 2 ? '2' : '1'} of 2</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onQuickSimulateRemaining}
            className="h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors inline-flex items-center gap-1.5"
            title="Auto-fill unplayed matches with simulated scores for testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Simulate Unplayed</span>
          </button>
        </div>
      </div>

      {/* Thin Progress Line */}
      <div className="h-1 w-full rounded-full bg-[var(--surface2)] overflow-hidden -mt-3">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Round Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((r) => {
          const rFixtures = fixtures.filter((f) => f.rd === r);
          const rDone = rFixtures.length > 0 && rFixtures.every((f) => !!results[f.id]);
          const isActive = activeRound === r;

          return (
            <button
              key={r}
              onClick={() => setActiveRound(r)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-semibold text-xs shrink-0 transition-all border ${
                isActive
                  ? 'bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)] shadow-2xs'
                  : rDone
                  ? 'bg-[var(--credit-bg)] text-[var(--credit)] border-[var(--credit-border)]'
                  : 'bg-[var(--surface)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border2)]'
              }`}
              title={`Round ${r}${rDone ? ' (Finished)' : ''}`}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Round Header & Resting Bye Notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <h3 className="font-display font-bold text-xl text-[var(--text)]">
            Round {activeRound}
          </h3>
          {isRoundComplete && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--credit-bg)] text-[var(--credit)] border border-[var(--credit-border)]">
              <CheckCircle className="w-3.5 h-3.5" /> All Recorded
            </span>
          )}
        </div>

        {restingPlayerName && (
          <div className="text-xs px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)]">
            <span className="font-semibold text-[var(--amber)]">Bye / Resting:</span> {restingPlayerName}
          </div>
        )}
      </div>

      {/* Match Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roundFixtures.map((fixture) => {
          const res = results[fixture.id]; // e.g. "a20", "a21", "b20", "b21"
          const winnerSide = res ? res[0] : null;
          const scoreType = res ? res.slice(1) : null;

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
              className={`p-4 rounded-2xl border transition-all shadow-xs ${
                res
                  ? 'bg-[var(--surface)] border-[var(--border2)]'
                  : 'bg-[var(--surface)] border-[var(--border)]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-3)] mb-3 pb-2 border-b border-[var(--border)]">
                <span>Fixture #{fixture.id}</span>
                <span>{res ? 'Score Recorded' : 'Awaiting Result'}</span>
              </div>

              {/* Fighter A vs Fighter B Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Fighter A */}
                <div
                  className={`p-3 rounded-xl border transition-all text-center flex flex-col justify-between gap-2.5 ${
                    winnerSide === 'a'
                      ? 'bg-[var(--credit-bg)] border-[var(--credit-border)] ring-1 ring-[var(--credit)]'
                      : winnerSide === 'b'
                      ? 'opacity-65 bg-[var(--surface2)] border-[var(--border)]'
                      : 'bg-[var(--surface2)] border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-left">
                    <FighterAvatar fighter={pA.fighter} name={pA.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-sm truncate text-[var(--text)]">
                        {pA.name}
                      </span>
                      <span className="block text-[11px] text-[var(--text-3)] truncate">
                        {pA.fighter ? pA.fighter.name : 'Unknown Fighter'}
                      </span>
                    </div>
                  </div>

                  {/* Score Buttons for A */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleScoreClick(fixture.id, 'a20')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        res === 'a20'
                          ? 'bg-[var(--credit)] text-white shadow-xs'
                          : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border2)]'
                      }`}
                      title="Won 2-0 (+3 points)"
                    >
                      Won 2–0
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScoreClick(fixture.id, 'a21')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        res === 'a21'
                          ? 'bg-[var(--credit)] text-white shadow-xs'
                          : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border2)]'
                      }`}
                      title="Won 2-1 (+2 points)"
                    >
                      Won 2–1
                    </button>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="justify-self-center my-1 sm:my-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface3)] border border-[var(--border)] flex items-center justify-center font-display font-extrabold text-[11px] text-[var(--debit)]">
                    VS
                  </div>
                </div>

                {/* Fighter B */}
                <div
                  className={`p-3 rounded-xl border transition-all text-center flex flex-col justify-between gap-2.5 ${
                    winnerSide === 'b'
                      ? 'bg-[var(--credit-bg)] border-[var(--credit-border)] ring-1 ring-[var(--credit)]'
                      : winnerSide === 'a'
                      ? 'opacity-65 bg-[var(--surface2)] border-[var(--border)]'
                      : 'bg-[var(--surface2)] border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-left">
                    <FighterAvatar fighter={pB.fighter} name={pB.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-sm truncate text-[var(--text)]">
                        {pB.name}
                      </span>
                      <span className="block text-[11px] text-[var(--text-3)] truncate">
                        {pB.fighter ? pB.fighter.name : 'Unknown Fighter'}
                      </span>
                    </div>
                  </div>

                  {/* Score Buttons for B */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleScoreClick(fixture.id, 'b20')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        res === 'b20'
                          ? 'bg-[var(--credit)] text-white shadow-xs'
                          : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border2)]'
                      }`}
                      title="Won 2-0 (+3 points)"
                    >
                      Won 2–0
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScoreClick(fixture.id, 'b21')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        res === 'b21'
                          ? 'bg-[var(--credit)] text-white shadow-xs'
                          : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border2)]'
                      }`}
                      title="Won 2-1 (+2 points)"
                    >
                      Won 2–1
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActiveRound((prev) => Math.max(1, prev - 1))}
          disabled={activeRound <= 1}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Round</span>
        </button>

        <span className="text-xs font-semibold text-[var(--text-3)] font-mono">
          Round {activeRound} of {totalRounds}
        </span>

        <button
          onClick={() => setActiveRound((prev) => Math.min(totalRounds, prev + 1))}
          disabled={activeRound >= totalRounds}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next Round</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
