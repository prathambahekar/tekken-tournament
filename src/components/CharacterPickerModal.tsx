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

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
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
    return ROSTER.filter((f) => f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col w-full max-w-lg max-h-[82vh] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        {/* Simple Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface2)]">
          <div className="text-sm font-bold font-display text-[var(--text)]">
            Choose Fighter for <span className="text-[var(--amber)]">{playerName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface3)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-[var(--border)]">
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
              placeholder="Search fighter name (e.g. Bob, Jin, Eddy)..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--surface2)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:border-[var(--amber)] transition-colors"
            />
          </div>
        </div>

        {/* Fighter Name Grid */}
        <div className="p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Clear / No Character button */}
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className={`col-span-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left text-xs transition-colors ${
              currentFighterId === null
                ? 'border-[var(--amber)] bg-[var(--surface2)] font-semibold text-[var(--text)]'
                : 'border-dashed border-[var(--border)] text-[var(--text-3)] hover:border-[var(--border2)] hover:text-[var(--text)]'
            }`}
          >
            <span className="w-7 h-7 rounded-lg border border-dashed border-[var(--border2)] flex items-center justify-center font-mono">
              ✕
            </span>
            <span>No fighter (Clear)</span>
          </button>

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
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-colors ${
                  isSelected
                    ? 'border-[var(--amber)] bg-[var(--surface2)] ring-1 ring-[var(--amber)]'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface2)] hover:border-[var(--border2)]'
                }`}
              >
                <FighterAvatar fighter={f} size="sm" />
                <span className="text-xs font-semibold truncate text-[var(--text)]">
                  {f.name}
                </span>
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
        <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface2)] flex items-center justify-between text-xs text-[var(--text-3)]">
          <span>{filteredFighters.length} fighters</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-xs font-medium text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface3)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
