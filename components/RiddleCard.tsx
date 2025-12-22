import React from 'react';
import { RiddleData } from '../types';
import { GenerativeCanvas } from './GenerativeCanvas';
import { EyeIcon, CpuChipIcon } from '@heroicons/react/24/solid';

interface Props {
  riddle: RiddleData;
  isLoading: boolean;
}

export const RiddleCard: React.FC<Props> = ({ riddle, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto bg-fc-card backdrop-blur-xl p-8 rounded-3xl border border-white/10 animate-pulse relative overflow-hidden">
        <div className="h-64 bg-white/5 rounded-2xl w-full mb-8"></div>
        <div className="h-4 bg-white/5 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto relative group perspective-1000">
      
      {/* Glow Effects - Adapts to riddle color */}
      <div 
        className="absolute -inset-1 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"
        style={{ 
          background: `linear-gradient(to right, ${riddle.visualConfig.colors[0]}, ${riddle.visualConfig.colors[1] || '#fff'})` 
        }}
      ></div>
      
      <div className="relative w-full bg-[#1A1523]/90 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Header Badge */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-display uppercase tracking-[0.2em] text-gray-500 mb-1">The Artifact</span>
            <span className="text-xs font-bold bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
              <CpuChipIcon className="w-3 h-3" />
              ID: {riddle.id.slice(0, 8)}
            </span>
          </div>
           <div className="text-right">
             <div className="flex gap-1 mt-1 justify-end">
               {[1,2,3].map((star) => (
                 <div key={star} className={`w-1.5 h-1.5 rounded-full ${
                    (riddle.difficulty === 'Easy' && star === 1) ||
                    (riddle.difficulty === 'Medium' && star <= 2) ||
                    (riddle.difficulty === 'Hard') 
                    ? 'bg-white shadow-[0_0_5px_#fff]' 
                    : 'bg-gray-800'
                 }`}></div>
               ))}
             </div>
           </div>
        </div>

        {/* THE ARTIFACT (Generative Canvas) */}
        <div className="mb-6 relative group-hover:scale-[1.02] transition-transform duration-500">
           <GenerativeCanvas config={riddle.visualConfig} />
        </div>

        {/* The Cryptic Hint */}
        <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gray-500"></div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Decipher Signal</span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gray-500"></div>
            </div>
            <h2 className="text-xl md:text-2xl font-sans font-light italic leading-relaxed text-white/90">
            "{riddle.question}"
            </h2>
        </div>

      </div>
    </div>
  );
};