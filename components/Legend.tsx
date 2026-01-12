import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Circle } from 'lucide-react';

export const Legend: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 text-zinc-400">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-800 rounded-lg"><ArrowUp size={20} /></div>
        <span className="text-xs">Relevante + Like</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-800 rounded-lg"><ArrowRight size={20} /></div>
        <span className="text-xs">Relevante</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-800 rounded-lg"><ArrowDown size={20} /></div>
        <span className="text-xs">Irrelevante + Dislike</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-800 rounded-lg"><ArrowLeft size={20} /></div>
        <span className="text-xs">Irrelevante</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-800 rounded-lg"><Circle size={20} /></div>
        <span className="text-xs">Favoritos (Círculo)</span>
      </div>
    </div>
  );
};
