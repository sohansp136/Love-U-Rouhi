export interface CoupleProfile {
  husbandName: string;
  wifeName: string;
  anniversaryDate: string; // YYYY-MM-DD
  anniversaryYearNumber: number; // e.g. 1st, 5th, 10th
  nicknameForHer: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroPhotoUrl: string;
  romanticQuote: string;
  quoteAuthor: string;
  husbandPin?: string;
  boardWallTheme?: string;
  boardCustomBgUrl?: string;
  // Security Gatekeeper & Email Recovery
  isSecuritySetupDone?: boolean;
  securityPasscode?: string;
  recoveryEmail?: string;
  recoverySecurityQuestion?: string;
  recoverySecurityAnswer?: string;
}

export type MemoryCategory = 'all' | 'firsts' | 'adventures' | 'milestones' | 'everyday';

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  location?: string;
  caption: string;
  category: 'firsts' | 'adventures' | 'milestones' | 'everyday';
  imageUrl: string;
  images?: string[];
  tags?: string[];
  favorite?: boolean;
}

export interface LoveLetter {
  id: string;
  title: string;
  sealedPrompt: string; // e.g. "Open when it's our anniversary morning"
  sealColor: string; // hex
  dateWritten: string;
  content: string[];
  signoff: string;
  isOpened?: boolean;
}

export interface LoveRequest {
  id: string;
  title: string;
  note?: string;
  category: 'date' | 'treat' | 'gift' | 'pamper' | 'cuddle' | 'custom';
  requestedAt: string;
  status: 'pending' | 'approved';
  husbandReply?: string;
  approvedAt?: string;
}

export interface VoiceCassetteTrack {
  id: string;
  title: string;
  author: 'husband' | 'wife';
  authorName: string;
  recipientName: string;
  audioUrl: string; // base64 or audio object URL
  durationSeconds: number;
  recordedDate: string;
  note?: string;
  side: 'A' | 'B';
}

export interface BucketListItem {
  id: string;
  title: string;
  note?: string;
  category: 'travel' | 'adventure' | 'experience' | 'lifestyle';
  targetTime?: string;
  isCompleted: boolean;
  completedAt?: string;
  addedBy: string;
}

export interface AnniversaryIdeaGuide {
  id: string;
  title: string;
  tagline: string;
  description: string;
  whySheWillLoveIt: string;
  howToMakeItUnforgettable: string[];
  interactiveDemoSectionId: string;
  difficulty: 'Easy & Quick' | 'Thoughtful & Cozy' | 'Epic Romance';
}

export type UserRole = 'husband' | 'wife';

export interface LoveMessage {
  id: string;
  senderRole: 'husband' | 'wife';
  senderName: string;
  recipientName: string;
  text?: string;
  imageUrl?: string;
  images?: string[];
  createdAt: string;
  timestamp: number;
  displayTime?: string;
  reactions?: { [emoji: string]: number };
  replyTo?: {
    id: string;
    senderName: string;
    senderRole?: 'husband' | 'wife';
    text?: string;
    imageUrl?: string;
  };
}

export type StickyColor = 'yellow' | 'pink' | 'purple' | 'green' | 'peach' | 'sky';

export interface StickyNote {
  id: string;
  authorRole: 'husband' | 'wife';
  authorName: string;
  content: string;
  color: StickyColor;
  rotation?: number;
  pinnedAt: string;
  pinnedDateFormatted?: string;
  heartsCount: number;
  likedByHusband?: boolean;
  likedByWife?: boolean;
  sticker?: string;
  imageUrl?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  entryDate: string;
  title: string;
  husbandNote?: string;
  husbandUpdatedAt?: string;
  husbandMood?: string;
  wifeNote?: string;
  wifeUpdatedAt?: string;
  wifeMood?: string;
  sharedPhotoUrl?: string;
  sharedPhotos?: string[];
  favoriteQuote?: string;
  weather?: string;
  specialLocation?: string;
  createdAt: string;
}
