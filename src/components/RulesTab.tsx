import React from 'react';
import { BookOpen, Trophy, ShieldCheck, Flame, Scale, GitBranch } from 'lucide-react';

interface RulesTabProps {
  playerCount: number;
}

export const RulesTab: React.FC<RulesTabProps> = ({ playerCount }) => {
  const totalMatches = playerCount * (playerCount - 1);
  const totalRounds = 2 * (playerCount + (playerCount % 2) - 1);

  const rules = [
    {
      title: 'Match Format',
      icon: Flame,
      color: 'text-[var(--debit)]',
      bg: 'bg-[var(--debit-bg)]',
      content: (
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          Standard Tekken 7 competitive match format: <span className="font-semibold text-[var(--text)]">First to 2 rounds (Best of 3 rounds)</span> wins the match fixture. Set round time to 60 seconds on standard game settings.
        </p>
      ),
    },
    {
      title: '3-Point System',
      icon: Trophy,
      color: 'text-[var(--amber)]',
      bg: 'bg-[var(--amber-bg)]',
      content: (
        <div className="space-y-1.5 text-xs text-[var(--text-2)] leading-relaxed">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface2)]">
            <span className="font-semibold text-[var(--text)]">2–0 Sweep:</span>
            <span className="font-bold text-[var(--credit)]">+3 Points</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface2)]">
            <span className="font-semibold text-[var(--text)]">2–1 Close Win:</span>
            <span className="font-bold text-[var(--amber)]">+2 Points</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface2)]">
            <span className="font-semibold text-[var(--text)]">Match Loss:</span>
            <span className="font-bold text-[var(--text-3)]">0 Points</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Double Round Robin',
      icon: Scale,
      color: 'text-[var(--credit)]',
      bg: 'bg-[var(--credit-bg)]',
      content: (
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          With <span className="font-semibold text-[var(--text)]">{playerCount} players</span>, each competitor plays every rival twice across <span className="font-semibold text-[var(--text)]">Leg 1 and Leg 2</span> (totaling {totalMatches} matches over {totalRounds} rounds). {playerCount % 2 !== 0 ? 'Because the player count is odd, one competitor receives a bye rest in each round.' : 'Pairs alternate each round.'}
        </p>
      ),
    },
    {
      title: 'Tie-Breaking Hierarchy',
      icon: ShieldCheck,
      color: 'text-[var(--info)]',
      bg: 'bg-[var(--surface2)]',
      content: (
        <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--text-2)] leading-relaxed">
          <li><span className="font-semibold text-[var(--text)]">Total Championship Points</span></li>
          <li><span className="font-semibold text-[var(--text)]">Total Match Victories (W)</span></li>
          <li><span className="font-semibold text-[var(--text)]">Round Differential (RF minus RA)</span></li>
          <li><span className="font-semibold text-[var(--text)]">Initial Tournament Seed / Head-to-Head</span></li>
        </ol>
      ),
    },
    {
      title: 'Q & DQ Mathematical Status',
      icon: BookOpen,
      color: 'text-[var(--text-2)]',
      bg: 'bg-[var(--surface2)]',
      content: (
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          The live standings table analyzes remaining fixtures: <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--credit-bg)] text-[var(--credit)]">Q</span> indicates mathematically guaranteed Top 4 qualification. <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--debit-bg)] text-[var(--debit)]">DQ</span> indicates mathematical elimination from Top 4.
        </p>
      ),
    },
    {
      title: 'Playoff Double-Elimination',
      icon: GitBranch,
      color: 'text-[var(--amber)]',
      bg: 'bg-[var(--amber-bg)]',
      content: (
        <ul className="space-y-1 text-xs text-[var(--text-2)] leading-relaxed">
          <li><span className="font-semibold text-[var(--text)]">Match 1:</span> 1st Seed vs 2nd Seed</li>
          <li><span className="font-semibold text-[var(--text)]">Match 2:</span> 3rd Seed vs 4th Seed</li>
          <li><span className="font-semibold text-[var(--text)]">Winners Match:</span> W1 vs W2 (Winner to Final)</li>
          <li><span className="font-semibold text-[var(--text)]">Losers Match:</span> L1 vs L2 (Loser out)</li>
          <li><span className="font-semibold text-[var(--text)]">Second Chance:</span> Losers Match Winner vs Winners Match Loser</li>
          <li><span className="font-semibold text-[var(--text)]">Grand Final:</span> Winners Finalist vs Second Chance Finalist</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <h2 className="text-lg font-bold font-display tracking-tight text-[var(--text)] mb-1">
          Official Tournament Rules & Scoring Guidelines
        </h2>
        <p className="text-xs text-[var(--text-2)] max-w-2xl">
          Everything you need to run a fair, exciting Tekken 7 home tournament, from round-robin math to double-elimination bracket resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${rule.bg} flex items-center justify-center ${rule.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--text)]">
                  {rule.title}
                </h3>
              </div>
              <div className="flex-1">{rule.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
