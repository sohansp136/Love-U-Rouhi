import React, { useState } from 'react';
import { Sparkles, Heart, Lightbulb, ArrowRight, X, CheckCircle2, Bookmark, Gift, Compass } from 'lucide-react';
import { anniversaryAppIdeas } from '../data/defaultData';
import { AnniversaryIdeaGuide } from '../types';

interface IdeaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSection: (sectionId: string) => void;
}

export const IdeaGuideModal: React.FC<IdeaGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToSection
}) => {
  const [selectedIdea, setSelectedIdea] = useState<AnniversaryIdeaGuide>(anniversaryAppIdeas[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-stone-100 flex items-center gap-2">
                5 Thoughtful Ideas for Your Wife's Anniversary App
              </h2>
              <p className="text-xs text-stone-400">
                Concepts engineered specifically for single-person emotional gifts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left sidebar list & Right deep-dive */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-stone-800">
          
          {/* Left Column: Idea Navigation */}
          <div className="md:col-span-5 p-4 space-y-2 overflow-y-auto max-h-[350px] md:max-h-full">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 px-3 py-1">
              Curated Concept Architectures
            </div>
            {anniversaryAppIdeas.map((idea, index) => {
              const isSelected = selectedIdea.id === idea.id;
              return (
                <button
                  key={idea.id}
                  onClick={() => setSelectedIdea(idea)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-rose-950/50 border border-rose-500/40 text-stone-100 shadow-md'
                      : 'hover:bg-stone-800/60 border border-transparent text-stone-300'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-serif flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-rose-500 text-white font-bold' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium leading-snug line-clamp-1">{idea.title}</h3>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{idea.tagline}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px]">
                      <span className="text-amber-400 font-medium">{idea.difficulty}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: In-Depth Breakdown */}
          <div className="md:col-span-7 p-6 space-y-6 overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-xs text-rose-400 font-medium mb-1">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>Concept Blueprint #{anniversaryAppIdeas.findIndex(i => i.id === selectedIdea.id) + 1}</span>
              </div>
              <h3 className="font-serif text-2xl text-stone-100 font-medium">
                {selectedIdea.title}
              </h3>
              <p className="text-sm text-stone-300 font-light mt-1">
                {selectedIdea.tagline}
              </p>
            </div>

            <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                The Core Experience
              </h4>
              <p className="text-sm text-stone-300 leading-relaxed font-light">
                {selectedIdea.description}
              </p>
            </div>

            <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-900/40">
              <h4 className="text-xs uppercase tracking-wider text-rose-300 font-semibold mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-300" />
                Why Your Wife Will Treasure This
              </h4>
              <p className="text-sm text-rose-200/90 leading-relaxed font-light">
                {selectedIdea.whySheWillLoveIt}
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
                How to Make it Unforgettable
              </h4>
              <ul className="space-y-2.5">
                {selectedIdea.howToMakeItUnforgettable.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Jump into live implementation */}
            <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
              <div className="text-xs text-stone-400">
                Already built right inside this app!
              </div>
              <button
                onClick={() => {
                  onJumpToSection(selectedIdea.interactiveDemoSectionId);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
              >
                <span>Jump To Live Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
