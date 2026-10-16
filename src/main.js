/**
 * Matías Olivera — Portfolio Main Controller
 * Handles animations, intersection observers, tabs, terminal runner, and wordmark parallax.
 */

import { initAurora } from './aurora.js';
import { initTerminalSimulator } from './terminalSimulation.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Background Aurora
  initAurora();

  // 2. Initialize Interactive Terminal Runner
  initTerminalSimulator();

  // 3. Sticky Header Scroll State
  const nav = document.getElementById('nav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
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
        entry.target.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
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
        const duration = 1600;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          // Ease-out cubic
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

  // 6. QA Artifacts Tab Navigation
  const artifactBtns = document.querySelectorAll('.artifact-btn');
  const artifactContents = document.querySelectorAll('.artifact-content');

  artifactBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      artifactBtns.forEach((b) => b.classList.remove('active'));
      artifactContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `artifact-${btn.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 7. Giant Footer Wordmark Parallax
  const wordmark = document.getElementById('wordmark');
  if (wordmark && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const rect = wordmark.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const offset = (0.5 - progress) * 50;
          wordmark.style.transform = `translateY(${offset}px)`;
        }
      },
      { passive: true }
    );
  }

  // 8. Clipboard Copy for Direct Email
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
        }, 2200);
      } catch (err) {
        console.warn('Clipboard write error:', err);
      }
    });
  }

  // 9. Message Composer Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || '';
      const subject = document.getElementById('form-subject')?.value || 'Senior QA / SDET Opportunity';
      const message = document.getElementById('form-message')?.value || '';

      const bodyText = `Hi Matías,\n\nName: ${name}\n\n${message}`;
      const mailtoUrl = `mailto:matiluzardo3@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailtoUrl;
    });
  }
});
