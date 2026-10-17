/**
 * Matías Olivera — Portfolio Main Controller
 * Handles animations, intersection observers, test runner, and wordmark parallax.
 */

import { initAurora } from './aurora.js';
import { initTestRunner } from './testRunner.js';

document.addEventListener('DOMContentLoaded', () => {
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

  // 6. Giant Footer Wordmark Parallax
  const wordmark = document.getElementById('wordmark');
  if (wordmark && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const rect = wordmark.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const offset = (0.5 - progress) * 40;
          wordmark.style.transform = `translateY(${offset}px)`;
        }
      },
      { passive: true }
    );
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

  // 8. Message Composer Form Submission
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

  // 9. Interactive Experience Accordion
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
});
