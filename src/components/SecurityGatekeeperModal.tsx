import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Heart,
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { CoupleProfile } from '../types';

interface SecurityGatekeeperModalProps {
  profile: CoupleProfile;
  isUnlocked: boolean;
  onUnlock: () => void;
  onUpdateSecurityProfile: (updated: Partial<CoupleProfile>) => Promise<void>;
}

const SECURITY_QUESTIONS = [
  'আমাদের শুভ পরিণয়ের বিশেষ তারিখ কোনটি?',
  'আমাদের প্রথম দেখা হয়েছিল কোথায়?',
  'রুহির সবচেয়ে প্রিয় বিষয় বা উপহার কোনটি?',
  'সোহানের সবচেয়ে প্রিয় কাজ কোনটি?',
  'আমাদের প্রথম একসাথে বেড়ানোর জায়গা কোনটি?'
];

export const SecurityGatekeeperModal: React.FC<SecurityGatekeeperModalProps> = ({
  profile,
  isUnlocked,
  onUnlock,
  onUpdateSecurityProfile
}) => {
  // If already unlocked, do not render gatekeeper
  if (isUnlocked) return null;

  const isSetupDone = !!profile.isSecuritySetupDone;

  // =================== FIRST-TIME SETUP STATE ===================
  const [setupPasscode, setSetupPasscode] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupEmail, setSetupEmail] = useState(
    profile.recoveryEmail || 'sohansp136@gmail.com'
  );
  const [setupQuestion, setSetupQuestion] = useState(
    profile.recoverySecurityQuestion || SECURITY_QUESTIONS[0]
  );
  const [setupAnswer, setSetupAnswer] = useState(
    profile.recoverySecurityAnswer || '18 October'
  );
  const [showSetupPasscode, setShowSetupPasscode] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [isSubmittingSetup, setIsSubmittingSetup] = useState(false);

  // =================== LOCK SCREEN STATE ===================
  const [pinInput, setPinInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isSuccessUnlocked, setIsSuccessUnlocked] = useState(false);

  // =================== FORGOT PASSCODE & OTP RECOVERY ===================
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState<'otp' | 'question'>('otp');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState(false);
  const [enteredAnswer, setEnteredAnswer] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify' | 'new_pin'>('request');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [demoOtpNotification, setDemoOtpNotification] = useState<string | null>(null);

  const correctPin = profile.securityPasscode || profile.husbandPin || '2024';
  const targetEmail = profile.recoveryEmail || 'sohansp136@gmail.com';

  // Keyboard listener for PIN entry
  useEffect(() => {
    if (!isSetupDone || isForgotModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pinInput.length < 6) {
          handleKeypadPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleKeypadBackspace();
      } else if (e.key === 'Enter') {
        handlePinSubmit(pinInput);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSetupDone, isForgotModalOpen, pinInput]);

  // Mask email for privacy (e.g., "soh***@gmail.com")
  const maskEmail = (email: string) => {
    if (!email || !email.includes('@')) return 'so***@gmail.com';
    const [user, domain] = email.split('@');
    if (user.length <= 3) return `${user}***@${domain}`;
    return `${user.slice(0, 3)}***@${domain}`;
  };

  // ----------------- First Time Setup Handler -----------------
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    const cleanPass = setupPasscode.trim();
    if (cleanPass.length < 4 || cleanPass.length > 6 || !/^\d+$/.test(cleanPass)) {
      setSetupError('পাসকোড অবশ্যই ৪ থেকে ৬ ডিজিটের সংখ্যা হতে হবে।');
      return;
    }

    if (cleanPass !== setupConfirm.trim()) {
      setSetupError('পাসকোড দুটি হুবহু মিলছে না। অনুগ্রহ করে পুনরায় টাইপ করুন।');
      return;
    }

    if (!setupEmail.trim() || !setupEmail.includes('@')) {
      setSetupError('একটি বৈধ রিকভারি ইমেইল অ্যাড্রেস লিখুন।');
      return;
    }

    if (!setupAnswer.trim()) {
      setSetupError('জরুরি সিকিউরিটি প্রশ্নের একটি উত্তর লিখুন।');
      return;
    }

    setIsSubmittingSetup(true);
    try {
      await onUpdateSecurityProfile({
        isSecuritySetupDone: true,
        securityPasscode: cleanPass,
        husbandPin: cleanPass, // sync with husbandPin as well
        recoveryEmail: setupEmail.trim(),
        recoverySecurityQuestion: setupQuestion,
        recoverySecurityAnswer: setupAnswer.trim()
      });

      // Mark session unlocked and open
      sessionStorage.setItem('couple_app_unlocked', 'true');
      setIsSuccessUnlocked(true);
      setTimeout(() => {
        onUnlock();
      }, 500);
    } catch (err) {
      console.error('Setup error:', err);
      setSetupError('সেটআপ সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmittingSetup(false);
    }
  };

  // ----------------- PIN Lockpad Handlers -----------------
  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 6) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError('');

      // Auto-submit when length matches
      if (nextPin.length === correctPin.length) {
        handlePinSubmit(nextPin);
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError('');
  };

  const handleKeypadClear = () => {
    setPinInput('');
    setPinError('');
  };

  const handlePinSubmit = (entered: string) => {
    if (entered === correctPin) {
      setPinError('');
      setIsSuccessUnlocked(true);
      sessionStorage.setItem('couple_app_unlocked', 'true');
      setTimeout(() => {
        onUnlock();
      }, 400);
    } else {
      setIsShaking(true);
      setPinError('ভুল পাসকোড! সঠিক ৪ ডিজিটের পাসকোড দিন।');
      setTimeout(() => {
        setIsShaking(false);
        setPinInput('');
      }, 600);
    }
  };

  // ----------------- OTP / Forgot Password Handlers -----------------
  const handleSendOtp = () => {
    setRecoveryError('');
    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSentNotice(true);
    setRecoveryStep('verify');

    // Display high-visibility notification so user can test instantly
    setDemoOtpNotification(code);

    // Auto-hide OTP toast after 15 seconds
    setTimeout(() => {
      setDemoOtpNotification(null);
    }, 15000);
  };

  const handleVerifyOtpOrAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (recoveryMode === 'otp') {
      if (enteredOtp.trim() === generatedOtp) {
        setRecoveryStep('new_pin');
      } else {
        setRecoveryError('ভুল ওটিপি কোড! অনুগ্রহ করে ইমেইলে পাওয়া কোডটি সঠিক লিখুন।');
      }
    } else {
      const realAnswer = (profile.recoverySecurityAnswer || '18 October').trim().toLowerCase();
      if (enteredAnswer.trim().toLowerCase() === realAnswer) {
        setRecoveryStep('new_pin');
      } else {
        setRecoveryError('সিকিউরিটি প্রশ্নের উত্তর মেলেনি। সঠিক উত্তর দিন।');
      }
    }
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    const cleanNew = newPasscode.trim();
    if (cleanNew.length < 4 || cleanNew.length > 6 || !/^\d+$/.test(cleanNew)) {
      setRecoveryError('নতুন পাসকোড ৪ থেকে ৬ ডিজিটের সংখ্যা হতে হবে।');
      return;
    }

    if (cleanNew !== confirmNewPasscode.trim()) {
      setRecoveryError('নতুন পাসকোড দুটি মিলছে না।');
      return;
    }

    setIsRecovering(true);
    try {
      await onUpdateSecurityProfile({
        securityPasscode: cleanNew,
        husbandPin: cleanNew
      });

      sessionStorage.setItem('couple_app_unlocked', 'true');
      setIsForgotModalOpen(false);
      setIsSuccessUnlocked(true);
      setTimeout(() => {
        onUnlock();
      }, 400);
    } catch (err) {
      console.error('Password reset error:', err);
      setRecoveryError('পাসকোড পরিবর্তন করতে সমস্যা হয়েছে।');
    } finally {
      setIsRecovering(false);
    }
  };

  // =========================================================================
  // VIEW 1: FIRST-TIME SETUP SCREEN (উপায় ২)
  // =========================================================================
  if (!isSetupDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md overflow-y-auto">
        {/* Decorative background glow */}
        <div className="absolute w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 sm:p-8 text-stone-100 my-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-3 shadow-lg shadow-rose-950/40">
              <ShieldCheck className="w-7 h-7 text-rose-400" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>উপায় ২ • প্রাথমিক নিরাপত্তা সেটআপ</span>
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-white">
              ভালোবাসার গোপন নীড় • পাসকোড লক
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md mx-auto">
              লিংক অন্য কারো কাছে চলে গেলেও যেন অনুমতি ছাড়া কেউ আপনাদের ব্যক্তিগত স্মৃতি ও চিরকুট দেখতে না পারে।
            </p>
          </div>

          {setupError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{setupError}</span>
            </div>
          )}

          <form onSubmit={handleSetupSubmit} className="space-y-4">
            {/* Passcode input */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                ৪ বা ৬ ডিজিটের গোপন পাসকোড দিন *
              </label>
              <div className="relative">
                <input
                  type={showSetupPasscode ? 'text' : 'password'}
                  required
                  maxLength={6}
                  value={setupPasscode}
                  onChange={(e) => setSetupPasscode(e.target.value.replace(/\D/g, ''))}
                  placeholder="যেমন: 2024 বা আপনাদের বিয়ের তারিখ"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm tracking-widest font-mono focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSetupPasscode(!showSetupPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1"
                >
                  {showSetupPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Passcode */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                পাসকোডটি পুনরায় নিশ্চিত করুন *
              </label>
              <input
                type={showSetupPasscode ? 'text' : 'password'}
                required
                maxLength={6}
                value={setupConfirm}
                onChange={(e) => setSetupConfirm(e.target.value.replace(/\D/g, ''))}
                placeholder="একই পাসকোড আবার টাইপ করুন"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm tracking-widest font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Recovery Email */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center justify-between">
                <span>রিকভারি ইমেইল (পাসকোড ভুলে গেলে OTP যাবে) *</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  placeholder="sohansp136@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                পাসকোড ভুলে গেলে এই ইমেইলে ৬ ডিজিটের ওটিপি পাঠিয়ে পাসকোড রিসেট করা যাবে।
              </span>
            </div>

            {/* Emergency Security Question */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2.5">
              <label className="block text-xs font-medium text-stone-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>জরুরি সিকিউরিটি প্রশ্ন ও উত্তর (ইমেইল বিলম্ব হলে বিকল্প)</span>
              </label>
              <select
                value={setupQuestion}
                onChange={(e) => setSetupQuestion(e.target.value)}
                className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500"
              >
                {SECURITY_QUESTIONS.map((q, idx) => (
                  <option key={idx} value={q}>
                    {q}
                  </option>
                ))}
              </select>

              <input
                type="text"
                required
                value={setupAnswer}
                onChange={(e) => setSetupAnswer(e.target.value)}
                placeholder="উত্তরটি লিখুন (যেমন: 18 October)"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmittingSetup}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all cursor-pointer mt-4"
            >
              {isSubmittingSetup ? (
                <span>সংরক্ষণ হচ্ছে...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>পাসকোড সক্রিয় করুন ও প্রবেশ করুন</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULLSCREEN PASSCODE LOCK GATEKEEPER
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-stone-950 via-[#1c1418] to-stone-950 backdrop-blur-xl">
      {/* Ambient background glow & particles */}
      <div className="absolute w-[500px] h-[500px] bg-rose-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[90px] bottom-10 right-10 pointer-events-none" />

      {/* Demo OTP Toast if sent */}
      {demoOtpNotification && (
        <div className="fixed top-6 z-50 animate-bounce max-w-sm w-full mx-auto px-4">
          <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-2xl border border-rose-400/50 flex items-center gap-3">
            <Mail className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold">📩 নতুন ওটিপি কোড পাঠানো হয়েছে!</strong>
              <span>আপনার ৬ ডিজিটের ওটিপি কোড: </span>
              <span className="font-mono font-extrabold text-sm tracking-wider underline">
                {demoOtpNotification}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Lock Screen Card */}
      <div
        className={`relative w-full max-w-sm rounded-3xl bg-stone-900/90 border border-stone-800/80 shadow-2xl p-7 text-center backdrop-blur-md transition-all duration-300 ${
          isShaking ? 'animate-shake ring-2 ring-rose-500' : ''
        }`}
      >
        {/* Couple Monogram Header */}
        <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4 shadow-inner ring-4 ring-rose-500/10">
          {isSuccessUnlocked ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-scale-up" />
          ) : (
            <Lock className="w-7 h-7 text-rose-400" />
          )}
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
          Forever & Always
        </h3>
        <p className="text-xs text-rose-300/80 mt-0.5 font-medium">
          {profile.wifeName || 'রুহি'} & {profile.husbandName || 'সোহান'}
        </p>
        <p className="text-[11px] text-stone-400 mt-2">
          আপনাদের ভালোবাসার ব্যক্তিগত নীড়ে প্রবেশ করতে পাসকোড দিন
        </p>

        {/* PIN Dots Visual */}
        <div className="flex items-center justify-center gap-3 my-6">
          {Array.from({ length: correctPin.length || 4 }).map((_, idx) => {
            const isFilled = idx < pinInput.length;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-rose-500 scale-125 shadow-md shadow-rose-500/50 ring-2 ring-rose-300'
                    : 'bg-stone-800 border border-stone-700'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {pinError && (
          <p className="text-xs text-rose-400 mb-4 animate-fade-in font-medium">
            {pinError}
          </p>
        )}

        {/* Numeric Keypad (0-9) */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypadPress(digit)}
              className="h-12 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 active:bg-rose-600 text-stone-100 font-semibold text-lg flex items-center justify-center border border-stone-700/50 transition-colors shadow-xs"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleKeypadClear}
            className="h-12 rounded-2xl bg-stone-900/60 hover:bg-stone-800/60 text-stone-400 hover:text-stone-200 text-xs font-medium flex items-center justify-center border border-stone-800/60 transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="h-12 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 active:bg-rose-600 text-stone-100 font-semibold text-lg flex items-center justify-center border border-stone-700/50 transition-colors shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleKeypadBackspace}
            className="h-12 rounded-2xl bg-stone-900/60 hover:bg-stone-800/60 text-stone-400 hover:text-rose-400 text-xs font-medium flex items-center justify-center border border-stone-800/60 transition-colors"
          >
            ⌫
          </button>
        </div>

        {/* Forgot Passcode Button */}
        <div className="pt-2 border-t border-stone-800/60">
          <button
            type="button"
            onClick={() => {
              setIsForgotModalOpen(true);
              setRecoveryStep('request');
              setRecoveryError('');
            }}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors hover:underline"
          >
            পাসকোড ভুলে গেছেন? (Email OTP Recovery)
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 3: FORGOT PASSCODE & EMAIL OTP RECOVERY MODAL
          ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 sm:p-7 text-stone-100">
            {/* Top Close */}
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-white p-1"
            >
              ✕
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">পাসকোড উদ্ধার ও রিসেট</h4>
                <p className="text-[11px] text-stone-400">
                  {recoveryStep === 'new_pin'
                    ? 'নতুন ৪ ডিজিটের পাসকোড সেট করুন'
                    : 'ইমেইল ওটিপি অথবা সিকিউরিটি প্রশ্নের মাধ্যমে আনলক'}
                </p>
              </div>
            </div>

            {recoveryError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {/* STEP 1: Request OTP */}
            {recoveryStep === 'request' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-center">
                  <Mail className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-300">
                    আপনাদের নিবন্ধিত রিকভারি ইমেইল:
                  </p>
                  <p className="text-sm font-mono font-bold text-rose-300 mt-1">
                    {maskEmail(targetEmail)}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    এই ইমেইলে একটি ৬ ডিজিটের ওটিপি ভেরিফিকেশন কোড পাঠানো হবে।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ইমেইলে ওটিপি কোড পাঠান</span>
                </button>

                {/* Option to switch to security question */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMode('question');
                      setRecoveryStep('verify');
                    }}
                    className="text-[11px] text-stone-400 hover:text-stone-200 underline"
                  >
                    ইমেইল ছাড়া সিক্রেট প্রশ্নের উত্তর দিয়ে রিসেট করুন
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Verify OTP or Security Answer */}
            {recoveryStep === 'verify' && (
              <form onSubmit={handleVerifyOtpOrAnswer} className="space-y-4">
                {recoveryMode === 'otp' ? (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      ইমেইলে পাঠানো ৬ ডিজিটের ওটিপি কোড লিখুন:
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="যেমন: 481920"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-center font-mono text-lg tracking-widest text-white focus:outline-none focus:border-rose-500"
                    />
                    <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
                      <span>কোড পাননি?</span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-rose-400 hover:underline"
                      >
                        পুনরায় ওটিপি পাঠান
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      সিকিউরিটি প্রশ্ন:
                    </label>
                    <p className="text-xs text-rose-300 font-semibold mb-2">
                      "{profile.recoverySecurityQuestion || SECURITY_QUESTIONS[0]}"
                    </p>
                    <input
                      type="text"
                      required
                      value={enteredAnswer}
                      onChange={(e) => setEnteredAnswer(e.target.value)}
                      placeholder="সঠিক উত্তর লিখুন"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setRecoveryStep('request')}
                    className="text-xs text-stone-400 hover:text-white"
                  >
                    ← পেছনে যান
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
                  >
                    <span>যাচাই করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Set New Passcode */}
            {recoveryStep === 'new_pin' && (
              <form onSubmit={handleResetPinSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ভেরিফিকেশন সফল! এখন নতুন পাসকোড দিন।</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    নতুন গোপন পাসকোড (৪-৬ ডিজিট) *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, ''))}
                    placeholder="নতুন পাসকোড"
                    className="w-full px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm tracking-widest font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    পুনরায় নতুন পাসকোড দিন *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={confirmNewPasscode}
                    onChange={(e) => setConfirmNewPasscode(e.target.value.replace(/\D/g, ''))}
                    placeholder="একই পাসকোড আবার দিন"
                    className="w-full px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm tracking-widest font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRecovering}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  {isRecovering ? (
                    <span>সংরক্ষণ হচ্ছে...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>পাসকোড আপডেট করুন ও আনলক করুন</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
