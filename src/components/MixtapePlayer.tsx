import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Mic,
  Square,
  Upload,
  Plus,
  Trash2,
  Heart,
  Sparkles,
  Volume2,
  Clock,
  Check,
  Disc,
  Radio,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VoiceCassetteTrack } from '../types';

interface MixtapePlayerProps {
  tracks: VoiceCassetteTrack[];
  wifeName: string;
  husbandName: string;
  onAddTrack: (track: Omit<VoiceCassetteTrack, 'id'>) => void;
  onDeleteTrack: (id: string) => void;
}

export const MixtapePlayer: React.FC<MixtapePlayerProps> = ({
  tracks,
  wifeName,
  husbandName,
  onAddTrack,
  onDeleteTrack
}) => {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSide, setActiveSide] = useState<'all' | 'A' | 'B'>('all');

  // Record modal / creation state
  const [isAddingVoice, setIsAddingVoice] = useState(false);
  const [addMethod, setAddMethod] = useState<'record' | 'upload'>('record');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState<'husband' | 'wife'>('husband');
  const [newNote, setNewNote] = useState('');
  const [newSide, setNewSide] = useState<'A' | 'B'>('A');

  // Microphone recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);

  // Audio player element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredTracks = tracks.filter((t) => {
    if (activeSide === 'all') return true;
    return t.side === activeSide;
  });

  const activeTrack = filteredTracks[activeTrackIndex % (filteredTracks.length || 1)] || tracks[0];

  // Sync audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeTrack]);

  // Handle Play/Pause
  const togglePlay = (targetIndex?: number) => {
    if (!activeTrack) {
      setIsAddingVoice(true);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (targetIndex !== undefined && targetIndex !== activeTrackIndex) {
      setActiveTrackIndex(targetIndex);
      const targetTrack = filteredTracks[targetIndex];
      audio.src = targetTrack.audioUrl;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.src !== activeTrack.audioUrl) {
        audio.src = activeTrack.audioUrl;
      }
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Start Live Microphone Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        setRecordedDuration(recordingSeconds);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('Microphone access was denied or is not supported by your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  // Handle File Upload from phone/PC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecordedAudioUrl(reader.result as string);
        setRecordedDuration(30); // estimated default
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVoiceTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !recordedAudioUrl) return;

    onAddTrack({
      title: newTitle,
      author: newAuthor,
      authorName: newAuthor === 'husband' ? husbandName : wifeName,
      recipientName: newAuthor === 'husband' ? wifeName : husbandName,
      audioUrl: recordedAudioUrl,
      durationSeconds: recordedDuration || 30,
      recordedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      note: newNote,
      side: newSide
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#38bdf8']
    });

    // Reset
    setNewTitle('');
    setNewNote('');
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setIsAddingVoice(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section id="voice-cassette" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-rose-400 font-serif italic text-base">Recorded From the Heart</span>
        <h2 className="font-serif text-3xl sm:text-5xl text-stone-100 font-normal tracking-tight mt-1 mb-3">
          Our Couple Voice Cassette Tape
        </h2>
        <p className="text-stone-400 text-sm font-light">
          No generic songs—this vintage cassette is reserved exclusively for your real voices. Record sweet whispers, sung songs, or personal voice notes for each other.
        </p>

        {/* Filter Side A / Side B */}
        {tracks.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl mt-6 max-w-xs mx-auto">
            {[
              { id: 'all', label: `All Tracks (${tracks.length})` },
              { id: 'A', label: `Side A · ${husbandName}` },
              { id: 'B', label: `Side B · ${wifeName}` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSide(tab.id as any);
                  setActiveTrackIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeSide === tab.id
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

      {/* Main Tape Deck Grid */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900/95 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Mechanical Running Ribbon Cassette Tape Deck */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          <div className="w-full max-w-md bg-gradient-to-b from-stone-950 to-stone-900 border-4 border-stone-800 rounded-3xl p-6 shadow-2xl relative select-none">
            {/* Screws */}
            <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 flex items-center justify-center text-[7px] text-stone-500 font-mono">+</div>
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 flex items-center justify-center text-[7px] text-stone-500 font-mono">+</div>
            <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 flex items-center justify-center text-[7px] text-stone-500 font-mono">+</div>
            <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full border border-stone-600 bg-stone-800 flex items-center justify-center text-[7px] text-stone-500 font-mono">+</div>

            {/* Cassette Label Sticker */}
            <div className="bg-[#fcf8ec] text-stone-900 rounded-xl p-3.5 mb-4 border border-amber-300/80 shadow-inner">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-rose-800 border-b border-amber-300/60 pb-1 mb-1.5">
                <span>{activeTrack ? `SIDE ${activeTrack.side} · VOICE TAPE` : 'SIDE A · BLANK TAPE'}</span>
                <span className="font-mono text-stone-600">MAGNETIC STEREO</span>
              </div>
              <h3 className="font-handwriting text-2xl sm:text-3xl text-stone-900 font-bold leading-tight truncate">
                {activeTrack ? activeTrack.title : 'Ready For Your Voices'}
              </h3>
              <p className="text-[11px] text-stone-600 truncate mt-0.5 font-sans">
                {activeTrack ? (
                  <>Recorded by <strong className="text-rose-900">{activeTrack.authorName}</strong> for {activeTrack.recipientName}</>
                ) : (
                  <>Handcrafted for {wifeName} & {husbandName}</>
                )}
              </p>
            </div>

            {/* CASSETTE WINDOW & RUNNING MAGNETIC TAPE RIBBON */}
            <div className="relative bg-stone-900 rounded-2xl p-4 border-2 border-stone-700/80 shadow-inner overflow-hidden">
              {/* Magnetic Tape Ribbon Background Track */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-7 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-y border-stone-700/60 opacity-90" />
              
              {/* Running Tape Ribbon Texture Animation when playing */}
              {isPlaying && (
                <div
                  className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-7 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(244,63,94,0.18)_8px,rgba(244,63,94,0.18)_16px)] animate-pulse pointer-events-none"
                  style={{ animationDuration: '0.7s' }}
                />
              )}

              {/* Tape Reels Container */}
              <div className="relative z-10 flex items-center justify-around py-2">
                {/* Left Spool */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full border-4 border-dashed border-stone-400 bg-stone-950 flex items-center justify-center shadow-lg transition-transform ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '2.2s' }}
                  >
                    <div className="w-7 h-7 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-950" />
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-mono text-stone-400 mt-1">FEED</span>
                </div>

                {/* Central Tape Counter & Status */}
                <div className="flex flex-col items-center px-2">
                  <div className="bg-stone-950 px-3 py-1 rounded-md border border-stone-700 text-sm font-mono text-rose-400 font-bold tracking-wider mb-1">
                    {formatTime(currentTime)}
                  </div>
                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-mono">
                    {isPlaying ? 'PLAYING' : 'READY'}
                  </span>
                </div>

                {/* Right Spool */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full border-4 border-dashed border-stone-400 bg-stone-950 flex items-center justify-center shadow-lg transition-transform ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '2.2s' }}
                  >
                    <div className="w-7 h-7 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-950" />
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-mono text-stone-400 mt-1">TAKE-UP</span>
                </div>
              </div>
            </div>

            {/* MECHANICAL CONTROLS */}
            <div className="mt-5 flex items-center justify-between border-t border-stone-800/80 pt-4">
              <button
                onClick={handleRewind}
                className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                title="Rewind to Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Play / Pause Toggle */}
              <button
                onClick={() => togglePlay()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-xs transition-all shadow-xl cursor-pointer ${
                  isPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 scale-105'
                    : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-950/60 hover:scale-105'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause Tape</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                    <span>{activeTrack ? 'Play Voice Tape' : 'Record First Voice Tape'}</span>
                  </>
                )}
              </button>

              {/* Record Voice Button */}
              <button
                onClick={() => setIsAddingVoice(true)}
                className="p-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Record or Upload Voice Note"
              >
                <Mic className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Voice Note Inspection & Track List */}
        <div className="lg:col-span-6 space-y-4">
          {activeTrack ? (
            <div className="relative bg-[#fdfbf7] text-stone-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-200/80">
              <div className="flex justify-between items-start pb-3 border-b border-amber-200/60 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-rose-800 font-bold block mb-0.5">
                    Side {activeTrack.side} · Recorded on {activeTrack.recordedDate}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
                    "{activeTrack.title}"
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Spoken by <strong className="text-stone-900">{activeTrack.authorName}</strong> for {activeTrack.recipientName}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Delete this voice recording from the tape?')) {
                      onDeleteTrack(activeTrack.id);
                      setIsPlaying(false);
                    }
                  }}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Voice Recording"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Written Note if provided */}
              {activeTrack.note && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/50 mb-4">
                  <span className="text-[10px] uppercase font-bold text-amber-900/60 block mb-1">
                    Personal Note Attached:
                  </span>
                  <p className="font-handwriting text-xl text-stone-800 leading-relaxed">
                    "{activeTrack.note}"
                  </p>
                </div>
              )}

              {/* Quick Play Status */}
              <div className="flex items-center justify-between pt-3 border-t border-amber-200/60 text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  Length: {formatTime(activeTrack.durationSeconds)}
                </span>
                <span className="font-serif italic text-rose-900 font-semibold">
                  Personal Voice Keepsake
                </span>
              </div>
            </div>
          ) : (
            /* Blank state prompt */
            <div className="bg-stone-900/60 border-2 border-dashed border-stone-800 rounded-2xl p-8 text-center">
              <Mic className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h4 className="font-serif text-xl text-stone-200 mb-1">
                Your Voice Tape is Blank
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-6 max-w-sm mx-auto">
                Leave your first message! Sing a few lines of her favorite song, leave a 30-second goodnight whisper, or speak your vows aloud.
              </p>
              <button
                onClick={() => setIsAddingVoice(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Record or Upload a Voice Note</span>
              </button>
            </div>
          )}

          {/* Track List */}
          {filteredTracks.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block px-1">
                Voice Tracks on This Cassette ({filteredTracks.length})
              </span>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {filteredTracks.map((track, idx) => {
                  const isSelected = track.id === activeTrack?.id;

                  return (
                    <button
                      key={track.id}
                      onClick={() => togglePlay(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-rose-950/50 border-rose-500/50 text-stone-100 shadow-md'
                          : 'bg-stone-950/40 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-serif font-medium text-stone-200 block truncate">
                          {track.title}
                        </span>
                        <span className="text-[10px] text-stone-400 block truncate">
                          By {track.authorName} · Side {track.side}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && isPlaying ? (
                          <Disc className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-stone-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setIsAddingVoice(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-stone-800 hover:border-stone-600 text-stone-400 hover:text-rose-300 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Voice Recording</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Record Voice or Upload Audio Modal */}
      {isAddingVoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100">
            <button
              onClick={() => {
                if (isRecording) stopRecording();
                setIsAddingVoice(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-normal text-stone-100 mb-1 flex items-center gap-2">
              <Mic className="w-5 h-5 text-rose-400" />
              <span>Add a Voice Note to Cassette</span>
            </h3>
            <p className="text-xs text-stone-400 mb-5">
              Record singing a song, speaking words of love, or upload an audio voice memo.
            </p>

            {/* Method switch: Live Record vs Upload */}
            <div className="flex items-center gap-2 p-1 bg-stone-950 rounded-xl mb-5 border border-stone-800">
              <button
                type="button"
                onClick={() => setAddMethod('record')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  addMethod === 'record'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Record via Microphone</span>
              </button>
              <button
                type="button"
                onClick={() => setAddMethod('upload')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  addMethod === 'upload'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio File</span>
              </button>
            </div>

            <form onSubmit={handleSaveVoiceTrack} className="space-y-4">
              {/* Voice capture section */}
              {addMethod === 'record' ? (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center">
                  {isRecording ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-rose-600/30 text-rose-400 border border-rose-500/50 flex items-center justify-center mx-auto animate-pulse">
                        <Mic className="w-6 h-6" />
                      </div>
                      <div className="font-mono text-xl text-rose-400 font-bold">
                        {formatTime(recordingSeconds)}
                      </div>
                      <p className="text-xs text-stone-400">Recording live... Speak or sing into your mic</p>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>Done & Stop Recording</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      {recordedAudioUrl ? (
                        <div className="space-y-2">
                          <span className="text-xs text-emerald-400 font-medium block">
                            ✓ Voice Recording Captured ({formatTime(recordedDuration)})
                          </span>
                          <audio src={recordedAudioUrl} controls className="h-8 w-full max-w-xs mx-auto" />
                          <button
                            type="button"
                            onClick={startRecording}
                            className="text-xs text-stone-400 hover:text-stone-200 underline mt-1 block mx-auto cursor-pointer"
                          >
                            Re-record voice
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-stone-400">
                            Click start to begin recording your voice directly from your phone or PC microphone.
                          </p>
                          <button
                            type="button"
                            onClick={startRecording}
                            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Mic className="w-3.5 h-3.5" />
                            <span>Start Recording Voice</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-3">
                  <label className="w-full py-4 px-4 rounded-xl border border-dashed border-stone-700 hover:border-rose-500 text-stone-300 text-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-rose-400" />
                    <span>Choose an Audio File (MP3, M4A, WAV, WebM)</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {recordedAudioUrl && (
                    <div className="text-xs text-emerald-400 font-medium">
                      ✓ Audio File Selected and Ready
                    </div>
                  )}
                </div>
              )}

              {/* Title & Author Info */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Track Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A Song I Sang For You / Late Night Thoughts"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Recorded By
                  </label>
                  <select
                    value={newAuthor}
                    onChange={(e) => {
                      const auth = e.target.value as 'husband' | 'wife';
                      setNewAuthor(auth);
                      setNewSide(auth === 'husband' ? 'A' : 'B');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                  >
                    <option value="husband">Husband ({husbandName})</option>
                    <option value="wife">Wife ({wifeName})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                    Cassette Side
                  </label>
                  <select
                    value={newSide}
                    onChange={(e) => setNewSide(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                  >
                    <option value="A">Side A</option>
                    <option value="B">Side B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Written Note or Dedication (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Listen to this whenever you miss my voice..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingVoice(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!recordedAudioUrl || !newTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-rose-900/30 cursor-pointer"
                >
                  Save to Cassette Tape
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
