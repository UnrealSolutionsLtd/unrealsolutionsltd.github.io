/**
 * Floating Discord Support Widget
 * Intercom-style pop-up that invites visitors to join the Discord and ask questions.
 *
 * Usage (anywhere before </body>):
 *   <script src="/assets/js/discord-widget.js" defer></script>
 *
 * Self-contained: injects its own styles and DOM, no dependencies.
 */

(function () {
  'use strict';

  // ---- Easy-to-edit content ----------------------------------------------
  const DISCORD_INVITE = 'https://discord.com/invite/pBDSCBcdgv';
  const TEASER_TEXT = '👋 Questions? Ask us on Discord!';
  const CARD_GREETING = '👋 Hi there!';
  const CARD_MESSAGE =
    'Got a question about our Unreal Engine plugins? Join our Discord — our team and community are happy to help.';
  const CARD_CTA = 'Join our Discord';
  const AUTO_TEASER_DELAY = 6000; // ms before the teaser bubble appears (first visit)
  const STORAGE_KEY = 'us_discord_widget_dismissed';
  // ------------------------------------------------------------------------

  // Avoid double-injection (e.g. script included twice).
  if (window.__usDiscordWidgetLoaded) return;
  window.__usDiscordWidgetLoaded = true;

  const DISCORD_MARK =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>';
  const CLOSE_MARK =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>';

  const STYLES = `
.us-discord-widget {
  --us-brand: #5865f2;
  --us-brand-hover: #4752c4;
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.us-discord-widget * { box-sizing: border-box; }

.us-fab {
  position: relative;
  width: 56px; height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--us-brand);
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(88,101,242,.45);
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
}
.us-fab:hover { background: var(--us-brand-hover); transform: translateY(-2px) scale(1.04); box-shadow: 0 10px 26px rgba(88,101,242,.55); }
.us-fab:active { transform: translateY(0) scale(.98); }
.us-fab:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
.us-fab svg { width: 28px; height: 28px; transition: opacity .15s ease, transform .15s ease; }
.us-fab .us-fab__close { position: absolute; opacity: 0; transform: rotate(-90deg) scale(.6); }
.us-discord-widget.is-open .us-fab .us-fab__discord { opacity: 0; transform: rotate(90deg) scale(.6); }
.us-discord-widget.is-open .us-fab .us-fab__close { opacity: 1; transform: rotate(0) scale(1); }

.us-teaser {
  position: relative;
  display: inline-flex; align-items: center; gap: 10px;
  max-width: 240px;
  padding: 11px 14px;
  border: 1px solid #374151;
  border-radius: 14px 14px 4px 14px;
  background: #1f2937;
  color: #f9fafb;
  font-size: 14px; line-height: 1.35; text-align: left;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,.45);
  opacity: 0; visibility: hidden;
  transform: translateY(10px) scale(.96); transform-origin: bottom right;
  transition: opacity .2s ease, transform .2s ease, visibility .2s, border-color .15s ease;
}
.us-teaser.is-visible { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
.us-teaser:hover { border-color: var(--us-brand); }
.us-teaser__text { flex: 1; }
.us-teaser__close {
  flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  font-size: 16px; line-height: 1; color: #9ca3af;
}
.us-teaser__close:hover { background: #374151; color: #fff; }

.us-card {
  width: 320px; max-width: calc(100vw - 40px);
  border-radius: 16px; overflow: hidden;
  background: #1f2937; border: 1px solid #374151;
  box-shadow: 0 16px 48px rgba(0,0,0,.5);
  opacity: 0; visibility: hidden;
  transform: translateY(10px) scale(.96); transform-origin: bottom right;
  transition: opacity .22s ease, transform .22s ease, visibility .22s;
}
.us-card.is-visible { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
.us-card__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; background: var(--us-brand); color: #fff;
}
.us-card__title { display: inline-flex; align-items: center; gap: 9px; font-weight: 600; font-size: 15px; }
.us-card__title svg { width: 20px; height: 20px; }
.us-card__close {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border: none; border-radius: 50%;
  background: transparent; color: #fff; cursor: pointer; opacity: .85;
  transition: background .15s ease, opacity .15s ease;
}
.us-card__close svg { width: 18px; height: 18px; }
.us-card__close:hover { background: rgba(255,255,255,.18); opacity: 1; }
.us-card__body { padding: 18px 16px 16px; }
.us-card__greeting { margin: 0 0 6px; font-weight: 600; font-size: 16px; color: #fff; }
.us-card__message { margin: 0; font-size: 14px; line-height: 1.55; color: #b9bbc6; }
.us-card__cta {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  margin: 0 16px 16px; padding: 11px 16px; border-radius: 10px;
  background: var(--us-brand); color: #fff !important; font-weight: 600; font-size: 14px;
  text-decoration: none; transition: background .15s ease;
}
.us-card__cta:hover { background: var(--us-brand-hover); }
.us-card__cta svg { width: 20px; height: 20px; }

@media (prefers-reduced-motion: reduce) {
  .us-fab, .us-fab svg, .us-teaser, .us-card { transition: none; }
}
@media print { .us-discord-widget { display: none; } }
`;

  function storageGet() {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  }
  function markDismissed() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* storage blocked — fine */ }
  }

  function init() {
    if (document.querySelector('.us-discord-widget')) return;

    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.className = 'us-discord-widget';
    root.setAttribute('aria-live', 'polite');
    root.innerHTML = `
      <div class="us-card" role="dialog" aria-label="Join our Discord community">
        <div class="us-card__header">
          <span class="us-card__title">${DISCORD_MARK}<span>Chat with us</span></span>
          <button class="us-card__close" type="button" aria-label="Close">${CLOSE_MARK}</button>
        </div>
        <div class="us-card__body">
          <p class="us-card__greeting"></p>
          <p class="us-card__message"></p>
        </div>
        <a class="us-card__cta" href="${DISCORD_INVITE}" target="_blank" rel="noopener">${DISCORD_MARK}<span></span></a>
      </div>
      <button class="us-teaser" type="button">
        <span class="us-teaser__text"></span>
        <span class="us-teaser__close" role="button" aria-label="Dismiss">×</span>
      </button>
      <button class="us-fab" type="button" aria-expanded="false" aria-label="Open chat — join our Discord">
        <span class="us-fab__discord">${DISCORD_MARK}</span>
        <span class="us-fab__close">${CLOSE_MARK}</span>
      </button>
    `;
    document.body.appendChild(root);

    // Fill text via textContent to avoid any markup issues with emoji/strings.
    root.querySelector('.us-card__greeting').textContent = CARD_GREETING;
    root.querySelector('.us-card__message').textContent = CARD_MESSAGE;
    root.querySelector('.us-card__cta span').textContent = CARD_CTA;
    root.querySelector('.us-teaser__text').textContent = TEASER_TEXT;

    const card = root.querySelector('.us-card');
    const teaser = root.querySelector('.us-teaser');
    const fab = root.querySelector('.us-fab');
    let isOpen = false;

    function setOpen(open) {
      isOpen = open;
      root.classList.toggle('is-open', open);
      card.classList.toggle('is-visible', open);
      fab.setAttribute('aria-expanded', String(open));
      fab.setAttribute('aria-label', open ? 'Close chat' : 'Open chat — join our Discord');
      if (open) hideTeaser(false);
    }
    function hideTeaser(dismiss) {
      teaser.classList.remove('is-visible');
      if (dismiss) markDismissed();
    }

    fab.addEventListener('click', function () {
      setOpen(!isOpen);
      if (!isOpen) markDismissed();
    });
    root.querySelector('.us-card__close').addEventListener('click', function () {
      setOpen(false);
      markDismissed();
    });
    teaser.addEventListener('click', function () { setOpen(true); });
    root.querySelector('.us-teaser__close').addEventListener('click', function (e) {
      e.stopPropagation();
      hideTeaser(true);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (isOpen) { setOpen(false); markDismissed(); }
      else if (teaser.classList.contains('is-visible')) hideTeaser(true);
    });

    if (!storageGet()) {
      setTimeout(function () {
        if (!isOpen) teaser.classList.add('is-visible');
      }, AUTO_TEASER_DELAY);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
