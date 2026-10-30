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

