import React from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';

import { UserRole } from '../types';

interface FooterProps {
  wifeName: string;
  husbandName: string;
  currentRole?: UserRole;
  onOpenIdeas: () => void;
  onOpenCustomize: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  wifeName,
  husbandName,
  currentRole = 'husband',
  onOpenIdeas,
  onOpenCustomize
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isWife = currentRole === 'wife';

  return (
    <footer className="border-t border-stone-800 bg-stone-950 py-16 px-4 sm:px-6 text-center text-stone-400">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Monogram Seal */}
        <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/40 mx-auto flex items-center justify-center text-rose-400 shadow-inner">
          <Heart className="w-5 h-5 fill-rose-500" />
        </div>

        <div>
          <h3 className="font-serif text-2xl sm:text-3xl text-stone-200 font-normal">
            Forever & Always, My Love
          </h3>
          <p className="font-handwriting text-2xl text-rose-300 mt-1">
            "To the moon, the stars, and every single tomorrow."
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
          <span>Made for {wifeName}</span>
          <span className="text-stone-700">·</span>
          <span>Crafted by {husbandName}</span>
          {!isWife && (
            <>
              <span className="text-stone-700">·</span>
              <button
                onClick={onOpenIdeas}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Review Anniversary App Ideas
              </button>
              <span className="text-stone-700">·</span>
              <button
                onClick={onOpenCustomize}
                className="text-rose-400 hover:underline cursor-pointer"
              >
                Edit Personal Details
              </button>
            </>
          )}
        </div>

        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400">
          <p>
            An intimate keepsake app built for just one extraordinary person.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
