import React from 'react';
import {
  Heart,
  Lightbulb,
  Settings,
  Mail,
  MessageSquareHeart,
  Compass,
  Radio,
  Flame,
  Gift,
  Check,
  UserCheck,
  Lock,
  MessageCircle
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  wifeName: string;
  husbandName: string;
  currentRole: UserRole;
  onRequestHusbandRole?: () => void;
  onToggleRole: () => void;
  onCopyWifeLink: () => void;
  isCopiedWifeLink: boolean;
  onOpenIdeas: () => void;
  onOpenCustomize: () => void;
  onReplayOpening: () => void;
  onOpenFirebase?: () => void;
  isFirebaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  wifeName,
  husbandName,
  currentRole,
  onRequestHusbandRole,
  onToggleRole,
  onCopyWifeLink,
  isCopiedWifeLink,
  onOpenIdeas,
  onOpenCustomize,
  onReplayOpening,
  onOpenFirebase,
  isFirebaseConnected = true
}) => {
  const isWife = currentRole === 'wife';

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Couple Monogram */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-sm sm:text-base text-stone-100 font-medium tracking-wide">
                Forever & Always
              </span>
              <span className="text-[10px] text-stone-400 font-sans -mt-0.5 truncate max-w-[130px] sm:max-w-none">
                {wifeName} & {husbandName}
              </span>
            </div>
          </a>

          {/* Role Indicator */}
          {isWife ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border bg-rose-500/15 border-rose-500/40 text-rose-300">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>Viewing as {wifeName} 💖</span>
              {onRequestHusbandRole && (
                <button
                  onClick={onRequestHusbandRole}
                  className="ml-1 text-rose-400/50 hover:text-rose-200 p-0.5 rounded cursor-pointer transition-colors"
                  title="Husband Admin (PIN Required)"
                >
                  <Lock className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onToggleRole}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-all cursor-pointer"
              title="Click to preview Wife's View"
            >
              <UserCheck className="w-3 h-3" />
              <span>Viewing as {husbandName} 💙 (Preview Wife Mode)</span>
            </button>
          )}
        </div>

        {/* Section Navigation Links (100% English) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs text-stone-400 font-medium">
          <a href="#story-timeline" className="hover:text-stone-100 transition-colors">
            Our Story
          </a>
          <a href="#couple-messenger" className="hover:text-rose-300 text-stone-300 transition-colors flex items-center gap-1 font-semibold">
            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Love Chat</span>
          </a>
          <a href="#love-requests" className="hover:text-rose-300 text-stone-300 transition-colors flex items-center gap-1 font-semibold">
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-400" />
            <span>Love Requests</span>
          </a>
          <a href="#bucket-list" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bucket List</span>
          </a>
          <a href="#voice-cassette" className="hover:text-amber-300 transition-colors flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Voice Tape</span>
          </a>
          <a href="#sealed-letters" className="hover:text-stone-100 transition-colors">
            Love Letters
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Husband-Only: Copy Wife's Gift Link */}
          {!isWife && (
            <button
              onClick={onCopyWifeLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-sm ${
                isCopiedWifeLink
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 border-rose-500/30 text-rose-200'
              }`}
              title="Copy the direct gift link for your wife"
            >
              {isCopiedWifeLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Gift className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Copy Wife's Gift Link</span>
                  <span className="sm:hidden">Share Link</span>
                </>
              )}
            </button>
          )}

          {/* Husband-Only: Ideas Guide Button */}
          {!isWife && (
            <button
              onClick={onOpenIdeas}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all cursor-pointer shadow-sm"
              title="Ideas & concepts for your wife's app"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Anniversary Ideas</span>
            </button>
          )}

          {/* Replay Opening Envelope */}
          <button
            onClick={onReplayOpening}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
            title="Replay Wax Seal Envelope Ceremony"
          >
            <Mail className="w-4 h-4 text-rose-400" />
          </button>

          {/* Firebase Cloud Sync Button (Husband Only) */}
          {!isWife && onOpenFirebase && (
            <button
              onClick={onOpenFirebase}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all cursor-pointer shadow-sm"
              title="Firebase Cloud Sync & Wife Access Links"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">Firebase Cloud</span>
              {isFirebaseConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          )}

          {/* Customize / Settings Button (Husband Only) */}
          {!isWife ? (
            <button
              onClick={onOpenCustomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-200 text-xs font-medium transition-all cursor-pointer"
              title="Edit Names, Photos & Details"
            >
              <Settings className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Customize</span>
            </button>
          ) : (
            /* Discreet lock icon for husband to unlock if needed */
            onRequestHusbandRole && (
              <button
                onClick={onRequestHusbandRole}
                className="p-2 rounded-xl text-stone-600 hover:text-stone-400 transition-colors cursor-pointer"
                title="Husband Admin Access (PIN Protected)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>

      </div>
    </header>
  );
};

