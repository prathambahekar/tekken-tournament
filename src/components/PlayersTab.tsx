import React, { useState, useEffect } from 'react';
import { TournamentState } from '../types';
import { ROSTER_MAP, ROSTER } from '../data/roster';
import { FighterAvatar } from './FighterAvatar';
import {
  Minus,
  Plus,
  Shuffle,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  MoreHorizontal,
  Check,
} from 'lucide-react';

interface PlayersTabProps {
  state: TournamentState;
  onUpdateNames: (newNames: string[]) => void;
  onUpdateChars: (newChars: (string | null)[]) => void;
  onChangePlayerCount: (newCount: number) => void;
  onOpenCharacterPicker: (playerIndex: number) => void;
  onExport: () => void;
  onOpenImportModal: () => void;
  onResetResults: () => void;
}

export const PlayersTab: React.FC<PlayersTabProps> = ({
  state,
  onUpdateNames,
  onUpdateChars,
  onChangePlayerCount,
  onOpenCharacterPicker,
  onExport,
  onOpenImportModal,
  onResetResults,
}) => {
  const [localNames, setLocalNames] = useState<string[]>(state.names);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  useEffect(() => {
    setLocalNames(state.names);
  }, [state.names]);

  const handleNameChange = (index: number, val: string) => {
    const updated = [...localNames];
    updated[index] = val;
    setLocalNames(updated);
  };

  const handleNameBlur = (index: number) => {
    const sanitized = [...localNames];
    sanitized[index] = sanitized[index]?.trim() || `Player ${index + 1}`;
    setLocalNames(sanitized);
    onUpdateNames(sanitized);
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 1500);
  };

  const handleShuffleSeeds = () => {
    if (confirm('Shuffle player seeds and match order?')) {
      const indices = state.names.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const shuffledNames = indices.map((i) => state.names[i]);
      const shuffledChars = indices.map((i) => state.chars[i]);
      setLocalNames(shuffledNames);
      onUpdateNames(shuffledNames);
      onUpdateChars(shuffledChars);
      setShowMoreActions(false);
    }
  };

  const handleRandomizeAllFighters = () => {
    const randomChars = state.names.map(() => {
      const rand = ROSTER[Math.floor(Math.random() * ROSTER.length)];
      return rand.id;
    });
    onUpdateChars(randomChars);
    setShowMoreActions(false);
  };

  const handleResetToDefaultNames = () => {
    const defaultNames = state.names.map((_, i) => `Player ${i + 1}`);
    setLocalNames(defaultNames);
    onUpdateNames(defaultNames);
    setShowMoreActions(false);
  };

  const handleClearAllFighters = () => {
    const cleared = state.names.map(() => null);
    onUpdateChars(cleared);
    setShowMoreActions(false);
  };

  const handleRandomizeSingleFighter = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const rand = ROSTER[Math.floor(Math.random() * ROSTER.length)];
    const updated = [...state.chars];
    updated[idx] = rand.id;
    onUpdateChars(updated);
  };

  const playedCount = Object.keys(state.res).length;
  const n = state.names.length;
  const totalRounds = 2 * (n + (n % 2) - 1);
  const totalMatches = n * (n - 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Minimal Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-display tracking-tight text-[var(--text)]">
              Players
            </h2>
            {savedIndicator && (
              <span className="flex items-center gap-1 text-xs text-[var(--credit)] font-medium animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-3)] mt-0.5">
            <span>{n} competitors</span>
            <span aria-hidden="true">·</span>
            <span>{totalMatches} matches</span>
            <span aria-hidden="true">·</span>
            <span>{totalRounds} rounds</span>
          </div>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Compact Stepper */}
          <div className="inline-flex items-center h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold overflow-hidden">
            <button
              type="button"
              onClick={() => onChangePlayerCount(n - 1)}
              disabled={n <= 4}
              className="w-8 h-full flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface2)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease player count"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-8 text-center px-1 tabular-nums font-mono text-[var(--text)]">
              {n}
            </span>
            <button
              type="button"
              onClick={() => onChangePlayerCount(n + 1)}
              disabled={n >= 16}
              className="w-8 h-full flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface2)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase player count"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Randomize Button */}
          <button
            onClick={handleRandomizeAllFighters}
            className="h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors inline-flex items-center gap-1.5"
            title="Randomize fighters for all players"
          >
            <Shuffle className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span className="hidden sm:inline">Randomize</span>
          </button>

          {/* More Actions Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions((prev) => !prev)}
              className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors ${
                showMoreActions
                  ? 'border-[var(--text-2)] bg-[var(--surface2)] text-[var(--text)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`}
              title="More actions"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreActions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoreActions(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg py-1 z-50 text-xs">
                  <button
                    onClick={handleShuffleSeeds}
                    className="w-full px-3 py-2 text-left text-[var(--text)] hover:bg-[var(--surface2)] flex items-center gap-2"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-[var(--text-3)]" />
                    <span>Shuffle Seeds</span>
                  </button>
                  <button
                    onClick={handleResetToDefaultNames}
                    className="w-full px-3 py-2 text-left text-[var(--text)] hover:bg-[var(--surface2)] flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[var(--text-3)]" />
                    <span>Reset Names (Player 1, 2...)</span>
                  </button>
                  <button
                    onClick={handleClearAllFighters}
                    className="w-full px-3 py-2 text-left text-[var(--debit)] hover:bg-[var(--debit-bg)] flex items-center gap-2 border-t border-[var(--border)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Fighters</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {state.names.map((_, idx) => {
          const charId = state.chars[idx];
          const fighter = charId ? ROSTER_MAP[charId] || null : null;

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border2)] transition-colors shadow-2xs flex flex-col justify-between gap-2.5"
            >
              {/* Row: Seed & Inline Name Input */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[var(--surface2)] text-[var(--text-3)] flex items-center justify-center font-mono font-bold text-xs select-none">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  maxLength={20}
                  value={localNames[idx] ?? `Player ${idx + 1}`}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  onBlur={() => handleNameBlur(idx)}
                  placeholder={`Player ${idx + 1}`}
                  className="flex-1 min-w-0 px-2 py-1 text-sm font-semibold rounded-md bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--amber)] focus:bg-[var(--surface2)] focus:outline-none transition-all text-[var(--text)]"
                />
              </div>

              {/* Character Selector Row */}
              <button
                type="button"
                onClick={() => onOpenCharacterPicker(idx)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-transparent hover:border-[var(--border)] transition-all text-left group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FighterAvatar fighter={fighter} name={localNames[idx] || `Player ${idx + 1}`} size="xs" />
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold truncate text-[var(--text)]">
                      {fighter ? fighter.name : 'Choose Fighter'}
                    </span>
                    <span className="block text-[10px] text-[var(--text-3)] truncate">
                      {fighter ? fighter.style : 'Optional assignment'}
                    </span>
                  </div>
                </div>

                <div
                  onClick={(e) => handleRandomizeSingleFighter(idx, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--text)] transition-opacity"
                  title="Randomize fighter for this player"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Minimal Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-[var(--text-3)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="hover:text-[var(--text)] transition-colors inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Export JSON</span>
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={onOpenImportModal}
            className="hover:text-[var(--text)] transition-colors inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[var(--credit)]" />
            <span>Import JSON</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="hover:text-[var(--debit)] transition-colors inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Match Results ({playedCount} recorded)</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-3">
            <h4 className="text-sm font-bold text-[var(--text)]">
              Reset match results?
            </h4>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              This will clear all {playedCount} recorded scores and playoff brackets. Player names and assigned fighters will be kept.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface3)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetResults();
                  setConfirmResetOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--debit)] text-white hover:opacity-90"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
