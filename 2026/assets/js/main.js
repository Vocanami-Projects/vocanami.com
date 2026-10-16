/**
 * SHONAN VOCANAMI 2026 - OFFICIAL SCRIPT
 * Features:
 *  1. CLI Bootloader Screen
 *  2. Mobile Navigation Toggle
 *  3. A103 98-Seat Grid Builder
 *  4. Rules Category Filter & Hashtag Copy
 *  5. Image Lightbox Modal
 */

(function () {
  'use strict';

  /* ========================================================================
     1. CLI BOOTLOADER
     ======================================================================== */
  const cliLoader = document.getElementById('cliLoader');
  const cliLogs = document.getElementById('cliLogs');
  const cliBarFill = document.getElementById('cliBarFill');
  const cliPercent = document.getElementById('cliPercent');
  const cliSkipBtn = document.getElementById('cliSkipBtn');

  const BOOT_SEQUENCE = [
    { tag: 'INFO', text: 'INITIALIZING SHONAN VOCANAMI 2026 SYSTEM...', pct: 18 },
    { tag: 'OK',   text: 'VENUE: SHONAN INSTITUTE OF TECHNOLOGY // BLDG-A [A103]', pct: 38 },
    { tag: 'OK',   text: 'SCHEDULE: 2026.10.31(SAT) - 11.01(SUN) [10:00~ / 14:30~]', pct: 60 },
    { tag: 'OK',   text: 'SEAT MAP: A103 FLOOR (FRONT SEATED / REAR STANDING OK)', pct: 82 },
    { tag: 'OK',   text: 'READY. OPENING PAGE...', pct: 100 }
  ];

  let bootTimers = [];

  function clearBootTimers() {
    bootTimers.forEach((id) => clearTimeout(id));
    bootTimers = [];
  }

  function finishCliBoot() {
    clearBootTimers();
    if (!cliLoader) return;
    if (cliBarFill) cliBarFill.style.width = '100%';
    if (cliPercent) cliPercent.textContent = '100%';
    cliLoader.classList.add('is-opening');
    document.body.classList.remove('is-locked');

    const hideId = setTimeout(() => {
      cliLoader.classList.add('is-hidden');
    }, 620);
    bootTimers.push(hideId);
  }

  function startCliBoot() {
    if (!cliLoader || !cliLogs) {
      document.body.classList.remove('is-locked');
      return;
    }
    clearBootTimers();
    cliLogs.innerHTML = '';
    if (cliBarFill) cliBarFill.style.width = '0%';
    if (cliPercent) cliPercent.textContent = '0%';

    BOOT_SEQUENCE.forEach((step, idx) => {
      const tId = setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'cli-log-line';
        const tagClass = step.tag === 'OK' ? 'tag-ok' : 'tag-info';
        line.innerHTML = `<span class="${tagClass}">[${step.tag}]</span> ${step.text}`;
        cliLogs.appendChild(line);

        if (cliBarFill) cliBarFill.style.width = step.pct + '%';
        if (cliPercent) cliPercent.textContent = step.pct + '%';
      }, idx * 210);
      bootTimers.push(tId);
    });

    const doneId = setTimeout(finishCliBoot, BOOT_SEQUENCE.length * 210 + 320);
    bootTimers.push(doneId);
  }

  if (cliSkipBtn) {
    cliSkipBtn.addEventListener('click', finishCliBoot);
  }

  startCliBoot();

  /* ========================================================================
     2. MOBILE NAVIGATION TOGGLE
     ======================================================================== */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ========================================================================
     3. A103 98-SEAT GRID BUILDER
     ======================================================================== */
  const seatedRowsContainer = document.getElementById('seatedRowsContainer');
  const standingRowsContainer = document.getElementById('standingRowsContainer');

  function buildSeatRows() {
    if (!seatedRowsContainer || !standingRowsContainer) return;

    seatedRowsContainer.innerHTML = '';
    standingRowsContainer.innerHTML = '';

    for (let r = 1; r <= 10; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'seat-row';

      const labelEl = document.createElement('div');
      labelEl.className = 'seat-row__label';
      labelEl.textContent = `${r}列`;
      rowEl.appendChild(labelEl);

      for (let c = 1; c <= 10; c++) {
        const isPa = r === 10 && c >= 9;
        const isSeated = r <= 4;

        const cell = document.createElement('div');
        if (isPa) {
          cell.className = 'seat-cell seat-cell--pa';
          cell.textContent = 'PA';
          cell.title = `${r}列目 右側：PA機材席（着席不可）`;
        } else if (isSeated) {
          cell.className = 'seat-cell seat-cell--seated';
          cell.textContent = '着席';
          cell.title = `${r}列目：【着席指定席】座ってご鑑賞ください`;
        } else {
          cell.className = 'seat-cell seat-cell--standing';
          cell.textContent = '立可';
          cell.title = `${r}列目：【立ち席可エリア】立っても座っても鑑賞可能です`;
        }

        rowEl.appendChild(cell);
      }

      if (r <= 4) {
        seatedRowsContainer.appendChild(rowEl);
      } else {
        standingRowsContainer.appendChild(rowEl);
      }
    }
  }

  buildSeatRows();

  /* ========================================================================
     4. RULES & GUIDELINES FILTER
     ======================================================================== */
  const filterBtns = document.querySelectorAll('.rule-filter-btn');
  const ruleCards = document.querySelectorAll('.rule-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const cat = btn.getAttribute('data-filter');
      ruleCards.forEach((card) => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* ========================================================================
     5. HASHTAG ONE-CLICK COPY
     ======================================================================== */
  const copyHashtagsBtn = document.getElementById('copyHashtagsBtn');
  if (copyHashtagsBtn) {
    copyHashtagsBtn.addEventListener('click', () => {
      const text = '#湘南ボカ波 #湘南ボカ波2026 #松稜祭';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          const orig = copyHashtagsBtn.textContent;
          copyHashtagsBtn.textContent = 'コピーしました';
          setTimeout(() => {
            copyHashtagsBtn.textContent = orig;
          }, 2000);
        });
      }
    });
  }

  /* ========================================================================
     6. LIGHTBOX MODAL FOR POSTERS & MAPS
     ======================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || '拡大画像';
    if (lightboxTitle) lightboxTitle.textContent = title || '画像プレビュー';
    lightbox.classList.add('is-open');
    document.body.classList.add('is-locked');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  }

  document.querySelectorAll('[data-lightbox-src]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-lightbox-src');
      const title = el.getAttribute('data-lightbox-title') || '';
      if (src) openLightbox(src, title);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('is-open')) {
        closeLightbox();
      } else if (cliLoader && !cliLoader.classList.contains('is-hidden')) {
        finishCliBoot();
      }
    }
  });
})();
