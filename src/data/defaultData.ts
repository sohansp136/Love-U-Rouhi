import {
  CoupleProfile,
  MemoryItem,
  LoveLetter,
  LoveRequest,
  VoiceCassetteTrack,
  BucketListItem,
  AnniversaryIdeaGuide,
  LoveMessage
} from '../types';

import heroImageSource from '../assets/images/anniversary_hero_1792066519480.jpg';
import stationeryImageSource from '../assets/images/romantic_letter_stationery_1792066536856.jpg';

export const HERO_IMAGE = heroImageSource;
export const STATIONERY_IMAGE = stationeryImageSource;

export const initialProfile: CoupleProfile = {
  husbandName: 'Your Loving Husband',
  wifeName: 'My Dearest Wife',
  anniversaryDate: '2022-10-18', // YYYY-MM-DD
  anniversaryYearNumber: 4,
  nicknameForHer: 'My Forever Love',
  heroHeadline: 'Every Single Second With You Is My Greatest Blessing',
  heroSubheadline: 'A handcrafted space created for only one person in this world. Happy Anniversary, my darling.',
  heroPhotoUrl: HERO_IMAGE,
  romanticQuote: 'In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.',
  quoteAuthor: 'Maya Angelou',
  husbandPin: '2024'
};

// Clean starting memories list
export const initialMemories: MemoryItem[] = [];

export const initialLetters: LoveLetter[] = [
  {
    id: 'let-1',
    title: 'Anniversary Morning Letter',
    sealedPrompt: 'Open on our anniversary morning before anything else',
    sealColor: '#e11d48',
    dateWritten: 'Anniversary Special',
    content: [
      'Happy Anniversary, my darling.',
      'From the moment I held your hand and made you my wife, I knew I was the most fortunate man alive. Every day with you teaches me how profound and tender true love can be.',
      'You are not just my wife; you are my best friend, my peaceful sanctuary, and my greatest strength. Thank you for making our home filled with joy, warmth, and grace.',
      'On this special day, my only prayer is that we continue to laugh, hold hands, and choose each other for all the years to come.'
    ],
    signoff: 'Forever and always yours,\nYour Husband'
  },
  {
    id: 'let-2',
    title: 'When You Feel Tired or Overwhelmed',
    sealedPrompt: 'Open when your day feels heavy or you doubt your strength',
    sealColor: '#b45309',
    dateWritten: 'For Exhausting Days',
    content: [
      'Take a deep breath and relax your shoulders, my love.',
      'I know life can sometimes feel demanding and heavy. When the world asks too much of you, remember that you are deeply cherished, respected, and admired.',
      'Whatever challenges you face today, you do not have to carry them alone. I am always standing right beside you, ready to hold your hand and protect your peace.'
    ],
    signoff: 'Always your safe harbor,'
  },
  {
    id: 'let-3',
    title: 'When You Miss Me',
    sealedPrompt: 'Open when work or distance keeps us apart for the day',
    sealColor: '#7c3aed',
    dateWritten: 'Thinking of You',
    content: [
      'Hey sweetheart,',
      'No matter how busy the day gets, you are always the constant rhythm in my heart and the first thought in my mind.',
      'Place your hand over your heart right now—that heartbeat carries all the love I have for you. I am counting down the moments until I get to hold you in my arms tonight.'
    ],
    signoff: 'Running back home to you,'
  }
];

// Clean starting love requests list
export const initialLoveRequests: LoveRequest[] = [];

// Clean starting voice cassette tracks — husband and wife record or upload their own voices
export const initialVoiceTracks: VoiceCassetteTrack[] = [];

// Clean starting Bucket List
export const initialBucketList: BucketListItem[] = [];

// Clean starting Love Chat Messages
export const initialLoveMessages: LoveMessage[] = [
  {
    id: 'msg-welcome-1',
    senderRole: 'husband',
    senderName: 'Your Loving Husband',
    recipientName: 'My Dearest Wife',
    text: 'Welcome to our private love chat room, my darling! ❤️ Here we can send sweet notes, whispers, and photos whenever we think of each other.',
    createdAt: new Date().toISOString(),
    timestamp: Date.now() - 60000,
    displayTime: 'Just now',
    reactions: { '❤️': 1 }
  }
];

export const anniversaryAppIdeas: AnniversaryIdeaGuide[] = [
  {
    id: 'idea-1',
    title: 'Love Requests & Husband Approval',
    tagline: 'A playful and loving space where she can ask for anything and you approve it with a love note.',
    description: 'An interactive wish system where she can request romantic dates, home-cooked dinners, spa days, shopping treats, or quiet cozy hours. The husband receives the request and stamps it as Approved with a heartfelt promise.',
    whySheWillLoveIt: 'Women love when their desires and little wishes are welcomed, noticed, and honored with genuine enthusiasm and zero resistance.',
    howToMakeItUnforgettable: [
      'Approve her requests warmly and quickly.',
      'Add an affectionate note or playful commitment when approving.',
      'Deliver on the request in real life to surprise her.'
    ],
    interactiveDemoSectionId: 'love-requests',
    difficulty: 'Easy & Quick'
  },
  {
    id: 'idea-2',
    title: 'Our Couple Bucket List',
    tagline: 'A living wishlist of travels, adventures, and milestones to achieve together.',
    description: 'A collaborative checklist of shared dreams—visiting breathtaking destinations, learning new skills, or checking off cozy life experiences with interactive completion checkboxes and celebration confetti.',
    whySheWillLoveIt: 'Planning a shared future builds excitement, romantic vision, and deep emotional security in a marriage.',
    howToMakeItUnforgettable: [
      'Add dreams that cater to her personal bucket list.',
      'Celebrate together whenever an item is marked completed.'
    ],
    interactiveDemoSectionId: 'bucket-list',
    difficulty: 'Thoughtful & Cozy'
  },
  {
    id: 'idea-3',
    title: 'Our Couple Voice Cassette Tape',
    tagline: 'Record intimate voice notes, sung songs, or sweet messages for each other on a retro tape deck.',
    description: 'A vintage running ribbon cassette tape player where either of you can record your voice directly using the microphone or upload an audio file. Listen to each other’s voices while the cassette reels spin.',
    whySheWillLoveIt: 'Hearing your real voice—saying "I love you", singing an acoustic line, or leaving a goodnight message—is incomparably warmer and more emotional than plain text.',
    howToMakeItUnforgettable: [
      'Record a 30-second whisper or song just for her.',
      'Encourage her to record a message back for you on Side B.'
    ],
    interactiveDemoSectionId: 'voice-cassette',
    difficulty: 'Easy & Quick'
  },
  {
    id: 'idea-4',
    title: 'Wax-Sealed "Open When..." Letters',
    tagline: 'Love letters sealed with virtual wax stamps for different emotional moments across the year.',
    description: 'Letters sealed with virtual colored wax stamps that crack open with sound and confetti. Letters for anniversary morning, hard days, or lonely moments.',
    whySheWillLoveIt: 'Extends your anniversary present across all 365 days of the upcoming year.',
    howToMakeItUnforgettable: [
      'Write from the heart with vulnerability and deep appreciation.',
      'Remind her of why you admire her grace and character.'
    ],
    interactiveDemoSectionId: 'sealed-letters',
    difficulty: 'Epic Romance'
  },
  {
    id: 'idea-5',
    title: 'Our Love Story Scrapbook',
    tagline: 'A blank, bespoke photo gallery waiting for your actual pictures and milestones.',
    description: 'A digital polaroid scrapbook where both of you can upload real photos from your wedding, travels, and sweet everyday moments, paired with handwritten captions.',
    whySheWillLoveIt: 'It is completely personal, authentic, and free of generic dummy content.',
    howToMakeItUnforgettable: [
      'Upload genuine photos of you both together.',
      'Write captions highlighting the small details only you remember.'
    ],
    interactiveDemoSectionId: 'story-timeline',
    difficulty: 'Easy & Quick'
  }
];
