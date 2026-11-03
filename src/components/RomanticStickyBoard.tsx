import React, { useState } from 'react';
import {
  StickyNote,
  StickyColor,
  UserRole,
  CoupleProfile
} from '../types';
import {
  Heart,
  Pin,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Check,
  Copy,
  Palette,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';

interface RomanticStickyBoardProps {
  notes: StickyNote[];
  currentRole: UserRole;
  profile: CoupleProfile;
  onAddNote: (note: StickyNote) => void;
  onDeleteNote: (id: string) => void;
  onToggleHeart: (id: string) => void;
  onUpdateProfile?: (updated: CoupleProfile) => void;
}

const COLOR_STYLES: Record<
  StickyColor,
  {
    bg: string;
    border: string;
    text: string;
    tape: string;
    pin: string;
    accent: string;
    name: string;
  }
> = {
  yellow: {
    bg: 'bg-amber-50/95 dark:bg-amber-950/80',
    border: 'border-amber-200 dark:border-amber-700/60',
    text: 'text-amber-950 dark:text-amber-100',
    tape: 'bg-amber-200/80',
    pin: 'bg-amber-500 shadow-amber-300/50',
    accent: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
    name: 'লেমন ইয়েলো'
  },
  pink: {
    bg: 'bg-rose-50/95 dark:bg-rose-950/80',
    border: 'border-rose-200 dark:border-rose-700/60',
    text: 'text-rose-950 dark:text-rose-100',
    tape: 'bg-rose-200/80',
    pin: 'bg-rose-500 shadow-rose-300/50',
    accent: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200',
    name: 'গোলাপি টিউলিপ'
  },
  purple: {
    bg: 'bg-purple-50/95 dark:bg-purple-950/80',
    border: 'border-purple-200 dark:border-purple-700/60',
    text: 'text-purple-950 dark:text-purple-100',
    tape: 'bg-purple-200/80',
    pin: 'bg-purple-500 shadow-purple-300/50',
    accent: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200',
    name: 'ল্যাভেন্ডার'
  },
  green: {
    bg: 'bg-emerald-50/95 dark:bg-emerald-950/80',
    border: 'border-emerald-200 dark:border-emerald-700/60',
    text: 'text-emerald-950 dark:text-emerald-100',
    tape: 'bg-emerald-200/80',
    pin: 'bg-emerald-500 shadow-emerald-300/50',
    accent: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200',
    name: 'মিন্ট ফ্রেশ'
  },
  peach: {
    bg: 'bg-orange-50/95 dark:bg-orange-950/80',
    border: 'border-orange-200 dark:border-orange-700/60',
    text: 'text-orange-950 dark:text-orange-100',
    tape: 'bg-orange-200/80',
    pin: 'bg-orange-500 shadow-orange-300/50',
    accent: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200',
    name: 'সুইট পিচ'
  },
  sky: {
    bg: 'bg-sky-50/95 dark:bg-sky-950/80',
    border: 'border-sky-200 dark:border-sky-700/60',
    text: 'text-sky-950 dark:text-sky-100',
    tape: 'bg-sky-200/80',
    pin: 'bg-sky-500 shadow-sky-300/50',
    accent: 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200',
    name: 'নীল আকাশ'
  }
};

export interface WallThemePreset {
  id: string;
  name: string;
  description: string;
  containerClass: string;
  previewBg: string;
  accentBorder: string;
  gridClass?: string;
  bgImageUrl?: string;
}

export const WALL_THEMES: WallThemePreset[] = [
  {
    id: 'corkboard',
    name: 'ক্লাসিক ককর্বোর্ড (Classic Pinboard)',
    description: 'উষ্ণ কাঠের ফ্রেম ও ককর্বোর্ডের চিরচেনা রোমান্টিক থিম',
    containerClass:
      'border-amber-900/30 bg-radial from-amber-100/40 via-amber-200/20 to-stone-200/50 dark:from-stone-900/60 dark:via-stone-950/80 dark:to-stone-900/90',
    previewBg: 'bg-amber-200 border-amber-400',
    accentBorder: 'border-amber-900/30',
    gridClass:
      'opacity-15 dark:opacity-5 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:20px_20px]'
  },
  {
    id: 'rose_garden',
    name: 'গোলাপ বাগান (Romantic Rose Garden)',
    description: 'লাল ও গোলাপি গোলাপের রোমান্টিক আবহে ঘেরা ভালোবাসার বাগান',
    containerClass:
      'border-rose-800/40 bg-gradient-to-br from-rose-950/90 via-pink-950/85 to-rose-900/90 text-rose-50',
    previewBg: 'bg-gradient-to-br from-rose-600 to-pink-700 border-rose-400',
    accentBorder: 'border-rose-500/40',
    bgImageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'starry_night',
    name: 'নিশিথ নক্ষত্র (Starry Midnight)',
    description: 'নীল আকাশ, জ্বলজ্বলে তারা ও আলোকময় রোমান্টিক সন্ধ্যা',
    containerClass:
      'border-indigo-800/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-indigo-50',
    previewBg: 'bg-gradient-to-br from-indigo-900 to-slate-950 border-indigo-400',
    accentBorder: 'border-indigo-500/40',
    bgImageUrl:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'candlelight',
    name: 'ক্যান্ডেললাইট গ্লো (Candlelight Glow)',
    description: 'মোমবাতির উষ্ণ মিষ্টি আলো ও মখমল পরিবেশ',
    containerClass:
      'border-amber-700/40 bg-gradient-to-br from-stone-950 via-amber-950/90 to-rose-950 text-amber-50',
    previewBg: 'bg-gradient-to-br from-amber-700 to-stone-900 border-amber-500',
    accentBorder: 'border-amber-500/40',
    bgImageUrl:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'sunset_romance',
    name: 'গোধূলির মিষ্টি আলো (Sunset Romance)',
    description: 'সূর্যাস্তের সোনালী ও গোলাপি আভার রোমান্টিক বিকেল',
    containerClass:
      'border-pink-800/40 bg-gradient-to-br from-amber-900/80 via-rose-900/80 to-purple-950/90 text-rose-50',
    previewBg: 'bg-gradient-to-br from-orange-500 via-rose-600 to-purple-900 border-pink-400',
    accentBorder: 'border-pink-500/40',
    bgImageUrl:
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'crimson_velvet',
    name: 'ক্রিমসন ভেলভেট (Velvet Crimson)',
    description: 'রাজকীয় গাঢ় লাল ভেলভেট কাপড়ের সুবাসিত থিম',
    containerClass:
      'border-red-800/50 bg-gradient-to-br from-red-950 via-rose-950 to-stone-950 text-rose-100',
    previewBg: 'bg-gradient-to-br from-red-800 to-stone-950 border-rose-500',
    accentBorder: 'border-rose-600/50',
    bgImageUrl:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'custom',
    name: 'নিজস্ব ছবি / কাস্টম ব্যাকগ্রাউন্ড (Custom Photo)',
    description: 'আপনাদের দুজনের পছন্দের কোনো রোমান্টিক ছবি বা ওয়ালপেপার ব্যাকগ্রাউন্ডে দিন',
    containerClass: 'border-stone-700/50 bg-stone-900 text-white',
    previewBg: 'bg-stone-700 border-stone-500',
    accentBorder: 'border-stone-600'
  }
];

const STICKERS = ['💖', '☕', '🍫', '🌹', '💍', '✨', '💌', '🍦', '🧸', '🌙', '🍕', '🍰'];

const QUICK_PROMPTS = [
  'আজ ফেরার সময় চকোলেট নিয়ে এসো! 🍫',
  'তোমার হাতের চা-টা খুব মনে পড়ছে ☕',
  'মনে করে দুপুরবেলা ঠিক সময়ে খেয়ে নিও ❤️',
  'আজকে রাতে একসাথে একটা মুভি দেখবো? 🎬',
  'তোমাকে পেয়ে আমার জীবনটা ধন্য! লাভ ইউ 💖'
];

export const RomanticStickyBoard: React.FC<RomanticStickyBoardProps> = ({
  notes,
  currentRole,
  profile,
  onAddNote,
  onDeleteNote,
  onToggleHeart,
  onUpdateProfile
}) => {
  const [filterRole, setFilterRole] = useState<'all' | 'husband' | 'wife'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New note form state
  const [authorRole, setAuthorRole] = useState<UserRole>(currentRole);
  const [content, setContent] = useState('');
  const [color, setColor] = useState<StickyColor>('pink');
  const [selectedSticker, setSelectedSticker] = useState('💖');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [floatingHeartId, setFloatingHeartId] = useState<string | null>(null);

  // Theme selection state
  const currentThemeId = profile.boardWallTheme || 'corkboard';
  const [selectedThemeId, setSelectedThemeId] = useState<string>(currentThemeId);
  const [customBgUrl, setCustomBgUrl] = useState<string>(profile.boardCustomBgUrl || '');
  const [customBgPreview, setCustomBgPreview] = useState<string | null>(
    profile.boardCustomBgUrl || null
  );

  const husbandDisplayName = profile.husbandName || 'সোহান';
  const wifeDisplayName = profile.wifeName || 'রুহি';

  const activeTheme =
    WALL_THEMES.find((t) => t.id === currentThemeId) || WALL_THEMES[0];

  const filteredNotes = notes.filter((n) => {
    if (filterRole === 'all') return true;
    return n.authorRole === filterRole;
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomWallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomBgPreview(result);
        setCustomBgUrl(result);
        setSelectedThemeId('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTheme = () => {
    if (!onUpdateProfile) return;
    const updatedProfile: CoupleProfile = {
      ...profile,
      boardWallTheme: selectedThemeId,
      boardCustomBgUrl: selectedThemeId === 'custom' ? customBgUrl : profile.boardCustomBgUrl
    };
    onUpdateProfile(updatedProfile);
    setIsThemeModalOpen(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    const randomRotation = Number((Math.random() * 6 - 3).toFixed(1)); // -3 to +3 deg
    const authorName = authorRole === 'husband' ? husbandDisplayName : wifeDisplayName;

    const newNote: StickyNote = {
      id: `sticky-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      authorRole,
      authorName,
      content: content.trim(),
      color,
      rotation: randomRotation,
      pinnedAt: new Date().toISOString(),
      pinnedDateFormatted: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      heartsCount: 1,
      likedByHusband: authorRole === 'husband',
      likedByWife: authorRole === 'wife',
      sticker: selectedSticker,
      imageUrl: imageUrl || undefined
    };

    onAddNote(newNote);
    setContent('');
    setImageUrl('');
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleHeartClick = (id: string) => {
    onToggleHeart(id);
    setFloatingHeartId(id);
    setTimeout(() => {
      setFloatingHeartId((curr) => (curr === id ? null : curr));
    }, 1000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine wall container background style
  const isCustomTheme = currentThemeId === 'custom' && profile.boardCustomBgUrl;
  const activeBgImage = isCustomTheme
    ? profile.boardCustomBgUrl
    : activeTheme.bgImageUrl;

  return (
    <section id="sticky-board" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Container */}
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 text-xs font-medium tracking-wide uppercase mb-3 border border-rose-200/60 dark:border-rose-800/50">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>ভালোবাসার দেয়াল • রোমান্টিক চিরকুট বোর্ড</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            ভালোবাসার পোস্ট-ইট চিরকুট বোর্ড
          </h2>
          <p className="mt-2 text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
            ফ্রিজ বা পড়ার টেবিলের বোর্ডের মতো দুজনের প্রতিদিনের মিষ্টি অনুভূতির রঙিন চিরকুট। আবদার, দুষ্টুমি কিংবা ভালোবাসার ছোট্ট বার্তা পিন করে রাখুন।
          </p>

          {/* Filter & Action Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex rounded-xl bg-stone-200/70 dark:bg-stone-800/70 p-1 border border-stone-300/50 dark:border-stone-700/50 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setFilterRole('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterRole === 'all'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                সকল চিরকুট ({notes.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterRole('husband')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterRole === 'husband'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                সোহানের চিরকুট ({notes.filter((n) => n.authorRole === 'husband').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterRole('wife')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterRole === 'wife'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                রুহির চিরকুট ({notes.filter((n) => n.authorRole === 'wife').length})
              </button>
            </div>

            {/* Theme Change Button */}
            {onUpdateProfile && (
              <button
                type="button"
                onClick={() => {
                  setSelectedThemeId(currentThemeId);
                  setCustomBgUrl(profile.boardCustomBgUrl || '');
                  setCustomBgPreview(profile.boardCustomBgUrl || null);
                  setIsThemeModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-medium text-xs transition-all shadow-xs"
              >
                <Palette className="w-4 h-4 text-rose-500" />
                <span>দেয়ালের থিম পরিবর্তন</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setAuthorRole(currentRole);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন চিরকুট পিন করুন</span>
            </button>
          </div>
        </div>

        {/* The Wall Board Container */}
        <div
          className={`relative rounded-3xl p-6 sm:p-8 lg:p-10 border-4 shadow-2xl backdrop-blur-xs min-h-[460px] overflow-hidden transition-all duration-500 ${
            activeTheme.containerClass
          }`}
          style={
            activeBgImage
              ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(15, 10, 20, 0.55), rgba(15, 10, 20, 0.70)), url("${activeBgImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }
              : undefined
          }
        >
          {/* Subtle grid pattern if active */}
          {activeTheme.gridClass && !activeBgImage && (
            <div
              className={`absolute inset-0 pointer-events-none rounded-3xl ${activeTheme.gridClass}`}
            />
          )}

          {filteredNotes.length === 0 ? (
            <div className="relative flex flex-col items-center justify-center py-20 text-center z-10">
              <div className="w-16 h-16 rounded-full bg-rose-100/90 dark:bg-rose-950/90 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
                <Pin className="w-8 h-8 rotate-45" />
              </div>
              <h3 className="text-lg font-semibold text-white drop-shadow-md">
                বোর্ডে এখনও কোনো চিরকুট নেই
              </h3>
              <p className="mt-1 text-stone-200 text-sm max-w-sm drop-shadow-xs">
                প্রথম মিষ্টি চিরকুটটি লিখে ভালোবাসার এই সুন্দর বোর্ডে পিন করে দিন!
              </p>
              <button
                type="button"
                onClick={() => {
                  setAuthorRole(currentRole);
                  setIsModalOpen(true);
                }}
                className="mt-5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> চিরকুট লিখুন
              </button>
            </div>
          ) : (
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
              {filteredNotes.map((note) => {
                const style = COLOR_STYLES[note.color] || COLOR_STYLES.yellow;
                const isHusband = note.authorRole === 'husband';
                const hasUserLiked =
                  currentRole === 'husband' ? !!note.likedByHusband : !!note.likedByWife;
                const hasImage = !!note.imageUrl;

                return (
                  <div
                    key={note.id}
                    style={{
                      transform: `rotate(${note.rotation || 0}deg)`,
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                    }}
                    className={`group relative rounded-2xl p-5 ${style.bg} ${style.border} border shadow-lg hover:shadow-2xl hover:rotate-0 hover:z-20 transition-all duration-300 flex flex-col justify-between`}
                  >
                    {/* Washi tape / Pushpin at top center */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white dark:border-stone-800 shadow-md ring-2 ring-rose-400/50" />
                    </div>

                    {/* Top Note Meta */}
                    <div>
                      <div className="flex items-center justify-between mb-3 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl select-none">{note.sticker || '💖'}</span>
                          <div>
                            <span
                              className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                                isHusband
                                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {note.authorName || (isHusband ? 'সোহান' : 'রুহি')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            title="টেক্সট কপি করুন"
                            onClick={() => handleCopy(note.id, note.content)}
                            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                          >
                            {copiedId === note.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            title="চিরকুটটি সরান"
                            onClick={() => {
                              if (window.confirm('আপনি কি এই চিরকুটটি বোর্ড থেকে সরাতে চান?')) {
                                onDeleteNote(note.id);
                              }
                            }}
                            className="p-1 rounded-md text-stone-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content text */}
                      <p
                        className={`text-sm sm:text-base leading-relaxed font-sans font-medium whitespace-pre-wrap ${style.text}`}
                      >
                        {note.content}
                      </p>

                      {/* Attached image if any */}
                      {hasImage && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-stone-300/40 dark:border-stone-700/40 shadow-xs max-h-48 bg-stone-900/5">
                          <img
                            src={note.imageUrl}
                            alt="চিরকুটের ছবি"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom footer: date & heart button */}
                    <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <span>{note.pinnedDateFormatted || 'আজ'}</span>

                      {/* Heart Button with Floating Hearts Animation */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => handleHeartClick(note.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                            hasUserLiked
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-white/80 dark:bg-stone-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${hasUserLiked ? 'fill-current' : ''}`}
                          />
                          <span>{note.heartsCount || 1}</span>
                        </button>

                        {/* Floating heart burst animation */}
                        {floatingHeartId === note.id && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce text-rose-500 text-sm">
                            💖
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Wall Theme Selection Modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                    চিরকুট বোর্ডের দেয়ালের থিম বেছে নিন
                  </h3>
                  <p className="text-xs text-stone-500">
                    এখান থেকে থিম পরিবর্তন করলে উভয়ের পেজেই রিয়েল-টাইমে দেয়ালের ব্যাকগ্রাউন্ড বদলে যাবে
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preset AI Themes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WALL_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 ring-2 ring-rose-500 shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      {/* Theme Mini Swatch */}
                      <div
                        className={`w-10 h-10 rounded-xl flex-shrink-0 border ${theme.previewBg} overflow-hidden relative flex items-center justify-center shadow-xs`}
                        style={
                          theme.bgImageUrl
                            ? {
                                backgroundImage: `url("${theme.bgImageUrl}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }
                            : undefined
                        }
                      >
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-xs">
                            ✓
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {theme.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                          {theme.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Photo Upload Section if Custom is Selected or directly uploading */}
              {selectedThemeId === 'custom' && (
                <div className="mt-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/70 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-rose-500" />
                    <span>আপনার পছন্দের কাস্টম ছবি আপলোড করুন</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 text-xs font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-100 transition-colors shadow-xs">
                      <Upload className="w-4 h-4 text-rose-500" />
                      <span>গ্যালারি থেকে ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomWallImageChange}
                        className="hidden"
                      />
                    </label>

                    <span className="text-xs text-stone-400">অথবা</span>

                    <input
                      type="url"
                      placeholder="ছবি লিংক লিংক দিন (Image URL)..."
                      value={customBgUrl}
                      onChange={(e) => {
                        setCustomBgUrl(e.target.value);
                        setCustomBgPreview(e.target.value);
                      }}
                      className="w-full flex-1 p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                  </div>

                  {customBgPreview && (
                    <div className="mt-2 relative rounded-2xl overflow-hidden h-36 border border-stone-300 dark:border-stone-700 shadow-inner">
                      <img
                        src={customBgPreview}
                        alt="কাস্টম ব্যাকগ্রাউন্ড প্রিভিউ"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center text-white text-xs font-medium">
                        লাইভ ব্যাকগ্রাউন্ড প্রিভিউ
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleSaveTheme}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md inline-flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>থিম পরিবর্তন প্রয়োগ করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Sticky Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 overflow-hidden">
            {/* Top Close & Title */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                  <Pin className="w-4 h-4 rotate-45" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                  নতুন মিষ্টি চিরকুট পিন করুন
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Author Role Selector */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                  কার কলমে চিরকুট?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthorRole('husband')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      authorRole === 'husband'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 shadow-xs ring-1 ring-sky-500'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>🤵‍♂️</span> {husbandDisplayName} (স্বামী)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthorRole('wife')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      authorRole === 'wife'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 shadow-xs ring-1 ring-rose-500'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>👰‍♀️</span> {wifeDisplayName} (স্ত্রী)
                  </button>
                </div>
              </div>

              {/* Sticky Note Color Picker */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                  চিরকুটের প্যাস্টেল রঙ পছন্দ করুন
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {(Object.keys(COLOR_STYLES) as StickyColor[]).map((c) => {
                    const isSelected = color === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        title={COLOR_STYLES[c].name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          isSelected
                            ? 'scale-110 ring-2 ring-stone-900 dark:ring-white shadow-md'
                            : 'opacity-80 hover:opacity-100'
                        } ${
                          c === 'yellow'
                            ? 'bg-amber-300 border-amber-400'
                            : c === 'pink'
                            ? 'bg-rose-300 border-rose-400'
                            : c === 'purple'
                            ? 'bg-purple-300 border-purple-400'
                            : c === 'green'
                            ? 'bg-emerald-300 border-emerald-400'
                            : c === 'peach'
                            ? 'bg-orange-300 border-orange-400'
                            : 'bg-sky-300 border-sky-400'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Stickers list */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                  স্টিকার বেছে নিন
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                  {STICKERS.map((stk) => (
                    <button
                      key={stk}
                      type="button"
                      onClick={() => setSelectedSticker(stk)}
                      className={`text-lg p-1.5 rounded-lg transition-transform ${
                        selectedSticker === stk
                          ? 'bg-white dark:bg-stone-700 scale-125 shadow-xs'
                          : 'hover:scale-110 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Content Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
                    চিরকুটের বার্তা
                  </label>
                  <span className="text-[11px] text-stone-400">বাংলা অথবা ইংরেজিতে লিখুন</span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="যেমন: আজকে কিন্তু রাতে তাড়াতাড়ি ফিরবে, একসাথে চা খাবো... 💖"
                  className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-3.5 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                />

                {/* Quick Prompts */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setContent(prompt)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200/60 dark:border-stone-700/60 transition-colors"
                    >
                      {prompt.slice(0, 24)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Photo Attachment */}
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                  ছবি সংযুক্ত করুন (ঐচ্ছিক)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-rose-500" />
                    <span>ডিভাইস থেকে ছবি তুলুন / বাছুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                      }}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      ছবি মুছুন
                    </button>
                  )}
                </div>

                {imagePreview && (
                  <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700">
                    <img
                      src={imagePreview}
                      alt="প্রিভিউ"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md inline-flex items-center gap-1.5"
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span>বোর্ডে পিন করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
