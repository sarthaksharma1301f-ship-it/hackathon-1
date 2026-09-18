// Storage & Seed Data Layer for Creator Gig Marketplace

const STORAGE_KEYS = {
  USERS: 'cgm_users_v1',
  GIGS: 'cgm_gigs_v1',
  BOOKINGS: 'cgm_bookings_v1',
  ACTIVE_USER_ID: 'cgm_active_user_id_v1',
};

const CATEGORIES = [
  'Video Editing',
  'Graphic Design',
  'Content Writing',
  'Tutoring',
  'Web Development',
  'Voiceover',
  'Social Media'
];

const INITIAL_USERS = [
  {
    id: 'usr_sarah',
    name: 'Sarah Chen',
    role: 'both',
    tagline: 'Video Editor & Motion Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    email: 'sarah.chen@creator.io'
  },
  {
    id: 'usr_marcus',
    name: 'Marcus Vance',
    role: 'both',
    tagline: 'Brand Identity & Vector Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'marcus.v@designcraft.co'
  },
  {
    id: 'usr_priya',
    name: 'Priya Patel',
    role: 'both',
    tagline: 'Full-Stack Dev & Python Tutor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'priya.codes@techguide.dev'
  },
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    role: 'both',
    tagline: 'Startup Founder & Client',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    email: 'elena@stealthai.launch'
  },
  {
    id: 'usr_david',
    name: 'David Kim',
    role: 'both',
    tagline: 'Copywriter & Newsletter Strategist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'david.k@wordsmith.net'
  }
];

const INITIAL_GIGS = [
  {
    id: 'gig_1',
    creator_id: 'usr_sarah',
    title: 'Viral TikTok & Instagram Reels Video Editing (Hooks + Subtitles)',
    category: 'Video Editing',
    rate: 45,
    description: 'Transform your raw smartphone footage into fast-paced, high-retention vertical videos. Includes custom kinetic typography, engaging sound effects, zoom cuts, and color correction optimized for the algorithm.',
    status: 'active',
    created_at: '2026-09-18T18:30:00.000Z'
  },
  {
    id: 'gig_2',
    creator_id: 'usr_marcus',
    title: 'Minimalist Modern Logo & Visual Identity Kit',
    category: 'Graphic Design',
    rate: 120,
    description: 'Bespoke vector logo design tailored for creative entrepreneurs and indie creators. Deliverables include primary logo, sub-mark, color palette hex codes, typography pairings, and ready-to-use social avatars.',
    status: 'active',
    created_at: '2026-09-18T17:15:00.000Z'
  },
  {
    id: 'gig_3',
    creator_id: 'usr_priya',
    title: '1-on-1 Python & Web Development Live Tutoring Session',
    category: 'Tutoring',
    rate: 55,
    description: 'Hands-on, friendly coding mentorship for beginners and intermediate coders. Learn React, JavaScript, or Python backend basics. We tackle your real assignment or personal portfolio project live on screen.',
    status: 'active',
    created_at: '2026-09-18T16:00:00.000Z'
  },
  {
    id: 'gig_4',
    creator_id: 'usr_david',
    title: 'High-Converting Landing Page Copy & Newsletter Ghostwriting',
    category: 'Content Writing',
    rate: 80,
    description: 'Compelling copy that speaks directly to your target audience. I write engaging newsletter issues, landing page sales hero copy, and product launch announcements that drive real clicks and signups.',
    status: 'active',
    created_at: '2026-09-18T14:20:00.000Z'
  },
  {
    id: 'gig_5',
    creator_id: 'usr_sarah',
    title: 'Cinematic 4K YouTube Video Storytelling & Pacing Edit',
    category: 'Video Editing',
    rate: 175,
    description: 'Complete narrative editing for 10–20 minute YouTube videos. Multi-cam sync, B-roll sourcing, custom transition design, audio ducking, and click-worthy high-CTR thumbnail concept included.',
    status: 'active',
    created_at: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'gig_6',
    creator_id: 'usr_priya',
    title: 'Custom Fast Responsive Portfolio Website in Tailwind + React',
    category: 'Web Development',
    rate: 220,
    description: 'Get a clean, modern personal creator portfolio or agency site that loads in milliseconds. Fully responsive across iPhone, iPad, and desktop with sleek dark/light aesthetics and contact form integration.',
    status: 'active',
    created_at: '2026-09-18T10:30:00.000Z'
  },
  {
    id: 'gig_7',
    creator_id: 'usr_marcus',
    title: 'Energetic Commercial Voiceover & Podcast Intro Audio',
    category: 'Voiceover',
    rate: 65,
    description: 'Broadcast-quality vocal recordings from a treated home studio. Clear, articulate, and youthful tone perfect for software explainer videos, podcast introductions, and YouTube sponsorships.',
    status: 'active',
    created_at: '2026-09-18T09:00:00.000Z'
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'bk_1001',
    gig_id: 'gig_1',
    client_id: 'usr_elena',
    client_name: 'Elena Rostova',
    client_email: 'elena@stealthai.launch',
    message: 'Hey Sarah! We have 3 raw founder clips from our team sprint. Need fast captions and hook cuts by Thursday. Can you take this on?',
    status: 'pending',
    created_at: '2026-09-18T20:10:00.000Z'
  },
  {
    id: 'bk_1002',
    gig_id: 'gig_2',
    client_id: 'usr_david',
    client_name: 'David Kim',
    client_email: 'david.k@wordsmith.net',
    message: 'Hi Marcus, launching a new newsletter called "Creator Signal" and need a sharp minimalist logo mark.',
    status: 'accepted',
    created_at: '2026-09-18T19:00:00.000Z'
  },
  {
    id: 'bk_1003',
    gig_id: 'gig_3',
    client_id: 'usr_elena',
    client_name: 'Elena Rostova',
    client_email: 'elena@stealthai.launch',
    message: 'Looking for in-person coding assistance in Seattle downtown this Saturday.',
    status: 'declined',
    created_at: '2026-09-18T17:45:00.000Z'
  },
  {
    id: 'bk_1004',
    gig_id: 'gig_1',
    client_id: 'usr_marcus',
    client_name: 'Marcus Vance',
    client_email: 'marcus.v@designcraft.co',
    message: 'Need a quick 30s cutdown of my Figma logo speed-art video with background lo-fi music.',
    status: 'pending',
    created_at: '2026-09-18T21:30:00.000Z'
  }
];

// Helper functions for persistent state
window.CGM_STORAGE = {
  CATEGORIES,

  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  setUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getActiveUserId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) || INITIAL_USERS[0].id;
    } catch {
      return INITIAL_USERS[0].id;
    }
  },

  setActiveUserId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
  },

  getGigs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GIGS);
      return data ? JSON.parse(data) : INITIAL_GIGS;
    } catch {
      return INITIAL_GIGS;
    }
  },

  setGigs(gigs) {
    localStorage.setItem(STORAGE_KEYS.GIGS, JSON.stringify(gigs));
  },

  getBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  setBookings(bookings) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.GIGS, JSON.stringify(INITIAL_GIGS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, INITIAL_USERS[0].id);
  }
};
