/**
 * SHONAN VOCANAMI 2026 at SHORYO FESTIVAL - OFFICIAL SPECIAL SITE SCRIPT
 * Features:
 *  1. CLI Stage System Bootloader Screen (with Skip & Replay)
 *  2. Hero Poster / Key Visual Switcher
 *  3. Interactive A103 98-Seat Matrix & Masking Tape Color Simulator
 *  4. Rules & Guidelines Category Filter
 *  5. High-Resolution Poster Lightbox Modal
 *  6. Hashtag Copy Helper & Scroll Reveal
 */

(function () {
  'use strict';

  /* ========================================================================
     1. CLI STAGE SYSTEM BOOTLOADER
     ======================================================================== */
  const cliLoader = document.getElementById('cliLoader');
  const cliLogs = document.getElementById('cliLogs');
  const cliBarFill = document.getElementById('cliBarFill');
  const cliPercent = document.getElementById('cliPercent');
  const cliSkipBtn = document.getElementById('cliSkipBtn');
  const cliReplayBtn = document.getElementById('cliReplayBtn');

  const BOOT_SEQUENCE = [
    { tag: 'INFO', text: 'BOOTING VOCANAMI-STAGE-OS v2026.10.31 (SHORYO-FESTIVAL BUILD)...', pct: 12 },
    { tag: 'OK',   text: 'VENUE LOCKED: SHONAN INSTITUTE OF TECHNOLOGY // BLDG-A [A103]', pct: 28 },
    { tag: 'OK',   text: 'SCHEDULE: 10/31(SAT) & 11/01(SUN) // 2 SHOWS/DAY [10:00~ / 14:30~]', pct: 45 },
    { tag: 'INFO', text: 'CONFIGURING FRONT 5-6 ROWS -> STAGE / SCREEN / PA / LIGHTING BUFFER', pct: 62 },
    { tag: 'OK',   text: 'SEAT MATRIX: 98 SEATS ACTIVE (ROW 1-4: SEATED 40 / ROW 5-10: STANDING OK 58 / PA: 2)', pct: 78 },
    { tag: 'WARN', text: 'GATE CONTROL: REAR-LEFT DOOR ONLY (FRONT CLASSROOM DOOR CLOSED)', pct: 90 },
    { tag: 'OK',   text: 'ALL SYSTEMS READY. LAUNCHING "SHONAN VOCANAMI 2026 at SHORYO FESTIVAL"!', pct: 100 }
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
    }, 680);
    bootTimers.push(hideId);
  }

  function startCliBoot() {
    if (!cliLoader || !cliLogs) return;
    clearBootTimers();

    cliLogs.innerHTML = '';
    if (cliBarFill) cliBarFill.style.width = '0%';
    if (cliPercent) cliPercent.textContent = '0%';

    cliLoader.classList.remove('is-hidden', 'is-opening');
    document.body.classList.add('is-locked');

    BOOT_SEQUENCE.forEach((step, idx) => {
      const tId = setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'cli-log-line';
        const tagClass =
          step.tag === 'OK' ? 'tag-ok' : step.tag === 'WARN' ? 'tag-warn' : 'tag-info';
        line.innerHTML = `<span class="${tagClass}">[${step.tag}]</span> ${step.text}`;
        cliLogs.appendChild(line);

        if (cliBarFill) cliBarFill.style.width = step.pct + '%';
        if (cliPercent) cliPercent.textContent = step.pct + '%';
      }, idx * 240);
      bootTimers.push(tId);
    });

    const doneId = setTimeout(finishCliBoot, BOOT_SEQUENCE.length * 240 + 380);
    bootTimers.push(doneId);
  }

  if (cliSkipBtn) {
    cliSkipBtn.addEventListener('click', finishCliBoot);
  }
  if (cliReplayBtn) {
    cliReplayBtn.addEventListener('click', startCliBoot);
  }

  // Run CLI boot on initial page load
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
     3. HERO POSTER / KEY VISUAL SWITCHER
     ======================================================================== */
  const heroMainImg = document.getElementById('heroMainImg');
  const heroFrame = document.getElementById('heroFrame');
  const heroBadge = document.getElementById('heroBadge');
  const visualTabs = document.querySelectorAll('.visual-tab');

  visualTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      visualTabs.forEach((b) => b.classList.remove('is-active'));
      tab.classList.add('is-active');

      const src = tab.getAttribute('data-img-src');
      const label = tab.getAttribute('data-img-label');
      const badge = tab.getAttribute('data-img-badge');

      if (heroMainImg && src) {
        heroMainImg.src = src;
        heroMainImg.alt = label || '湘南ボカ波2026 キービジュアル';
      }
      if (heroFrame && src) {
        heroFrame.setAttribute('data-lightbox-src', src);
        heroFrame.setAttribute('data-lightbox-title', label || '');
      }
      if (heroBadge && badge) {
        heroBadge.textContent = badge;
      }
    });
  });

  /* ========================================================================
     4. INTERACTIVE A103 SEAT MAP & MASKING TAPE COLOR SIMULATOR
     ======================================================================== */
  const seatedRowsContainer = document.getElementById('seatedRowsContainer');
  const standingRowsContainer = document.getElementById('standingRowsContainer');
  const seatStatusReadout = document.getElementById('seatStatusReadout');

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
          cell.title = `${r}列目 右側（${c}番）：PA・運営機材席（使用不可）`;
        } else if (isSeated) {
          cell.className = 'seat-cell seat-cell--seated';
          cell.textContent = '着席';
          cell.title = `${r}列目 ${c}番：【着席指定席】必ず座ってご鑑賞ください`;
        } else {
          cell.className = 'seat-cell seat-cell--standing';
          cell.textContent = '立OK';
          cell.title = `${r}列目 ${c}番：【立ち席可エリア】立っても座っても鑑賞OK！`;
        }

        cell.addEventListener('mouseenter', () => {
          if (seatStatusReadout) {
            seatStatusReadout.textContent = cell.title;
          }
        });

        cell.addEventListener('click', () => {
          if (seatStatusReadout) {
            seatStatusReadout.textContent = cell.title;
          }
        });

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

  // Masking Tape Color Switcher
  const a103Diagram = document.getElementById('a103Diagram');
  const tapeBtns = document.querySelectorAll('.tape-btn');
  const tapeAdviceText = document.getElementById('tapeAdviceText');

  const TAPE_ADVICE = {
    'blue-purple': '【青×紫（ポスターカラー統一）】メインビジュアルのミクシアン＆2026パープルと統一感抜群！※ただし暗転時は青と紫がやや近く見えるため、明るい水色テープ＋ラベンダー紫テープを選ぶのがコツです。',
    'blue-yellow': '【水色(青)×黄色（暗所での視認性No.1・推奨！）】暗いライブ教室内でもプロジェクターの反射光だけで一目で区別できる補色ペア！ミク（水色）×リンレン（黄色）のボカロカラーにも合致します。',
    'blue-green': '【青×緑（サインボード標準）】JIS安全標識に近い落ち着いた組み合わせ。明るい照明下では見やすいですが、暗転時は黄色テープの方がよりくっきり浮かび上がります。'
  };

  tapeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tapeBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const theme = btn.getAttribute('data-tape');
      if (a103Diagram && theme) {
        a103Diagram.setAttribute('data-tape-theme', theme);
      }
      if (tapeAdviceText && theme && TAPE_ADVICE[theme]) {
        tapeAdviceText.textContent = TAPE_ADVICE[theme];
      }
    });
  });

  /* ========================================================================
     5. RULES & GUIDELINES FILTER
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
     6. HASHTAG ONE-CLICK COPY
     ======================================================================== */
  const copyHashtagsBtn = document.getElementById('copyHashtagsBtn');
  if (copyHashtagsBtn) {
    copyHashtagsBtn.addEventListener('click', () => {
      const text = '#湘南ボカ波 #湘南ボカ波2026 #松稜祭';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          const orig = copyHashtagsBtn.textContent;
          copyHashtagsBtn.textContent = '✓ ハッシュタグをコピーしました！';
          setTimeout(() => {
            copyHashtagsBtn.textContent = orig;
          }, 2200);
        });
      }
    });
  }

  /* ========================================================================
     7. LIGHTBOX MODAL FOR POSTERS & MAPS
     ======================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || '拡大画像';
    if (lightboxTitle) lightboxTitle.textContent = title || 'PREVIEW';
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

  /* ========================================================================
     8. SCROLL REVEAL OBSERVER
     ======================================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
