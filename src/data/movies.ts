import { z } from 'zod';

/**
 * Plex-portable movie metadata schema.
 *
 * Field names (`title`, `sortTitle`, `originalTitle`, `year`, `contentRating`,
 * `duration`, `studio`, `tagline`, `summary`, `editionTitle`, `userRating`,
 * `guids`, `directors`, `genres`, `cast`) align 1:1 with Plex Media Server's
 * Metadata model and standard NFO / TMDb / IMDb agent identifiers so this
 * catalog can import from or export to Plex without reshaping.
 */
export const MediaFormatSchema = z.enum([
  '4K UHD',
  'Blu-ray',
  'DVD',
  'Digital',
]);

export type MediaFormat = z.infer<typeof MediaFormatSchema>;

export const MovieGuidSchema = z.object({
  id: z.string().regex(/^(imdb:\/\/tt\d+|tmdb:\/\/\d+|tvdb:\/\/\d+)$/),
});

export const MovieSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  sortTitle: z.string().min(1),
  originalTitle: z.string().optional(),
  year: z.number().int().min(1888).max(2100),
  contentRating: z.enum(['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR']),
  /** Runtime in minutes (Plex stores milliseconds as `duration * 60_000`) */
  duration: z.number().int().positive(),
  studio: z.string().min(1),
  tagline: z.string().optional(),
  summary: z.string().min(1),
  directors: z.array(z.string()).min(1),
  writers: z.array(z.string()).default([]),
  cast: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
      }),
    )
    .default([]),
  genres: z.array(z.string()).min(1),
  /** Plex `editionTitle` (e.g. "Final Cut", "Criterion Collection", "Extended Edition") */
  editionTitle: z.string().optional(),
  /** External agent GUIDs (`imdb://tt...`, `tmdb://...`) */
  guids: z.array(MovieGuidSchema).min(1),
  /** Physical/digital shelf format */
  mediaFormat: MediaFormatSchema,
  videoSpec: z.string().optional(),
  audioSpec: z.string().optional(),
  /** Plex 10-point user rating (1.0 - 10.0) */
  userRating: z.number().min(1).max(10).optional(),
  isFavorite: z.boolean().default(false),
  addedAt: z.string(),
  notes: z.string().optional(),
  posterAccent: z.string().default('from-zinc-800 to-zinc-950'),
});

export type Movie = z.infer<typeof MovieSchema>;

const rawMovies: Movie[] = [
  {
    slug: 'the-fellowship-of-the-ring',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    sortTitle: 'Lord of the Rings: The Fellowship of the Ring, The',
    year: 2001,
    contentRating: 'PG-13',
    duration: 228,
    studio: 'New Line Cinema',
    tagline: 'One Ring to Rule Them All.',
    summary:
      'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    directors: ['Peter Jackson'],
    writers: ['Fran Walsh', 'Philippa Boyens', 'Peter Jackson'],
    cast: [
      { name: 'Elijah Wood', role: 'Frodo Baggins' },
      { name: 'Ian McKellen', role: 'Gandalf' },
      { name: 'Viggo Mortensen', role: 'Aragorn' },
      { name: 'Sean Astin', role: 'Samwise Gamgee' },
    ],
    genres: ['Adventure', 'Fantasy', 'Drama'],
    editionTitle: 'Extended Edition',
    guids: [{ id: 'imdb://tt0120737' }, { id: 'tmdb://120' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC Dolby Vision / HDR10',
    audioSpec: 'Dolby Atmos TrueHD 7.1',
    userRating: 10.0,
    isFavorite: true,
    addedAt: '2026-01-15',
    notes: 'Middle-earth 4K UHD Steelbook set — remastered from the 4K scan with Dolby Atmos.',
    posterAccent: 'from-emerald-900 via-teal-950 to-zinc-950',
  },
  {
    slug: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    sortTitle: 'Blade Runner 2049',
    year: 2017,
    contentRating: 'R',
    duration: 164,
    studio: 'Warner Bros. Pictures',
    tagline: 'The key to the future is finally unearthed.',
    summary:
      'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what’s left of society into chaos.',
    directors: ['Denis Villeneuve'],
    writers: ['Hampton Fancher', 'Michael Green'],
    cast: [
      { name: 'Ryan Gosling', role: 'K' },
      { name: 'Harrison Ford', role: 'Rick Deckard' },
      { name: 'Ana de Armas', role: 'Joi' },
      { name: 'Sylvia Hoeks', role: 'Luv' },
    ],
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    editionTitle: 'Theatrical',
    guids: [{ id: 'imdb://tt1856101' }, { id: 'tmdb://335984' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC HDR10 (Native 4K DI)',
    audioSpec: 'Dolby Atmos TrueHD 7.1',
    userRating: 9.8,
    isFavorite: true,
    addedAt: '2026-01-20',
    notes: 'Reference-grade Roger Deakins cinematography and LFE bass track for testing the home theater.',
    posterAccent: 'from-amber-700 via-orange-950 to-zinc-950',
  },
  {
    slug: 'interstellar',
    title: 'Interstellar',
    sortTitle: 'Interstellar',
    year: 2014,
    contentRating: 'PG-13',
    duration: 169,
    studio: 'Paramount Pictures',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    summary:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    directors: ['Christopher Nolan'],
    writers: ['Jonathan Nolan', 'Christopher Nolan'],
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper' },
      { name: 'Anne Hathaway', role: 'Brand' },
      { name: 'Jessica Chastain', role: 'Murph' },
      { name: 'Michael Caine', role: 'Professor Brand' },
    ],
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    editionTitle: 'IMAX Ratio Switching',
    guids: [{ id: 'imdb://tt0816692' }, { id: 'tmdb://157336' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC HDR10 (1.78:1 / 2.39:1 IMAX)',
    audioSpec: 'DTS-HD Master Audio 5.1',
    userRating: 9.7,
    isFavorite: true,
    addedAt: '2026-02-02',
    notes: '65mm IMAX sequences expand to full 16:9 frame on the 4K UHD disc.',
    posterAccent: 'from-sky-900 via-indigo-950 to-zinc-950',
  },
  {
    slug: 'there-will-be-blood',
    title: 'There Will Be Blood',
    sortTitle: 'There Will Be Blood',
    year: 2007,
    contentRating: 'R',
    duration: 158,
    studio: 'Paramount Vantage',
    tagline: 'There Will Be Greed. There Will Be Vengeance.',
    summary:
      'Ruthless silver miner, turned oil prospector, Daniel Plainview, moves to oil-rich California. Using his son to project a trustworthy, family-man image, Plainview cons local landowners into selling him their valuable properties for a pittance.',
    directors: ['Paul Thomas Anderson'],
    writers: ['Paul Thomas Anderson'],
    cast: [
      { name: 'Daniel Day-Lewis', role: 'Daniel Plainview' },
      { name: 'Paul Dano', role: 'Paul Sunday / Eli Sunday' },
      { name: 'Ciarán Hinds', role: 'Fletcher Hamilton' },
    ],
    genres: ['Drama', 'History'],
    guids: [{ id: 'imdb://tt0469494' }, { id: 'tmdb://7345' }],
    mediaFormat: 'Blu-ray',
    videoSpec: '1080p AVC 2.35:1',
    audioSpec: 'Dolby TrueHD 5.1',
    userRating: 9.6,
    isFavorite: true,
    addedAt: '2026-02-14',
    notes: 'Still waiting on a 4K UHD Criterion release; the 1080p transfer holds up remarkably well.',
    posterAccent: 'from-stone-800 via-red-950 to-zinc-950',
  },
  {
    slug: 'parasite',
    title: 'Parasite',
    sortTitle: 'Parasite',
    originalTitle: '기생충',
    year: 2019,
    contentRating: 'R',
    duration: 132,
    studio: 'NEON',
    tagline: 'Act like you own the place.',
    summary:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    directors: ['Bong Joon-ho'],
    writers: ['Bong Joon-ho', 'Han Jin-won'],
    cast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', role: 'Choi Yeon-gyo' },
      { name: 'Choi Woo-shik', role: 'Kim Ki-woo' },
    ],
    genres: ['Thriller', 'Drama', 'Comedy'],
    editionTitle: 'Criterion Collection (+ B&W Edition)',
    guids: [{ id: 'imdb://tt6751668' }, { id: 'tmdb://496243' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC HDR10+',
    audioSpec: 'Dolby Atmos (Korean)',
    userRating: 9.6,
    isFavorite: true,
    addedAt: '2026-03-01',
    notes: 'Includes both the 4K UHD theatrical master and Bong Joon-ho’s Black-and-White edition.',
    posterAccent: 'from-teal-900 via-emerald-950 to-zinc-950',
  },
  {
    slug: 'dune-part-two',
    title: 'Dune: Part Two',
    sortTitle: 'Dune: Part Two',
    year: 2024,
    contentRating: 'PG-13',
    duration: 166,
    studio: 'Warner Bros. Pictures',
    tagline: 'Long live the fighters.',
    summary:
      'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    directors: ['Denis Villeneuve'],
    writers: ['Denis Villeneuve', 'Jon Spaihts'],
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides' },
      { name: 'Zendaya', role: 'Chani' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica' },
      { name: 'Javier Bardem', role: 'Stilgar' },
    ],
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    guids: [{ id: 'imdb://tt15239678' }, { id: 'tmdb://693134' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC Dolby Vision / HDR10',
    audioSpec: 'Dolby Atmos TrueHD 7.1',
    userRating: 9.5,
    isFavorite: true,
    addedAt: '2026-03-19',
    notes: 'Hans Zimmer’s score + sandworm riding sequence in uncompressed Dolby Atmos.',
    posterAccent: 'from-amber-600 via-yellow-950 to-zinc-950',
  },
  {
    slug: 'no-country-for-old-men',
    title: 'No Country for Old Men',
    sortTitle: 'No Country for Old Men',
    year: 2007,
    contentRating: 'R',
    duration: 122,
    studio: 'Miramax',
    tagline: 'There are no clean getaways.',
    summary:
      'Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.',
    directors: ['Joel Coen', 'Ethan Coen'],
    writers: ['Joel Coen', 'Ethan Coen'],
    cast: [
      { name: 'Tommy Lee Jones', role: 'Ed Tom Bell' },
      { name: 'Javier Bardem', role: 'Anton Chigurh' },
      { name: 'Josh Brolin', role: 'Llewelyn Moss' },
    ],
    genres: ['Crime', 'Thriller', 'Drama'],
    editionTitle: 'Criterion Collection 4K',
    guids: [{ id: 'imdb://tt0477348' }, { id: 'tmdb://6977' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC Dolby Vision (Roger Deakins Supervised)',
    audioSpec: 'DTS-HD Master Audio 5.1',
    userRating: 9.5,
    isFavorite: true,
    addedAt: '2026-04-04',
    notes: 'Criterion spine #1242 — new 4K digital master supervised by Roger Deakins.',
    posterAccent: 'from-orange-900 via-stone-900 to-zinc-950',
  },
  {
    slug: 'the-social-network',
    title: 'The Social Network',
    sortTitle: 'Social Network, The',
    year: 2010,
    contentRating: 'PG-13',
    duration: 120,
    studio: 'Columbia Pictures',
    tagline: 'You don’t get to 500 million friends without making a few enemies.',
    summary:
      'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea and by the co-founder who was later squeezed out of the business.',
    directors: ['David Fincher'],
    writers: ['Aaron Sorkin'],
    cast: [
      { name: 'Jesse Eisenberg', role: 'Mark Zuckerberg' },
      { name: 'Andrew Garfield', role: 'Eduardo Saverin' },
      { name: 'Justin Timberlake', role: 'Sean Parker' },
      { name: 'Rooney Mara', role: 'Erica Albright' },
    ],
    genres: ['Drama', 'Biography'],
    guids: [{ id: 'imdb://tt1285016' }, { id: 'tmdb://37799' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC Dolby Vision',
    audioSpec: 'Dolby Atmos',
    userRating: 9.4,
    isFavorite: true,
    addedAt: '2026-04-18',
    notes: 'Trent Reznor & Atticus Ross score in Dolby Atmos.',
    posterAccent: 'from-blue-900 via-slate-900 to-zinc-950',
  },
  {
    slug: 'heat',
    title: 'Heat',
    sortTitle: 'Heat',
    year: 1995,
    contentRating: 'R',
    duration: 170,
    studio: 'Warner Bros. Pictures',
    tagline: 'A Los Angeles crime saga.',
    summary:
      'A group of high-end professional thieves start to feel the heat from the LAPD when they unknowingly leave a verbal clue at their latest heist.',
    directors: ['Michael Mann'],
    writers: ['Michael Mann'],
    cast: [
      { name: 'Al Pacino', role: 'Lt. Vincent Hanna' },
      { name: 'Robert De Niro', role: 'Neil McCauley' },
      { name: 'Val Kilmer', role: 'Chris Shiherlis' },
    ],
    genres: ['Crime', 'Drama', 'Thriller'],
    editionTitle: 'Director’s Definitive Edition',
    guids: [{ id: 'imdb://tt0113277' }, { id: 'tmdb://949' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC HDR10',
    audioSpec: 'DTS-HD Master Audio 5.1',
    userRating: 9.3,
    isFavorite: false,
    addedAt: '2026-05-01',
    notes: 'Downtown LA street shootout acoustics remain unmatched.',
    posterAccent: 'from-cyan-900 via-slate-950 to-zinc-950',
  },
  {
    slug: 'arrival',
    title: 'Arrival',
    sortTitle: 'Arrival',
    year: 2016,
    contentRating: 'PG-13',
    duration: 116,
    studio: 'Paramount Pictures',
    tagline: 'Why are they here?',
    summary:
      'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    directors: ['Denis Villeneuve'],
    writers: ['Eric Heisserer'],
    cast: [
      { name: 'Amy Adams', role: 'Dr. Louise Banks' },
      { name: 'Jeremy Renner', role: 'Ian Donnelly' },
      { name: 'Forest Whitaker', role: 'Colonel Weber' },
    ],
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    guids: [{ id: 'imdb://tt2543164' }, { id: 'tmdb://329865' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC Dolby Vision',
    audioSpec: 'DTS-HD Master Audio 7.1',
    userRating: 9.3,
    isFavorite: true,
    addedAt: '2026-05-12',
    notes: 'Jóhann Jóhannsson + Max Richter score.',
    posterAccent: 'from-zinc-700 via-zinc-900 to-black',
  },
  {
    slug: 'spirited-away',
    title: 'Spirited Away',
    sortTitle: 'Spirited Away',
    originalTitle: '千と千尋の神隠し',
    year: 2001,
    contentRating: 'PG',
    duration: 125,
    studio: 'Studio Ghibli / GKIDS',
    tagline: 'Nothing that happens is ever forgotten, even if you can’t remember it.',
    summary:
      'During her family’s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    directors: ['Hayao Miyazaki'],
    writers: ['Hayao Miyazaki'],
    cast: [
      { name: 'Rumi Hiiragi', role: 'Chihiro Ogino / Sen' },
      { name: 'Miyu Irino', role: 'Haku' },
      { name: 'Mari Natsuki', role: 'Yubaba / Zeniba' },
    ],
    genres: ['Animation', 'Fantasy', 'Adventure'],
    editionTitle: 'GKIDS Limited Edition Steelbook',
    guids: [{ id: 'imdb://tt0245429' }, { id: 'tmdb://129' }],
    mediaFormat: 'Blu-ray',
    videoSpec: '1080p AVC 1.85:1',
    audioSpec: 'DTS-HD Master Audio 5.1 (Japanese & English)',
    userRating: 9.4,
    isFavorite: true,
    addedAt: '2026-06-03',
    notes: 'Includes original Japanese DTS-HD MA track with literal English subtitles.',
    posterAccent: 'from-rose-900 via-purple-950 to-zinc-950',
  },
  {
    slug: 'whiplash',
    title: 'Whiplash',
    sortTitle: 'Whiplash',
    year: 2014,
    contentRating: 'R',
    duration: 106,
    studio: 'Sony Pictures Classics',
    tagline: 'The road to greatness can take you to the edge.',
    summary:
      'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student’s potential.',
    directors: ['Damien Chazelle'],
    writers: ['Damien Chazelle'],
    cast: [
      { name: 'Miles Teller', role: 'Andrew Neiman' },
      { name: 'J.K. Simmons', role: 'Terence Fletcher' },
    ],
    genres: ['Drama', 'Music'],
    guids: [{ id: 'imdb://tt2582802' }, { id: 'tmdb://244786' }],
    mediaFormat: '4K UHD',
    videoSpec: '2160p HEVC HDR10',
    audioSpec: 'Dolby Atmos',
    userRating: 9.2,
    isFavorite: false,
    addedAt: '2026-06-21',
    notes: 'Caravan finale in Dolby Atmos.',
    posterAccent: 'from-amber-800 via-neutral-900 to-black',
  },
];

export const MOVIES: Movie[] = z.array(MovieSchema).parse(rawMovies);

export function getAllMovies(): Movie[] {
  return [...MOVIES].sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));
}

export function getMovieBySlug(slug: string): Movie | undefined {
  return MOVIES.find((m) => m.slug === slug);
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function getExternalId(movie: Movie, prefix: 'imdb' | 'tmdb'): string | undefined {
  const entry = movie.guids.find((g) => g.id.startsWith(`${prefix}://`));
  return entry?.id.replace(`${prefix}://`, '');
}

/**
 * Converts a Movie record into Plex's `Metadata` JSON representation for
 * direct portability with Plex scripts, Tautulli, or future D1 sync jobs.
 */
export function toPlexMetadata(movie: Movie) {
  return {
    type: 'movie',
    title: movie.title,
    TitleSort: movie.sortTitle,
    originalTitle: movie.originalTitle,
    year: movie.year,
    contentRating: movie.contentRating,
    duration: movie.duration * 60_000,
    studio: movie.studio,
    tagline: movie.tagline,
    summary: movie.summary,
    editionTitle: movie.editionTitle,
    userRating: movie.userRating,
    addedAt: Math.floor(new Date(`${movie.addedAt}T00:00:00Z`).getTime() / 1000),
    Guid: movie.guids,
    Director: movie.directors.map((tag) => ({ tag })),
    Writer: movie.writers.map((tag) => ({ tag })),
    Genre: movie.genres.map((tag) => ({ tag })),
    Role: movie.cast.map((c) => ({ tag: c.name, role: c.role })),
    Media: [
      {
        container: movie.mediaFormat,
        videoProfile: movie.videoSpec,
        audioProfile: movie.audioSpec,
      },
    ],
  };
}
