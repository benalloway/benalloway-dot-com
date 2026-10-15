// @ts-check

/**
 * Plain-TS island for Spotlight header interactions:
 * 1. Light / Dark theme toggle (persisted in localStorage, synced with documentElement.classList)
 * 2. Mobile navigation <dialog> sheet (open, close, backdrop click)
 */

const openBtn = document.querySelector<HTMLButtonElement>('[data-mobile-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-mobile-menu-close]');
const dialog = document.querySelector<HTMLDialogElement>('#mobile-nav-dialog');
const panel = document.querySelector<HTMLElement>('[data-mobile-menu-panel]');

if (openBtn && dialog) {
  openBtn.addEventListener('click', () => {
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
  });

  dialog.addEventListener('close', () => {
    openBtn.setAttribute('aria-expanded', 'false');
  });

  dialog.addEventListener('click', (event) => {
    if (panel && !panel.contains(event.target as Node)) {
      dialog.close();
    }
  });
}

if (closeBtn && dialog) {
  closeBtn.addEventListener('click', () => {
    dialog.close();
  });
}

const themeBtn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    root.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage unavailable in private mode; ignore
    }
  });
}
