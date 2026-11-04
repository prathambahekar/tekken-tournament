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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Main Tekken 7 Card with Red Top Border */}
      <div className="bg-[var(--surface)] border border-[var(--border)] border-t-[3px] border-t-[#e51b24] rounded-lg p-4 sm:p-6 shadow-xl space-y-5">
        {/* Card Header: Gold Italic Title + Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[var(--border)]/40">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-black italic tracking-wider text-[#ffb703] uppercase text-base sm:text-lg">
              PLAYERS
            </h3>
            <span className="text-xs text-[var(--text-3)] font-mono">
              ({n} fighters)
            </span>
            {savedIndicator && (
              <span className="flex items-center gap-1 text-xs text-[var(--credit)] font-bold animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          {/* Quick Controls: Format & Stepper */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* Format Toggle: Single vs Double Round Robin */}
            <div className="inline-flex items-center p-0.5 rounded-md bg-[var(--surface2)] text-xs font-semibold border border-[var(--border)]">
              <button
                type="button"
                onClick={() => onChangeFormat('single')}
                className={`px-2.5 py-1 rounded transition-all ${
                  format === 'single'
                    ? 'bg-[#e51b24] text-white font-bold shadow-xs'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
                title="Single Round-Robin"
              >
                Single Round
              </button>
              <button
                type="button"
                onClick={() => onChangeFormat('double')}
                className={`px-2.5 py-1 rounded transition-all ${
                  format === 'double'
                    ? 'bg-[#e51b24] text-white font-bold shadow-xs'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
                title="Double Round-Robin"
              >
                Double Round
              </button>
            </div>

            {/* Stepper */}
            <div className="inline-flex items-center h-8 rounded-md bg-[var(--surface2)] text-xs font-semibold overflow-hidden border border-[var(--border)]">
              <button
                type="button"
                onClick={() => onChangePlayerCount(n - 1)}
                disabled={n <= 4}
                className="w-8 h-full flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface3)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease player count"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="min-w-7 text-center px-1 tabular-nums font-mono text-xs text-[var(--text)] font-bold">
                {n}
              </span>
              <button
                type="button"
                onClick={() => onChangePlayerCount(n + 1)}
                disabled={n >= 16}
                className="w-8 h-full flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--surface3)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase player count"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreActions((prev) => !prev)}
                className={`h-8 w-8 rounded-md flex items-center justify-center transition-all border border-[var(--border)] ${
                  showMoreActions
                    ? 'bg-[var(--surface2)] text-[var(--text)]'
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
                  <div className="absolute right-0 mt-1.5 w-48 rounded-md bg-[var(--surface)] shadow-2xl py-1 z-50 text-xs border border-[var(--border2)]">
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
                      <span>Reset Names</span>
                    </button>
                    <button
                      onClick={handleClearAllFighters}
                      className="w-full px-3 py-2 text-left text-[#e51b24] hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Fighters</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Players Inputs Grid matching Tekken 7 Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {state.names.map((_, idx) => {
            const charId = state.chars[idx];
            const fighter = charId ? ROSTER_MAP[charId] || null : null;

            return (
              <div
                key={idx}
                className="flex flex-col gap-1.5 p-2 rounded-md bg-[var(--surface2)]/60 border border-[var(--border)] transition-colors"
              >
                {/* Name Input */}
                <input
                  type="text"
                  maxLength={20}
                  value={localNames[idx] ?? `Player ${idx + 1}`}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  onBlur={() => handleNameBlur(idx)}
                  placeholder={`Player ${idx + 1}`}
                  className="w-full px-3 py-1.5 text-sm font-semibold rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:border-[#e51b24] focus:outline-none transition-colors"
                />

                {/* Character Picker Trigger Button */}
                <button
                  type="button"
                  onClick={() => onOpenCharacterPicker(idx)}
                  className="flex items-center justify-between px-2 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface2)] text-left transition-colors border border-[var(--border)]/60"
                  title="Choose Tekken 7 fighter"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FighterAvatar
                      fighter={fighter}
                      name={localNames[idx] || `Player ${idx + 1}`}
                      size="xs"
                    />
                    <span
                      className={`text-[11px] font-semibold truncate ${
                        fighter ? 'text-[var(--text)]' : 'text-[var(--text-3)]'
                      }`}
                    >
                      {fighter ? fighter.name : 'Pick fighter'}
                    </span>
                  </div>
                  {fighter && (
                    <span className="text-[9px] text-[#ffb703] font-mono shrink-0">
                      {fighter.id.toUpperCase()}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Save Names Button matching Tekken 7 Screenshot */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveNames}
            className="px-4 py-1.5 rounded-md text-xs font-bold font-sans bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--text)] border border-[var(--border2)] hover:border-[#e51b24] transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span>Save names</span>
            {savedIndicator && <Check className="w-3.5 h-3.5 text-[var(--credit)]" />}
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center gap-3 text-xs text-[var(--text-3)]">
            <button
              onClick={onExport}
              className="hover:text-[var(--text)] transition-colors inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#ffb703]" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={onOpenImportModal}
              className="hover:text-[var(--text)] transition-colors inline-flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Import</span>
            </button>
            <button
              onClick={() => setConfirmResetOpen(true)}
              className="hover:text-[#e51b24] transition-colors inline-flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm p-5 rounded-lg bg-[var(--surface)] border border-[var(--border2)] shadow-2xl space-y-3">
            <h4 className="text-sm font-bold text-[var(--text)] font-display uppercase tracking-wide">
              Reset match results?
            </h4>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              This will clear all {playedCount} recorded scores and playoff brackets. Player names and assigned fighters will be kept.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface3)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetResults();
                  setConfirmResetOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-md bg-[#e51b24] text-white hover:opacity-90"
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
