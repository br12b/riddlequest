
import React from 'react';
import { LeaderboardEntry } from '../types';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface Props {
  entries: LeaderboardEntry[];
  currentUserAddress: string | null;
}

export const Leaderboard: React.FC<Props> = ({ entries, currentUserAddress }) => {
  return (
    <div className="w-full bg-[#1A1523]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fc-purple via-fc-neon to-fc-purple"></div>
      
      <div className="flex items-center gap-2 mb-6">
        <TrophyIcon className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-display font-bold text-white tracking-wider">TOP SOLVERS</h3>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div 
            key={entry.rank}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              entry.address === currentUserAddress 
                ? 'bg-fc-purple/20 border-fc-purple/50 shadow-[0_0_15px_rgba(133,93,205,0.2)]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-8 h-8 flex items-center justify-center rounded-lg font-bold font-mono text-sm
                ${entry.rank === 1 ? 'bg-yellow-500 text-black' : 
                  entry.rank === 2 ? 'bg-gray-400 text-black' : 
                  entry.rank === 3 ? 'bg-orange-700 text-white' : 'bg-black/30 text-gray-400'}
              `}>
                {entry.rank}
              </div>
              <div className="flex flex-col">
                <span className={`font-mono text-sm ${entry.address === currentUserAddress ? 'text-fc-neon' : 'text-gray-300'}`}>
                  {entry.address}
                </span>
                <div className="flex gap-1">
                  {entry.badges.map((b, i) => <span key={i} className="text-xs">{b}</span>)}
                </div>
              </div>
            </div>
            
            <div className="font-display font-bold text-white">
              {entry.score.toLocaleString()} <span className="text-xs text-fc-purple">XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
