import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  MessageSquareHeart,
  Check,
  X,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveRequest, UserRole } from '../types';

interface LoveRequestsProps {
  requests: LoveRequest[];
  wifeName: string;
  husbandName: string;
  currentRole?: UserRole;
  onAddRequest: (title: string, note?: string, category?: LoveRequest['category']) => void;
  onApproveRequest: (id: string, husbandReply: string) => void;
  onDeleteRequest?: (id: string) => void;
}

export const LoveRequests: React.FC<LoveRequestsProps> = ({
  requests,
  wifeName,
  husbandName,
  currentRole = 'husband',
  onAddRequest,
  onApproveRequest,
  onDeleteRequest
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [isAdding, setIsAdding] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState<LoveRequest['category']>('treat');

  // Approving modal state
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);
  const [husbandReply, setHusbandReply] = useState('');

  const quickPresets = [
    { title: 'Cook a delicious homemade dinner for us tonight', icon: '🍲', cat: 'treat' },
    { title: 'Take me on a spontaneous romantic sunset drive', icon: '🚗', cat: 'date' },
    { title: 'Pick out a gorgeous gift or dress for me', icon: '👗', cat: 'gift' },
    { title: 'Say yes to all my movie & treat choices tonight', icon: '👑', cat: 'pamper' },
    { title: 'Brew hot coffee and cuddle under blankets without phones', icon: '☕', cat: 'cuddle' }
  ];

  const handleSelectPreset = (title: string, cat: string) => {
    setNewTitle(title);
    setNewCategory(cat as any);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddRequest(newTitle, newNote, newCategory);
    setNewTitle('');
    setNewNote('');
    setIsAdding(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af']
    });
  };

  const handleOpenApproveModal = (req: LoveRequest) => {
    setApprovingRequestId(req.id);
    setHusbandReply(`Approved with all my heart! Your wish is my command, my darling. ❤️`);
  };

  const handleConfirmApproval = () => {
    if (!approvingRequestId) return;
    onApproveRequest(approvingRequestId, husbandReply);
    setApprovingRequestId(null);
    setHusbandReply('');

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#10b981', '#fbbf24', '#e11d48']
    });
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    return true;
  });

  return (
    <section id="love-requests" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-rose-400 font-serif italic text-base">Make a Wish</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-stone-100 font-normal tracking-tight mt-1 mb-3">
          Love Requests & Husband's Approval
        </h2>
        <p className="text-stone-400 text-sm font-light">
          {wifeName} can request anything she wishes for, and {husbandName} will gladly review and approve it with love.
        </p>

        {/* Filter Segmented Controls */}
        {requests.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl mt-6 max-w-xs mx-auto">
            {[
              { id: 'all', label: `All (${requests.length})` },
              { id: 'pending', label: `Pending (${requests.filter(r => r.status === 'pending').length})` },
              { id: 'approved', label: `Approved (${requests.filter(r => r.status === 'approved').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Area: Empty State vs Requests Grid */}
      {requests.length === 0 ? (
        <div className="max-w-xl mx-auto bg-stone-900/70 border-2 border-dashed border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl mb-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-5">
            <MessageSquareHeart className="w-8 h-8" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal mb-2">
            No Requests Yet
          </h3>

          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed mb-8 max-w-md mx-auto">
            There are no pre-filled requests here. {wifeName}, whatever you desire—a romantic home-cooked dinner, a shopping spree, an uninterrupted back rub, or a weekend drive—ask for it! {husbandName} is ready to approve it.
          </p>

          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-xs sm:text-sm shadow-xl shadow-rose-950/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Make Your First Love Request</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {filteredRequests.map((req) => {
            const isApproved = req.status === 'approved';

            return (
              <div
                key={req.id}
                className={`group relative bg-[#fdfbf7] text-stone-900 rounded-2xl p-6 shadow-xl border border-amber-200/70 transition-all flex flex-col justify-between overflow-hidden ${
                  isApproved ? 'border-emerald-300/80' : 'hover:-translate-y-1'
                }`}
              >
                {/* Delete request button if needed */}
                {onDeleteRequest && (
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this request?')) {
                        onDeleteRequest(req.id);
                      }
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-stone-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete Request"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Top Row: Category & Status */}
                <div>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-amber-200/50 pr-6">
                    <span className="text-[11px] font-sans uppercase tracking-wider text-rose-800 font-bold flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      {req.requestedAt}
                    </span>

                    {isApproved ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Approved with Love
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Awaiting Husband's Review
                      </span>
                    )}
                  </div>

                  {/* Request Title */}
                  <h3 className="font-serif text-2xl font-bold text-stone-900 leading-snug mb-2">
                    "{req.title}"
                  </h3>

                  {/* Sweet Note */}
                  {req.note && (
                    <p className="font-handwriting text-stone-700 text-lg leading-relaxed mb-4">
                      ~ {req.note}
                    </p>
                  )}
                </div>

                {/* Husband Reply / Approval Action Area */}
                <div className="pt-4 mt-2 border-t border-amber-200/60">
                  {isApproved ? (
                    <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                        <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{husbandName}'s Response:</span>
                      </div>
                      <p className="font-serif italic text-sm text-stone-800 leading-relaxed">
                        "{req.husbandReply || 'Approved! With all my love.'}"
                      </p>
                      {req.approvedAt && (
                        <span className="text-[10px] text-stone-500 block mt-1 text-right">
                          {req.approvedAt}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-stone-500 font-light">

                        {currentRole === 'wife'
                          ? `Awaiting ${husbandName}'s review & approval`
                          : 'Husband can review and approve this'}
                      </span>

                      {currentRole === 'wife' ? (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Approval</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenApproveModal(req)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium text-xs shadow-md shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve with Love</span>
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Button to submit another request when list is not empty */}
      {requests.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Make Another Love Request</span>
          </button>
        </div>
      )}

      {/* Submit Request Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-stone-100 mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>Make a Love Request</span>
            </h3>
            <p className="text-xs text-stone-400 mb-5">
              {wifeName}, write down whatever you are wishing for. {husbandName} will gladly review and grant it.
            </p>

            {/* Quick preset suggestions */}
            <div className="mb-4">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-2">
                Quick Inspiration:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.title, preset.cat)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-stone-300 text-xs text-left transition-colors cursor-pointer"
                  >
                    <span className="mr-1">{preset.icon}</span>
                    <span>{preset.title.slice(0, 32)}...</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Your Request / Wish
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Take me on a quiet sunset drive and get dessert"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Playful Note or Sweet Terms (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. No cancellations allowed! Warm hugs included."
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
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md shadow-rose-900/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Love Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Husband Approve Modal */}
      {approvingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
            <button
              onClick={() => setApprovingRequestId(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-stone-100 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Approve Love Request</span>
            </h3>
            <p className="text-xs text-stone-400 mb-5">
              {husbandName}, write an affectionate note to {wifeName} and approve her wish.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Husband's Loving Note & Promise
                </label>
                <textarea
                  rows={3}
                  value={husbandReply}
                  onChange={(e) => setHusbandReply(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApprovingRequestId(null)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApproval}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-950/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve with Love</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
