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
  const [viewMode, setViewMode] = useState<'flowchart' | 'cards'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'cards';
    }
    return 'flowchart';
  });
  const [copied, setCopied] = useState(false);

  const ko = computeKnockout(standings, koResults);

  const grandFinal = ko.f;
  const championIndex = grandFinal.winner;
  const runnerUpIndex = grandFinal.loser;

  const championStandingsRow = championIndex != null ? standings.find((s) => s.i === championIndex) : null;
  const runnerUpStandingsRow = runnerUpIndex != null ? standings.find((s) => s.i === runnerUpIndex) : null;

  // Trigger victory confetti when champion is crowned (monochrome stark white & silver)
  useEffect(() => {
    if (championIndex != null) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#ededed', '#a1a1aa', '#52525b'],
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
      `\nFormat: Double-Elimination Top 4 Playoffs`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlayerDetails = (index: number | null) => {
    if (index == null) return null;
    const standing = standings.find((s) => s.i === index);
    if (!standing) return null;
    return {
      index,
      name: standing.name,
      fighter: standing.fighter,
    };
  };

  const hasAnyKnockoutResult = Object.values(koResults).some((val) => val != null);

  // Flowchart canvas layout geometry
  const CANVAS_W = 1040;
  const CANVAS_H = 430;

  const POSITIONS: Record<KnockoutMatchId, MatchPosition> = {
    m1: { x: 20, y: 30, w: 220, h: 145 },
    m2: { x: 20, y: 240, w: 220, h: 145 },
    w: { x: 280, y: 70, w: 220, h: 145 },
    l: { x: 280, y: 250, w: 220, h: 145 },
    r: { x: 540, y: 200, w: 220, h: 145 },
    f: { x: 800, y: 135, w: 220, h: 155 },
  };

  const getExitPoint = (matchId: KnockoutMatchId, type: 'w' | 'l') => {
    const pos = POSITIONS[matchId];
    return {
      x: pos.x + pos.w,
      y: type === 'w' ? pos.y + 44 : pos.y + 104,
    };
  };

  const getEntryPoint = (matchId: KnockoutMatchId, slotIndex: 0 | 1) => {
    const pos = POSITIONS[matchId];
    return {
      x: pos.x,
      y: slotIndex === 0 ? pos.y + 44 : pos.y + 104,
    };
  };

  const CONNECTOR_LINKS: {
    id: string;
    from: KnockoutMatchId;
    to: KnockoutMatchId;
    targetSlot: 0 | 1;
    type: 'w' | 'l';
    isActive: boolean;
  }[] = [
    { id: 'm1-w', from: 'm1', to: 'w', targetSlot: 0, type: 'w', isActive: ko.m1.winner !== null },
    { id: 'm2-w', from: 'm2', to: 'w', targetSlot: 1, type: 'w', isActive: ko.m2.winner !== null },
    { id: 'm1-l', from: 'm1', to: 'l', targetSlot: 0, type: 'l', isActive: ko.m1.winner !== null },
    { id: 'm2-l', from: 'm2', to: 'l', targetSlot: 1, type: 'l', isActive: ko.m2.winner !== null },
    { id: 'w-f', from: 'w', to: 'f', targetSlot: 0, type: 'w', isActive: ko.w.winner !== null },
    { id: 'w-r', from: 'w', to: 'r', targetSlot: 0, type: 'l', isActive: ko.w.winner !== null },
    { id: 'l-r', from: 'l', to: 'r', targetSlot: 1, type: 'w', isActive: ko.l.winner !== null },
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
        <div className={`flex items-center justify-between px-2.5 py-1.5 border border-[var(--border)] bg-[var(--surface2)] text-xs font-mono text-[var(--text-3)] select-none ${compact ? 'h-[36px]' : 'min-h-[46px]'}`}>
          <span className="italic">TBD (PENDING)</span>
          <span className="text-[9px] uppercase">SLOT {slotIndex + 1}</span>
        </div>
      );
    }

    return (
      <button
        type="button"
        disabled={!isClickable}
        onClick={() => onSelectWinner(matchId, details.index)}
        className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${compact ? 'h-[36px]' : 'min-h-[46px]'} ${
          isWinner
            ? 'bg-white text-black border border-white font-bold'
            : isLoser
            ? 'opacity-40 bg-[var(--surface2)] text-[var(--text-3)] line-through border border-[var(--border)]'
            : 'bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--text)] border border-[var(--border)]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FighterAvatar fighter={details.fighter} name={details.name} size={compact ? 'xs' : 'sm'} />
          <div className="min-w-0">
            <span className="block text-xs font-bold truncate leading-tight font-sans">
              {details.name}
            </span>
            {details.fighter && (
              <span className="block text-[10px] text-[var(--text-3)] truncate leading-tight font-mono">
                {details.fighter.name}
              </span>
            )}
          </div>
        </div>

        {isWinner ? (
          <span className="text-[10px] font-bold text-black ml-1 shrink-0 px-1.5 py-0.5 bg-white font-mono">
            ADVANCED &check;
          </span>
        ) : !compact && winner === null ? (
          <span className="text-[10px] text-[var(--text-3)] ml-1 shrink-0 font-mono">
            ADVANCE &rarr;
          </span>
        ) : null}
      </button>
    );
  };

  // Render match card inside the flowchart canvas
  const renderFlowchartCard = (id: KnockoutMatchId) => {
    const match = ko[id];
    const pos = POSITIONS[id];
    const isFinal = id === 'f';

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
        className={`p-2.5 flex flex-col justify-between select-none z-10 transition-colors bg-[var(--surface)] border ${
          isFinal ? 'border-white ring-1 ring-white/50' : 'border-[var(--border2)]'
        }`}
      >
        <div className="flex items-center justify-between gap-1.5 text-[10px] font-mono pb-1 border-b border-[var(--border)] mb-1 uppercase">
          <span className="font-bold tracking-tight truncate text-[var(--ink-strong)]">
            {isFinal && <Trophy className="w-3 h-3 inline mr-1 -mt-0.5" />}
            {match.title}
          </span>
          <span className="text-[9px] text-[var(--text-3)] shrink-0">
            {id.toUpperCase()}
          </span>
        </div>

        <div className="space-y-1.5 flex-1 flex flex-col justify-center">
          {renderSlot(id, match.players[0], 0, match.winner, true)}
          {renderSlot(id, match.players[1], 1, match.winner, true)}
        </div>
      </div>
    );
  };

  // Render match card in stacked List mode
  const renderListCard = (id: KnockoutMatchId) => {
    const match = ko[id];
    const isFinal = id === 'f';

    return (
      <div
        key={id}
        className={`p-3.5 border bg-[var(--surface2)] space-y-3 ${
          isFinal ? 'border-white' : 'border-[var(--border)]'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--border)] pb-2 uppercase">
          <span className="font-bold text-[var(--ink-strong)] flex items-center gap-1.5">
            {isFinal && <Trophy className="w-3.5 h-3.5 text-white" />}
            <span>{match.title}</span>
          </span>
          <span className="text-[10px] text-[var(--text-3)]">
            MATCH {id.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2">
          {renderSlot(id, match.players[0], 0, match.winner, false)}
          <div className="flex items-center justify-center -my-1">
            <span className="text-[10px] font-mono text-[var(--text-3)]">VS</span>
          </div>
          {renderSlot(id, match.players[1], 1, match.winner, false)}
        </div>
      </div>
    );
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
                04 //
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-[var(--ink-strong)] uppercase tracking-tight">
                KNOCKOUT PLAYOFFS
              </h2>
              {!isRoundRobinComplete && (
                <span className="text-[9px] px-1.5 py-0.5 border border-[var(--border2)] text-[var(--text-2)] font-mono uppercase tracking-widest">
                  PROJECTED SEEDS
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-3)] font-mono tracking-wide">
              SECTION 04 &mdash; DOUBLE-ELIMINATION TOP 4 BRACKET &middot; TAP WINNER TO ADVANCE
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Toggle: Flowchart vs List */}
            <div className="inline-flex border border-[var(--border)] bg-[var(--surface2)] text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('flowchart')}
                className={`px-3 py-1.5 transition-colors inline-flex items-center gap-1.5 ${
                  viewMode === 'flowchart'
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>[01] FLOWCHART</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 transition-colors border-l border-[var(--border)] inline-flex items-center gap-1.5 ${
                  viewMode === 'cards'
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>[02] LIST</span>
              </button>
            </div>

            {hasAnyKnockoutResult && (
              <button
                onClick={onResetKnockout}
                className="h-8 px-2.5 bg-[var(--surface2)] text-xs font-mono text-[var(--text-2)] hover:text-[var(--danger)] hover:border-[var(--danger)] border border-[var(--border)] transition-colors inline-flex items-center gap-1"
                title="Reset bracket results"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            )}
          </div>
        </div>

        {/* Champion Crowning Banner: Dark Swiss Brutalist Monochrome */}
        {championStandingsRow && (
          <div className="p-4 sm:p-5 bg-[var(--surface2)] border border-white space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 border border-white bg-white text-black flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-3)] block">
                    TOURNAMENT CHAMPION
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-black text-[var(--ink-strong)] uppercase tracking-tight">
                    {championStandingsRow.name}
                  </h3>
                  {championStandingsRow.fighter && (
                    <p className="text-xs text-[var(--text-2)]">
                      FIGHTER: <span className="text-white font-bold">{championStandingsRow.fighter.name}</span> ({championStandingsRow.fighter.style})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0">
                {runnerUpStandingsRow && (
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[var(--text-3)] block uppercase tracking-wider">
                      RUNNER-UP
                    </span>
                    <span className="text-xs font-bold text-[var(--ink-strong)]">
                      {runnerUpStandingsRow.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleCopyRecap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-white text-black hover:opacity-90 transition-opacity shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY RECAP'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 1: Interactive Flowchart Canvas with Clean Technical Connectors */}
        {viewMode === 'flowchart' && (
          <div className="p-3 sm:p-5 border border-[var(--border)] bg-[var(--bg)]">
            {/* Mobile Scroll Instruction */}
            <div className="lg:hidden text-xs font-mono text-[var(--text-3)] flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
              <span>&larr; HORIZONTAL BRACKET PAN &rarr;</span>
              <span className="text-[10px]">DIAGRAM VIEW</span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              {/* Stage Column Headers */}
              <div className="min-w-[1040px] grid grid-cols-4 gap-6 pb-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)] select-none">
                <div className="pl-4">01 · OPENING SEMIS</div>
                <div className="pl-4">02 · ADVANCEMENT & LOWER</div>
                <div className="pl-4">03 · LOWER FINAL</div>
                <div className="pl-4 text-[var(--ink-strong)] font-black">04 · GRAND CHAMPIONSHIP</div>
              </div>

              {/* Diagram */}
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

                    const pathD = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

                    const strokeColor = link.isActive
                      ? '#ffffff'
                      : 'rgba(255, 255, 255, 0.2)';
                    const strokeWidth = link.isActive ? 2 : 1;

                    return (
                      <g key={link.id}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeLinecap="square"
                        />
                        <rect
                          x={start.x - 2}
                          y={start.y - 2}
                          width={4}
                          height={4}
                          fill={strokeColor}
                        />
                        <rect
                          x={end.x - 2}
                          y={end.y - 2}
                          width={4}
                          height={4}
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

              {/* Flowchart Legend */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 text-xs font-mono text-[var(--text-3)] border-t border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-[2px] bg-white inline-block"></span>
                    <span>ADVANCEMENT PATH</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-white/40 inline-block"></span>
                    <span>POTENTIAL PATHWAY</span>
                  </span>
                </div>
                <span className="text-[11px]">CLICK COMPETITOR TO ADVANCE WINNER</span>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Responsive Stacked Stages */}
        {viewMode === 'cards' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] px-1">
                STAGE 01 // OPENING SEMIFINALS
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderListCard('m1')}
                {renderListCard('m2')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] px-1">
                STAGE 02 // WINNERS & LOWER BRACKET
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderListCard('w')}
                {renderListCard('l')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] px-1">
                STAGE 03 // LOWER FINAL (SECOND CHANCE)
              </div>
              <div className="max-w-xl">
                {renderListCard('r')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--ink-strong)] px-1 font-bold">
                STAGE 04 // GRAND CHAMPIONSHIP FINAL
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
