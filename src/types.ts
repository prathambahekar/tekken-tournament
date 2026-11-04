export type FighterType = 'Base' | 'DLC' | 'Guest';

export interface Fighter {
  id: string;
  name: string;
  type: FighterType;
  style: string;
  origin?: string;
  initials: string;
  hue: number;
  img?: string;
}

export interface MatchFixture {
  id: string; // e.g. "0-1-1"
  a: number;  // player index A
  b: number;  // player index B
  rd: number; // round number
  leg: number; // 1 or 2
}

export type MatchResultValue = 'a20' | 'a21' | 'b20' | 'b21';

export interface StandingsRow {
  i: number;
  name: string;
  fighter?: Fighter | null;
  p: number;   // played
  w: number;   // won
  l: number;   // lost
  pts: number; // points
  rf: number;  // rounds for
  ra: number;  // rounds against
  diff: number;// round difference
  status?: 'Q' | 'DQ' | null;
  rank: number;
}

export type KnockoutMatchId = 'm1' | 'm2' | 'w' | 'l' | 'r' | 'f';

export type TournamentFormat = 'single' | 'double';

export interface TournamentState {
  names: string[];
  chars: (string | null)[];
  format?: TournamentFormat;
  res: Record<string, MatchResultValue>; // fixtureId -> result
  ko: Record<KnockoutMatchId, number | null>; // matchId -> winner player index
}

export type ActiveTab = 'players' | 'table' | 'matches' | 'knockout' | 'rules';
