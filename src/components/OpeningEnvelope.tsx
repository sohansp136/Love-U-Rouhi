import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, X } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynthesizer';

interface OpeningEnvelopeProps {
  wifeName: string;
  husbandName: string;
  onOpen: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({
  wifeName,
  husbandName,
  onOpen,
  isOpen,
  onClose
}) => {
  const [isCracking, setIsCracking] = useState(false);

  if (isOpen) {
    return null;
  }

  const handleCrackSeal = () => {
    setIsCracking(true);
    romanticAudio.playSealBreakSound();

    // Trigger rose-gold and soft pink confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a', '#e11d48']
    });

    setTimeout(() => {
      onOpen();
      setIsCracking(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md transition-opacity duration-500">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          title="Skip to app"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="max-w-md w-full relative">
        {/* Decorative Floating ambient glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-rose-900/30 via-amber-800/20 to-rose-900/30 rounded-3xl blur-2xl -z-10" />

        {/* Vintage Letter Envelope */}
        <div className="relative bg-[#fcf9f2] text-stone-800 rounded-2xl shadow-2xl border border-amber-200/60 p-8 sm:p-10 overflow-hidden transform transition-all duration-700 hover:scale-[1.01]">
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#d6c7b2_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Postal Stamp & Postmark Detail */}
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="text-left">
              <span className="text-[11px] uppercase tracking-widest text-amber-900/60 font-semibold block">
                Special Delivery
              </span>
              <span className="font-handwriting text-2xl text-rose-800">
                To My Forever Person
              </span>
            </div>

            {/* Vintage Heart Postmark */}
            <div className="border-2 border-dashed border-rose-300 rounded-lg p-2.5 bg-rose-50/50 flex flex-col items-center rotate-3 shadow-inner">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="text-[9px] uppercase tracking-tighter text-rose-700 font-bold mt-1">
                FIRST CLASS LOVE
              </span>
            </div>
          </div>

          {/* Main Recipient Calligraphy */}
          <div className="my-10 text-center relative z-10 py-4 border-y border-amber-200/50">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
              Handcrafted exclusively for
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal italic tracking-wide">
              {wifeName}
            </h2>
            <p className="font-handwriting text-xl text-stone-600 mt-2">
              with all my heart, forever & always
            </p>
          </div>

          {/* Wax Seal Action Button */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={handleCrackSeal}
              disabled={isCracking}
              className={`relative group w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer ${
                isCracking ? 'scale-110 opacity-70' : 'hover:scale-105 active:scale-95'
              }`}
            >
              {/* Wax Seal Outer Rims */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 shadow-xl border-4 border-rose-500/80 group-hover:shadow-rose-600/50 group-hover:shadow-2xl transition-all" />
              
              {/* Wax Irregular Stamp Drops */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-800" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-rose-800" />

              {/* Heart Crest Inside Seal */}
              <div className="relative z-10 flex flex-col items-center text-rose-100">
                <Heart className="w-8 h-8 fill-rose-100 text-rose-800 stroke-[1.5] drop-shadow" />
                <span className="text-[10px] tracking-widest uppercase font-semibold text-rose-200 mt-0.5">
                  {isCracking ? 'Opening...' : 'Break Seal'}
                </span>
              </div>
            </button>

            <p className="text-xs text-stone-500 mt-4 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Tap the wax seal to unwrap your anniversary gift
            </p>
          </div>

          {/* From signature */}
          <div className="mt-8 text-right relative z-10">
            <span className="text-[11px] text-stone-400 block">From:</span>
            <span className="font-serif italic text-base text-stone-700">
              {husbandName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
