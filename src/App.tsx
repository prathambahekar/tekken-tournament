import React, { useState, useEffect, useMemo } from 'react';
import { TournamentState, ActiveTab, KnockoutMatchId, MatchResultValue, TournamentFormat } from './types';
import {
  loadTournamentState,
  saveTournamentState,
  buildFixtures,
  getTotalRounds,
  computeStandings,
  computeKnockout,
} from './utils/tournament';
import { Navbar } from './components/Navbar';
import { PlayersTab } from './components/PlayersTab';
import { PointsTableTab } from './components/PointsTableTab';
import { MatchesTab } from './components/MatchesTab';
import { KnockoutTab } from './components/KnockoutTab';
import { RulesTab } from './components/RulesTab';
import { CharacterPickerModal } from './components/CharacterPickerModal';
import { ImportModal } from './components/ImportModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<TournamentState>(loadTournamentState);
  const [activeTab, setActiveTab] = useState<ActiveTab>('players');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tekken-theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    playerIndex: number;
  }>({
    isOpen: false,
    playerIndex: 0,
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync theme attribute with documentElement & body
  useEffect(() => {
    const themeStr = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeStr);
    document.documentElement.setAttribute('data-color-scheme', themeStr);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('tekken-theme', themeStr);
  }, [isDark]);

  // Sync tab with URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as ActiveTab;
    if (['players', 'table', 'matches', 'knockout', 'rules'].includes(hash)) {
      setActiveTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '') as ActiveTab;
      if (['players', 'table', 'matches', 'knockout', 'rules'].includes(newHash)) {
        setActiveTab(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    try {
      window.history.pushState(null, '', `#${tab}`);
    } catch {
      // safe fallback
    }
  };

  // Autosave state
  useEffect(() => {
    saveTournamentState(state);
  }, [state]);

  const n = state.names.length;
  const format: TournamentFormat = state.format === 'single' ? 'single' : 'double';
  const fixtures = useMemo(() => buildFixtures(n, format), [n, format]);
  const totalRounds = useMemo(() => getTotalRounds(n, format), [n, format]);

  const standings = useMemo(
    () => computeStandings(state.names, state.chars, fixtures, state.res),
    [state.names, state.chars, fixtures, state.res]
  );

  const completedMatches = Object.keys(state.res).length;
  const totalMatches = fixtures.length;
  const isRoundRobinComplete = completedMatches === totalMatches && totalMatches > 0;
  const remainingMatches = totalMatches - completedMatches;

  const koState = useMemo(() => computeKnockout(standings, state.ko), [standings, state.ko]);
  const championIndex = koState.f.winner;
  const championName = championIndex != null ? state.names[championIndex] : null;

  // Player count change handler
  const handleChangePlayerCount = (newCount: number) => {
    if (newCount < 4 || newCount > 16 || newCount === n) return;

    const newNames = Array.from({ length: newCount }, (_, i) => state.names[i] || `Player ${i + 1}`);
    const newChars = Array.from({ length: newCount }, (_, i) => state.chars[i] || null);

    setState((prev) => ({
      names: newNames,
      chars: newChars,
      format: prev.format || 'double',
      res: {},
      ko: { m1: null, m2: null, w: null, l: null, r: null, f: null },
    }));
    showToast(`Player count updated to ${newCount}`);
  };

  // Format change handler (Single vs Double Round-Robin)
  const handleChangeFormat = (newFormat: TournamentFormat) => {
    if (newFormat === format) return;

    setState((prev) => {
      // If switching from double to single, prune leg 2 results
      const updatedRes: Record<string, MatchResultValue> = {};
      if (newFormat === 'single') {
        Object.entries(prev.res).forEach(([key, val]) => {
          if (!key.endsWith('-2')) {
            updatedRes[key] = val;
          }
        });
      } else {
        Object.assign(updatedRes, prev.res);
      }

      return {
        ...prev,
        format: newFormat,
        res: updatedRes,
      };
    });
    showToast(`Format set to ${newFormat === 'single' ? 'Single' : 'Double'} Round-Robin`);
  };

  // Names update
  const handleUpdateNames = (newNames: string[]) => {
    setState((prev) => ({
      ...prev,
      names: newNames,
    }));
  };

  // Characters update
  const handleUpdateChars = (newChars: (string | null)[]) => {
    setState((prev) => ({
      ...prev,
      chars: newChars,
    }));
  };

  // Match score update
  const handleSetMatchResult = (matchId: string, result: MatchResultValue | null) => {
    setState((prev) => {
      const updated = { ...prev.res };
      if (result === null) {
        delete updated[matchId];
      } else {
        updated[matchId] = result;
      }
      return {
        ...prev,
        res: updated,
      };
    });
  };



  // Knockout match winner toggle
  const handleSelectKnockoutWinner = (matchId: KnockoutMatchId, playerIndex: number) => {
    setState((prev) => {
      const current = prev.ko[matchId];
      const updatedKo = { ...prev.ko };

      if (current === playerIndex) {
        updatedKo[matchId] = null;
        if (matchId === 'm1' || matchId === 'm2') {
          updatedKo.w = null;
          updatedKo.l = null;
          updatedKo.r = null;
          updatedKo.f = null;
        } else if (matchId === 'w') {
          updatedKo.r = null;
          updatedKo.f = null;
        } else if (matchId === 'l') {
          updatedKo.r = null;
          updatedKo.f = null;
        } else if (matchId === 'r') {
          updatedKo.f = null;
        }
      } else {
        updatedKo[matchId] = playerIndex;
      }

      return {
        ...prev,
        ko: updatedKo,
      };
    });
  };

  // Reset knockout
  const handleResetKnockout = () => {
    setState((prev) => ({
      ...prev,
      ko: { m1: null, m2: null, w: null, l: null, r: null, f: null },
    }));
    showToast('Playoff bracket reset');
  };

  // Reset all results
  const handleResetResults = () => {
    setState((prev) => ({
      ...prev,
      res: {},
      ko: { m1: null, m2: null, w: null, l: null, r: null, f: null },
    }));
    showToast('All match results reset');
  };

  // Export JSON
  const handleExport = () => {
    const data = {
      app: 'tekken-home',
      version: 1,
      exported: new Date().toISOString(),
      names: state.names,
      chars: state.chars,
      format: state.format || 'double',
      res: state.res,
      ko: state.ko,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tekken7-tournament-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Tournament exported to JSON file');
  };

  // Import JSON success
  const handleImportSuccess = (importedState: TournamentState) => {
    setState(importedState);
    saveTournamentState(importedState);
    showToast(
      `Imported tournament: ${importedState.names.length} players and ${Object.keys(importedState.res).length} match results loaded!`
    );
    // Switch to Standings table so user immediately sees the results
    setActiveTab('table');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 sm:top-18 left-3.5 right-3.5 sm:left-auto sm:right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold shadow-lg text-[var(--text)] animate-in slide-in-from-top-2 duration-150">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[var(--credit)] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[var(--amber)] shrink-0" />
          )}
          <span className="truncate">{toast.message}</span>
        </div>
      )}

      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        playerCount={n}
        completedMatches={completedMatches}
        totalMatches={totalMatches}
        championName={championName}
        format={format}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 pt-1 sm:pt-0 pb-24 md:pb-16">
        {activeTab === 'players' && (
          <PlayersTab
            state={state}
            format={format}
            onChangeFormat={handleChangeFormat}
            onUpdateNames={handleUpdateNames}
            onUpdateChars={handleUpdateChars}
            onChangePlayerCount={handleChangePlayerCount}
            onOpenCharacterPicker={(playerIndex) =>
              setPickerModal({ isOpen: true, playerIndex })
            }
            onExport={handleExport}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onResetResults={handleResetResults}
          />
        )}

        {activeTab === 'table' && (
          <PointsTableTab
            standings={standings}
            fixtures={fixtures}
            results={state.res}
            playerNames={state.names}
            format={format}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesTab
            names={state.names}
            chars={state.chars}
            fixtures={fixtures}
            results={state.res}
            totalRounds={totalRounds}
            format={format}
            onSetResult={handleSetMatchResult}
          />
        )}

        {activeTab === 'knockout' && (
          <KnockoutTab
            standings={standings}
            koResults={state.ko}
            isRoundRobinComplete={isRoundRobinComplete}
            totalMatches={totalMatches}
            remainingMatches={remainingMatches}
            previewMode={previewMode}
            onTogglePreviewMode={() => setPreviewMode((prev) => !prev)}
            onSelectWinner={handleSelectKnockoutWinner}
            onResetKnockout={handleResetKnockout}
          />
        )}

        {activeTab === 'rules' && <RulesTab playerCount={n} format={format} />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        completedMatches={completedMatches}
        totalMatches={totalMatches}
        hasChampion={!!championName}
      />

      {/* Fighter Picker Modal */}
      <CharacterPickerModal
        isOpen={pickerModal.isOpen}
        playerIndex={pickerModal.playerIndex}
        playerName={state.names[pickerModal.playerIndex] || `Player ${pickerModal.playerIndex + 1}`}
        currentFighterId={state.chars[pickerModal.playerIndex]}
        onSelect={(fighterId) => {
          const updated = [...state.chars];
          updated[pickerModal.playerIndex] = fighterId;
          handleUpdateChars(updated);
          setPickerModal({ isOpen: false, playerIndex: 0 });
        }}
        onClose={() => setPickerModal({ isOpen: false, playerIndex: 0 })}
      />

      {/* Import Tournament Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
