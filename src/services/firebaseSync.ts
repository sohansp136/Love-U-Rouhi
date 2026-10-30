import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import {
  CoupleProfile,
  MemoryItem,
  LoveLetter,
  LoveRequest,
  VoiceCassetteTrack,
  BucketListItem,
  LoveMessage
} from '../types';
import {
  initialProfile,
  initialMemories,
  initialLetters,
  initialLoveRequests,
  initialVoiceTracks,
  initialBucketList,
  initialLoveMessages
} from '../data/defaultData';

export interface FirebaseSyncCallbacks {
  onProfileChange: (profile: CoupleProfile) => void;
  onMemoriesChange: (memories: MemoryItem[]) => void;
  onLettersChange: (letters: LoveLetter[]) => void;
  onLoveRequestsChange: (requests: LoveRequest[]) => void;
  onVoiceTracksChange: (tracks: VoiceCassetteTrack[]) => void;
  onBucketListChange: (items: BucketListItem[]) => void;
  onLoveMessagesChange?: (messages: LoveMessage[]) => void;
  onStatusChange: (status: { isConnected: boolean; isSyncing: boolean; lastSyncedAt: Date | null }) => void;
  onUserChange?: (user: User | null) => void;
}

/**
 * Seeds initial anniversary keepsake data to Firestore ONLY IF EMPTY
 * NEVER overwrites existing user customizer profile
 */
export async function seedInitialDataIfEmpty() {
  try {
    const profileRef = doc(db, 'couple_profile', 'main');
    const profileSnap = await getDoc(profileRef);

    // Only create default profile if couple_profile/main does not exist at all!
    if (!profileSnap.exists()) {
      console.log('Seeding initial anniversary profile to Firestore...');
      await setDoc(profileRef, {
        ...initialProfile,
        updatedAt: serverTimestamp()
      });
    }

    // Seed letters only if letters collection is empty
    const lettersSnap = await getDocs(collection(db, 'letters'));
    if (lettersSnap.empty) {
      for (const letItem of initialLetters) {
        await setDoc(doc(db, 'letters', letItem.id), {
          ...letItem,
          createdAt: serverTimestamp()
        });
      }
    }
  } catch (err) {
    console.warn('Initial seeding non-blocking note:', err);
  }
}

/**
 * Initializes realtime synchronization with Firestore
 */
export function initFirebaseRealtimeSync(callbacks: FirebaseSyncCallbacks) {
  const unsubscribers: (() => void)[] = [];

  callbacks.onStatusChange({
    isConnected: true,
    isSyncing: true,
    lastSyncedAt: new Date()
  });

  // 1. Auth state listener
  if (callbacks.onUserChange) {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      callbacks.onUserChange?.(user);
    });
    unsubscribers.push(unsubAuth);
  }

  // 2. Profile Realtime Listener
  const profileDocRef = doc(db, 'couple_profile', 'main');
  const unsubProfile = onSnapshot(profileDocRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as CoupleProfile;
      callbacks.onProfileChange({
        husbandName: data.husbandName || initialProfile.husbandName,
        wifeName: data.wifeName || initialProfile.wifeName,
        anniversaryDate: data.anniversaryDate || initialProfile.anniversaryDate,
        anniversaryYearNumber: data.anniversaryYearNumber || initialProfile.anniversaryYearNumber,
        nicknameForHer: data.nicknameForHer || initialProfile.nicknameForHer,
        heroHeadline: data.heroHeadline || initialProfile.heroHeadline,
        heroSubheadline: data.heroSubheadline || initialProfile.heroSubheadline,
        heroPhotoUrl: data.heroPhotoUrl || initialProfile.heroPhotoUrl,
        romanticQuote: data.romanticQuote || initialProfile.romanticQuote,
        quoteAuthor: data.quoteAuthor || initialProfile.quoteAuthor
      });
      callbacks.onStatusChange({
        isConnected: true,
        isSyncing: false,
        lastSyncedAt: new Date()
      });
    }
  }, (err) => {
    callbacks.onStatusChange({ isConnected: false, isSyncing: false, lastSyncedAt: null });
    handleFirestoreError(err, OperationType.GET, 'couple_profile/main');
  });
  unsubscribers.push(unprofileDocRefUnsub(unsubProfile));

  // 3. Love Requests Realtime Listener
  const loveReqsCol = collection(db, 'love_requests');
  const unsubLoveReqs = onSnapshot(loveReqsCol, (snap) => {
    if (!snap.empty) {
      const list: LoveRequest[] = snap.docs.map((d) => {
        const item = d.data();
        return {
          id: item.id || d.id,
          title: item.title,
          note: item.note,
          category: item.category,
          requestedAt: item.requestedAt,
          status: item.status,
          husbandReply: item.husbandReply,
          approvedAt: item.approvedAt
        };
      });
      callbacks.onLoveRequestsChange(list);
      callbacks.onStatusChange({ isConnected: true, isSyncing: false, lastSyncedAt: new Date() });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'love_requests');
  });
  unsubscribers.push(unsubLoveReqs);

  // 4. Scrapbook Memories Realtime Listener
  const memoriesCol = collection(db, 'memories');
  const unsubMemories = onSnapshot(memoriesCol, (snap) => {
    if (!snap.empty) {
      const list: MemoryItem[] = snap.docs.map((d) => {
        const item = d.data();
        return {
          id: item.id || d.id,
          date: item.date,
          title: item.title,
          location: item.location,
          caption: item.caption,
          category: item.category,
          imageUrl: item.imageUrl,
          images: item.images || (item.imageUrl ? [item.imageUrl] : []),
          favorite: item.favorite
        };
      });
      callbacks.onMemoriesChange(list);
      callbacks.onStatusChange({ isConnected: true, isSyncing: false, lastSyncedAt: new Date() });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'memories');
  });
  unsubscribers.push(unsubMemories);

  // 5. Sealed Letters Realtime Listener
  const lettersCol = collection(db, 'letters');
  const unsubLetters = onSnapshot(lettersCol, (snap) => {
    if (!snap.empty) {
      const list: LoveLetter[] = snap.docs.map((d) => {
        const item = d.data();
        return {
          id: item.id || d.id,
          title: item.title,
          sealedPrompt: item.sealedPrompt,
          sealColor: item.sealColor,
          dateWritten: item.dateWritten,
          content: item.content || [],
          signoff: item.signoff,
          isOpened: item.isOpened
        };
      });
      callbacks.onLettersChange(list);
      callbacks.onStatusChange({ isConnected: true, isSyncing: false, lastSyncedAt: new Date() });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'letters');
  });
  unsubscribers.push(unsubLetters);

  // 6. Voice Tracks Realtime Listener
  const voiceCol = collection(db, 'voice_tracks');
  const unsubVoice = onSnapshot(voiceCol, (snap) => {
    if (!snap.empty) {
      const list: VoiceCassetteTrack[] = snap.docs.map((d) => {
        const item = d.data();
        return {
          id: item.id || d.id,
          title: item.title,
          author: item.author,
          authorName: item.authorName,
          recipientName: item.recipientName,
          audioUrl: item.audioUrl,
          durationSeconds: item.durationSeconds,
          recordedDate: item.recordedDate,
          note: item.note,
          side: item.side
        };
      });
      callbacks.onVoiceTracksChange(list);
      callbacks.onStatusChange({ isConnected: true, isSyncing: false, lastSyncedAt: new Date() });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'voice_tracks');
  });
  unsubscribers.push(unsubVoice);

  // 7. Bucket List Realtime Listener
  const bucketCol = collection(db, 'bucket_list');
  const unsubBucket = onSnapshot(bucketCol, (snap) => {
    if (!snap.empty) {
      const list: BucketListItem[] = snap.docs.map((d) => {
        const item = d.data();
        return {
          id: item.id || d.id,
          title: item.title,
          note: item.note,
          category: item.category,
          targetTime: item.targetTime,
          isCompleted: item.isCompleted,
          completedAt: item.completedAt,
          addedBy: item.addedBy
        };
      });
      callbacks.onBucketListChange(list);
      callbacks.onStatusChange({ isConnected: true, isSyncing: false, lastSyncedAt: new Date() });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'bucket_list');
  });
  unsubscribers.push(unsubBucket);

  // 8. Love Messages (Couples Realtime Messenger) Listener
  const messagesCol = collection(db, 'love_messages');
  const unsubMessages = onSnapshot(messagesCol, (snap) => {
    if (!snap.empty) {
      const list: LoveMessage[] = snap.docs.map((d) => {
        const item = d.data();
        return {
          id: item.id || d.id,
          senderRole: item.senderRole || 'husband',
          senderName: item.senderName || '',
          recipientName: item.recipientName || '',
          text: item.text || '',
          imageUrl: item.imageUrl || '',
          images: item.images || (item.imageUrl ? [item.imageUrl] : []),
          createdAt: item.createdAt || '',
          reactions: item.reactions || {}
        };
      });
      // Sort chronologically
      list.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
      callbacks.onLoveMessagesChange?.(list);
      callbacks.onStatusChange({ isConnected: true, isSyncing: false, lastSyncedAt: new Date() });
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'love_messages');
  });
  unsubscribers.push(unsubMessages);

  // Check seeding in background
  seedInitialDataIfEmpty();

  return () => {
    unsubscribers.forEach((u) => u());
  };
}

function unprofileDocRefUnsub(fn: () => void) {
  return fn;
}

// =================== FIRESTORE MUTATIONS ===================

export async function saveProfileToFirestore(profile: CoupleProfile) {
  const path = 'couple_profile/main';
  try {
    const cleanData: Record<string, any> = {
      husbandName: profile.husbandName || initialProfile.husbandName,
      wifeName: profile.wifeName || initialProfile.wifeName,
      anniversaryDate: profile.anniversaryDate || initialProfile.anniversaryDate,
      anniversaryYearNumber: profile.anniversaryYearNumber ?? initialProfile.anniversaryYearNumber,
      nicknameForHer: profile.nicknameForHer || profile.wifeName || initialProfile.nicknameForHer,
      heroHeadline: profile.heroHeadline || initialProfile.heroHeadline,
      heroSubheadline: profile.heroSubheadline || initialProfile.heroSubheadline,
      heroPhotoUrl: profile.heroPhotoUrl || initialProfile.heroPhotoUrl,
      romanticQuote: profile.romanticQuote || initialProfile.romanticQuote,
      quoteAuthor: profile.quoteAuthor || initialProfile.quoteAuthor,
      husbandPin: profile.husbandPin || '2024',
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'couple_profile', 'main'), cleanData, { merge: true });
    return cleanData;
  } catch (err) {
    console.error('saveProfileToFirestore error:', err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function addLoveRequestToFirestore(req: LoveRequest) {
  const path = `love_requests/${req.id}`;
  try {
    await setDoc(doc(db, 'love_requests', req.id), {
      ...req,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function approveLoveRequestInFirestore(id: string, husbandReply: string, approvedAt: string) {
  const path = `love_requests/${id}`;
  try {
    await updateDoc(doc(db, 'love_requests', id), {
      status: 'approved',
      husbandReply,
      approvedAt,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteLoveRequestFromFirestore(id: string) {
  const path = `love_requests/${id}`;
  try {
    await deleteDoc(doc(db, 'love_requests', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function addMemoryToFirestore(memory: MemoryItem) {
  const path = `memories/${memory.id}`;
  try {
    const imagesList = memory.images && memory.images.length > 0
      ? memory.images
      : (memory.imageUrl ? [memory.imageUrl] : []);

    await setDoc(doc(db, 'memories', memory.id), {
      ...memory,
      imageUrl: memory.imageUrl || imagesList[0] || '',
      images: imagesList,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteMemoryFromFirestore(id: string) {
  const path = `memories/${id}`;
  try {
    await deleteDoc(doc(db, 'memories', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function toggleMemoryFavoriteInFirestore(id: string, favorite: boolean) {
  const path = `memories/${id}`;
  try {
    await updateDoc(doc(db, 'memories', id), {
      favorite,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function addLetterToFirestore(letter: LoveLetter) {
  const path = `letters/${letter.id}`;
  try {
    await setDoc(doc(db, 'letters', letter.id), {
      ...letter,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function openLetterInFirestore(id: string) {
  const path = `letters/${id}`;
  try {
    await updateDoc(doc(db, 'letters', id), {
      isOpened: true,
      openedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function addVoiceTrackToFirestore(track: VoiceCassetteTrack) {
  const path = `voice_tracks/${track.id}`;
  try {
    await setDoc(doc(db, 'voice_tracks', track.id), {
      ...track,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteVoiceTrackFromFirestore(id: string) {
  const path = `voice_tracks/${id}`;
  try {
    await deleteDoc(doc(db, 'voice_tracks', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function addBucketItemToFirestore(item: BucketListItem) {
  const path = `bucket_list/${item.id}`;
  try {
    await setDoc(doc(db, 'bucket_list', item.id), {
      ...item,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function toggleBucketItemInFirestore(id: string, isCompleted: boolean, completedAt?: string) {
  const path = `bucket_list/${id}`;
  try {
    await updateDoc(doc(db, 'bucket_list', id), {
      isCompleted,
      completedAt: completedAt || null,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteBucketItemFromFirestore(id: string) {
  const path = `bucket_list/${id}`;
  try {
    await deleteDoc(doc(db, 'bucket_list', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function addLoveMessageToFirestore(message: LoveMessage) {
  const path = `love_messages/${message.id}`;
  try {
    const imagesList = message.images && message.images.length > 0
      ? message.images
      : (message.imageUrl ? [message.imageUrl] : []);

    await setDoc(doc(db, 'love_messages', message.id), {
      ...message,
      imageUrl: message.imageUrl || imagesList[0] || '',
      images: imagesList,
      reactions: message.reactions || {},
      createdAt: message.createdAt || new Date().toISOString(),
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteLoveMessageFromFirestore(id: string) {
  const path = `love_messages/${id}`;
  try {
    await deleteDoc(doc(db, 'love_messages', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function reactToLoveMessageInFirestore(id: string, emoji: string) {
  const path = `love_messages/${id}`;
  try {
    const docRef = doc(db, 'love_messages', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const reactions = { ...(data.reactions || {}) };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      await updateDoc(docRef, { reactions, updatedAt: serverTimestamp() });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Generate a shareable gift link specially for the wife
 */
export function getWifeGiftUrl(): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('role', 'wife');
  // Remove legacy supabase query parameters
  url.searchParams.delete('sb_url');
  url.searchParams.delete('sb_key');
  return url.toString();
}

/**
 * Generate husband gift link
 */
export function getHusbandGiftUrl(): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('role', 'husband');
  return url.toString();
}
