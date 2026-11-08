import React, { useState, useEffect } from 'react';
import { TournamentState, TournamentFormat } from '../types';
import { ROSTER_MAP } from '../data/roster';
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
  format: TournamentFormat;
  onChangeFormat: (format: TournamentFormat) => void;
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
  format,
  onChangeFormat,
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

  const handleSaveNames = () => {
    const sanitized = localNames.map((n, i) => n?.trim() || `Player ${i + 1}`);
    setLocalNames(sanitized);
    onUpdateNames(sanitized);
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  };

  const handleNameBlur = (index: number) => {
    const sanitized = [...localNames];
    sanitized[index] = sanitized[index]?.trim() || `Player ${index + 1}`;
    setLocalNames(sanitized);
    onUpdateNames(sanitized);
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

  const playedCount = Object.keys(state.res).length;
  const n = state.names.length;

  return (
    <div className="space-y-6">
      {/* Editorial Section Container: Sharp 1px Border & Deep Black Background */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-4 sm:p-6 space-y-6">
        {/* Section Header with Numbered Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display font-black text-lg sm:text-xl text-[var(--ink-strong)]">
              Players
            </h2>
            <p className="text-xs text-[var(--text-3)]">
              Add names, choose fighters, and set the match format.
            </p>
          </div>

          {/* Quick Controls: Format Segment & Stepper */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Format Toggle: Sharp Segmented Control */}
            <div className="inline-flex border border-[var(--border)] bg-[var(--surface2)] text-xs font-mono">
              <button
                type="button"
                onClick={() => onChangeFormat('single')}
                className={`px-3 py-1.5 transition-colors ${
                  format === 'single'
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
                title="Single Round-Robin"
              >
                Once
              </button>
              <button
                type="button"
                onClick={() => onChangeFormat('double')}
                className={`px-3 py-1.5 transition-colors border-l border-[var(--border)] ${
                  format === 'double'
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-bold'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
                title="Double Round-Robin"
              >
                Twice
              </button>
            </div>

            {/* Stepper: Sharp Square Box */}
            <div className="inline-flex items-center h-8 border border-[var(--border)] bg-[var(--surface2)] text-xs font-mono">
              <button
                type="button"
                onClick={() => onChangePlayerCount(n - 1)}
                disabled={n <= 4}
                className="w-8 h-full flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface3)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease player count"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center tabular-nums font-mono text-xs text-[var(--ink-strong)] font-bold border-x border-[var(--border)]">
                {String(n).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => onChangePlayerCount(n + 1)}
                disabled={n >= 16}
                className="w-8 h-full flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface3)] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase player count"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreActions((prev) => !prev)}
                className={`h-8 w-8 flex items-center justify-center transition-colors border border-[var(--border)] ${
                  showMoreActions
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                    : 'bg-[var(--surface2)] text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
                title="More options"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMoreActions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMoreActions(false)}
                  />
                  <div className="absolute right-0 mt-1 w-56 bg-[var(--surface)] border border-[var(--border2)] py-1 z-50 text-xs font-mono shadow-2xl">
                    <button
                      onClick={handleShuffleSeeds}
                      className="w-full px-3 py-2 text-left text-[var(--text)] hover:bg-[var(--surface2)] flex items-center gap-2"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-[var(--text-3)]" />
                      <span>Shuffle player order</span>
                    </button>
                    <button
                      onClick={handleResetToDefaultNames}
                      className="w-full px-3 py-2 text-left text-[var(--text)] hover:bg-[var(--surface2)] flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[var(--text-3)]" />
                      <span>Use default names</span>
                    </button>
                    <button
                      onClick={handleClearAllFighters}
                      className="w-full px-3 py-2 text-left text-[var(--danger)] hover:bg-[var(--surface2)] flex items-center gap-2 border-t border-[var(--border)]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear all fighters</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Grid: Player Input Cards with Swiss Technical Alignments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {state.names.map((_, idx) => {
            const charId = state.chars[idx];
            const fighter = charId ? ROSTER_MAP[charId] || null : null;

            return (
              <div
                key={idx}
                className="flex flex-col gap-2 p-3 bg-[var(--surface2)] border border-[var(--border)] transition-colors hover:border-[var(--border2)]"
              >
                {/* Index & Name Field */}
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-1.5">
                  <span className="font-mono text-[10px] text-[var(--text-3)] tracking-widest uppercase">
                    Player {idx + 1}
                  </span>
                  {fighter && (
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-3)]">
                      {fighter.id}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    maxLength={20}
                    value={localNames[idx] ?? `Player ${idx + 1}`}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    onBlur={() => handleNameBlur(idx)}
                    placeholder={`Player ${idx + 1}`}
                    className="w-full px-2.5 py-1.5 text-sm font-sans font-semibold bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-strong)] focus:border-[var(--ink-strong)] focus:outline-none transition-colors"
                  />
                </div>

                {/* Character Picker Button */}
                <button
                  type="button"
                  onClick={() => onOpenCharacterPicker(idx)}
                  className="flex items-center justify-between px-2.5 py-2 min-h-[44px] bg-[var(--surface)] hover:bg-[var(--surface3)] text-left transition-colors border border-[var(--border)]"
                  title="Assign Tekken 7 Fighter"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FighterAvatar
                      fighter={fighter}
                      name={localNames[idx] || `Player ${idx + 1}`}
                      size="xs"
                    />
                    <div className="min-w-0">
                      <span
                        className={`text-xs font-mono font-bold truncate block ${
                          fighter ? 'text-[var(--ink-strong)]' : 'text-[var(--text-3)]'
                        }`}
                      >
                        {fighter ? fighter.name : 'Choose fighter'}
                      </span>
                      {fighter && (
                        <span className="text-[10px] text-[var(--text-3)] truncate block font-sans">
                          {fighter.style}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-3)] shrink-0 ml-1">
                    {fighter ? 'Change' : 'Choose'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Actions: Stark Inverted Monochrome Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveNames}
              className="px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Save changes</span>
              {savedIndicator && <Check className="w-3.5 h-3.5" />}
            </button>
            {savedIndicator && (
              <span className="text-xs font-mono text-[var(--text-2)] uppercase">
                Saved
              </span>
            )}
          </div>

          {/* Secondary Actions: Thin Bordered Tech Buttons */}
          <div className="flex items-center justify-around sm:justify-end gap-2 text-xs font-mono text-[var(--text-3)]">
            <button
              onClick={onExport}
              className="px-3 py-1.5 border border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={onOpenImportModal}
              className="px-3 py-1.5 border border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)] transition-colors inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
            <button
              onClick={() => setConfirmResetOpen(true)}
              className="px-3 py-1.5 border border-[var(--border)] hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog: Sharp Square Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-sm p-5 bg-[var(--surface)] border border-[var(--border2)] space-y-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[var(--danger)] tracking-widest uppercase">
                Please confirm
              </span>
              <h4 className="text-sm font-black text-[var(--ink-strong)] font-display uppercase tracking-wide">
                Clear match results?
              </h4>
            </div>
            <p className="text-xs text-[var(--text-2)] font-mono leading-relaxed">
              This action clears all {playedCount} recorded scores and playoff brackets. Competitor names and assigned fighters will be preserved.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-3 py-1.5 text-xs font-mono uppercase bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface3)] border border-[var(--border)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetResults();
                  setConfirmResetOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-mono font-bold uppercase bg-[var(--danger)] text-white hover:opacity-90"
              >
                Clear results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
