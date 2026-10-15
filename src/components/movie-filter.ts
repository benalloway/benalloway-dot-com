// @ts-check

/**
 * Plain-TS island for `/movies` catalog filtering & sorting.
 * Zero framework overhead — instant client-side search, format chip filtering,
 * genre filtering, and sorting by Plex `sortTitle`, release `year`, or `userRating`.
 */

const searchInput = document.querySelector<HTMLInputElement>('[data-movie-search]');
const genreSelect = document.querySelector<HTMLSelectElement>('[data-movie-genre]');
const sortSelect = document.querySelector<HTMLSelectElement>('[data-movie-sort]');
const formatButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[data-format-chip]'),
);
const grid = document.querySelector<HTMLElement>('[data-movie-grid]');
const cards = Array.from(
  document.querySelectorAll<HTMLElement>('[data-movie-card]'),
);
const countEl = document.querySelector<HTMLElement>('[data-movie-count]');
const emptyEl = document.querySelector<HTMLElement>('[data-movie-empty]');
const resetBtn = document.querySelector<HTMLButtonElement>('[data-movie-reset]');

let activeFormat = 'ALL';

function applyFilters() {
  if (!grid) return;

  const query = (searchInput?.value ?? '').trim().toLowerCase();
  const genre = genreSelect?.value ?? 'ALL';
  const sortBy = sortSelect?.value ?? 'sortTitle';

  const visible: HTMLElement[] = [];

  for (const card of cards) {
    const format = card.dataset.format ?? '';
    const genres = (card.dataset.genres ?? '').split('|');
    const searchBlob = (card.dataset.search ?? '').toLowerCase();

    const matchesFormat = activeFormat === 'ALL' || format === activeFormat;
    const matchesGenre = genre === 'ALL' || genres.includes(genre);
    const matchesQuery = !query || searchBlob.includes(query);

    const show = matchesFormat && matchesGenre && matchesQuery;
    card.hidden = !show;
    if (show) visible.push(card);
  }

  visible.sort((a, b) => {
    if (sortBy === 'year-desc') {
      return Number(b.dataset.year ?? 0) - Number(a.dataset.year ?? 0);
    }
    if (sortBy === 'rating-desc') {
      return Number(b.dataset.rating ?? 0) - Number(a.dataset.rating ?? 0);
    }
    return (a.dataset.sortTitle ?? '').localeCompare(b.dataset.sortTitle ?? '');
  });

  for (const card of visible) {
    grid.appendChild(card);
  }

  if (countEl) {
    countEl.textContent = `${visible.length} ${visible.length === 1 ? 'film' : 'films'}`;
  }

  if (emptyEl) {
    emptyEl.hidden = visible.length > 0;
  }
}

for (const btn of formatButtons) {
  btn.addEventListener('click', () => {
    activeFormat = btn.dataset.formatChip ?? 'ALL';
    for (const other of formatButtons) {
      const selected = other === btn;
      other.setAttribute('aria-pressed', selected ? 'true' : 'false');
    }
    applyFilters();
  });
}

searchInput?.addEventListener('input', applyFilters);
genreSelect?.addEventListener('change', applyFilters);
sortSelect?.addEventListener('change', applyFilters);

resetBtn?.addEventListener('click', () => {
  activeFormat = 'ALL';
  if (searchInput) searchInput.value = '';
  if (genreSelect) genreSelect.value = 'ALL';
  if (sortSelect) sortSelect.value = 'sortTitle';
  for (const btn of formatButtons) {
    btn.setAttribute(
      'aria-pressed',
      btn.dataset.formatChip === 'ALL' ? 'true' : 'false',
    );
  }
  applyFilters();
});
