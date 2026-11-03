import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, Heart, X, KeyRound, AlertCircle } from 'lucide-react';

interface HusbandPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin: string;
  wifeName: string;
  husbandName: string;
}

export const HusbandPinModal: React.FC<HusbandPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPin,
  wifeName,
  husbandName
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMessage('');
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (codeToVerify: string) => {
    if (codeToVerify === currentPin) {
      setErrorMessage('');
      onSuccess();
    } else {
      setIsShaking(true);
      setErrorMessage('Incorrect PIN. This section is reserved for ' + husbandName + '.');
      setTimeout(() => {
        setIsShaking(false);
        setPinInput('');
        inputRef.current?.focus();
      }, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify(pinInput);
    }
  };

  const handleKeyPressNum = (num: string) => {
    if (pinInput.length < 6) {
      const next = pinInput + num;
      setPinInput(next);
      setErrorMessage('');
      if (next.length === currentPin.length) {
        handleVerify(next);
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div
        className={`relative max-w-sm w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          title="Back to Wife View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-normal text-stone-100">
            Husband Access Passcode
          </h3>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            Please enter the secret PIN to switch to {husbandName}'s controls & settings.
          </p>
        </div>

        {/* Secret Note for Wife */}
        <div className="mb-5 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-center">
          <p className="text-[11px] text-rose-300 font-sans flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Reserved for {husbandName}'s surprise preparations</span>
          </p>
        </div>

        {/* Hidden Input for Keyboard typing */}
        <input
          ref={inputRef}
          type="password"
          maxLength={6}
          value={pinInput}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setPinInput(val);
            if (val.length === currentPin.length) {
              handleVerify(val);
            }
          }}
          onKeyDown={handleKeyDown}
          className="sr-only"
        />

        {/* PIN Dots Indicator */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex justify-center items-center gap-3.5 my-5 cursor-pointer py-2"
        >
          {Array.from({ length: Math.max(4, currentPin.length) }).map((_, idx) => {
            const isFilled = idx < pinInput.length;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  isFilled
                    ? 'bg-rose-500 border-rose-400 scale-110 shadow-sm shadow-rose-500/50'
                    : 'bg-stone-800/80 border-stone-700'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs text-center flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPressNum(digit)}
              className="h-11 rounded-xl bg-stone-800/70 hover:bg-stone-700/80 active:bg-rose-600/40 text-stone-100 text-lg font-medium transition-colors cursor-pointer border border-stone-700/60"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleKeyPressNum('0')}
            className="h-11 rounded-xl bg-stone-800/70 hover:bg-stone-700/80 active:bg-rose-600/40 text-stone-100 text-lg font-medium transition-colors cursor-pointer border border-stone-700/60"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-11 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => handleVerify(pinInput)}
          disabled={pinInput.length === 0}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm shadow-lg shadow-rose-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>Unlock Husband View</span>
        </button>

        <p className="text-[10px] text-stone-500 text-center mt-3">
          Default PIN is 2024. You can customize this anytime in Settings.
        </p>
      </div>
    </div>
  );
};
