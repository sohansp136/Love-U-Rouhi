import React, { useState } from 'react';
import { Mail, Heart, Sparkles, X, Plus } from 'lucide-react';
import { LoveLetter, UserRole } from '../types';
import { romanticAudio } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface OpenWhenLettersProps {
  letters: LoveLetter[];
  wifeName: string;
  husbandName: string;
  currentRole?: UserRole;
  onAddLetter: (letter: Omit<LoveLetter, 'id'>) => void;
  onOpenLetter?: (id: string) => void;
}

export const OpenWhenLetters: React.FC<OpenWhenLettersProps> = ({
  letters,
  wifeName,
  husbandName,
  currentRole = 'husband',
  onAddLetter,
  onOpenLetter
}) => {
  const isWife = currentRole === 'wife';
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [isWritingNew, setIsWritingNew] = useState(false);

  // New letter form
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newColor, setNewColor] = useState('#e11d48');
  const [newContent, setNewContent] = useState('');

  const handleOpenLetter = (letter: LoveLetter) => {
    setSelectedLetter(letter);
    romanticAudio.playSealBreakSound();
    onOpenLetter?.(letter.id);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#fda4af', '#f43f5e', '#fef08a']
    });
  };

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddLetter({
      title: newTitle,
      sealedPrompt: newPrompt || `Open when you need love`,
      sealColor: newColor,
      dateWritten: 'Anniversary Keepsake',
      content: newContent.split('\n\n').filter(Boolean),
      signoff: `With all my heart,\n${husbandName}`,
      isOpened: false
    });

    setNewTitle('');
    setNewPrompt('');
    setNewContent('');
    setIsWritingNew(false);
  };

  return (
    <section id="sealed-letters" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-rose-400 font-serif italic text-base">To Open Throughout Our Year</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-stone-100 font-normal tracking-tight mt-1 mb-3">
          Wax-Sealed "Open When..." Letters
        </h2>
        <p className="text-stone-400 text-sm font-light">
          A promise that no matter where you are or what the day holds, my words will always be here to hold you.
        </p>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {letters.map((letter) => (
          <div
            key={letter.id}
            onClick={() => handleOpenLetter(letter)}
            className="group relative bg-[#fdfbf7] rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-amber-200/70 text-stone-900 cursor-pointer flex flex-col justify-between min-h-[260px] overflow-hidden"
          >
            {/* Envelope flap aesthetic styling */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-100/60 to-transparent border-b border-amber-200/40 pointer-events-none" />

            {/* Top Prompt Badge */}
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-900/60 block mb-1">
                Wax Sealed Letter
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug group-hover:text-rose-700 transition-colors">
                {letter.title}
              </h3>
            </div>

            {/* Middle Prompt */}
            <div className="my-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200/50">
              <p className="text-xs font-handwriting text-stone-700 text-base leading-snug">
                "{letter.sealedPrompt}"
              </p>
            </div>

            {/* Wax Seal at bottom */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
              <span className="text-[11px] text-stone-500 font-sans">
                {letter.dateWritten}
              </span>

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform"
                style={{ backgroundColor: letter.sealColor }}
              >
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Husband quick trigger to add another letter */}
      {!isWife && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsWritingNew(true)}
            className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-rose-400 font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Husband: Write another "Open When..." letter</span>
          </button>
        </div>
      )}

      {/* Letter Reading Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-[#fcf9f2] text-stone-900 border border-amber-200 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#d6c7b2_0.8px,transparent_0.8px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stationery Header */}
            <div className="text-center pb-6 border-b border-amber-200/60 relative z-10">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg"
                style={{ backgroundColor: selectedLetter.sealColor }}
              >
                <Heart className="w-6 h-6 fill-white text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block">
                {selectedLetter.sealedPrompt}
              </span>
              <h3 className="font-serif text-3xl font-normal text-stone-900 mt-1">
                {selectedLetter.title}
              </h3>
            </div>

            {/* Letter Body */}
            <div className="py-8 space-y-4 relative z-10">
              {selectedLetter.content.map((paragraph, idx) => (
                <p key={idx} className="font-serif text-lg text-stone-800 leading-relaxed font-light">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Handwritten Signoff */}
            <div className="pt-6 border-t border-amber-200/60 relative z-10 text-right">
              <p className="font-handwriting text-2xl text-rose-800 whitespace-pre-line">
                {selectedLetter.signoff}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Write New Letter Modal */}
      {isWritingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
            <button
              onClick={() => setIsWritingNew(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-stone-100 mb-1">
              Write an "Open When..." Letter
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Write a letter she can unlock when she needs your love the most.
            </p>

            <form onSubmit={handleCreateLetter} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Letter Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. When You Can't Sleep"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Envelope Prompt
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Open when it's 2am and your mind won't quiet down"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Wax Seal Color
                </label>
                <div className="flex gap-3">
                  {[
                    { color: '#e11d48', label: 'Crimson' },
                    { color: '#b45309', label: 'Gold' },
                    { color: '#7c3aed', label: 'Violet' },
                    { color: '#059669', label: 'Emerald' }
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.color}
                      onClick={() => setNewColor(item.color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                        newColor === item.color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Letter Content
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Pour your heart out here... Separate paragraphs with a blank line."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWritingNew(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md shadow-rose-900/30 cursor-pointer"
                >
                  Seal Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
