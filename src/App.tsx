/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initialProfile,
  initialMemories,
  initialLetters,
  initialLoveRequests,
  initialVoiceTracks,
  initialBucketList,
  initialLoveMessages
} from './data/defaultData';
import {
  CoupleProfile,
  MemoryItem,
  LoveLetter,
  LoveRequest,
  VoiceCassetteTrack,
  BucketListItem,
  LoveMessage,
  UserRole
} from './types';

// Components
import { Navbar } from './components/Navbar';
import { OpeningEnvelope } from './components/OpeningEnvelope';
import { HeroSection } from './components/HeroSection';
import { IdeaGuideModal } from './components/IdeaGuideModal';
import { TimelineScrapbook } from './components/TimelineScrapbook';
import { CoupleMessenger } from './components/CoupleMessenger';
import { OpenWhenLetters } from './components/OpenWhenLetters';
import { LoveRequests } from './components/LoveRequests';
import { MixtapePlayer } from './components/MixtapePlayer';
import { BucketList } from './components/BucketList';
import { CustomizeDrawer } from './components/CustomizeDrawer';
import { FirebaseModal } from './components/FirebaseModal';
import { HusbandPinModal } from './components/HusbandPinModal';
import { Footer } from './components/Footer';

// Firebase Sync & Realtime Services
import {
  initFirebaseRealtimeSync,
  saveProfileToFirestore,
  addLoveRequestToFirestore,
  approveLoveRequestInFirestore,
  deleteLoveRequestFromFirestore,
  addMemoryToFirestore,
  deleteMemoryFromFirestore,
  toggleMemoryFavoriteInFirestore,
  addLetterToFirestore,
  openLetterInFirestore,
  addVoiceTrackToFirestore,
  deleteVoiceTrackFromFirestore,
  addBucketItemToFirestore,
  toggleBucketItemInFirestore,
  deleteBucketItemFromFirestore,
  addLoveMessageToFirestore,
  deleteLoveMessageFromFirestore,
  reactToLoveMessageInFirestore,
  getWifeGiftUrl
} from './services/firebaseSync';

export default function App() {
  // Persistence state
  const [profile, setProfile] = useState<CoupleProfile>(() => {
    try {
      const saved = localStorage.getItem('anniversary_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('anniversary_memories');
      return saved ? JSON.parse(saved) : initialMemories;
    } catch {
      return initialMemories;
    }
  });

  const [letters, setLetters] = useState<LoveLetter[]>(() => {
    try {
      const saved = localStorage.getItem('anniversary_letters');
      return saved ? JSON.parse(saved) : initialLetters;
    } catch {
      return initialLetters;
    }
  });

  const [loveRequests, setLoveRequests] = useState<LoveRequest[]>(() => {
    try {
      const saved = localStorage.getItem('anniversary_love_requests');
      return saved ? JSON.parse(saved) : initialLoveRequests;
    } catch {
      return initialLoveRequests;
    }
  });

  const [voiceTracks, setVoiceTracks] = useState<VoiceCassetteTrack[]>(() => {
    try {
      const saved = localStorage.getItem('anniversary_voice_tracks');
      return saved ? JSON.parse(saved) : initialVoiceTracks;
    } catch {
      return initialVoiceTracks;
    }
  });

  const [bucketList, setBucketList] = useState<BucketListItem[]>(() => {
    try {
      const saved = localStorage.getItem('anniversary_bucket_list');
      return saved ? JSON.parse(saved) : initialBucketList;
    } catch {
      return initialBucketList;
    }
  });

  const [messages, setMessages] = useState<LoveMessage[]>(() => {
    try {
      const saved = localStorage.getItem('anniversary_love_messages');
      if (saved) {
        const parsed: LoveMessage[] = JSON.parse(saved);
        parsed.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        return parsed;
      }
      return initialLoveMessages;
    } catch {
      return initialLoveMessages;
    }
  });

  // Modal states
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isIdeasModalOpen, setIsIdeasModalOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Firebase status
  const [firebaseStatus, setFirebaseStatus] = useState<{
    isConnected: boolean;
    isSyncing: boolean;
    lastSyncedAt: Date | null;
  }>({
    isConnected: true,
    isSyncing: false,
    lastSyncedAt: null
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Husband PIN & Security Lock Modal
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Active Role State ('husband' | 'wife')
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('view') || params.get('role');
      if (roleParam === 'wife') {
        try {
          sessionStorage.removeItem('anniversary_husband_unlocked');
          localStorage.setItem('anniversary_role', 'wife');
        } catch {}
        return 'wife';
      }
    }
    try {
      const saved = localStorage.getItem('anniversary_role');
      if (saved === 'wife') return 'wife';
      if (saved === 'husband') return 'husband';
    } catch {}
    return 'husband';
  });

  const [isCopiedWifeLink, setIsCopiedWifeLink] = useState(false);

  const handleToggleRole = () => {
    if (currentRole === 'husband') {
      // Husband can easily preview wife mode
      setCurrentRole('wife');
      try {
        localStorage.setItem('anniversary_role', 'wife');
      } catch {}
    } else {
      // In wife mode, accessing husband mode strictly requires PIN
      setIsPinModalOpen(true);
    }
  };

  const handlePinUnlockSuccess = () => {
    setCurrentRole('husband');
    try {
      localStorage.setItem('anniversary_role', 'husband');
      sessionStorage.setItem('anniversary_husband_unlocked', 'true');
    } catch {}
    setIsPinModalOpen(false);
  };

  const handleCopyWifeLink = () => {
    const url = getWifeGiftUrl();
    navigator.clipboard.writeText(url).then(() => {
      setIsCopiedWifeLink(true);
      setTimeout(() => setIsCopiedWifeLink(false), 3000);
    });
  };

  // Sync state to local storage as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem('anniversary_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('anniversary_memories', JSON.stringify(memories));
    } catch {}
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('anniversary_letters', JSON.stringify(letters));
    } catch {}
  }, [letters]);

  useEffect(() => {
    try {
      localStorage.setItem('anniversary_love_requests', JSON.stringify(loveRequests));
    } catch {}
  }, [loveRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('anniversary_voice_tracks', JSON.stringify(voiceTracks));
    } catch {}
  }, [voiceTracks]);

  useEffect(() => {
    try {
      localStorage.setItem('anniversary_bucket_list', JSON.stringify(bucketList));
    } catch {}
  }, [bucketList]);

  useEffect(() => {
    try {
      localStorage.setItem('anniversary_love_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // LIVE FIREBASE FIRESTORE SYNC & REALTIME SUBSCRIPTIONS
  useEffect(() => {
    const unsubscribe = initFirebaseRealtimeSync({
      onProfileChange: (newProfile) => {
        setProfile(newProfile);
      },
      onMemoriesChange: (newMemories) => {
        setMemories(newMemories);
      },
      onLettersChange: (newLetters) => {
        setLetters(newLetters);
      },
      onLoveRequestsChange: (newRequests) => {
        setLoveRequests(newRequests);
      },
      onVoiceTracksChange: (newTracks) => {
        setVoiceTracks(newTracks);
      },
      onBucketListChange: (newBucket) => {
        setBucketList(newBucket);
      },
      onLoveMessagesChange: (newMessages) => {
        setMessages(newMessages);
      },
      onStatusChange: (status) => {
        setFirebaseStatus(status);
      },
      onUserChange: (user) => {
        setCurrentUser(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handlers
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateProfile = async (updated: CoupleProfile) => {
    // 1. Immediately update React state for instant UI reflection
    setProfile(updated);

    // 2. Persist to localStorage cache
    try {
      localStorage.setItem('anniversary_profile', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 3. Persist to Firestore database
    try {
      await saveProfileToFirestore(updated);
    } catch (e) {
      console.error('Firestore save profile error:', e);
    }
  };

  const handleAddMemory = (newMemory: Omit<MemoryItem, 'id'>) => {
    const item: MemoryItem = {
      ...newMemory,
      id: `mem-${Date.now()}`
    };
    setMemories((prev) => [item, ...prev]);
    addMemoryToFirestore(item).catch((e) => console.error(e));
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    deleteMemoryFromFirestore(id).catch((e) => console.error(e));
  };

  const handleToggleFavoriteMemory = (id: string) => {
    setMemories((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m));
      const target = updated.find((m) => m.id === id);
      if (target) {
        toggleMemoryFavoriteInFirestore(id, !!target.favorite).catch((e) => console.error(e));
      }
      return updated;
    });
  };

  const handleAddLetter = (newLetter: Omit<LoveLetter, 'id'>) => {
    const item: LoveLetter = {
      ...newLetter,
      id: `let-${Date.now()}`
    };
    setLetters((prev) => [...prev, item]);
    addLetterToFirestore(item).catch((e) => console.error(e));
  };

  const handleOpenLetter = (id: string) => {
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, isOpened: true } : l)));
    openLetterInFirestore(id).catch((e) => console.error(e));
  };

  // Love Request handlers
  const handleAddLoveRequest = (
    title: string,
    note?: string,
    category: LoveRequest['category'] = 'treat'
  ) => {
    const today = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const newReq: LoveRequest = {
      id: `req-${Date.now()}`,
      title,
      note,
      category,
      requestedAt: today || 'Today',
      status: 'pending'
    };
    setLoveRequests((prev) => [newReq, ...prev]);
    addLoveRequestToFirestore(newReq).catch((e) => console.error(e));
  };

  const handleApproveLoveRequest = (id: string, husbandReply: string) => {
    const today = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const approvedAt = `Approved with love on ${today}`;
    setLoveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'approved',
              husbandReply,
              approvedAt
            }
          : req
      )
    );
    approveLoveRequestInFirestore(id, husbandReply, approvedAt).catch((e) => console.error(e));
  };

  const handleDeleteLoveRequest = (id: string) => {
    setLoveRequests((prev) => prev.filter((r) => r.id !== id));
    deleteLoveRequestFromFirestore(id).catch((e) => console.error(e));
  };

  // Voice Cassette Track handlers
  const handleAddVoiceTrack = (track: Omit<VoiceCassetteTrack, 'id'>) => {
    const item: VoiceCassetteTrack = {
      ...track,
      id: `voice-${Date.now()}`
    };
    setVoiceTracks((prev) => [item, ...prev]);
    addVoiceTrackToFirestore(item).catch((e) => console.error(e));
  };

  const handleDeleteVoiceTrack = (id: string) => {
    setVoiceTracks((prev) => prev.filter((t) => t.id !== id));
    deleteVoiceTrackFromFirestore(id).catch((e) => console.error(e));
  };

  // Bucket list handlers
  const handleAddBucketItem = (
    title: string,
    category: BucketListItem['category'],
    targetTime?: string,
    note?: string
  ) => {
    const item: BucketListItem = {
      id: `b-${Date.now()}`,
      title,
      category,
      targetTime,
      note,
      isCompleted: false,
      addedBy: currentRole === 'wife' ? profile.wifeName : profile.husbandName
    };
    setBucketList((prev) => [item, ...prev]);
    addBucketItemToFirestore(item).catch((e) => console.error(e));
  };

  const handleToggleBucketItem = (id: string) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    setBucketList((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isCompleted: !item.isCompleted,
              completedAt: !item.isCompleted ? today : undefined
            }
          : item
      );
      const target = updated.find((i) => i.id === id);
      if (target) {
        toggleBucketItemInFirestore(id, target.isCompleted, target.completedAt).catch((e) => console.error(e));
      }
      return updated;
    });
  };

  const handleDeleteBucketItem = (id: string) => {
    setBucketList((prev) => prev.filter((i) => i.id !== id));
    deleteBucketItemFromFirestore(id).catch((e) => console.error(e));
  };

  // Couples Messenger handlers
  const handleSendMessage = async (msg: Omit<LoveMessage, 'id' | 'createdAt' | 'timestamp'>) => {
    const systemNow = Date.now();
    let safeTimestamp = systemNow;
    if (messages.length > 0) {
      const maxExistingTs = Math.max(...messages.map((m) => (typeof m.timestamp === 'number' && !isNaN(m.timestamp) ? m.timestamp : 0)));
      if (maxExistingTs >= safeTimestamp) {
        safeTimestamp = maxExistingTs + 1000;
      }
    }
    const timeFormatted = new Date(safeTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: LoveMessage = {
      ...msg,
      id: `msg-${safeTimestamp}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date(safeTimestamp).toISOString(),
      timestamp: safeTimestamp,
      displayTime: timeFormatted
    };
    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== newMsg.id);
      const updated = [...filtered, newMsg];
      updated.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      return updated;
    });
    try {
      await addLoveMessageToFirestore(newMsg);
    } catch (e) {
      console.error('Failed to sync love message to Firestore:', e);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    deleteLoveMessageFromFirestore(id).catch((e) => console.error(e));
  };

  const handleReactMessage = (id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const reactions = { ...(m.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...m, reactions };
        }
        return m;
      })
    );
    reactToLoveMessageInFirestore(id, emoji).catch((e) => console.error(e));
  };

  // Reset to sample anniversary data
  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to restore default sample anniversary keepsake data?')) {
      setProfile(initialProfile);
      setMemories(initialMemories);
      setLetters(initialLetters);
      setLoveRequests(initialLoveRequests);
      setVoiceTracks(initialVoiceTracks);
      setBucketList(initialBucketList);
      setMessages(initialLoveMessages);
      saveProfileToFirestore(initialProfile).catch((e) => console.error(e));
    }
  };

  // Export / Import Backup JSON
  const handleExportData = () => {
    const fullBackup = {
      profile,
      memories,
      letters,
      loveRequests,
      voiceTracks,
      bucketList,
      messages,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anniversary_keepsake_${profile.husbandName}_${profile.wifeName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.memories) setMemories(parsed.memories);
        if (parsed.letters) setLetters(parsed.letters);
        if (parsed.loveRequests) setLoveRequests(parsed.loveRequests);
        if (parsed.voiceTracks) setVoiceTracks(parsed.voiceTracks);
        if (parsed.bucketList) setBucketList(parsed.bucketList);
        if (parsed.messages) setMessages(parsed.messages);
        alert('Keepsake backup imported successfully!');
      } catch {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Top Ceremony Envelope (if not opened yet) */}
      {!isEnvelopeOpen && (
        <OpeningEnvelope
          wifeName={profile.nicknameForHer || profile.wifeName}
          husbandName={profile.husbandName}
          isOpen={isEnvelopeOpen}
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* Top Navigation Bar */}
      <Navbar
        wifeName={profile.wifeName}
        husbandName={profile.husbandName}
        currentRole={currentRole}
        onRequestHusbandRole={() => setIsPinModalOpen(true)}
        onToggleRole={handleToggleRole}
        onCopyWifeLink={handleCopyWifeLink}
        isCopiedWifeLink={isCopiedWifeLink}
        onOpenIdeas={() => setIsIdeasModalOpen(true)}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onReplayOpening={() => setIsEnvelopeOpen(false)}
        onOpenFirebase={() => setIsFirebaseModalOpen(true)}
        isFirebaseConnected={firebaseStatus.isConnected}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {/* Hero Section */}
        <HeroSection
          profile={profile}
          onExploreSection={handleScrollToSection}
          onOpenIdeas={() => setIsIdeasModalOpen(true)}
          onOpenCustomize={() => setIsCustomizeOpen(true)}
        />

        {/* Section 1: Our Story Timeline Scrapbook */}
        <TimelineScrapbook
          memories={memories}
          wifeName={profile.wifeName}
          currentRole={currentRole}
          onAddMemory={handleAddMemory}
          onDeleteMemory={handleDeleteMemory}
          onToggleFavorite={handleToggleFavoriteMemory}
        />

        {/* Section 2: Sweet Whispers Couples Messenger (Realtime Text & Photos) */}
        <CoupleMessenger
          messages={messages}
          wifeName={profile.wifeName}
          husbandName={profile.husbandName}
          currentRole={currentRole}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onReactMessage={handleReactMessage}
        />

        {/* Section 3: Love Requests & Husband's Approval */}
        <LoveRequests
          requests={loveRequests}
          wifeName={profile.wifeName}
          husbandName={profile.husbandName}
          currentRole={currentRole}
          onAddRequest={handleAddLoveRequest}
          onApproveRequest={handleApproveLoveRequest}
          onDeleteRequest={handleDeleteLoveRequest}
        />

        {/* Section 3: Couple Voice Cassette Tape (Running Ribbon & Real Voice Recording) */}
        <MixtapePlayer
          tracks={voiceTracks}
          wifeName={profile.wifeName}
          husbandName={profile.husbandName}
          onAddTrack={handleAddVoiceTrack}
          onDeleteTrack={handleDeleteVoiceTrack}
        />

        {/* Section 4: Wax-Sealed "Open When..." Letters */}
        <OpenWhenLetters
          letters={letters}
          wifeName={profile.wifeName}
          husbandName={profile.husbandName}
          currentRole={currentRole}
          onAddLetter={handleAddLetter}
          onOpenLetter={handleOpenLetter}
        />

        {/* Section 5: Couple Bucket List */}
        <BucketList
          items={bucketList}
          wifeName={profile.wifeName}
          husbandName={profile.husbandName}
          onAddItem={handleAddBucketItem}
          onToggleItem={handleToggleBucketItem}
          onDeleteItem={handleDeleteBucketItem}
        />
      </main>

      {/* Footer */}
      <Footer
        wifeName={profile.wifeName}
        husbandName={profile.husbandName}
        currentRole={currentRole}
        onOpenIdeas={() => setIsIdeasModalOpen(true)}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
      />

      {/* Husband's Anniversary Ideas Blueprint Guide */}
      <IdeaGuideModal
        isOpen={isIdeasModalOpen}
        onClose={() => setIsIdeasModalOpen(false)}
        onJumpToSection={handleScrollToSection}
      />

      {/* Husband's Live Personalizer Drawer */}
      <CustomizeDrawer
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onResetDefaults={handleResetDefaults}
        onReplayOpening={() => setIsEnvelopeOpen(false)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onOpenFirebase={() => setIsFirebaseModalOpen(true)}
      />

      {/* Firebase Cloud Sync & Wife Access Modal */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        wifeName={profile.wifeName}
        husbandName={profile.husbandName}
        currentRole={currentRole}
        onToggleRole={handleToggleRole}
        currentUser={currentUser}
        isConnected={firebaseStatus.isConnected}
        lastSyncedAt={firebaseStatus.lastSyncedAt}
      />

      {/* Husband Secret PIN Unlock Modal */}
      <HusbandPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinUnlockSuccess}
        currentPin={profile.husbandPin || '2024'}
        wifeName={profile.wifeName}
        husbandName={profile.husbandName}
      />

    </div>
  );
}
