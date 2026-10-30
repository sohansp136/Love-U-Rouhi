import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Calendar, Clock, MessageSquareHeart, BookOpen, Compass, MessageCircle } from 'lucide-react';
import { CoupleProfile } from '../types';
import defaultHeroImg from '../assets/images/anniversary_hero_1792066519480.jpg';

interface HeroSectionProps {
  profile: CoupleProfile;
  onExploreSection: (sectionId: string) => void;
  onOpenIdeas: () => void;
  onOpenCustomize: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  onExploreSection,
  onOpenIdeas,
  onOpenCustomize
}) => {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    heartbeats: 0
  });

  // Calculate precision elapsed time
  useEffect(() => {
    const calculateTime = () => {
      const anniversary = new Date(profile.anniversaryDate).getTime();
      const now = new Date().getTime();
      const diffMs = Math.max(0, now - anniversary);

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      // Estimated breakdown
      const years = Math.floor(totalDays / 365.25);
      const remainingDaysAfterYears = Math.floor(totalDays % 365.25);
      const months = Math.floor(remainingDaysAfterYears / 30.4375);
      const days = Math.floor(remainingDaysAfterYears % 30.4375);

      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      // Heartbeats: ~80 beats per minute on average
      const heartbeats = totalMinutes * 80;

      setTimeTogether({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        heartbeats
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [profile.anniversaryDate]);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 py-16 overflow-hidden">
      {/* Background Hero Image with Gentle Romantic Vignette */}
      <div className="absolute inset-0 -z-20">
        <img
          src={profile.heroPhotoUrl}
          alt="Anniversary Hero Scene"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05] scale-105 transform animate-fade-in transition-all duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultHeroImg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0c0a09_85%)]" />
      </div>

      {/* Floating Gentle Light Sparks */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Top Floating Utility Bar */}
      <div className="max-w-4xl w-full mx-auto mb-6 flex justify-between items-center text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-serif italic text-sm">Forever & Always</span>
          <span className="text-stone-600">·</span>
          <span className="text-stone-300 font-medium">{profile.wifeName} & {profile.husbandName}</span>
        </div>

        <div className="flex items-center gap-2 text-stone-400 text-xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Our Love Journey</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="max-w-3xl mx-auto z-10">
        {/* Prominent Center Couple Portrait Medallion */}
        <div className="relative inline-block mb-5 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-400 shadow-2xl shadow-rose-950/80 mx-auto transform group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-stone-950 bg-stone-900 shadow-inner">
              <img
                src={profile.heroPhotoUrl}
                alt={`${profile.husbandName} & ${profile.wifeName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultHeroImg;
                }}
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-rose-600 border-2 border-stone-950 text-white shadow-lg">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </div>
        </div>

        {/* Subtle romantic label */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs tracking-wider uppercase mb-5 backdrop-blur-sm shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Happy Anniversary, {profile.wifeName}</span>
          </div>
        </div>

        {/* Grand Editorial Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-stone-100 font-normal tracking-tight leading-[1.15] mb-6">
          {profile.heroHeadline}
        </h1>

        <p className="font-sans text-base sm:text-lg text-stone-300/90 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          {profile.heroSubheadline}
        </p>

        {/* Live Relationship Precision Counter Card */}
        <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800/60">
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Anniversary Date: <strong className="text-stone-200">{profile.anniversaryDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400/90 font-mono">Live Precision Counter</span>
            </div>
          </div>

          {/* Time Units Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
            <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/50">
              <span className="font-serif text-2xl sm:text-3xl text-rose-300 font-bold block">
                {timeTogether.years}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Years</span>
            </div>
            <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/50">
              <span className="font-serif text-2xl sm:text-3xl text-rose-300 font-bold block">
                {timeTogether.months}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Months</span>
            </div>
            <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/50">
              <span className="font-serif text-2xl sm:text-3xl text-rose-300 font-bold block">
                {timeTogether.days}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Days</span>
            </div>
            <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/50">
              <span className="font-serif text-2xl sm:text-3xl text-amber-300 font-bold block">
                {timeTogether.hours}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Hours</span>
            </div>
            <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/50">
              <span className="font-serif text-2xl sm:text-3xl text-amber-300 font-bold block">
                {timeTogether.minutes}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Mins</span>
            </div>
            <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/50">
              <span className="font-serif text-2xl sm:text-3xl text-rose-400 font-bold block animate-pulse">
                {timeTogether.seconds}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Secs</span>
            </div>
          </div>

          {/* Emotional Heartbeat Stat */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 text-xs text-stone-300 bg-stone-950/40 rounded-xl py-3 px-4 border border-stone-800/40">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/80 animate-ping" />
              <span>
                Over <strong className="text-rose-300">{timeTogether.heartbeats.toLocaleString()}</strong> heartbeats dedicated to loving you
              </span>
            </div>
            <div className="hidden sm:block text-stone-700">|</div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span><strong className="text-amber-300">{timeTogether.totalDays}</strong> sunrise mornings together</span>
            </div>
          </div>
        </div>

        {/* Quick Discovery Navigation Buttons (100% English, no reasons button) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onExploreSection('story-timeline')}
            className="px-5 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700/90 border border-stone-700 text-stone-200 font-medium text-xs transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            Our Love Story
          </button>
          <button
            onClick={() => onExploreSection('couple-messenger')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs transition-all shadow-lg shadow-rose-900/40 hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Love Chat (মেসেঞ্জার)</span>
          </button>
          <button
            onClick={() => onExploreSection('love-requests')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-600/60 text-white font-medium text-xs transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
          >
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Love Requests</span>
          </button>
          <button
            onClick={() => onExploreSection('bucket-list')}
            className="px-5 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-emerald-300 font-medium text-xs transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Couple Bucket List</span>
          </button>
          <button
            onClick={() => onExploreSection('sealed-letters')}
            className="px-5 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-stone-200 font-medium text-xs transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Love Letters
          </button>
        </div>
      </div>

      {/* Quote card below */}
      <div className="mt-14 max-w-xl mx-auto z-10 text-center">
        <p className="font-serif italic text-stone-300 text-lg leading-relaxed">
          "{profile.romanticQuote}"
        </p>
        <span className="text-xs uppercase tracking-widest text-stone-500 mt-2 block font-medium">
          — {profile.quoteAuthor}
        </span>
      </div>
    </section>
  );
};
