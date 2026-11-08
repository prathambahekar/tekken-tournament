import React, { useState, useRef } from 'react';
import { TournamentState, MatchResultValue, KnockoutMatchId } from '../types';
import { ROSTER_MAP } from '../data/roster';
import { X, Upload, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedState: TournamentState) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    names: string[];
    matchesCount: number;
    hasKnockout: boolean;
    state: TournamentState;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const parseAndValidate = (text: string) => {
    setError(null);
    setPreview(null);

    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) {
        throw new Error('No valid JSON object found in text.');
      }

      const parsed = JSON.parse(text.slice(start, end + 1));

      if (!parsed || !Array.isArray(parsed.names) || parsed.names.length < 4 || parsed.names.length > 16) {
        throw new Error('Tournament must contain between 4 and 16 player names.');
      }

      if (!parsed.res || typeof parsed.res !== 'object') {
        throw new Error('Missing or invalid match results ("res") object.');
      }

      const importedNames: string[] = parsed.names.map((n: unknown, i: number) =>
        String(n || '').trim().slice(0, 20) || `Player ${i + 1}`
      );

      const importedChars: (string | null)[] = importedNames.map((_: string, i: number) => {
        const c = Array.isArray(parsed.chars) ? parsed.chars[i] : null;
        return typeof c === 'string' && ROSTER_MAP[c] ? c : null;
      });

      const maxIndex = importedNames.length - 1;
      const importedRes: Record<string, MatchResultValue> = {};

      Object.keys(parsed.res).forEach((key) => {
        const parts = key.split('-').map(Number);
        if (
          parts.length === 3 &&
          !isNaN(parts[0]) &&
          !isNaN(parts[1]) &&
          parts[0] <= maxIndex &&
          parts[1] <= maxIndex &&
          /^[ab](20|21)$/.test(parsed.res[key])
        ) {
          importedRes[key] = parsed.res[key];
        }
      });

      const importedKo: Record<KnockoutMatchId, number | null> = {
        m1: null,
        m2: null,
        w: null,
        l: null,
        r: null,
        f: null,
      };

      if (parsed.ko && typeof parsed.ko === 'object') {
        (['m1', 'm2', 'w', 'l', 'r', 'f'] as KnockoutMatchId[]).forEach((key) => {
          const v = parsed.ko[key];
          if (typeof v === 'number' && v >= 0 && v < importedNames.length) {
            importedKo[key] = v;
          }
        });
      }

      const readyState: TournamentState = {
        names: importedNames,
        chars: importedChars,
        res: importedRes,
        ko: importedKo,
      };

      const hasKo = Object.values(importedKo).some((v) => v !== null);

      setPreview({
        names: importedNames,
        matchesCount: Object.keys(importedRes).length,
        hasKnockout: hasKo,
        state: readyState,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid tournament file format.';
      setError(msg);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => setError('Failed to read the selected file.');
    reader.onload = () => {
      const text = String(reader.result || '');
      setJsonText(text);
      parseAndValidate(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => setError('Failed to read dropped file.');
    reader.onload = () => {
      const text = String(reader.result || '');
      setJsonText(text);
      parseAndValidate(text);
    };
    reader.readAsText(file);
  };

  // One-click load for preset
  const handleLoadAttachmentPreset = async () => {
    try {
      const res = await fetch('/assets/aistudio/tekken-tournament-2026-11-03-fixed_46028ca2.json');
      if (!res.ok) {
        throw new Error('Could not fetch preset file');
      }
      const text = await res.text();
      setJsonText(text);
      parseAndValidate(text);
    } catch (err) {
      const fallback = JSON.stringify({
        app: 'tekken-home',
        version: 1,
        exported: '2026-11-03T17:06:50.221Z',
        names: ['Pius', 'Hrishi', 'Ritu', 'Krish', 'Pratham', 'Parth', 'Sanskar'],
        res: {
          '1-6-1': 'a20', '2-5-1': 'b21', '3-4-1': 'b20', '0-6-1': 'b21', '1-4-1': 'a20',
          '2-3-1': 'b20', '0-5-1': 'a20', '4-6-1': 'a20', '1-2-1': 'a20', '0-4-1': 'a20',
          '3-5-1': 'a20', '2-6-1': 'b20', '0-3-1': 'a21', '2-4-1': 'b20', '1-5-1': 'a21',
          '0-2-1': 'a20', '1-3-1': 'b20', '5-6-1': 'b20', '0-1-1': 'a20', '3-6-1': 'b20',
          '4-5-1': 'a20', '1-6-2': 'a20', '2-5-2': 'b21', '3-4-2': 'b21', '0-6-2': 'a20',
          '1-4-2': 'b20', '2-3-2': 'b21', '0-5-2': 'a20', '4-6-2': 'b21', '1-2-2': 'a21',
          '0-4-2': 'b21', '3-5-2': 'a21', '2-6-2': 'a20', '0-3-2': 'a21', '2-4-2': 'b20',
          '1-5-2': 'a21', '0-2-2': 'a20', '1-3-2': 'a20', '5-6-2': 'a20', '0-1-2': 'b20',
          '3-6-2': 'b20', '4-5-2': 'a21'
        },
        ko: { m1: 0, m2: 6, w: 0, l: 4, r: 6, f: 0 }
      }, null, 2);
      setJsonText(fallback);
      parseAndValidate(fallback);
    }
  };

  const handleConfirmImport = () => {
    if (!preview) return;
    onImportSuccess(preview.state);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xs select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col w-full max-w-lg max-h-[88vh] sm:max-h-[82vh] bg-[var(--surface)] border border-[var(--border2)] shadow-2xl overflow-hidden pb-safe sm:pb-0 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)]">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-white" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-strong)]">
              Import tournament
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[var(--text-3)] hover:text-white hover:bg-[var(--surface3)] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Preset Quick Load */}
          <div className="p-3 bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[var(--ink-strong)] block uppercase">
                Load example
              </span>
              <span className="text-[var(--text-3)] text-[11px]">
                Pius, Hrishi, Ritu... (42 matches & playoffs)
              </span>
            </div>
            <button
              type="button"
              onClick={handleLoadAttachmentPreset}
              className="px-3 py-1.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:opacity-90 inline-flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use example</span>
            </button>
          </div>

          {/* Drag & Drop File Picker */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border border-dashed border-[var(--border2)] hover:border-white bg-[var(--surface2)] cursor-pointer text-center transition-colors space-y-2"
          >
            <Upload className="w-5 h-5 mx-auto text-[var(--text-3)]" />
            <div className="text-xs text-[var(--text-2)] uppercase">
              <span className="font-bold text-white">Choose a file</span> or drag it here
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Paste JSON area */}
          <div>
            <label className="block text-[11px] font-bold text-[var(--text-3)] mb-1 uppercase tracking-wider">
              OR PASTE JSON PAYLOAD:
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                if (e.target.value.trim()) {
                  parseAndValidate(e.target.value);
                } else {
                  setPreview(null);
                  setError(null);
                }
              }}
              rows={4}
              placeholder='Paste tournament JSON string here...'
              className="w-full p-2.5 text-xs font-mono bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-strong)] focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[var(--surface2)] border border-[var(--danger)] text-xs text-[var(--danger)]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Valid Preview Card */}
          {preview && (
            <div className="p-3.5 bg-[var(--surface2)] border border-white space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-white uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>VALID TOURNAMENT ARCHIVE:</span>
              </div>
              <div className="space-y-1 text-[var(--text-2)] text-[11px]">
                <div>
                  <span className="text-white font-bold">{preview.names.length} players:</span>{' '}
                  {preview.names.join(', ')}
                </div>
                <div>
                  <span className="text-white font-bold">MATCH RECORD:</span>{' '}
                  {preview.matchesCount} completed fixtures
                </div>
                <div>
                  <span className="text-white font-bold">PLAYOFF BRACKET:</span>{' '}
                  {preview.hasKnockout ? 'Progression state included' : 'No playoff matches played yet'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 sm:px-5 py-3 border-t border-[var(--border)] bg-[var(--surface2)]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs uppercase bg-[var(--surface)] hover:bg-[var(--surface3)] border border-[var(--border)] text-[var(--text-2)] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={!preview}
            className="px-4 py-1.5 text-xs font-bold uppercase bg-white text-black hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Replace current tournament
          </button>
        </div>
      </div>
    </div>
  );
};
