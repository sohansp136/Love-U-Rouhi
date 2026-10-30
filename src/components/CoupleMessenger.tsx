import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Heart,
  Smile,
  Trash2,
  Maximize2,
  X,
  Sparkles,
  MessageCircle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  User,
  HeartHandshake
} from 'lucide-react';
import { LoveMessage, UserRole } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface CoupleMessengerProps {
  messages: LoveMessage[];
  wifeName: string;
  husbandName: string;
  currentRole: UserRole;
  onSendMessage: (msg: Omit<LoveMessage, 'id' | 'createdAt'>) => void;
  onDeleteMessage: (id: string) => void;
  onReactMessage: (id: string, emoji: string) => void;
}

const QUICK_ROMANTIC_PROMPTS = [
  'মিস করছি তোমায় খুব! 💖',
  'অনেক অনেক ভালোবাসি রুহি! 🌹',
  'তুমি আমার জীবনের শ্রেষ্ঠ পাওয়া ✨',
  'বাসায় জলদি ফিরে আসো জান 🏡',
  'একটু কথা বলবে আমার সাথে? 💌',
  'তোমার মিষ্টি হাসিটা দেখতে ইচ্ছে করছে 🥰',
  'তুমি আমার সবচেয়ে প্রিয় মানুষ 💍'
];

const ROMANTIC_EMOJIS = ['❤️', '💖', '😘', '🥰', '🌹', '💌', '💍', '✨', '☕', '🌸'];

export const CoupleMessenger: React.FC<CoupleMessengerProps> = ({
  messages,
  wifeName,
  husbandName,
  currentRole,
  onSendMessage,
  onDeleteMessage,
  onReactMessage
}) => {
  // Sender identity selection
  const [activeSenderRole, setActiveSenderRole] = useState<'husband' | 'wife'>(
    currentRole === 'wife' ? 'wife' : 'husband'
  );

  // Sync active sender when user switches mode at top nav
  useEffect(() => {
    setActiveSenderRole(currentRole === 'wife' ? 'wife' : 'husband');
  }, [currentRole]);

  const [inputText, setInputText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Lightbox full image modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Auto-scroll chat feed
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length]);

  // Handle multi-image file select
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file, 1200, 1200, 0.78);
          compressedList.push(compressed);
        }
      }
      setSelectedImages((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Error processing photos:', err);
      alert('Could not process some photos. Please try smaller files.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed && selectedImages.length === 0) return;

    setIsSending(true);

    const senderName = activeSenderRole === 'wife' ? wifeName : husbandName;
    const recipientName = activeSenderRole === 'wife' ? husbandName : wifeName;

    onSendMessage({
      senderRole: activeSenderRole,
      senderName,
      recipientName,
      text: trimmed || undefined,
      imageUrl: selectedImages[0] || undefined,
      images: selectedImages.length > 0 ? selectedImages : undefined,
      reactions: {}
    });

    setInputText('');
    setSelectedImages([]);
    setShowEmojiPicker(false);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const activeSenderName = activeSenderRole === 'wife' ? wifeName : husbandName;
  const partnerName = activeSenderRole === 'wife' ? husbandName : wifeName;

  return (
    <section id="couple-messenger" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium mb-3">
            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>আমাদের মিষ্টি বার্তালাপ • Couples Love Messenger</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal tracking-wide">
            Sweet Whispers & Love Notes
          </h2>
          <p className="text-sm text-stone-400 max-w-2xl mt-1.5">
            তোমাদের দুজনের একান্ত বার্তালাপ। যেকোনো সময় যেকোনো জায়গা থেকে মিষ্টি কথা, ছবি কিংবা অনুভূতির চিরকুট পাঠাও। অপরজন তা সাথে সাথে দেখতে পারবে।
          </p>
        </div>

        {/* Sender Role Switcher */}
        <div className="bg-stone-900/90 border border-stone-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-sm self-start md:self-auto">
          <span className="text-[11px] font-medium text-stone-400 px-2.5 hidden sm:inline">
            মেসেজ পাঠাচ্ছেন:
          </span>
          <button
            onClick={() => setActiveSenderRole('husband')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeSenderRole === 'husband'
                ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span>🤵</span>
            <span>{husbandName} (স্বামী)</span>
          </button>
          <button
            onClick={() => setActiveSenderRole('wife')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeSenderRole === 'wife'
                ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <span>👰</span>
            <span>{wifeName} (স্ত্রী)</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-stone-900/60 border border-stone-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col">
        {/* Chat Sub-header */}
        <div className="px-5 py-3.5 bg-stone-950/70 border-b border-stone-800/70 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-300 font-medium">
              {husbandName} & {wifeName} এর প্রাইভেট চ্যাট রুম
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>লাইভ ফায়ারস্টোর সিঙ্ক • এন্ড-টু-এন্ড সিকিউর</span>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="p-4 sm:p-6 min-h-[360px] max-h-[560px] overflow-y-auto space-y-4 bg-stone-950/40 selection:bg-rose-500/30">
          {messages.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-800/80 rounded-2xl">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3 shadow-inner">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg text-stone-200 mb-1">
                এখনো কোনো বার্তা পাঠানো হয়নি
              </h4>
              <p className="text-xs text-stone-400 max-w-md mb-4">
                {wifeName}-এর উদ্দেশ্যে প্রথম মিষ্টি চিরকুট বা প্রিয় কোনো ছবি পাঠিয়ে এই ভালোবাসার চ্যাট শুরু করুন!
              </p>
              <button
                onClick={() =>
                  handleQuickPrompt(
                    activeSenderRole === 'husband'
                      ? `আমার প্রিয় ${wifeName}, এই চমৎকার দিনে তোমাকে অনেক ভালোবাসি! 💖`
                      : `আমার প্রিয় ${husbandName}, সবকিছুর জন্য তোমাকে ধন্যবাদ! 🌹`
                  )
                }
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 border border-rose-500/30 text-rose-200 text-xs font-medium transition-all cursor-pointer shadow-sm"
              >
                💌 প্রথম বার্তাটি লিখুন
              </button>
            </div>
          ) : (
            messages.map((msg) => {
              const isSenderMe = msg.senderRole === activeSenderRole;
              const isWifeSender = msg.senderRole === 'wife';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isSenderMe ? 'items-end' : 'items-start'
                  } group transition-all`}
                >
                  {/* Sender Name & Timestamp badge */}
                  <div
                    className={`flex items-center gap-1.5 text-[10px] text-stone-400 mb-1 px-1 ${
                      isSenderMe ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <span className="font-medium text-stone-300">
                      {isWifeSender ? '👰 ' + (msg.senderName || wifeName) : '🤵 ' + (msg.senderName || husbandName)}
                    </span>
                    <span>•</span>
                    <span className="text-stone-400">{msg.createdAt}</span>
                    {/* Delete button (hover) */}
                    <button
                      onClick={() => {
                        if (confirm('এই মেসেজটি ডিলিট করতে চান?')) {
                          onDeleteMessage(msg.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-400 transition-opacity p-0.5 rounded cursor-pointer ml-1"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[85%] sm:max-w-md md:max-w-lg rounded-3xl p-3.5 sm:p-4 shadow-md transition-all ${
                      isSenderMe
                        ? isWifeSender
                          ? 'bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 text-white rounded-tr-none shadow-rose-950/40'
                          : 'bg-gradient-to-br from-stone-800 via-stone-800 to-stone-900 border border-rose-500/20 text-stone-100 rounded-tr-none shadow-black/50'
                        : isWifeSender
                        ? 'bg-stone-900 border border-rose-500/30 text-rose-50 rounded-tl-none shadow-black/40'
                        : 'bg-stone-900 border border-blue-500/30 text-stone-100 rounded-tl-none shadow-black/40'
                    }`}
                  >
                    {/* Photos Grid if any */}
                    {msg.images && msg.images.length > 0 && (
                      <div
                        className={`mb-2.5 grid gap-2 rounded-2xl overflow-hidden ${
                          msg.images.length === 1
                            ? 'grid-cols-1'
                            : msg.images.length === 2
                            ? 'grid-cols-2'
                            : 'grid-cols-2 sm:grid-cols-3'
                        }`}
                      >
                        {msg.images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setLightboxImage(img)}
                            className="relative group/img overflow-hidden rounded-xl bg-stone-950 aspect-video cursor-zoom-in"
                          >
                            <img
                              src={img}
                              alt="Attachment"
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fallback single imageUrl if images array not populated */}
                    {(!msg.images || msg.images.length === 0) && msg.imageUrl && (
                      <div
                        onClick={() => setLightboxImage(msg.imageUrl!)}
                        className="mb-2.5 relative group/img overflow-hidden rounded-xl bg-stone-950 aspect-video max-h-60 cursor-zoom-in"
                      >
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      </div>
                    )}

                    {/* Text Message Content */}
                    {msg.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
                        {msg.text}
                      </p>
                    )}

                    {/* Reactions Bar inside bubble */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2.5 pt-2 border-t border-white/10">
                        {Object.entries(msg.reactions).map(([emoji, count]) =>
                          count > 0 ? (
                            <button
                              key={emoji}
                              onClick={() => onReactMessage(msg.id, emoji)}
                              className="px-2 py-0.5 rounded-full text-xs bg-black/30 hover:bg-black/40 border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] font-semibold">{count}</span>
                            </button>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reaction Selector (Discreet hover action) */}
                  <div
                    className={`flex items-center gap-1 mt-1 opacity-60 hover:opacity-100 transition-opacity ${
                      isSenderMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {['❤️', '😘', '🥰', '🌹'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onReactMessage(msg.id, emoji)}
                        className="hover:scale-125 transition-transform p-1 text-xs cursor-pointer"
                        title={`React ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Selected Photos Preview Strip */}
        {selectedImages.length > 0 && (
          <div className="p-3 bg-stone-900/95 border-t border-stone-800 flex items-center gap-3 overflow-x-auto">
            <span className="text-[11px] text-stone-400 font-medium whitespace-nowrap">
              সংযুক্ত ছবিসমূহ ({selectedImages.length}):
            </span>
            {selectedImages.map((img, i) => (
              <div
                key={i}
                className="relative w-14 h-14 rounded-xl overflow-hidden border border-rose-500/40 flex-shrink-0 group"
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveSelectedImage(i)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-500 cursor-pointer shadow"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 rounded-xl border border-dashed border-stone-700 hover:border-rose-400 flex flex-col items-center justify-center text-stone-400 hover:text-rose-300 text-[10px] flex-shrink-0 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 mb-0.5" />
              <span>আরো ছবি</span>
            </button>
          </div>
        )}

        {/* Quick Romantic Prompts Scrollbar */}
        <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            দ্রুত চিরকুট:
          </span>
          {QUICK_ROMANTIC_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-rose-200 border border-stone-800 hover:border-rose-500/30 transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Composer Input Area */}
        <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800">
          {/* Quick Emoji Bar (if toggled) */}
          {showEmojiPicker && (
            <div className="mb-2 p-2 bg-stone-900 border border-stone-800 rounded-2xl flex flex-wrap gap-2 items-center shadow-lg">
              {ROMANTIC_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAddEmoji(emoji)}
                  className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 sm:gap-3">
            {/* Image Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompressing}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 ${
                selectedImages.length > 0
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="ছবি সংযুক্ত করুন (একাধিক ছবি নির্বাচন সম্ভব)"
            >
              <ImageIcon className="w-5 h-5 text-rose-400" />
            </button>

            {/* Emoji Trigger */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition-all cursor-pointer flex-shrink-0 hidden sm:flex"
              title="ইমোজি বাছুন"
            >
              <Smile className="w-5 h-5 text-amber-400" />
            </button>

            {/* Main Text Area */}
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeSenderRole === 'wife'
                    ? `${husbandName}-এর জন্য মিষ্টি কোনো কথা লিখুন...`
                    : `${wifeName}-এর উদ্দেশ্যে ভালোবাসার বার্তা লিখুন...`
                }
                rows={1}
                className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all resize-none max-h-32 min-h-[44px]"
              />
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={
                (!inputText.trim() && selectedImages.length === 0) ||
                isCompressing ||
                isSending
              }
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
              title="বার্তা পাঠান"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          </div>

          {/* Status info below input */}
          <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 px-1">
            <span>
              বর্তমান প্রেরক: <strong className="text-stone-300">{activeSenderName}</strong>
            </span>
            <span>Enter চাপলে মেসেজ যাবে • Shift+Enter এ নতুন লাইন</span>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-stone-900 text-stone-300 hover:text-white border border-stone-700 cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Expanded Memory"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-stone-800"
            />
          </div>
        </div>
      )}
    </section>
  );
};
