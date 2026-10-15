// @ts-check
import { getAllMovies, toPlexMetadata } from '../../data/movies';

/**
 * Portable Plex MediaContainer JSON export endpoint (`GET /api/movies.json`).
 * Allows direct consumption by Plex scripts, Tautulli, or future D1 importers.
 */
export const GET = async () => {
  const movies = getAllMovies();
  return Response.json({
    MediaContainer: {
      size: movies.length,
      identifier: 'com.benalloway.movies',
      title1: 'Movies We Own',
      Metadata: movies.map(toPlexMetadata),
    },
  });
};
