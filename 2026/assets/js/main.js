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
     3. A103 98-SEAT GRID BUILDER (4 Desk Blocks: 2-3-3-2 + 3 Vertical Aisles)
     ======================================================================== */
  const seatedRowsContainer = document.getElementById('seatedRowsContainer');
  const standingRowsContainer = document.getElementById('standingRowsContainer');

  const DESK_BLOCKS = [
    { cols: [1, 2], className: 'desk-block desk-block--2' },
    { cols: [3, 4, 5], className: 'desk-block desk-block--3' },
    { cols: [6, 7, 8], className: 'desk-block desk-block--3' },
    { cols: [9, 10], className: 'desk-block desk-block--2' }
  ];

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

      DESK_BLOCKS.forEach((block, bIdx) => {
        const deskEl = document.createElement('div');
        deskEl.className = block.className;

        block.cols.forEach((c) => {
          const isPa = r === 10 && c >= 9;
          const isSeated = r <= 4;

          const cell = document.createElement('div');
          if (isPa) {
            cell.className = 'seat-cell seat-cell--pa';
            cell.textContent = 'PA';
            cell.title = `${r}列目 右側：PA機材席（着席不可・当日変更の場合あり）`;
          } else if (isSeated) {
            cell.className = 'seat-cell seat-cell--seated';
            cell.textContent = '着席';
            cell.title = `${r}列目（予定）：【着席指定席】座ってご鑑賞ください`;
          } else {
            cell.className = 'seat-cell seat-cell--standing';
            cell.textContent = '立可';
            cell.title = `${r}列目（予定）：【立ち席可エリア】立っても座っても鑑賞可能です`;
          }
          deskEl.appendChild(cell);
        });

        rowEl.appendChild(deskEl);

        // Insert vertical aisle between the 4 desk blocks (3 aisles total)
        if (bIdx < DESK_BLOCKS.length - 1) {
          const aisleEl = document.createElement('div');
          aisleEl.className = 'seat-aisle-cell';
          aisleEl.textContent = '通路';
          aisleEl.title = '縦通路（立ち止まり禁止）';
          rowEl.appendChild(aisleEl);
        }
      });

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

  /* ========================================================================
     7. PAGINATED NEWS LOADER (_news/news-list.json, Max 5 per page, Expandable)
     ======================================================================== */
  const newsListContainer = document.getElementById('newsListContainer');
  const newsFirstBtn = document.getElementById('newsFirstBtn');
  const newsPrevBtn = document.getElementById('newsPrevBtn');
  const newsNextBtn = document.getElementById('newsNextBtn');
  const newsLastBtn = document.getElementById('newsLastBtn');
  const newsPageStatus = document.getElementById('newsPageStatus');

  const NEWS_PAGE_SIZE = 5;
  let newsFiles = [];
  let currentNewsPage = 1;
  const newsCache = new Map();

  function normalizeAssetUrl(rawUrl) {
    if (!rawUrl) return '';
    if (rawUrl.startsWith('/2026/') || rawUrl.startsWith('/2025/')) {
      return '.' + rawUrl;
    }
    return rawUrl;
  }

  function parseNewsHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const h3 = doc.querySelector('h3');
    const dateText = h3 ? h3.textContent.trim() : '';

    const paragraphs = Array.from(doc.querySelectorAll('p'));
    const headlineText = paragraphs.length > 0 ? paragraphs[0].textContent.trim() : 'お知らせ';

    const detailNodes = [];
    Array.from(doc.body.children).forEach((child, idx) => {
      if (child.tagName === 'H3') return;
      // Skip the first paragraph in the detail body only if it contains no links and there are other elements
      if (child.tagName === 'P' && child === paragraphs[0] && !child.querySelector('a') && doc.body.children.length > 2) {
        return;
      }

      if (child.tagName === 'IMG') {
        const src = normalizeAssetUrl(child.getAttribute('src') || '');
        const alt = child.getAttribute('alt') || headlineText;
        const wrap = document.createElement('div');
        wrap.className = 'news-item__media';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(src, alt);
        });
        wrap.appendChild(img);
        detailNodes.push(wrap);
      } else if (child.tagName === 'A' && child.querySelector('img')) {
        const innerImg = child.querySelector('img');
        const src = normalizeAssetUrl(innerImg.getAttribute('src') || '');
        const alt = innerImg.getAttribute('alt') || headlineText;
        const wrap = document.createElement('div');
        wrap.className = 'news-item__media';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(src, alt);
        });
        wrap.appendChild(img);
        detailNodes.push(wrap);
      } else if (child.tagName === 'P') {
        const p = document.createElement('p');
        p.innerHTML = child.innerHTML;
        p.querySelectorAll('a').forEach((a) => {
          const href = a.getAttribute('href') || '';
          a.setAttribute('href', normalizeAssetUrl(href));
        });
        detailNodes.push(p);
      }
    });

    if (detailNodes.length === 0 && paragraphs.length > 0) {
      const p = document.createElement('p');
      p.textContent = headlineText;
      detailNodes.push(p);
    }

    return { dateText, headlineText, detailNodes };
  }

  async function fetchNewsItem(filename) {
    if (newsCache.has(filename)) {
      return newsCache.get(filename);
    }
    const res = await fetch(`./_news/${filename}`);
    if (!res.ok) throw new Error(`Failed to load ${filename}`);
    const text = await res.text();
    newsCache.set(filename, text);
    return text;
  }

  async function renderNewsPage(page) {
    if (!newsListContainer || newsFiles.length === 0) return;

    const totalPages = Math.max(1, Math.ceil(newsFiles.length / NEWS_PAGE_SIZE));
    currentNewsPage = Math.min(Math.max(1, page), totalPages);

    const startIdx = (currentNewsPage - 1) * NEWS_PAGE_SIZE;
    const slice = newsFiles.slice(startIdx, startIdx + NEWS_PAGE_SIZE);

    if (newsFirstBtn) newsFirstBtn.disabled = currentNewsPage <= 1;
    if (newsPrevBtn) newsPrevBtn.disabled = currentNewsPage <= 1;
    if (newsNextBtn) newsNextBtn.disabled = currentNewsPage >= totalPages;
    if (newsLastBtn) newsLastBtn.disabled = currentNewsPage >= totalPages;
    if (newsPageStatus) newsPageStatus.textContent = `${currentNewsPage} / ${totalPages}`;

    try {
      const htmlList = await Promise.all(slice.map((file) => fetchNewsItem(file)));
      newsListContainer.innerHTML = '';

      htmlList.forEach((rawHtml, idx) => {
        const { dateText, headlineText, detailNodes } = parseNewsHtml(rawHtml);

        const itemEl = document.createElement('article');
        itemEl.className = 'news-item';
        if (currentNewsPage === 1 && idx === 0) {
          itemEl.classList.add('is-expanded');
        }

        const summaryBtn = document.createElement('button');
        summaryBtn.type = 'button';
        summaryBtn.className = 'news-item__summary';
        summaryBtn.setAttribute('aria-expanded', itemEl.classList.contains('is-expanded') ? 'true' : 'false');

        const dateSpan = document.createElement('span');
        dateSpan.className = 'news-item__date';
        dateSpan.textContent = dateText;

        const headlineSpan = document.createElement('span');
        headlineSpan.className = 'news-item__headline';
        headlineSpan.textContent = headlineText;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'news-item__toggle-icon';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>';

        summaryBtn.appendChild(dateSpan);
        summaryBtn.appendChild(headlineSpan);
        summaryBtn.appendChild(iconSpan);

        const detailDiv = document.createElement('div');
        detailDiv.className = 'news-item__detail';
        detailNodes.forEach((node) => detailDiv.appendChild(node));

        summaryBtn.addEventListener('click', () => {
          const expanded = itemEl.classList.toggle('is-expanded');
          summaryBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });

        itemEl.appendChild(summaryBtn);
        itemEl.appendChild(detailDiv);
        newsListContainer.appendChild(itemEl);
      });
    } catch (err) {
      // Fallback if opened via file:// protocol where fetch may be restricted
      console.warn('News fetch fallback:', err);
    }
  }

  async function initNewsLoader() {
    if (!newsListContainer) return;
    try {
      const res = await fetch('./_news/news-list.json');
      if (!res.ok) return;
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        newsFiles = list;
        await renderNewsPage(1);
      }
    } catch (err) {
      console.warn('Could not load news-list.json:', err);
    }

    if (newsFirstBtn) {
      newsFirstBtn.addEventListener('click', () => renderNewsPage(1));
    }
    if (newsPrevBtn) {
      newsPrevBtn.addEventListener('click', () => renderNewsPage(currentNewsPage - 1));
    }
    if (newsNextBtn) {
      newsNextBtn.addEventListener('click', () => renderNewsPage(currentNewsPage + 1));
    }
    if (newsLastBtn) {
      newsLastBtn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(newsFiles.length / NEWS_PAGE_SIZE));
        renderNewsPage(totalPages);
      });
    }
  }

  initNewsLoader();
})();
