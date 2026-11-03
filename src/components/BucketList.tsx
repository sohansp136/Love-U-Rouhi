import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Compass,
  MapPin,
  Calendar,
  X,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BucketListItem } from '../types';

interface BucketListProps {
  items: BucketListItem[];
  wifeName: string;
  husbandName: string;
  onAddItem: (title: string, category: BucketListItem['category'], targetTime?: string, note?: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export const BucketList: React.FC<BucketListProps> = ({
  items,
  wifeName,
  husbandName,
  onAddItem,
  onToggleItem,
  onDeleteItem
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BucketListItem['category']>('travel');
  const [newTarget, setNewTarget] = useState('');
  const [newNote, setNewNote] = useState('');

  const completedCount = items.filter((i) => i.isCompleted).length;

  const handleToggle = (id: string, currentState: boolean) => {
    if (!currentState) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f43f5e', '#fbbf24']
      });
    }
    onToggleItem(id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem(newTitle, newCategory, newTarget, newNote);
    setNewTitle('');
    setNewCategory('travel');
    setNewTarget('');
    setNewNote('');
    setIsAdding(false);
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.isCompleted;
    if (filter === 'completed') return item.isCompleted;
    return true;
  });

  const getCategoryLabel = (cat: BucketListItem['category']) => {
    switch (cat) {
      case 'travel': return 'Travel';
      case 'adventure': return 'Adventure';
      case 'experience': return 'Experience';
      case 'lifestyle': return 'Lifestyle';
      default: return 'Milestone';
    }
  };

  return (
    <section id="bucket-list" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-rose-400 font-serif italic text-base">Shared Horizons</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-stone-100 font-normal tracking-tight mt-1 mb-3">
          Our Couple Bucket List
        </h2>
        <p className="text-stone-400 text-sm font-light">
          A collection of places to see, adventures to chase, and sweet milestones to accomplish hand in hand.
        </p>

        {/* Progress & Filters */}
        {items.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-stone-900 border border-stone-800 rounded-2xl">
            <span className="text-xs text-stone-300 font-medium">
              Accomplished: <strong className="text-emerald-400">{completedCount}</strong> of {items.length} dreams
            </span>

            <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl">
              {[
                { id: 'all', label: `All (${items.length})` },
                { id: 'pending', label: `To Do (${items.length - completedCount})` },
                { id: 'completed', label: `Completed (${completedCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main List */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-stone-100 font-normal mb-2">
              Your Bucket List is Blank & Ready
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto mb-6">
              Where do you both want to travel? What quiet retreats or spontaneous trips do you want to experience? Start building your shared list today.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Our First Bucket List Item</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  item.isCompleted
                    ? 'bg-stone-950/40 border-stone-800/60 opacity-75'
                    : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div
                  onClick={() => handleToggle(item.id, item.isCompleted)}
                  className="flex items-start gap-3.5 flex-1 cursor-pointer"
                >
                  <button
                    type="button"
                    className="mt-0.5 text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-600" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p
                      className={`text-sm sm:text-base text-stone-200 leading-relaxed font-medium ${
                        item.isCompleted ? 'line-through text-stone-500' : ''
                      }`}
                    >
                      {item.title}
                    </p>

                    {item.note && (
                      <p className="text-xs text-stone-400 mt-1 font-light">
                        {item.note}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-stone-500">
                      <span className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-400">
                        {getCategoryLabel(item.category)}
                      </span>
                      {item.targetTime && (
                        <span>Target: <strong className="text-rose-400 font-normal">{item.targetTime}</strong></span>
                      )}
                      {item.completedAt && (
                        <span className="text-emerald-400">✓ {item.completedAt}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Delete this item from your bucket list?')) {
                      onDeleteItem(item.id);
                    }
                  }}
                  className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="flex justify-end pt-4 border-t border-stone-800">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Dream to Bucket List</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-stone-100 mb-1 flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-400" />
              <span>Add to Couple Bucket List</span>
            </h3>
            <p className="text-xs text-stone-400 mb-5">
              A shared milestone, travel destination, or experience for the two of you.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Dream / Milestone
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel to Switzerland / Cozy cabin getaway in autumn"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                  >
                    <option value="travel">Travel</option>
                    <option value="adventure">Adventure</option>
                    <option value="experience">Experience</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Target Timeframe (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next Summer / 2027"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Personal Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Stay at a wooden lodge with a stone fireplace..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md shadow-rose-900/30 cursor-pointer"
                >
                  Save to Bucket List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
