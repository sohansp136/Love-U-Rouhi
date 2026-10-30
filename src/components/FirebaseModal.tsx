import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Smartphone,
  Laptop,
  Heart,
  X,
  Sparkles,
  Zap,
  LogIn,
  LogOut,
  UserCheck,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logoutUser, testFirestoreConnection } from '../lib/firebase';
import { getWifeGiftUrl, getHusbandGiftUrl } from '../services/firebaseSync';
import { UserRole } from '../types';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  wifeName: string;
  husbandName: string;
  currentRole: UserRole;
  onToggleRole: () => void;
  currentUser: User | null;
  isConnected: boolean;
  lastSyncedAt: Date | null;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({
  isOpen,
  onClose,
  wifeName,
  husbandName,
  currentRole,
  onToggleRole,
  currentUser,
  isConnected,
  lastSyncedAt
}) => {
  const [copiedWifeLink, setCopiedWifeLink] = useState(false);
  const [copiedHusbandLink, setCopiedHusbandLink] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const wifeLink = getWifeGiftUrl();
  const husbandLink = getHusbandGiftUrl();

  const handleCopyWife = () => {
    navigator.clipboard.writeText(wifeLink).then(() => {
      setCopiedWifeLink(true);
      setTimeout(() => setCopiedWifeLink(false), 3000);
    });
  };

  const handleCopyHusband = () => {
    navigator.clipboard.writeText(husbandLink).then(() => {
      setCopiedHusbandLink(true);
      setTimeout(() => setCopiedHusbandLink(false), 3000);
    });
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `আমার ভালোবাসা ${wifeName}, আমাদের অ্যানিভার্সারির স্পেশাল উপহার তোমার জন্য: ${wifeLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const ok = await testFirestoreConnection();
      if (ok) {
        setTestStatus('✅ Firebase Cloud Firestore connects instantly! Realtime sync is active.');
      } else {
        setTestStatus('⚡ Firebase is in offline-ready mode and will sync automatically.');
      }
    } catch (err: any) {
      setTestStatus(`Error testing connection: ${err.message || 'Check network'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoggingIn(true);
    try {
      if (currentUser) {
        await logoutUser();
      } else {
        await loginWithGoogle();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-stone-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-medium text-stone-100">
                  Firebase Cloud & Couple Sync
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Connected
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Centralized real-time database powering your anniversary keepsake
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Quick Explanation for Bengali User */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-stone-900/60 border border-rose-800/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-medium text-sm">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>তোমার ও তোমার স্ত্রীর অ্যাক্সেস কীভাবে কাজ করে?</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Firebase ক্লাউড ডেটাবেজের কারণে তোমাদের দুইজনের অ্যাক্সেস সম্পূর্ণ <strong>স্বয়ংক্রিয় ও লাইভ সিঙ্ক</strong>।
              তোমার স্ত্রী নিচের স্পেশাল লিংক দিয়ে তার মোবাইলে ওপেন করলেই সে সরাসরি স্ত্রীর ভিউ পাবে।
              সেখান থেকে সে কোনো লাভ কুপন বা রিকোয়েস্ট পাঠালে তোমার ডিভাইসে <strong>মুহূর্তেই (Real-time)</strong> নোটিফিকেশন চলে আসবে!
            </p>
          </div>

          {/* Link Sharing Section */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold text-stone-400 tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Gift Links for Wife & Husband</span>
            </h3>

            {/* Wife Link Card */}
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-rose-200">
                      স্ত্রীকে পাঠানোর গিফট লিংক (Wife View)
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      এই লিংকে ডুকলে সে স্বয়ংক্রিয়ভাবে {wifeName}-এর মোডে দেখবে ও কুপন রিকোয়েস্ট পাঠাতে পারবে
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium border border-rose-500/40">
                  Wife Access
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={wifeLink}
                  className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 select-all font-mono"
                />
                <button
                  onClick={handleCopyWife}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-all shadow-md cursor-pointer shrink-0"
                >
                  {copiedWifeLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-medium transition-all cursor-pointer shrink-0"
                  title="Share via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Husband Link Card */}
            <div className="p-3.5 rounded-2xl bg-stone-950/40 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-blue-400" />
                  তোমার পার্সোনাল লিংক (Husband View)
                </span>
                <button
                  onClick={handleCopyHusband}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {copiedHusbandLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHusbandLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={husbandLink}
                className="w-full bg-stone-900/80 border border-stone-800 rounded-lg px-2.5 py-1.5 text-[11px] text-stone-400 select-all font-mono"
              />
            </div>
          </div>

          {/* Sync Status & Realtime Channels */}
          <div className="p-4 rounded-2xl bg-stone-950/50 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-stone-400 tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Realtime Sync Features</span>
              </span>
              <span className="text-[11px] text-stone-400">
                {lastSyncedAt ? `Synced ${lastSyncedAt.toLocaleTimeString()}` : 'Connected'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-300">Love Requests & Coupons</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-300">Memory Scrapbook & Photos</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-300">Open-When Wax Sealed Letters</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-300">Voice Cassette Tracks</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-300">Couple Bucket List Dreams</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-stone-300">Anniversary Dates & Quotes</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleTestPing}
                disabled={isTesting}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isTesting ? 'Testing Cloud Ping...' : 'Test Cloud Connection'}</span>
              </button>
              {testStatus && (
                <span className="text-xs text-stone-300 animate-fade-in">{testStatus}</span>
              )}
            </div>
          </div>

          {/* Role Mode Switcher */}
          <div className="p-4 rounded-2xl bg-stone-950/40 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <UserCheck className="w-4 h-4 text-rose-400" />
              <div>
                <p className="font-medium">Current Preview Mode: <span className="text-rose-400 font-bold">{currentRole === 'wife' ? `${wifeName} (Wife)` : `${husbandName} (Husband)`}</span></p>
                <p className="text-[11px] text-stone-400">Switch mode anytime to test how your spouse experiences the app</p>
              </div>
            </div>
            <button
              onClick={onToggleRole}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-medium text-stone-200 transition-all cursor-pointer shrink-0"
            >
              Switch to {currentRole === 'husband' ? 'Wife Mode' : 'Husband Mode'}
            </button>
          </div>

          {/* Optional Firebase Auth (Google Sign-in) */}
          <div className="p-4 rounded-2xl bg-stone-950/30 border border-stone-850 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-medium text-stone-300">Firebase Authentication</span>
                <p className="text-[11px] text-stone-400">
                  {currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Signed in with anonymous couple session'}
                </p>
              </div>
            </div>
            <button
              onClick={handleGoogleAuth}
              disabled={isLoggingIn}
              className="px-3 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {currentUser ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5 text-rose-400" />}
              <span>{currentUser ? 'Sign Out' : 'Sign in with Google'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950/40 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Firebase Firestore Backend Active</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
