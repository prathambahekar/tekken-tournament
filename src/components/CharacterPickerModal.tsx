import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ROSTER } from '../data/roster';
import { Fighter } from '../types';
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xs select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] bg-[var(--surface)] border border-[var(--border2)] shadow-2xl overflow-hidden pb-safe sm:pb-0 font-mono">
        {/* Header with Technical Title */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface2)] border-b border-[var(--border)] shrink-0">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-strong)]">
            Choose a fighter for <span className="text-white underline">{playerName}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[var(--text-3)] hover:text-white hover:bg-[var(--surface3)] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
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
              placeholder="Search fighters..."
              className="w-full pl-9 pr-8 py-2 text-xs uppercase bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-strong)] placeholder-[var(--text-3)] focus:outline-none focus:border-white transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-3)] hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Fighter Grid */}
        <div className="p-3 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* None / Clear option */}
          {!query && (
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className={`flex items-center p-2 border text-left transition-colors min-h-[42px] ${
                currentFighterId === null
                  ? 'border-white bg-white text-black font-bold'
                  : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--text-3)] hover:text-white hover:bg-[var(--surface3)]'
              }`}
            >
              <span className="text-xs font-bold uppercase truncate">
                No fighter
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
                className={`flex items-center p-2 border text-left transition-colors min-h-[42px] ${
                  isSelected
                    ? 'border-white bg-white text-black font-bold'
                    : 'border-[var(--border)] bg-[var(--surface2)] hover:bg-[var(--surface3)] hover:border-[var(--border2)] text-[var(--text)]'
                }`}
              >
                <span className="text-xs font-bold uppercase truncate block leading-tight">
                  {f.name}
                </span>
              </button>
            );
          })}

          {filteredFighters.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-[var(--text-3)] font-mono">
              No fighters found for "{query}".
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between text-xs text-[var(--text-3)] shrink-0 font-mono">
          <span>{filteredFighters.length} fighters</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs uppercase bg-[var(--surface)] hover:bg-[var(--surface3)] border border-[var(--border)] text-[var(--text-2)] hover:text-white transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
