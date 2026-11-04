import { MatchFixture, MatchResultValue, StandingsRow, TournamentState, KnockoutMatchId, TournamentFormat } from '../types';
import { ROSTER_MAP } from '../data/roster';

export const LOCAL_STORAGE_KEY = 'tekken-home-v1';

/**
 * Generate standard round-robin fixtures using the polygon/circle method.
 * Supports 'single' (1 leg) or 'double' (2 legs). Odd counts receive a bye slot.
 */
export function buildFixtures(n: number, format: TournamentFormat = 'double'): MatchFixture[] {
  const m = n + (n % 2);
  const arr: number[] = [];
  const out: MatchFixture[] = [];

  for (let i = 0; i < m; i++) {
    arr.push(i);
  }

  const roundsPerLeg = m - 1;
  const maxLeg = format === 'single' ? 1 : 2;

  for (let leg = 1; leg <= maxLeg; leg++) {
    const a = arr.slice();
    for (let r = 0; r < roundsPerLeg; r++) {
      for (let i = 0; i < m / 2; i++) {
        const p1 = a[i];
        const p2 = a[m - 1 - i];
        if (p1 >= n || p2 >= n) continue;

        const x = Math.min(p1, p2);
        const y = Math.max(p1, p2);
        const roundNum = (leg - 1) * roundsPerLeg + r + 1;
        out.push({
          id: `${x}-${y}-${leg}`,
          a: x,
          b: y,
          rd: roundNum,
          leg,
        });
      }
      // Rotate array preserving index 0
      a.splice(1, 0, a.pop()!);
    }
  }

  return out;
}

export function getTotalRounds(n: number, format: TournamentFormat = 'double'): number {
  const roundsPerLeg = n + (n % 2) - 1;
  return format === 'single' ? roundsPerLeg : 2 * roundsPerLeg;
}

/**
 * Calculate full standings table from results
 */
export function computeStandings(
  names: string[],
  chars: (string | null)[],
  fixtures: MatchFixture[],
  results: Record<string, MatchResultValue>
): StandingsRow[] {
  const n = names.length;
  const table: StandingsRow[] = names.map((name, i) => {
    const charId = chars[i];
    return {
      i,
      name,
      fighter: charId ? ROSTER_MAP[charId] || null : null,
      p: 0,
      w: 0,
      l: 0,
      pts: 0,
      rf: 0,
      ra: 0,
      diff: 0,
      rank: 1,
    };
  });

  // Calculate stats from results
  fixtures.forEach((m) => {
    const r = results[m.id];
    if (!r) return;

    const winnerIndex = r[0] === 'a' ? m.a : m.b;
    const loserIndex = winnerIndex === m.a ? m.b : m.a;
    const isCloseFight = r.slice(1) === '21'; // 2-1 or 2-0

    table[winnerIndex].p++;
    table[loserIndex].p++;

    table[winnerIndex].w++;
    table[loserIndex].l++;

    table[winnerIndex].pts += isCloseFight ? 2 : 3;
    table[winnerIndex].rf += 2;
    table[winnerIndex].ra += isCloseFight ? 1 : 0;

    table[loserIndex].rf += isCloseFight ? 1 : 0;
    table[loserIndex].ra += 2;
  });

  // Calculate round difference
  table.forEach((row) => {
    row.diff = row.rf - row.ra;
  });

  // Sort: Points DESC, Wins DESC, Round Diff DESC, Index ASC
  table.sort((x, y) => {
    return (
      y.pts - x.pts ||
      y.w - x.w ||
      y.diff - x.diff ||
      x.i - y.i
    );
  });

  // Compute Q (guaranteed top-4) & DQ (eliminated from top-4)
  const playedCount = Object.keys(results).length;
  const totalMatches = fixtures.length;
  const isFinished = playedCount === totalMatches && totalMatches > 0;
  const maxMatchesPerPlayer = 2 * (n - 1);

  table.forEach((row, k) => {
    row.rank = k + 1;
    if (isFinished) {
      row.status = k < 4 ? 'Q' : 'DQ';
      return;
    }

    const remainingMatches = Math.max(0, maxMatchesPerPlayer - row.p);
    const maxPossiblePoints = row.pts + remainingMatches * 3;

    let definitelyAbove = 0;
    let couldReach = 0;

    table.forEach((other) => {
      if (other.i === row.i) return;
      if (other.pts > maxPossiblePoints) {
        definitelyAbove++;
      }
      const otherRemaining = Math.max(0, maxMatchesPerPlayer - other.p);
      const otherMaxPoints = other.pts + otherRemaining * 3;
      if (otherMaxPoints >= row.pts) {
        couldReach++;
      }
    });

    if (definitelyAbove >= 4) {
      row.status = 'DQ';
    } else if (couldReach <= 3 && playedCount > n) {
      row.status = 'Q';
    } else {
      row.status = null;
    }
  });

  return table;
}

/**
 * Knockout Bracket structure calculation
 */
export interface KnockoutMatchState {
  id: KnockoutMatchId;
  title: string;
  subtitle: string;
  players: [number | null, number | null];
  winner: number | null;
  loser: number | null;
}

export function computeKnockout(
  standings: StandingsRow[],
  koResults: Record<KnockoutMatchId, number | null>
): Record<KnockoutMatchId, KnockoutMatchState> {
  const seed: (number | null)[] = standings.slice(0, 4).map((s) => s.i);
  while (seed.length < 4) seed.push(null);

  function getWin(id: KnockoutMatchId, p0: number | null, p1: number | null): number | null {
    const w = koResults[id];
    if (p0 != null && p1 != null && (w === p0 || w === p1)) {
      return w;
    }
    return null;
  }

  function getLoser(p0: number | null, p1: number | null, winner: number | null): number | null {
    if (winner == null || p0 == null || p1 == null) return null;
    return winner === p0 ? p1 : p0;
  }

  // Match 1: 1st vs 2nd
  const m1_p: [number | null, number | null] = [seed[0], seed[1]];
  const m1_w = getWin('m1', m1_p[0], m1_p[1]);
  const m1_l = getLoser(m1_p[0], m1_p[1], m1_w);

  // Match 2: 3rd vs 4th
  const m2_p: [number | null, number | null] = [seed[2], seed[3]];
  const m2_w = getWin('m2', m2_p[0], m2_p[1]);
  const m2_l = getLoser(m2_p[0], m2_p[1], m2_w);

  // Winners Match (Semifinal): Winner M1 vs Winner M2
  const w_p: [number | null, number | null] = [m1_w, m2_w];
  const w_w = getWin('w', w_p[0], w_p[1]);
  const w_l = getLoser(w_p[0], w_p[1], w_w);

  // Losers Match (Elimination): Loser M1 vs Loser M2
  const l_p: [number | null, number | null] = [m1_l, m2_l];
  const l_w = getWin('l', l_p[0], l_p[1]);
  const l_l = getLoser(l_p[0], l_p[1], l_w);

  // Second Chance (Losers Final): Loser of Winners Match vs Winner of Losers Match
  const r_p: [number | null, number | null] = [l_w, w_l];
  const r_w = getWin('r', r_p[0], r_p[1]);
  const r_l = getLoser(r_p[0], r_p[1], r_w);

  // Grand Final: Winner of Winners Match vs Winner of Second Chance
  const f_p: [number | null, number | null] = [w_w, r_w];
  const f_w = getWin('f', f_p[0], f_p[1]);
  const f_l = getLoser(f_p[0], f_p[1], f_w);

  return {
    m1: {
      id: 'm1',
      title: 'Qualifier 1',
      subtitle: 'Seed 1 vs 2',
      players: m1_p,
      winner: m1_w,
      loser: m1_l,
    },
    m2: {
      id: 'm2',
      title: 'Qualifier 2',
      subtitle: 'Seed 3 vs 4',
      players: m2_p,
      winner: m2_w,
      loser: m2_l,
    },
    w: {
      id: 'w',
      title: 'Winners Final',
      subtitle: 'To Grand Final',
      players: w_p,
      winner: w_w,
      loser: w_l,
    },
    l: {
      id: 'l',
      title: 'Losers Match',
      subtitle: 'Elimination',
      players: l_p,
      winner: l_w,
      loser: l_l,
    },
    r: {
      id: 'r',
      title: 'Losers Final',
      subtitle: 'To Grand Final',
      players: r_p,
      winner: r_w,
      loser: r_l,
    },
    f: {
      id: 'f',
      title: 'Grand Final',
      subtitle: 'Championship',
      players: f_p,
      winner: f_w,
      loser: f_l,
    },
  };
}

const OLD_CHAR_DEFAULTS = [
  'Jin Kazama',
  'Kazuya Mishima',
  'Heihachi',
  'Hwoarang',
  'Paul Phoenix',
  'King',
  'Bryan Fury',
];

export function getDefaultTournament(): TournamentState {
  const defaultCount = 7;
  const initialNames = Array.from({ length: defaultCount }, (_, i) => `Player ${i + 1}`);
  const initialChars: (string | null)[] = Array.from({ length: defaultCount }, () => null);

  return {
    names: initialNames,
    chars: initialChars,
    format: 'double',
    res: {},
    ko: {
      m1: null,
      m2: null,
      w: null,
      l: null,
      r: null,
      f: null,
    },
  };
}

export function loadTournamentState(): TournamentState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return getDefaultTournament();
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.names) || data.names.length < 4 || data.names.length > 16) {
      return getDefaultTournament();
    }

    // If the stored state still has the old default character names as player names, migrate to Player 1, 2...
    const isOldDefault =
      data.names.length === OLD_CHAR_DEFAULTS.length &&
      data.names.every((n: string, i: number) => n === OLD_CHAR_DEFAULTS[i]);

    const finalNames = isOldDefault
      ? Array.from({ length: data.names.length }, (_, i) => `Player ${i + 1}`)
      : data.names;

    const finalChars = isOldDefault
      ? Array.from({ length: data.names.length }, () => null)
      : Array.isArray(data.chars)
      ? finalNames.map((_: string, idx: number) => data.chars[idx] || null)
      : finalNames.map(() => null);

    const format: TournamentFormat = data.format === 'single' ? 'single' : 'double';

    return {
      names: finalNames,
      chars: finalChars,
      format,
      res: data.res || {},
      ko: data.ko || {
        m1: null,
        m2: null,
        w: null,
        l: null,
        r: null,
        f: null,
      },
    };
  } catch {
    return getDefaultTournament();
  }
}

export function saveTournamentState(state: TournamentState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}
