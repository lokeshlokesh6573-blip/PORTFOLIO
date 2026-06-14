/* ====================================================
   LOKESH KONDRUGONTI – PORTFOLIO JAVASCRIPT
   ==================================================== */

'use strict';

// ──────────────────────────────────────────────────
// 1.  DOM HELPERS
// ──────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ──────────────────────────────────────────────────
// 2.  NAVIGATION
// ──────────────────────────────────────────────────
(function initNavigation() {
  const navbar   = $('#navbar');
  const toggle   = $('#nav-toggle');
  const navLinks = $('#nav-links');
  const links    = $$('.nav-link');

  // Sticky + glass effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
    toggleBackToTop();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    }
  });

  // Active link on scroll
  function updateActiveLink() {
    const sections = $$('section[id]');
    const scrollY  = window.scrollY + 100;

    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const link   = $(`[data-section="${sec.id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }
})();

// ──────────────────────────────────────────────────
// 3.  TYPED TEXT EFFECT
// ──────────────────────────────────────────────────
(function initTypedEffect() {
  const el     = $('#typed-text');
  if (!el) return;

  const phrases = [
    'Data Science Student',
    'AI & ML Enthusiast',
    'Generative AI Explorer',
    'Web Developer',
    'Problem Solver',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIdx];

    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseTimer = setTimeout(type, 500);
        return;
      }
      pauseTimer = setTimeout(type, 45);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        pauseTimer = setTimeout(() => { deleting = true; type(); }, 2000);
        return;
      }
      pauseTimer = setTimeout(type, 85);
    }
  }

  setTimeout(type, 800);
})();

// ──────────────────────────────────────────────────
// 4.  SCROLL ANIMATIONS (Intersection Observer)
// ──────────────────────────────────────────────────
(function initScrollAnimations() {
  const items = $$('[data-animate]');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if parent has multiple
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => { el.classList.add('animated'); }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  items.forEach((item, i) => {
    item.dataset.delay = i * 80;
    observer.observe(item);
  });
})();

// ──────────────────────────────────────────────────
// 5.  SKILL BAR ANIMATION
// ──────────────────────────────────────────────────
(function initSkillBars() {
  const skillSection = $('#skills');
  if (!skillSection) return;

  let triggered = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      skillSection.querySelectorAll('.skill-level-bar').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.style.getPropertyValue('--level') || getComputedStyle(bar).getPropertyValue('--level');
          // Force reflow to trigger transition
          bar.style.width = '0';
          requestAnimationFrame(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = bar.closest('.skill-card').dataset.level || bar.style.getPropertyValue('--level');
          });
        }, i * 80);
      });

      // Apply via CSS class
      skillSection.classList.add('skills-animated');
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  observer.observe(skillSection);
})();

// ──────────────────────────────────────────────────
// 6.  COUNTER ANIMATIONS (Hero Stats)
// ──────────────────────────────────────────────────
(function initCounters() {
  // No numeric counters needed in current design – placeholder for future use
})();

// ──────────────────────────────────────────────────
// 7.  CONTACT FORM
// ──────────────────────────────────────────────────
(function initContactForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  const submitBtn = $('#contact-submit');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = $('#contact-name')?.value.trim();
    const email   = $('#contact-email')?.value.trim();
    const message = $('#contact-message')?.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shakeInvalid(form);
      return;
    }

    if (!isValidEmail(email)) {
      shakeInvalid($('#contact-email'));
      return;
    }

    // Simulate submit
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    await delay(1200);

    form.reset();
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Send Message`;
    submitBtn.disabled = false;
    success.classList.add('visible');

    setTimeout(() => success.classList.remove('visible'), 5000);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeInvalid(el) {
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();

// ──────────────────────────────────────────────────
// 8.  BACK TO TOP
// ──────────────────────────────────────────────────
function toggleBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

$('#back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ──────────────────────────────────────────────────
// 9.  FLOATING BADGE PARALLAX (Subtle)
// ──────────────────────────────────────────────────
(function initParallax() {
  const badges = $$('.floating-badge');
  if (!badges.length) return;

  let ticking = false;

  document.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      badges.forEach((badge, i) => {
        const factor = (i + 1) * 6;
        badge.style.transform = `translateY(${dy * factor}px) translateX(${dx * factor}px)`;
      });
      ticking = false;
    });
  });
})();

// ──────────────────────────────────────────────────
// 10. SKILL CARD HOVER – SHOW LEVEL BARS
// ──────────────────────────────────────────────────
(function initSkillCardHover() {
  const cards = $$('.skill-card');
  cards.forEach(card => {
    const bar = card.querySelector('.skill-level-bar');
    if (!bar) return;

    card.addEventListener('mouseenter', () => {
      const level = getComputedStyle(bar).getPropertyValue('--level').trim();
      bar.style.width = level;
    });

    card.addEventListener('mouseleave', () => {
      // Keep bars filled once skills section is animated
      const section = document.getElementById('skills');
      if (!section?.classList.contains('skills-animated')) {
        bar.style.width = '0';
      }
    });
  });
})();

// ──────────────────────────────────────────────────
// 11. ADD SHAKE KEYFRAME TO DOM
// ──────────────────────────────────────────────────
(function injectShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

// ──────────────────────────────────────────────────
// 12. SMOOTH REVEAL FOR HERO ON LOAD
// ──────────────────────────────────────────────────
(function initHeroReveal() {
  const heroContent = $('.hero-content');
  const heroImage   = $('.hero-image-wrapper');

  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(32px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  }

  if (heroImage) {
    heroImage.style.opacity = '0';
    heroImage.style.transform = 'translateX(32px)';
    setTimeout(() => {
      heroImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'translateX(0)';
    }, 400);
  }
})();

// ──────────────────────────────────────────────────
// 13. PROJECT CARD TILT EFFECT
// ──────────────────────────────────────────────────
(function initTiltEffect() {
  const cards = $$('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 4;
      const tiltY  = ((cx - x) / cx) * 4;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ──────────────────────────────────────────────────
// 14. SECTION VISIBILITY INDICATOR
// ──────────────────────────────────────────────────
(function initSectionObserver() {
  const sections = $$('section[id]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = $(`[data-section="${entry.target.id}"]`);
      if (link) {
        link.classList.toggle('active', entry.isIntersecting);
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));
})();

// ──────────────────────────────────────────────────
// 15. CONSOLE EASTER EGG
// ──────────────────────────────────────────────────
console.log(
  '%c👋 Hey there, curious developer!',
  'color: #6366f1; font-size: 18px; font-weight: bold;'
);
console.log(
  '%cThis portfolio was crafted with ❤️ by Lokesh Kondrugonti.\nLet\'s connect: lokeshlokesh6573@gmail.com',
  'color: #475569; font-size: 13px;'
);
