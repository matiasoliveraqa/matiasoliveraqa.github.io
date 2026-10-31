/**
 * Matías Olivera — Portfolio Main Controller
 * Handles animations, intersection observers, test runner, and wordmark parallax.
 */

import { initAurora } from './aurora.js';
import { initTestRunner } from './testRunner.js';

function initApp() {
  // 1. Initialize Monochrome Aurora Background
  initAurora();

  // 2. Initialize Virtual Browser Test Runner
  initTestRunner();

  // 3. Sticky Header Scroll State
  const nav = document.getElementById('nav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 4. Staggered Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const parent = entry.target.parentElement;
        const siblings = parent ? [...parent.querySelectorAll('.reveal')] : [];
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(index * 60, 300)}ms`;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 5. Stat Counter Count-Ups
  const counterElements = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => countObserver.observe(el));

  // 6. Giant Footer Wordmark Dynamic Shimmer on Scroll
  const wordmark = document.getElementById('wordmark');
  if (wordmark && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let lastScrollY = window.scrollY;
    let velocity = 0;

    const onWordmarkScroll = () => {
      const rect = wordmark.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (0.5 - progress) * 36;
        wordmark.style.transform = `translateY(${offset}px)`;

        const currentY = window.scrollY;
        velocity = Math.min(Math.abs(currentY - lastScrollY), 50);
        lastScrollY = currentY;

        const glow = Math.min(45, 15 + velocity * 0.6);
        wordmark.style.filter = `drop-shadow(0 0 ${glow}px rgba(255, 255, 255, ${0.25 + velocity * 0.01}))`;
      }
    };

    window.addEventListener('scroll', onWordmarkScroll, { passive: true });
  }

  // 7. Clipboard Copy for Direct Email
  const emailBox = document.getElementById('copy-email-box');
  const emailText = document.getElementById('email-text');
  const copyFeedback = document.getElementById('copy-feedback');

  if (emailBox && emailText && copyFeedback) {
    emailBox.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailText.textContent.trim());
        copyFeedback.style.display = 'inline';
        setTimeout(() => {
          copyFeedback.style.display = 'none';
        }, 2000);
      } catch (err) {
        console.warn('Clipboard write error:', err);
      }
    });
  }

  // 8. Interactive Experience Accordion
  const expItems = document.querySelectorAll('.exp-item');
  expItems.forEach((item) => {
    const trigger = item.querySelector('.exp-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  });

  // 9. Minimalist Full-Bleed Geometric Shutter Scroll Controller (Victor Anferov / Rockstar GTA VI Concept)
  const runnerTrack = document.getElementById('runner');
  const geometricShutter = document.getElementById('geometric-shutter');
  const bladeTop = document.getElementById('blade-top');
  const bladeBottom = document.getElementById('blade-bottom');
  const bladeLeft = document.getElementById('blade-left');
  const bladeRight = document.getElementById('blade-right');
  const shutterHeadline = document.getElementById('shutter-headline');
  const runnerBox = document.getElementById('runner-container');
  const replayBtn = document.getElementById('reopen-shutter-btn');

  if (runnerTrack && geometricShutter && bladeTop && bladeBottom && bladeLeft && bladeRight) {
    let ticking = false;

    const updateShutterProgress = () => {
      const rect = runnerTrack.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) {
        if (rect.top < window.innerHeight * 0.7) {
          bladeTop.style.transform = 'translate3d(0, -55%, 0) rotate(-2.5deg)';
          bladeBottom.style.transform = 'translate3d(0, 55%, 0) rotate(2.5deg)';
          bladeLeft.style.transform = 'translate3d(-55%, 0, 0) rotate(1.5deg)';
          bladeRight.style.transform = 'translate3d(55%, 0, 0) rotate(-1.5deg)';
          if (shutterHeadline) shutterHeadline.style.opacity = '0';
          geometricShutter.classList.add('is-unlocked');
        }
        ticking = false;
        return;
      }

      // Progress from 0 (when runner pins at top of viewport) to 1 (when track ends)
      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // 1. Center headline fades out and shrinks smoothly as aperture begins opening
      if (shutterHeadline) {
        const headT = Math.min(1, Math.max(0, (rawProgress - 0.04) / 0.24));
        shutterHeadline.style.opacity = `${(1 - headT).toFixed(3)}`;
        shutterHeadline.style.transform = `translate(-50%, -50%) scale(${(1 - headT * 0.06).toFixed(3)})`;
      }

      // 2. Aperture blades start opening at 5% scroll, completely cleared at 82%
      const startOpen = 0.05;
      const endOpen = 0.82;
      const t = Math.max(0, Math.min(1, (rawProgress - startOpen) / (endOpen - startOpen)));

      // Smooth cubic ease-in-out curve
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Part the 4 geometric blades outward in diamond aperture progression (55% clears viewport)
      const movePercent = eased * 55;
      bladeTop.style.transform = `translate3d(0, ${-movePercent}%, 0) rotate(${(-eased * 2.5).toFixed(2)}deg)`;
      bladeBottom.style.transform = `translate3d(0, ${movePercent}%, 0) rotate(${(eased * 2.5).toFixed(2)}deg)`;
      bladeLeft.style.transform = `translate3d(${-movePercent}%, 0, 0) rotate(${(eased * 1.5).toFixed(2)}deg)`;
      bladeRight.style.transform = `translate3d(${movePercent}%, 0, 0) rotate(${(-eased * 1.5).toFixed(2)}deg)`;

      // 3. Revealed test runner studio scaling and opacity
      if (runnerBox) {
        runnerBox.style.transform = `scale(${(0.92 + eased * 0.08).toFixed(3)})`;
        runnerBox.style.opacity = `${(0.25 + eased * 0.75).toFixed(3)}`;
      }

      // 4. Unlock pointer events when fully opened
      if (eased >= 0.86) {
        geometricShutter.classList.add('is-unlocked');
      } else {
        geometricShutter.classList.remove('is-unlocked');
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateShutterProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateShutterProgress();

    // Replay button click
    if (replayBtn) {
      let isReplaying = false;
      replayBtn.addEventListener('click', () => {
        if (isReplaying) return;
        isReplaying = true;
        geometricShutter.classList.remove('is-unlocked');
        geometricShutter.classList.add('is-replaying');
        replayBtn.style.opacity = '0.5';

        setTimeout(() => {
          geometricShutter.classList.remove('is-replaying');
          geometricShutter.classList.add('is-unlocked');
          bladeTop.style.transform = 'translate3d(0, -55%, 0) rotate(-2.5deg)';
          bladeBottom.style.transform = 'translate3d(0, 55%, 0) rotate(2.5deg)';
          bladeLeft.style.transform = 'translate3d(-55%, 0, 0) rotate(1.5deg)';
          bladeRight.style.transform = 'translate3d(55%, 0, 0) rotate(-1.5deg)';
          if (shutterHeadline) shutterHeadline.style.opacity = '0';
          replayBtn.style.opacity = '1';
          isReplaying = false;
        }, 1500);
      });
    }
  }

  // 10. Project Card Micro-Tabs Toggle (Overview vs Quick Run)
  const projCards = document.querySelectorAll('.proj');
  projCards.forEach((card) => {
    const tabButtons = card.querySelectorAll('.proj-tab-btn');
    const panes = card.querySelectorAll('.proj-tab-pane');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabButtons.forEach((b) => b.classList.toggle('active', b === btn));
        panes.forEach((pane) => {
          if (targetTab === 'overview') {
            pane.classList.toggle('active', pane.classList.contains('pane-overview'));
          } else if (targetTab === 'cli') {
            pane.classList.toggle('active', pane.classList.contains('pane-cli'));
          }
        });
      });
    });
  });

  // 11. Project CLI Copy Snippet Handlers
  const copyButtons = document.querySelectorAll('.cli-copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.getAttribute('data-copy');
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        btn.classList.add('copied');
        setTimeout(() => {
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.warn('Clipboard copy error:', err);
      }
    });
  });

  // 12. Project Card Interactive Mouse Spotlight & Border Beam
  projCards.forEach((card) => {
    let frameId = null;

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
        card.style.setProperty('--beam-opacity', '1');
      });
    });

    card.addEventListener('pointerleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      card.style.setProperty('--beam-opacity', '0');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
