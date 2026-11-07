import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ROSTER } from '../data/roster';
import { Fighter } from '../types';
import { FighterAvatar } from './FighterAvatar';
import { Search, X } from 'lucide-react';

interface CharacterPickerModalProps {
  isOpen: boolean;
  playerName: string;
  playerIndex: number;
  currentFighterId: string | null;
  onSelect: (fighterId: string | null) => void;
  onClose: () => void;
}

export const CharacterPickerModal: React.FC<CharacterPickerModalProps> = ({
  isOpen,
  playerName,
  currentFighterId,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset query on open - DO NOT auto-focus to prevent virtual keyboard from popping up on mobile
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredFighters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROSTER;
    return ROSTER.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.style.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-xl sm:rounded-xl shadow-2xl overflow-hidden pb-safe sm:pb-0">
        {/* Mobile Drag Handle */}
        <div className="w-10 h-1 bg-[var(--border2)] rounded-sm mx-auto my-2 sm:hidden shrink-0" />

        {/* Minimal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface2)] border-b border-[var(--border)] shrink-0">
          <div className="text-sm font-bold font-display text-[var(--text)]">
            Choose Fighter for <span className="text-[var(--amber)]">{playerName}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface3)] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar (No auto-focus to prevent virtual keyboard popup) */}
        <div className="p-3 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredFighters.length > 0) {
                  onSelect(filteredFighters[0].id);
                  onClose();
                }
              }}
              placeholder="Search fighter (e.g. Jin, Kazuya, Eddy)..."
              className="w-full pl-9 pr-8 py-2.5 sm:py-2 text-base sm:text-sm bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-3)] focus:outline-none focus:ring-1 focus:ring-[var(--amber)] transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-3)] hover:text-[var(--text)]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Minimal Fighter Pills Grid */}
        <div className="p-3 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* None / Clear option as a compact pill in the grid */}
          {!query && (
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all min-h-[48px] active:scale-95 ${
                currentFighterId === null
                  ? 'border-[var(--amber)] bg-[var(--surface2)] ring-1 ring-[var(--amber)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-[var(--surface3)] flex items-center justify-center font-mono text-xs text-[var(--text-2)] shrink-0">
                ✕
              </span>
              <span className="text-xs font-semibold truncate">
                No Fighter
              </span>
            </button>
          )}

          {filteredFighters.map((f: Fighter) => {
            const isSelected = currentFighterId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onSelect(f.id);
                  onClose();
                }}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all min-h-[48px] active:scale-95 ${
                  isSelected
                    ? 'border-[var(--amber)] bg-[var(--surface2)] ring-1 ring-[var(--amber)] font-semibold'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)] hover:border-[var(--border2)]'
                }`}
              >
                <FighterAvatar fighter={f} size="sm" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold truncate text-[var(--text)] block leading-tight">
                    {f.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-3)] truncate block leading-tight">
                    {f.style}
                  </span>
                </div>
              </button>
            );
          })}

          {filteredFighters.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-[var(--text-3)]">
              No fighter found for "{query}".
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between text-xs text-[var(--text-3)] shrink-0">
          <span>{filteredFighters.length} fighters</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface3)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
