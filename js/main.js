document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else if (!header.classList.contains('scrolled') || document.querySelector('.page-hero')) {
      if (!document.querySelector('.page-hero')) {
        if (window.scrollY <= 50) header.classList.remove('scrolled');
      }
    }
  });

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      nav.classList.toggle('active');
      closeCallDropdown();
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  const callDropdown = document.getElementById('callDropdown');
  const callToggle = callDropdown?.querySelector('.call-dropdown-toggle');

  function closeCallDropdown() {
    if (!callDropdown) return;
    callDropdown.classList.remove('open');
    callToggle?.setAttribute('aria-expanded', 'false');
  }

  if (callToggle && callDropdown) {
    callToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = callDropdown.classList.toggle('open');
      callToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!callDropdown.contains(e.target)) closeCallDropdown();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCallDropdown();
    });
  }

  const fadeElements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(el => observer.observe(el));

  // Relocate floating ad containers to document.body to avoid stacking-context clipping
  function relocateAdWraps() {
    const wraps = document.querySelectorAll('.ad-float-wrap, .ad-float-wrap-left');
    wraps.forEach(wrap => {
      try {
        if (wrap.parentElement !== document.body) {
          document.body.appendChild(wrap);
          wrap.style.pointerEvents = 'auto';
        }
      } catch (err) {
        // ignore
      }
    });
  }

  relocateAdWraps();

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#name').value;
      const phone = contactForm.querySelector('#phone').value;
      const email = contactForm.querySelector('#email').value;
      const message = contactForm.querySelector('#message').value;
      const service = contactForm.querySelector('#service');

      let text = `Hello Kanya International,%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}`;
      if (service && service.value) {
        text += `%0AService: ${encodeURIComponent(service.options[service.selectedIndex].text)}`;
      }
      text += `%0A%0AMessage: ${encodeURIComponent(message)}`;

      window.open(`https://wa.me/919921177816?text=${text}`, '_blank');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Floating ad close buttons
  function initAdCloseButtons() {
    // Remove any ads flagged hidden in localStorage before binding events
    document.querySelectorAll('.ad-float').forEach(ad => {
      const id = ad.dataset.adId;
      if (id && localStorage.getItem('ad-hidden-' + id)) {
        if (ad && ad.parentNode) ad.parentNode.removeChild(ad);
      }
    });

    document.querySelectorAll('.ad-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const ad = btn.closest('.ad-float');
        if (!ad) return;
        const id = ad.dataset.adId;
        // animate then remove
        ad.classList.add('closing');
        if (id) {
          try { localStorage.setItem('ad-hidden-' + id, '1'); } catch (err) { /* ignore */ }
        }
        setTimeout(() => {
          if (ad && ad.parentNode) ad.parentNode.removeChild(ad);
        }, 380);
      });
    });
  }

  initAdCloseButtons();
  // re-run relocation in case DOM changes move nodes later
  setTimeout(relocateAdWraps, 500);
});
