import React, { useEffect, useState } from 'react';
import { StandingsRow, KnockoutMatchId } from '../types';
import { FighterAvatar } from './FighterAvatar';
import { computeKnockout } from '../utils/tournament';
import confetti from 'canvas-confetti';
import { Trophy, Copy, Check, RotateCcw, GitBranch, List } from 'lucide-react';

interface KnockoutTabProps {
  standings: StandingsRow[];
  koResults: Record<KnockoutMatchId, number | null>;
  isRoundRobinComplete: boolean;
  totalMatches: number;
  remainingMatches: number;
  previewMode?: boolean;
  onTogglePreviewMode?: () => void;
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
  onSelectWinner,
  onResetKnockout,
}) => {
  const [viewMode, setViewMode] = useState<'flowchart' | 'cards'>('flowchart');
  const [copied, setCopied] = useState(false);

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

  const handleCopyRecap = () => {
    if (!championStandingsRow) return;
    const text = `🏆 TEKKEN 7 TOURNAMENT RESULTS 🏆\n` +
      `🥇 Champion: ${championStandingsRow.name} (${championStandingsRow.fighter?.name || 'Fighter'})\n` +
      (runnerUpStandingsRow ? `🥈 Runner-Up: ${runnerUpStandingsRow.name} (${runnerUpStandingsRow.fighter?.name || 'Fighter'})\n` : '') +
      `Format: Double Elimination Playoffs`;
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

  const hasAnyKnockoutResult = Object.values(koResults).some((v) => v !== null);

  // Flowchart canvas geometry
  const CARD_W = 216;
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

  // Exit point calculation on source card
  const getExitPoint = (sourceId: KnockoutMatchId, type: 'w' | 'l') => {
    const pos = POSITIONS[sourceId];
    const match = ko[sourceId];
    const p0 = match.players[0];
    const p1 = match.players[1];
    const winner = match.winner;

    let slotY = pos.y + pos.h / 2;

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

  // Entry point calculation on destination card
  const getEntryPoint = (targetId: KnockoutMatchId, slot: 0 | 1) => {
    const pos = POSITIONS[targetId];
    const slotY = slot === 0 ? pos.y + 50 : pos.y + 95;
    return { x: pos.x, y: slotY };
  };

  const CONNECTOR_LINKS: Array<{
    id: string;
    from: KnockoutMatchId;
    to: KnockoutMatchId;
    targetSlot: 0 | 1;
    type: 'w' | 'l';
    isActive: boolean;
  }> = [
    { id: 'm1-w', from: 'm1', to: 'w', targetSlot: 0, type: 'w', isActive: ko.m1.winner !== null },
    { id: 'm2-w', from: 'm2', to: 'w', targetSlot: 1, type: 'w', isActive: ko.m2.winner !== null },
    { id: 'm1-l', from: 'm1', to: 'l', targetSlot: 0, type: 'l', isActive: ko.m1.loser !== null },
    { id: 'm2-l', from: 'm2', to: 'l', targetSlot: 1, type: 'l', isActive: ko.m2.loser !== null },
    { id: 'l-r', from: 'l', to: 'r', targetSlot: 0, type: 'w', isActive: ko.l.winner !== null },
    { id: 'w-r', from: 'w', to: 'r', targetSlot: 1, type: 'l', isActive: ko.w.loser !== null },
    { id: 'w-f', from: 'w', to: 'f', targetSlot: 0, type: 'w', isActive: ko.w.winner !== null },
    { id: 'r-f', from: 'r', to: 'f', targetSlot: 1, type: 'w', isActive: ko.r.winner !== null },
  ];

  const renderSlot = (
    matchId: KnockoutMatchId,
    playerIndex: number | null,
    slotIndex: number,
    winner: number | null,
    compact: boolean = false
  ) => {
    const details = getPlayerDetails(playerIndex);
    const isWinner = winner != null && winner === playerIndex;
    const isLoser = winner != null && winner !== playerIndex && playerIndex != null;
    const isClickable = playerIndex != null;

    if (!details) {
      return (
        <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[var(--surface2)] text-xs text-[var(--text-3)] select-none ${compact ? 'h-[36px]' : 'min-h-[42px]'}`}>
          <span className="italic">TBD</span>
          <span className="text-[9px] uppercase font-mono">Slot {slotIndex + 1}</span>
        </div>
      );
    }

    return (
      <button
        type="button"
        disabled={!isClickable}
        onClick={() => onSelectWinner(matchId, details.index)}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-all active:scale-[0.99] ${compact ? 'h-[36px]' : 'min-h-[42px]'} ${
          isWinner
            ? 'bg-[var(--credit-bg)] text-[var(--text)] font-bold ring-1 ring-[var(--credit)]'
            : isLoser
            ? 'opacity-50 bg-[var(--surface2)] text-[var(--text-3)] line-through'
            : 'bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--text)]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FighterAvatar fighter={details.fighter} name={details.name} size="xs" />
          <div className="min-w-0">
            <span className="block text-xs font-semibold truncate leading-tight">
              {details.name}
            </span>
            {details.fighter && (
              <span className="block text-[10px] text-[var(--text-3)] truncate leading-tight">
                {details.fighter.name}
              </span>
            )}
          </div>
        </div>

        {isWinner && (
          <span className="text-xs font-bold text-[var(--credit)] ml-1 shrink-0">✓</span>
        )}
      </button>
    );
  };

  // Render match card inside the flowchart canvas
  const renderFlowchartCard = (id: KnockoutMatchId) => {
    const match = ko[id];
    const pos = POSITIONS[id];
    const isFinal = id === 'f';
    const isWinners = id === 'w';
    const isLosers = id === 'l';
    const isSecondChance = id === 'r';

    let cardBg = 'bg-[var(--surface)] border border-[var(--border)]';
    let titleColor = 'text-[var(--text)]';
    let subtitleColor = 'text-[var(--text-3)]';

    if (isFinal) {
      cardBg = 'bg-[var(--surface)] border border-[var(--amber)] ring-1 ring-[var(--amber)] shadow-md';
      titleColor = 'text-[var(--amber)] font-bold';
      subtitleColor = 'text-[var(--amber)] font-semibold';
    } else if (isWinners) {
      cardBg = 'bg-[var(--surface)] border border-[var(--credit)]/50 ring-1 ring-[var(--credit)]/30';
      titleColor = 'text-[var(--credit)]';
      subtitleColor = 'text-[var(--credit)]';
    } else if (isLosers) {
      cardBg = 'bg-[var(--surface)] border border-[var(--debit)]/50 ring-1 ring-[var(--debit)]/30';
      titleColor = 'text-[var(--debit)]';
      subtitleColor = 'text-[var(--debit)]';
    } else if (isSecondChance) {
      cardBg = 'bg-[var(--surface)] border border-[var(--amber)]/50 ring-1 ring-[var(--amber)]/30';
      titleColor = 'text-[var(--amber)]';
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
        className={`p-2.5 rounded-lg shadow-xs flex flex-col justify-between select-none z-10 transition-all ${cardBg}`}
      >
        <div className="flex items-center justify-between gap-1.5 text-[11px] font-mono pb-1 border-b border-[var(--border)] mb-1">
          <span className={`font-bold tracking-tight truncate ${titleColor}`}>
            {isFinal && <Trophy className="w-3 h-3 inline mr-1 -mt-0.5 text-[var(--amber)]" />}
            {match.title}
          </span>
          <span className={`text-[10px] shrink-0 ${subtitleColor}`}>{match.subtitle}</span>
        </div>
        <div className="space-y-1 mt-0.5">
          {renderSlot(id, match.players[0], 0, match.winner, true)}
          {renderSlot(id, match.players[1], 1, match.winner, true)}
        </div>
      </div>
    );
  };

  // Render stacked match card for list view
  const renderListCard = (id: KnockoutMatchId) => {
    const match = ko[id];
    const isFinal = id === 'f';

    return (
      <div
        key={id}
        className={`p-3 rounded-lg bg-[var(--surface)] shadow-xs flex flex-col justify-between gap-2.5 transition-all border border-[var(--border)] ${
          isFinal ? 'ring-1 ring-[var(--amber)]' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2 pb-1 text-xs border-b border-[var(--border)]">
          <div className="flex items-center gap-1.5 font-display font-bold">
            {isFinal && <Trophy className="w-4 h-4 text-[var(--amber)] inline shrink-0" />}
            <span className="text-[var(--text)] text-sm">{match.title}</span>
          </div>
          <span className="text-[10px] text-[var(--text-3)] font-mono">
            {match.subtitle}
          </span>
        </div>

        <div className="space-y-2">
          {renderSlot(id, match.players[0], 0, match.winner, false)}
          {renderSlot(id, match.players[1], 1, match.winner, false)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Tekken 7 Card Container */}
      <div className="bg-[var(--surface)] border border-[var(--border)] border-t-[3px] border-t-[#e51b24] rounded-lg p-4 sm:p-5 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black italic tracking-wider text-[#ffb703] uppercase text-base sm:text-lg">
                KNOCKOUT PLAYOFFS
              </h3>
              {!isRoundRobinComplete && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--amber-bg)] text-[#ffb703] font-mono font-bold border border-[var(--amber-border)]">
                  Projected Seeds
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--text-3)] font-mono mt-0.5">
              Double-elimination top 4 bracket · Tap winner to advance
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Toggle: Flowchart vs Cards */}
            <div className="inline-flex items-center p-0.5 bg-[var(--surface2)] rounded-md border border-[var(--border)] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('flowchart')}
                className={`px-2.5 py-1 rounded transition-all inline-flex items-center gap-1.5 ${
                  viewMode === 'flowchart'
                    ? 'bg-[#e51b24] text-white font-bold shadow-xs'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Flowchart</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded transition-all inline-flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? 'bg-[#e51b24] text-white font-bold shadow-xs'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>

          {hasAnyKnockoutResult && (
            <button
              onClick={onResetKnockout}
              className="h-8 px-2.5 rounded-lg bg-[var(--surface)] text-xs font-medium text-[var(--text-2)] hover:text-[var(--debit)] hover:bg-[var(--debit-bg)] transition-colors inline-flex items-center gap-1"
              title="Reset bracket results"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Champion Crowning Celebration Banner */}
      {championStandingsRow && (
        <div className="p-4 sm:p-5 rounded-lg bg-gradient-to-br from-amber-500/15 via-[var(--surface)] to-red-500/15 border border-[var(--amber)] shadow-md animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Trophy className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[var(--amber)]">
                  Tournament Champion
                </span>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-[var(--text)]">
                  {championStandingsRow.name}
                </h3>
                {championStandingsRow.fighter && (
                  <p className="text-xs text-[var(--text-2)]">
                    Fighter:{' '}
                    <span className="font-semibold text-[var(--text)]">
                      {championStandingsRow.fighter.name}
                    </span>{' '}
                    ({championStandingsRow.fighter.style || 'Martial Arts'})
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              {runnerUpStandingsRow && (
                <div className="text-left sm:text-right">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)] shadow-xs transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[var(--credit)]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Results'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 1: Interactive Flowchart Diagram Canvas */}
      {viewMode === 'flowchart' && (
        <div className="p-3 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-xs">
          {/* Mobile Horizontal Pan Hint */}
          <div className="lg:hidden text-xs text-[var(--text-3)] flex items-center justify-between pb-2 mb-2">
            <span>← Scroll horizontally to explore full bracket →</span>
            <span className="font-mono text-[10px]">Interactive Flowchart</span>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            {/* Stage Column Headers */}
            <div className="min-w-[1040px] grid grid-cols-4 gap-6 pb-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)] select-none">
              <div className="pl-4">01 · Qualifiers</div>
              <div className="pl-4">02 · Semis & Elimination</div>
              <div className="pl-4">03 · Losers Final</div>
              <div className="pl-4 text-[var(--amber)]">04 · Grand Final</div>
            </div>

            {/* Flowchart Diagram with SOLID SVG Connectors (Zero split lines) */}
            <div
              className="relative min-w-[1040px] select-none"
              style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }}
            >
              <svg
                className="absolute inset-0 pointer-events-none"
                width={CANVAS_W}
                height={CANVAS_H}
                aria-hidden="true"
              >
                {CONNECTOR_LINKS.map((link) => {
                  const start = getExitPoint(link.from, link.type);
                  const end = getEntryPoint(link.to, link.targetSlot);
                  const midX = (start.x + end.x) / 2;

                  // Smooth continuous cubic bezier curve path
                  const pathD = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

                  const isWinner = link.type === 'w';
                  const strokeColor = isWinner
                    ? link.isActive
                      ? 'var(--credit)'
                      : 'rgba(46, 125, 50, 0.35)'
                    : link.isActive
                    ? 'var(--debit)'
                    : 'rgba(211, 47, 47, 0.35)';

                  const strokeWidth = link.isActive ? 2.5 : 1.75;

                  return (
                    <g key={link.id}>
                      {/* Active line subtle glow - SOLID (no dashed/split line) */}
                      {link.isActive && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isWinner ? 'var(--credit)' : 'var(--debit)'}
                          strokeWidth={5}
                          strokeOpacity={0.25}
                        />
                      )}

                      {/* Main connection curve - SOLID (no dashed/split line) */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        className="transition-all duration-200"
                      />

                      {/* Origin pin */}
                      <circle
                        cx={start.x}
                        cy={start.y}
                        r={link.isActive ? 3.5 : 2.5}
                        fill={strokeColor}
                      />

                      {/* Destination pin */}
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

              {/* Render All 6 Match Cards in Diagram Layout */}
              {(['m1', 'm2', 'w', 'l', 'r', 'f'] as KnockoutMatchId[]).map((id) =>
                renderFlowchartCard(id)
              )}
            </div>

            {/* Flowchart Legend (SOLID continuous lines, zero split lines) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 text-xs text-[var(--text-3)]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-1 bg-[var(--credit)] inline-block rounded-full"></span>
                  <span>Winner Advancement</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-5 h-1 bg-[var(--debit)] inline-block rounded-full"></span>
                  <span>Second Chance Drop-down</span>
                </span>
              </div>
              <span className="text-[11px]">Tap any player slot to advance them through the bracket.</span>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Responsive Stacked Stages */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-display font-bold uppercase tracking-wider text-[var(--text-3)] px-1">
              Stage 1 · Opening Semifinals
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderListCard('m1')}
              {renderListCard('m2')}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-display font-bold uppercase tracking-wider text-[var(--text-3)] px-1">
              Stage 2 · Winners & Losers Match
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderListCard('w')}
              {renderListCard('l')}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-display font-bold uppercase tracking-wider text-[var(--amber)] px-1">
              Stage 3 · Losers Final (Second Chance)
            </div>
            <div className="max-w-xl">
              {renderListCard('r')}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-display font-bold uppercase tracking-wider text-[var(--amber)] px-1">
              Stage 4 · Grand Championship Final
            </div>
            <div className="max-w-xl">
              {renderListCard('f')}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
