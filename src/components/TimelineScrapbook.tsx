import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  Heart,
  Plus,
  Sparkles,
  X,
  Trash2,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
  Images
} from 'lucide-react';
import { MemoryItem, MemoryCategory, UserRole } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface TimelineScrapbookProps {
  memories: MemoryItem[];
  wifeName: string;
  currentRole?: UserRole;
  onAddMemory: (memory: Omit<MemoryItem, 'id'>) => void;
  onDeleteMemory: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const TimelineScrapbook: React.FC<TimelineScrapbookProps> = ({
  memories,
  wifeName,
  currentRole = 'husband',
  onAddMemory,
  onDeleteMemory,
  onToggleFavorite
}) => {
  const isWife = currentRole === 'wife';
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>('all');
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState<'firsts' | 'adventures' | 'milestones' | 'everyday'>('milestones');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);

  const filteredMemories = memories.filter((mem) => {
    if (selectedCategory === 'all') return true;
    return mem.category === selectedCategory;
  });

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageUploadError(null);
    setIsCompressingImage(true);

    try {
      const compressedList: string[] = [];
      for (const file of files) {
        const compressedDataUrl = await compressImageFile(file, 1280, 1280, 0.82);
        compressedList.push(compressedDataUrl);
      }
      setNewImages((prev) => [...prev, ...compressedList]);
    } catch (err: any) {
      console.error('Multiple image compression error:', err);
      setImageUploadError('Could not process some images. Please select standard JPG or PNG photos.');
    } finally {
      setIsCompressingImage(false);
      e.target.value = '';
    }
  };

  const handleAddSingleUrl = () => {
    if (!newImageUrl.trim()) return;
    setNewImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImageFromNewList = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCoverPhoto = (index: number) => {
    if (index === 0) return;
    setNewImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleSubmitNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCaption.trim()) return;

    const allPhotos = newImages.length > 0
      ? newImages
      : (newImageUrl ? [newImageUrl] : ['https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80']);

    onAddMemory({
      title: newTitle,
      date: newDate || 'A Special Day',
      location: newLocation || 'Somewhere Special',
      caption: newCaption,
      category: newCategory,
      imageUrl: allPhotos[0],
      images: allPhotos,
      tags: ['Our Story'],
      favorite: false
    });

    // Reset
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewCaption('');
    setNewImageUrl('');
    setNewImages([]);
    setIsAddingMemory(false);
  };

  return (
    <section id="story-timeline" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-rose-400 font-serif italic text-base">Chapter by Chapter</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-stone-100 font-normal tracking-tight mt-1 mb-3">
          Our Love Story Scrapbook
        </h2>
        <p className="text-stone-400 text-sm sm:text-base font-light">
          A personalized scrapbook crafted by the two of you. Upload your real wedding photographs, first date memories, and quiet everyday moments.
        </p>

        {/* Category Filters */}
        {memories.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 p-1 bg-stone-900/80 border border-stone-800 rounded-xl mt-6 max-w-lg mx-auto overflow-x-auto">
            {[
              { id: 'all', label: `All Memories (${memories.length})` },
              { id: 'milestones', label: 'Milestones' },
              { id: 'firsts', label: 'Our Firsts' },
              { id: 'adventures', label: 'Adventures' },
              { id: 'everyday', label: 'Everyday Joy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as MemoryCategory)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-stone-800 text-rose-300 shadow-sm border border-stone-700'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* When Empty: Dedicated Invitation to Create the First Memory */}
      {memories.length === 0 ? (
        <div className="max-w-xl mx-auto bg-stone-900/70 border-2 border-dashed border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8" />
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal mb-2">
            Your Scrapbook is Waiting
          </h3>

          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed mb-8 max-w-md mx-auto">
            There are no random or generic placeholder pictures here. You and {wifeName} can upload your own real photos, cherish your wedding memories, and record your private stories.
          </p>

          <button
            onClick={() => setIsAddingMemory(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-xs sm:text-sm shadow-xl shadow-rose-950/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Our First Memory</span>
          </button>
        </div>
      ) : (
        /* Polaroid Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredMemories.map((mem, index) => {
            const tilts = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];
            const tiltClass = tilts[index % tilts.length];
            const photosList = (mem.images && mem.images.length > 0) ? mem.images : (mem.imageUrl ? [mem.imageUrl] : []);
            const photosCount = photosList.length;

            return (
              <div
                key={mem.id}
                onClick={() => {
                  setActiveMemory(mem);
                  setActivePhotoIndex(0);
                }}
                className={`group relative bg-white rounded-lg p-3 pb-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer text-stone-900 border border-stone-200 transform ${tiltClass}`}
              >
                {/* Stacked polaroid layers effect if multiple photos */}
                {photosCount > 1 && (
                  <>
                    <div className="absolute inset-0 bg-stone-100 rounded-lg transform rotate-2 translate-x-1 translate-y-1 -z-10 shadow-md border border-stone-300/60" />
                    <div className="absolute inset-0 bg-stone-50 rounded-lg transform -rotate-1 -translate-x-1 translate-y-0.5 -z-20 shadow-sm border border-stone-300/40" />
                  </>
                )}

                {/* Washi Tape Accent at Top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-200/80 backdrop-blur-sm border-l border-r border-amber-300/60 rotate-1 shadow-sm opacity-90 pointer-events-none" />

                {/* Photo Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-stone-100 mb-3">
                  <img
                    src={mem.imageUrl || photosList[0]}
                    alt={mem.title}
                    className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Multiple Photos Badge */}
                  {photosCount > 1 && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-stone-900/85 text-amber-300 font-sans text-[10px] font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-md border border-stone-700/60">
                      <Images className="w-3.5 h-3.5 text-amber-400" />
                      <span>{photosCount} Photos</span>
                    </div>
                  )}

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(mem.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-stone-900/50 backdrop-blur-sm text-white hover:text-rose-400 transition-colors cursor-pointer"
                    title="Toggle Favorite"
                  >
                    <Heart className={`w-4 h-4 ${mem.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Delete Button (Husband Only) */}
                  {!isWife && photosCount <= 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this memory from your scrapbook?')) {
                          onDeleteMemory(mem.id);
                        }
                      }}
                      className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-stone-900/50 backdrop-blur-sm text-stone-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Subtle category tag */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-stone-950/70 text-stone-200 backdrop-blur-xs uppercase">
                    {mem.category}
                  </div>
                </div>

                {/* Polaroid Handwritten Caption */}
                <div className="px-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-sans mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {mem.date}
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-1 line-clamp-1 max-w-[130px]">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        {mem.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-rose-700 transition-colors leading-tight">
                    {mem.title}
                  </h3>

                  <p className="font-handwriting text-stone-700 text-base leading-snug line-clamp-2 mt-1">
                    "{mem.caption}"
                  </p>
                </div>
              </div>
            );
          })}

          {/* Add Another Memory Card (Husband Only) */}
          {!isWife && (
            <div
              onClick={() => setIsAddingMemory(true)}
              className="border-2 border-dashed border-stone-800 hover:border-rose-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group bg-stone-900/30 hover:bg-stone-900/60 transition-all min-h-[300px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-stone-800 group-hover:bg-rose-500/20 text-stone-400 group-hover:text-rose-400 flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-stone-200 group-hover:text-rose-300 font-medium">
                Add Event or Memory Album
              </h3>
              <p className="text-xs text-stone-400 font-light mt-1 max-w-[200px]">
                Upload multiple photos from a date, trip, or wedding event all at once.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Memory Detail Inspection Modal */}
      {activeMemory && (() => {
        const activePhotos = (activeMemory.images && activeMemory.images.length > 0)
          ? activeMemory.images
          : (activeMemory.imageUrl ? [activeMemory.imageUrl] : []);
        const currentPhoto = activePhotos[activePhotoIndex] || activePhotos[0];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md">
            <div className="relative max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl text-stone-100 flex flex-col max-h-[90vh]">
              <button
                onClick={() => setActiveMemory(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/70 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Photo Display with Navigation Arrows */}
              <div className="relative aspect-video w-full bg-stone-950 shrink-0 group">
                <img
                  src={currentPhoto}
                  alt={activeMemory.title}
                  className="w-full h-full object-contain bg-stone-950"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />

                {/* Photo Counter Badge */}
                {activePhotos.length > 1 && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-stone-950/80 text-amber-300 font-mono text-xs border border-stone-800 backdrop-blur-md">
                    Photo {activePhotoIndex + 1} of {activePhotos.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {activePhotos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) => (prev === 0 ? activePhotos.length - 1 : prev - 1))
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 hover:text-white border border-stone-800 shadow-xl transition-all cursor-pointer z-10"
                      title="Previous Photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) => (prev === activePhotos.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 hover:text-white border border-stone-800 shadow-xl transition-all cursor-pointer z-10"
                      title="Next Photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Multi-Photo Thumbnail Strip */}
              {activePhotos.length > 1 && (
                <div className="p-3 bg-stone-950/90 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
                  {activePhotos.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIndex === i
                          ? 'border-rose-500 scale-105 shadow-md shadow-rose-950/50'
                          : 'border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                <div className="flex items-center gap-3 text-xs text-stone-400 mb-2">
                  <span className="text-rose-400 font-medium">{activeMemory.date}</span>
                  {activeMemory.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {activeMemory.location}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100 mb-4">
                  {activeMemory.title}
                </h3>

                <div className="p-5 rounded-2xl bg-stone-950/60 border border-stone-800/80 mb-6">
                  <p className="font-handwriting text-xl sm:text-2xl text-rose-200/90 leading-relaxed">
                    "{activeMemory.caption}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-stone-400 pt-2 border-t border-stone-800/60">
                  {!isWife ? (
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this memory album from your scrapbook?')) {
                          onDeleteMemory(activeMemory.id);
                          setActiveMemory(null);
                        }
                      }}
                      className="flex items-center gap-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Album</span>
                    </button>
                  ) : <div />}

                  <button
                    onClick={() => onToggleFavorite(activeMemory.id)}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${activeMemory.favorite ? 'fill-rose-500' : ''}`} />
                    {activeMemory.favorite ? 'Favorited' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Memory Modal (Supports Multiple Photo Selection) */}
      {isAddingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md">
          <div className="relative max-w-xl w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddingMemory(false);
                setNewImages([]);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-stone-100 mb-1">
              Add Event & Photo Album
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Select multiple photos from a date, travel adventure, or wedding event to create a shared photo story album.
            </p>

            <form onSubmit={handleSubmitNewMemory} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Event / Memory Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Our Wedding Day / Cox's Bazar Sunset Vacation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Date / Timeframe
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 18, 2022"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. By the Ocean / Our Home"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="milestones">Milestone (Wedding, Proposal, Big Days)</option>
                  <option value="firsts">Our Firsts (First Date, First Trip)</option>
                  <option value="adventures">Adventures & Travels</option>
                  <option value="everyday">Everyday Sweet Moments</option>
                </select>
              </div>

              {/* Multiple Photo Upload Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Upload Event Photos (Multiple Selection Enabled)
                  </label>
                  <span className="text-[10px] text-rose-400 font-medium">
                    {newImages.length} Photos Selected
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image link URL (optional)"
                      value={newImageUrl}
                      onChange={(e) => {
                        setNewImageUrl(e.target.value);
                        setImageUploadError(null);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-rose-500"
                    />
                    {newImageUrl && (
                      <button
                        type="button"
                        onClick={handleAddSingleUrl}
                        className="px-3 py-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 hover:text-white text-xs cursor-pointer"
                      >
                        Add Link
                      </button>
                    )}
                    <label className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors font-medium shadow-md">
                      {isCompressingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-white" />
                          <span>Upload Photos</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isCompressingImage}
                        onChange={handleMultipleImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Error notice if upload failed */}
                  {imageUploadError && (
                    <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{imageUploadError}</span>
                    </div>
                  )}

                  {/* Attached Photos Thumbnail Gallery Grid */}
                  {newImages.length > 0 ? (
                    <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {newImages.length} Photos in Album
                        </span>
                        <span className="text-[10px] text-stone-500">First photo is cover</span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                        {newImages.map((imgUrl, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden border border-stone-800 group bg-stone-900"
                          >
                            <img src={imgUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                            
                            {i === 0 ? (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] bg-emerald-600 text-white font-semibold">
                                Cover
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(i)}
                                className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] bg-stone-900/80 hover:bg-rose-600 text-stone-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Set as Cover Photo"
                              >
                                Set Cover
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImageFromNewList(i)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-stone-950/80 hover:bg-rose-600 text-stone-300 hover:text-white transition-colors cursor-pointer"
                              title="Remove Photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-500">
                      Tip: Press Ctrl / Shift to select multiple photos from your phone gallery or computer at once!
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Your Story / Memory Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe how you felt, what made this event so special..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingMemory(false);
                    setNewImages([]);
                  }}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompressingImage}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-rose-900/30 cursor-pointer"
                >
                  Save Album to Scrapbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
