/**
 * Configuration-driven metadata for Onam Events
 */

export const EVENT_CONFIG = {
  music: {
    id: 'music',
    title: 'MUSIC',
    subtitle: 'Swara & Layam Rhythm',
    scriptSub: "Feel the Rhythm & Beats",
    tagline: 'Classical melodies, Folk Nadan Pattu & Acoustic Rhythms',
    badge: 'Category 01',
    formats: ['solo', 'duo', 'group'],
    comingSoon: false,
    musicTypes: [
      'Vocal (Nadan Pattu / Folk)',
      'Classical Carnatic',
      'Light Music',
      'Instrumental (Chenda / Violin / Flute)',
      'Western Vocal',
      'Fusion Band',
      'Other'
    ],
    genres: ['Traditional Kerala', 'Carnatic', 'Semi-Classical', 'Western Pop/Rock', 'Indie Fusion', 'Folk/Pattu'],
    iconType: 'music'
  },

  dance: {
    id: 'dance',
    title: 'DANCE',
    subtitle: 'Nrutha Sandhya Grace',
    scriptSub: "Grace & Fluid Motion",
    tagline: 'Thiruvathira, Kathakali Mudras & Cinematic Steps',
    badge: 'Category 02',
    formats: ['solo', 'duo', 'group'],
    comingSoon: false,
    danceTypes: [
      'Thiruvathirakali',
      'Mohiniyattam / Kathakali Mudra',
      'Kerala Folk Dance',
      'Cinematic / Western',
      'Semi-Classical Fusion',
      'Contemporary'
    ],
    iconType: 'dance'
  },

  games: {
    id: 'games',
    title: 'GAMES',
    subtitle: 'Onakalikal Heritage',
    scriptSub: "Traditional Onam Fun",
    tagline: 'Vadam Vali Tug of War, Sundari Kk Pottu Thottal & Games',
    badge: 'Category 03',
    comingSoon: true,
    iconType: 'games'
  }
};

export const FORMAT_DESCRIPTIONS = {
  solo: {
    title: 'SOLO',
    label: 'Single Performer',
    description: 'Showcase your individual artistry and solo spotlight talent.'
  },
  duo: {
    title: 'DUO',
    label: 'Duet Pair (2 Members)',
    description: 'Synchronized duet performance between two artists.'
  },
  group: {
    title: 'GROUP',
    label: 'Team Performance (Up to 12)',
    description: 'Energetic team choreography and ensemble group acts.'
  }
};

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Chemical Engineering',
  'Management Studies (MBA)',
  'Humanities & Basic Sciences',
  'Other'
];

export const ACADEMIC_YEARS = [
  '1st Year / Sem 1-2',
  '2nd Year / Sem 3-4',
  '3rd Year / Sem 5-6',
  '4th Year / Sem 7-8',
  'Post Graduate (M.Tech/MBA/MCA)'
];
