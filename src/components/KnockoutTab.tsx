import React, { useEffect } from 'react';
import { StandingsRow, KnockoutMatchId } from '../types';
import { FighterAvatar } from './FighterAvatar';
import { computeKnockout } from '../utils/tournament';
import confetti from 'canvas-confetti';
import { Trophy, Award, Lock, Unlock, Copy, Check, AlertCircle } from 'lucide-react';

interface KnockoutTabProps {
  standings: StandingsRow[];
  koResults: Record<KnockoutMatchId, number | null>;
  isRoundRobinComplete: boolean;
  totalMatches: number;
  remainingMatches: number;
  previewMode: boolean;
  onTogglePreviewMode: () => void;
  onSelectWinner: (matchId: KnockoutMatchId, playerIndex: number) => void;
  onResetKnockout: () => void;
}

interface MatchPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const KnockoutTab: React.FC<KnockoutTabProps> = ({
  standings,
  koResults,
  isRoundRobinComplete,
  remainingMatches,
  previewMode,
  onTogglePreviewMode,
  onSelectWinner,
  onResetKnockout,
}) => {
  const isUnlocked = isRoundRobinComplete || previewMode;
  const ko = computeKnockout(standings, koResults);

  const grandFinal = ko.f;
  const championIndex = grandFinal.winner;
  const runnerUpIndex = grandFinal.loser;

  const championStandingsRow = championIndex != null ? standings.find((s) => s.i === championIndex) : null;
  const runnerUpStandingsRow = runnerUpIndex != null ? standings.find((s) => s.i === runnerUpIndex) : null;

  // Trigger victory confetti when champion is crowned
  useEffect(() => {
    if (championIndex != null) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#e8141c', '#f5b81c', '#26b24f', '#ffffff'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [championIndex]);

  const [copied, setCopied] = React.useState(false);

  const handleCopyRecap = () => {
    if (!championStandingsRow) return;
    const text = `🏆 TEKKEN 7 TOURNAMENT RESULTS 🏆\n` +
      `🥇 Champion: ${championStandingsRow.name} (${championStandingsRow.fighter?.name || 'Fighter'})\n` +
      (runnerUpStandingsRow ? `🥈 Runner-Up: ${runnerUpStandingsRow.name} (${runnerUpStandingsRow.fighter?.name || 'Fighter'})\n` : '') +
      `Playoffs: Double Elimination (Top 4 Seeds)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlayerDetails = (playerIndex: number | null) => {
    if (playerIndex == null) return null;
    const found = standings.find((s) => s.i === playerIndex);
    return {
      index: playerIndex,
      name: found ? found.name : `Player ${playerIndex + 1}`,
      fighter: found?.fighter || null,
    };
  };

  // Fixed coordinate system for SVG connector lines and match cards
  const CARD_W = 210;
  const CARD_H = 126;
  const CANVAS_W = 1040;
  const CANVAS_H = 460;

  const POSITIONS: Record<KnockoutMatchId, MatchPosition> = {
    m1: { x: 20, y: 35, w: CARD_W, h: CARD_H },
    m2: { x: 20, y: 275, w: CARD_W, h: CARD_H },
    w: { x: 285, y: 65, w: CARD_W, h: CARD_H },
    l: { x: 285, y: 275, w: CARD_W, h: CARD_H },
    r: { x: 550, y: 185, w: CARD_W, h: CARD_H },
    f: { x: 810, y: 125, w: CARD_W, h: CARD_H },
  };

  // Helper to calculate exact exit point on the source card
  const getExitPoint = (sourceId: KnockoutMatchId, type: 'w' | 'l') => {
    const pos = POSITIONS[sourceId];
    const match = ko[sourceId];
    const p0 = match.players[0];
    const p1 = match.players[1];
    const winner = match.winner;

    let slotY = pos.y + pos.h / 2; // default midpoint

    if (winner !== null && p0 !== null && p1 !== null) {
      if (type === 'w') {
        slotY = winner === p0 ? pos.y + 50 : pos.y + 95;
      } else {
        slotY = winner === p0 ? pos.y + 95 : pos.y + 50;
      }
    } else {
      slotY = type === 'w' ? pos.y + 50 : pos.y + 95;
    }

    return { x: pos.x + pos.w, y: slotY };
  };

  // Helper to calculate entry point into target card slot
  const getEntryPoint = (targetId: KnockoutMatchId, slot: 0 | 1) => {
    const pos = POSITIONS[targetId];
    const slotY = slot === 0 ? pos.y + 50 : pos.y + 95;
    return { x: pos.x, y: slotY };
  };

  // Connectors list
  const CONNECTOR_LINKS: Array<{
    id: string;
    from: KnockoutMatchId;
    to: KnockoutMatchId;
    targetSlot: 0 | 1;
    type: 'w' | 'l';
    isActive: boolean;
  }> = [
    {
      id: 'm1-w',
      from: 'm1',
      to: 'w',
      targetSlot: 0,
      type: 'w',
      isActive: ko.m1.winner !== null,
    },
    {
      id: 'm2-w',
      from: 'm2',
      to: 'w',
      targetSlot: 1,
      type: 'w',
      isActive: ko.m2.winner !== null,
    },
    {
      id: 'm1-l',
      from: 'm1',
      to: 'l',
      targetSlot: 0,
      type: 'l',
      isActive: ko.m1.loser !== null,
    },
    {
      id: 'm2-l',
      from: 'm2',
      to: 'l',
      targetSlot: 1,
      type: 'l',
      isActive: ko.m2.loser !== null,
    },
    {
      id: 'l-r',
      from: 'l',
      to: 'r',
      targetSlot: 0,
      type: 'w',
      isActive: ko.l.winner !== null,
    },
    {
      id: 'w-r',
      from: 'w',
      to: 'r',
      targetSlot: 1,
      type: 'l',
      isActive: ko.w.loser !== null,
    },
    {
      id: 'w-f',
      from: 'w',
      to: 'f',
      targetSlot: 0,
      type: 'w',
      isActive: ko.w.winner !== null,
    },
    {
      id: 'r-f',
      from: 'r',
      to: 'f',
      targetSlot: 1,
      type: 'w',
      isActive: ko.r.winner !== null,
    },
  ];

  const renderSlot = (
    matchId: KnockoutMatchId,
    playerIndex: number | null,
    slotIndex: number,
    winner: number | null
  ) => {
    const details = getPlayerDetails(playerIndex);
    const isWinner = winner != null && winner === playerIndex;
    const isLoser = winner != null && winner !== playerIndex && playerIndex != null;
    const isClickable = isUnlocked && playerIndex != null;

    if (!details) {
      return (
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[var(--surface2)]/40 border border-dashed border-[var(--border)] text-xs text-[var(--text-3)] italic select-none">
          <span>TBD</span>
          <span className="text-[9px] uppercase font-mono">Slot {slotIndex + 1}</span>
        </div>
      );
    }

    return (
      <button
        type="button"
        disabled={!isClickable}
        onClick={() => onSelectWinner(matchId, details.index)}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all ${
          isWinner
            ? 'bg-[var(--credit-bg)] border-[var(--credit-border)] ring-1 ring-[var(--credit)] text-[var(--text)] font-bold'
            : isLoser
            ? 'opacity-55 bg-[var(--surface2)] border-[var(--border)] text-[var(--text-3)] line-through'
            : 'bg-[var(--surface2)] border-[var(--border)] hover:border-[var(--border2)] hover:bg-[var(--surface3)] text-[var(--text)]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FighterAvatar fighter={details.fighter} name={details.name} size="xs" />
          <div className="min-w-0">
            <span className="block text-xs font-semibold truncate leading-tight">
              {details.name}
            </span>
            <span className="block text-[10px] text-[var(--text-3)] truncate leading-tight">
              {details.fighter ? details.fighter.name : 'Unknown Fighter'}
            </span>
          </div>
        </div>

        {isWinner && (
          <span className="text-xs font-bold text-[var(--credit)] ml-1">✓</span>
        )}
      </button>
    );
  };

  const renderCard = (id: KnockoutMatchId) => {
    const match = ko[id];
    const pos = POSITIONS[id];
    const isFinal = id === 'f';
    const isWinners = id === 'w';
    const isLosers = id === 'l';
    const isSecondChance = id === 'r';

    let cardBorder = 'border-[var(--border)]';
    let titleColor = 'text-[var(--text)]';
    let subtitleColor = 'text-[var(--text-3)]';

    if (isFinal) {
      cardBorder = 'border-2 border-[var(--amber)] shadow-md';
      titleColor = 'text-[var(--amber)] font-bold';
      subtitleColor = 'text-[var(--amber)]';
    } else if (isWinners) {
      cardBorder = 'border-[var(--credit-border)]';
      titleColor = 'text-[var(--credit)]';
      subtitleColor = 'text-[var(--credit)]';
    } else if (isLosers) {
      cardBorder = 'border-[var(--debit-border)]';
      titleColor = 'text-[var(--debit)]';
      subtitleColor = 'text-[var(--debit)]';
    } else if (isSecondChance) {
      cardBorder = 'border-[var(--amber-border)]';
      titleColor = 'text-[var(--amber)]';
      subtitleColor = 'text-[var(--amber)]';
    }

    return (
      <div
        key={id}
        style={{
          position: 'absolute',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.w}px`,
          height: `${pos.h}px`,
        }}
        className={`p-2.5 rounded-xl bg-[var(--surface)] shadow-xs flex flex-col justify-between select-none z-10 ${cardBorder}`}
      >
        <div className="flex items-center justify-between text-[10px] font-mono pb-1 border-b border-[var(--border)]">
          <span className={`font-bold truncate ${titleColor}`}>
            {isFinal && <Trophy className="w-3 h-3 inline mr-1 -mt-0.5" />}
            {match.title}
          </span>
          <span className={`truncate ${subtitleColor}`}>{match.subtitle}</span>
        </div>
        <div className="space-y-1 mt-1">
          {renderSlot(id, match.players[0], 0, match.winner)}
          {renderSlot(id, match.players[1], 1, match.winner)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight text-[var(--text)]">
            Playoffs Bracket
          </h2>
          <div className="flex items-center gap-2 text-xs text-[var(--text-3)] mt-0.5">
            <span>Double-Elimination</span>
            <span aria-hidden="true">·</span>
            <span>Top 4 Seeds</span>
            <span aria-hidden="true">·</span>
            <span>Grand Final Decider</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isRoundRobinComplete && (
            <button
              onClick={onTogglePreviewMode}
              className={`h-9 px-3 rounded-lg text-xs font-medium border transition-colors inline-flex items-center gap-1.5 ${
                previewMode
                  ? 'bg-[var(--amber-bg)] text-[var(--amber)] border-[var(--amber-border)]'
                  : 'bg-[var(--surface)] text-[var(--text-2)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {previewMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{previewMode ? 'Preview Active' : 'Unlock Preview'}</span>
            </button>
          )}

          {Object.values(koResults).some((v) => v !== null) && (
            <button
              onClick={onResetKnockout}
              className="h-9 px-3 rounded-lg text-xs font-medium border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--debit)] transition-colors"
            >
              Reset Bracket
            </button>
          )}
        </div>
      </div>

      {/* Lock Notice if not complete and preview not enabled */}
      {!isUnlocked && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--amber-border)] text-[var(--text-2)] text-xs">
          <AlertCircle className="w-4 h-4 text-[var(--amber)] shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-[var(--text)]">Round robin in progress:</span>{' '}
            Complete all {remainingMatches} remaining matches to lock in playoff seeding, or tap "Unlock Preview" to test the bracket.
          </div>
        </div>
      )}

      {/* Champion Crowning Celebration Banner */}
      {championStandingsRow && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[var(--surface)] to-red-500/15 border-2 border-[var(--amber)] shadow-md animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Trophy className="w-8 h-8 fill-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[var(--amber)]">
                  Tournament Champion
                </span>
                <h3 className="text-xl font-display font-extrabold text-[var(--text)]">
                  {championStandingsRow.name}
                </h3>
                <p className="text-xs text-[var(--text-2)]">
                  Fighter:{' '}
                  <span className="font-semibold text-[var(--text)]">
                    {championStandingsRow.fighter?.name || 'Mystery Fighter'}
                  </span>{' '}
                  ({championStandingsRow.fighter?.style || 'Martial Arts'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {runnerUpStandingsRow && (
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-[var(--text-3)] block uppercase tracking-wider font-semibold">
                    Runner-Up
                  </span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    {runnerUpStandingsRow.name}
                  </span>
                </div>
              )}
              <button
                onClick={handleCopyRecap}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)] shadow-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[var(--credit)]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Results'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bracket Canvas with SVG Connector Strings */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-x-auto no-scrollbar">
        {/* Column Stage Headers */}
        <div className="min-w-[1040px] grid grid-cols-4 gap-6 pb-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)] select-none">
          <div className="pl-5">01 · Opening Semifinals</div>
          <div className="pl-5">02 · Winners & Losers</div>
          <div className="pl-5">03 · Losers Final</div>
          <div className="pl-5 text-[var(--amber)]">04 · Grand Final</div>
        </div>

        {/* Diagram Flow Stage with Attached Connector Strings */}
        <div
          className="relative min-w-[1040px] select-none"
          style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }}
        >
          {/* SVG Connector Strings Layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={CANVAS_W}
            height={CANVAS_H}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="winnerGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--credit)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="loserGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--debit)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f87171" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {CONNECTOR_LINKS.map((link) => {
              const start = getExitPoint(link.from, link.type);
              const end = getEntryPoint(link.to, link.targetSlot);
              const midX = (start.x + end.x) / 2;

              // Smooth cubic bezier curved string
              const pathD = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

              const isWinner = link.type === 'w';
              const strokeColor = isWinner
                ? link.isActive
                  ? 'var(--credit)'
                  : 'rgba(46, 125, 50, 0.3)'
                : link.isActive
                ? 'var(--debit)'
                : 'rgba(211, 47, 47, 0.3)';

              const strokeWidth = link.isActive ? 2.5 : 1.75;
              const isDashed = !isWinner;

              return (
                <g key={link.id}>
                  {/* Subtle shadow glow for active advancement lines */}
                  {link.isActive && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isWinner ? 'var(--credit)' : 'var(--debit)'}
                      strokeWidth={5}
                      strokeOpacity={0.2}
                      strokeDasharray={isDashed ? '6 4' : undefined}
                    />
                  )}

                  {/* Primary connecting string */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isDashed ? '6 4' : undefined}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />

                  {/* Origin connector pin */}
                  <circle
                    cx={start.x}
                    cy={start.y}
                    r={link.isActive ? 3.5 : 2.5}
                    fill={strokeColor}
                  />

                  {/* Destination entry pin */}
                  <circle
                    cx={end.x}
                    cy={end.y}
                    r={link.isActive ? 3.5 : 2.5}
                    fill={strokeColor}
                  />
                </g>
              );
            })}
          </svg>

          {/* Render All 6 Match Cards placed in the diagram */}
          {(['m1', 'm2', 'w', 'l', 'r', 'f'] as KnockoutMatchId[]).map((id) =>
            renderCard(id)
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-3)]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[var(--credit)] inline-block rounded-full"></span>
              <span>Winner Advancement String</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-0.5 border-t-2 border-dashed border-[var(--debit)] inline-block"></span>
              <span>Loser Drop-down String (Second Chance)</span>
            </span>
          </div>
          <span className="text-[11px]">Click any competitor in a match to advance them.</span>
        </div>
      </div>
    </div>
  );
};
