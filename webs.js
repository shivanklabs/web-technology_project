/* ══════════════════════════════════════
   NOURA — Premium Dry Fruits
   Main Script
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CUSTOM CURSOR ── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot snaps instantly
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Follower lags behind smoothly
  function animateFollower() {
    fx += (mx - fx) * 0.10;
    fy += (my - fy) * 0.10;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state on interactable elements
  const hoverTargets = document.querySelectorAll('a, button, .product-card, .filter-btn, .testi-dot');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });

  // Click burst
  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicked');
    setTimeout(() => cursor.classList.remove('clicked'), 300);
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });

  /* ── 2. PARTICLES ── */
  const particleContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 22;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size  = Math.random() * 120 + 40;
    const left  = Math.random() * 100;
    const top   = Math.random() * 100;
    const dur   = (Math.random() * 8 + 6).toFixed(2) + 's';
    const delay = (Math.random() * 10).toFixed(2) + 's';

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      top: ${top}%;
      --dur: ${dur};
      --delay: ${delay};
    `;
    particleContainer.appendChild(p);
  }

  /* ── 3. NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── 4. NAVBAR HAMBURGER (mobile) ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger && hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position  = 'absolute';
    navLinks.style.top       = '70px';
    navLinks.style.right     = '1.5rem';
    navLinks.style.background = '#fff';
    navLinks.style.padding   = '1rem 1.5rem';
    navLinks.style.borderRadius = '16px';
    navLinks.style.boxShadow = '0 8px 40px rgba(232,118,154,0.15)';
    navLinks.style.border    = '1px solid rgba(255,174,200,0.3)';
    navLinks.style.zIndex    = '999';
  });

  /* ── 5. SMOOTH SCROLL for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks.style.display === 'flex' && window.innerWidth < 768) {
          navLinks.style.display = 'none';
        }
      }
    });
  });

  /* ── 6. PRODUCT FILTER ── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'cardIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // inject cardIn keyframes dynamically
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `, styleSheet.cssRules.length);

  /* ── 7. ADD TO CART TOAST ── */
  const toast    = document.getElementById('toast');
  const cartBtns = document.querySelectorAll('.add-cart');

  cartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // ripple effect on button
      btn.textContent = '✓ Added';
      btn.style.background = 'var(--rose)';
      btn.style.color      = '#fff';
      btn.style.borderColor = 'var(--rose)';

      showToast();

      setTimeout(() => {
        btn.textContent = 'Add +';
        btn.style.background  = '';
        btn.style.color       = '';
        btn.style.borderColor = '';
      }, 1800);
    });
  });

  function showToast() {
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ── 8. STAT COUNTER ANIMATION ── */
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  function animateStats() {
    statNums.forEach(num => {
      const target = parseInt(num.dataset.target, 10);
      const duration = 1800;
      const start    = performance.now();

      function update(ts) {
        const elapsed  = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
        num.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else num.textContent = target.toLocaleString();
      }
      requestAnimationFrame(update);
    });
  }

  /* ── 9. SCROLL REVEAL (Intersection Observer) ── */
  // Tag elements for reveal
  const srTargets = [
    ...document.querySelectorAll('.product-card'),
    ...document.querySelectorAll('.perk'),
    ...document.querySelectorAll('.testi-card'),
    ...document.querySelectorAll('.section-header'),
    ...document.querySelectorAll('.about-content'),
    document.querySelector('.contact-form'),
  ].filter(Boolean);

  srTargets.forEach(el => el.classList.add('sr'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  srTargets.forEach(el => revealObserver.observe(el));

  // Stats observer
  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsStrip);
  }

  /* ── 10. TESTIMONIAL CAROUSEL ── */
  const track      = document.getElementById('testiTrack');
  const dotsWrap   = document.getElementById('testiDots');
  const cards      = document.querySelectorAll('.testi-card');

  if (!track || !cards.length) return;

  const visibleCount = () => window.innerWidth < 768 ? 1 : 3;
  let current   = 0;
  let autoTimer = null;
  const total   = cards.length;

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.classList.add('testi-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function getDots()  { return document.querySelectorAll('.testi-dot'); }
  function cardWidth() {
    if (!cards[0]) return 0;
    const rect = cards[0].getBoundingClientRect();
    return rect.width + 24; // gap=1.5rem ≈ 24px
  }

  function goTo(index) {
    const visible = visibleCount();
    const maxIdx  = Math.max(0, total - visible);
    current = Math.max(0, Math.min(index, maxIdx));

    track.style.transform = `translateX(-${current * cardWidth()}px)`;

    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() {
    const visible = visibleCount();
    const maxIdx  = Math.max(0, total - visible);
    goTo(current >= maxIdx ? 0 : current + 1);
  }

  function startAuto() { autoTimer = setInterval(next, 3800); }
  function stopAuto()  { clearInterval(autoTimer); }

  startAuto();

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : goTo(current - 1);
  });

  window.addEventListener('resize', () => goTo(current));

  /* ── 11. CONTACT FORM SUBMIT ── */
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.submit-btn');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#2D1A24';
    setTimeout(() => {
      btn.textContent = 'Send Message ✦';
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  /* ── 12. PARALLAX on hero bg text ── */
  const heroBgText = document.querySelector('.hero-bg-text');
  if (heroBgText) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.25}px))`;
      heroBgText.style.opacity   = Math.max(0, 1 - scrollY / 400);
    });
  }

  /* ── 13. CARD TILT on mouse move ── */
  productCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const xRel  = (e.clientX - rect.left) / rect.width  - 0.5;
      const yRel  = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-8px)
        rotateX(${(-yRel * 8).toFixed(2)}deg)
        rotateY(${(xRel  * 8).toFixed(2)}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  console.log('%cNoura 🌸 Loaded', 'color:#E8769A;font-size:14px;font-weight:600;');

}); // end DOMContentLoaded