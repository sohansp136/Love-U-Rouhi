import React, { useState } from 'react';
import { Settings, X, Camera, RotateCcw, Heart, Check, Sparkles, Eye, Download, Upload, Flame, Gift, Lock, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CoupleProfile } from '../types';
import { getWifeGiftUrl } from '../services/firebaseSync';
import { compressImageFile } from '../utils/imageCompressor';

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  onUpdateProfile: (updated: CoupleProfile) => void;
  onResetDefaults: () => void;
  onReplayOpening: () => void;
  onExportData?: () => void;
  onImportData?: (file: File) => void;
  onOpenFirebase?: () => void;
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetDefaults,
  onReplayOpening,
  onExportData,
  onImportData,
  onOpenFirebase
}) => {
  const [formData, setFormData] = useState<CoupleProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedWifeLink, setCopiedWifeLink] = useState(false);
  const [isCompressingHero, setIsCompressingHero] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);

  // Sync state whenever drawer is opened or profile changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
      setSaveSuccess(false);
      setHeroUploadError(null);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeroUploadError(null);
    setIsCompressingHero(true);

    try {
      const compressedDataUrl = await compressImageFile(file, 1600, 1600, 0.82);
      setFormData((prev) => ({
        ...prev,
        heroPhotoUrl: compressedDataUrl
      }));
    } catch (err) {
      console.error('Hero image compression error:', err);
      setHeroUploadError('Could not process this image. Please choose another JPG or PNG file.');
    } finally {
      setIsCompressingHero(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.wifeName.trim() || !formData.husbandName.trim()) {
      alert('Please enter both your name and your wife’s name.');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Could not save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md h-full bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col text-stone-100 overflow-hidden animate-slide-left">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-100">
                Husband's Customizer Studio
              </h3>
              <p className="text-xs text-stone-400">
                Tailor this app specifically for your wife
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>All changes saved to your browser!</span>
            </div>
          )}

          {/* Wife's Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Your Wife's Name / Pet Name
            </label>
            <input
              type="text"
              required
              value={formData.wifeName}
              onChange={(e) => setFormData({ ...formData, wifeName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
              placeholder="e.g. Sarah / My Honey"
            />
          </div>

          {/* Husband's Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Your Name / Sign-off
            </label>
            <input
              type="text"
              required
              value={formData.husbandName}
              onChange={(e) => setFormData({ ...formData, husbandName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
              placeholder="e.g. Alex / Your Loving Husband"
            />
          </div>

          {/* Anniversary Date */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Anniversary Date (Day You Married or Met)
            </label>
            <input
              type="date"
              required
              value={formData.anniversaryDate}
              onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
            />
            <span className="text-[10px] text-stone-500 mt-1 block">
              This updates the live elapsed years, days, and heartbeat counter on the hero!
            </span>
          </div>

          {/* Hero Headline */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Hero Headline
            </label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Hero Subheadline */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Personal Welcome Note
            </label>
            <textarea
              rows={2}
              value={formData.heroSubheadline}
              onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Hero Photo / Couple Picture */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Top Hero Couple Photo (Background Banner)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste direct image link (e.g. https://...jpg)"
                  value={formData.heroPhotoUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, heroPhotoUrl: e.target.value });
                    setHeroUploadError(null);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-rose-500"
                />
                <label className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  {isCompressingHero ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5 text-rose-400" />
                      <span>Upload Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isCompressingHero}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {heroUploadError && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{heroUploadError}</span>
                </div>
              )}

              {formData.heroPhotoUrl && (
                <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Hero Photo Attached
                    </span>
                    <span className="text-[10px] text-stone-500">Previews at page top</span>
                  </div>

                  <div className="h-32 w-full rounded-xl overflow-hidden border border-stone-800 relative bg-stone-900">
                    <img
                      src={formData.heroPhotoUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setHeroUploadError('Unable to load preview from this URL. Please verify the URL or upload directly.');
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 leading-tight">
                    This photo will preview as the grand background at the very top of the page. Click <strong>"Save All Changes"</strong> below to activate it!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quote & Author */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Special Quote
            </label>
            <textarea
              rows={2}
              value={formData.romanticQuote}
              onChange={(e) => setFormData({ ...formData, romanticQuote: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
            />
            <input
              type="text"
              placeholder="Author or 'Our Song'"
              value={formData.quoteAuthor}
              onChange={(e) => setFormData({ ...formData, quoteAuthor: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Backup & Device Sync */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Backup & Device Sync (Share With Her)
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed font-light">
              Export your memories, love requests, and voice notes into a file, or import it on another phone or computer.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {onExportData && (
                <button
                  type="button"
                  onClick={onExportData}
                  className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Download a backup file to keep or share"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>Export Backup</span>
                </button>
              )}

              {onImportData && (
                <label className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-rose-400" />
                  <span>Import Data</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImportData(file);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {onOpenFirebase && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFirebase();
                }}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/40 text-amber-300 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Firebase Cloud & Wife Access Links</span>
              </button>
            )}
          </div>

          {/* Husband Security PIN & Privacy Lock */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Husband Security PIN (Privacy Lock)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                Active Protection
              </span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed font-light">
              Your wife will be locked strictly into Wife View. She cannot access Husband Controls, view ideas, or edit memories without this secret 4-digit PIN.
            </p>

            <div>
              <label className="block text-[11px] text-stone-300 font-medium mb-1">
                4-Digit Secret Passcode
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.husbandPin || '2024'}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, husbandPin: val });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm tracking-widest font-mono focus:outline-none focus:border-rose-500"
                placeholder="2024"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Default: 2024. Save changes below to update.
              </span>
            </div>
          </div>

          {/* Replay Opening & Hand-Over Mode */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Presentation & Gift Reveal
            </div>

            <button
              type="button"
              onClick={() => {
                const url = getWifeGiftUrl();
                navigator.clipboard.writeText(url).then(() => {
                  setCopiedWifeLink(true);
                  setTimeout(() => setCopiedWifeLink(false), 3000);
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              {copiedWifeLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Wife's Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 text-white" />
                  <span>Copy Direct Gift Link for Wife</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                onClose();
                onReplayOpening();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-rose-400" />
              <span>Replay Wax Seal Envelope (Ready For Her!)</span>
            </button>


            <button
              type="button"
              onClick={onResetDefaults}
              className="w-full py-2 text-stone-500 hover:text-stone-300 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Anniversary Data</span>
            </button>
          </div>
        </form>

        {/* Footer Submit */}
        <div className="p-6 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            disabled={isSaving || isCompressingHero}
            onClick={() => handleSubmit()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-rose-950/50 cursor-pointer flex items-center gap-2 transition-all active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving All Changes...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <span>Save All Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
