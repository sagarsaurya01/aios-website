// Homepage motion layer — GSAP + ScrollTrigger, loaded from CDN.
// Fully optional: if the CDN fails to load, the page stays completely
// visible and functional with zero motion. Respects prefers-reduced-motion.
(function () {
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  // ---- Header: subtle shadow once the page has scrolled ----
  var header = document.querySelector('.site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -10',
      end: 99999,
      onUpdate: function (self) {
        header.classList.toggle('is-scrolled', self.scroll() > 10);
      }
    });
  }

  // ---- Hero entrance ----
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero .eyebrow', { opacity: 0, y: 16, duration: .6, clearProps: 'transform' })
    .from('.hero h1', { opacity: 0, y: 28, duration: .8, clearProps: 'transform' }, '-=.42')
    .from('.hero .intro', { opacity: 0, y: 20, duration: .6, clearProps: 'transform' }, '-=.5')
    .from('.hero .actions .button', { opacity: 0, y: 16, duration: .5, stagger: .12, clearProps: 'transform' }, '-=.35')
    .from('.hero .meta', { opacity: 0, duration: .5 }, '-=.25')
    .from('.hero-blob', { opacity: 0, scale: .6, duration: 1.2, stagger: .15, ease: 'power2.out', clearProps: 'transform' }, '-=.9');

  // ---- Hero blob parallax (mouse-follow) ----
  var heroEl = document.querySelector('.hero');
  var blobs = gsap.utils.toArray('[data-parallax]');
  if (heroEl && blobs.length && window.matchMedia('(pointer: fine)').matches) {
    heroEl.addEventListener('mousemove', function (e) {
      var rect = heroEl.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      blobs.forEach(function (b) {
        var strength = parseFloat(b.getAttribute('data-parallax')) || 15;
        gsap.to(b, { x: relX * strength, y: relY * strength, duration: 1, ease: 'power2.out', overwrite: 'auto' });
      });
    });
    heroEl.addEventListener('mouseleave', function () {
      blobs.forEach(function (b) {
        gsap.to(b, { x: 0, y: 0, duration: 1.1, ease: 'power3.out', overwrite: 'auto' });
      });
    });
  }

  // ---- Generic scroll reveal ----
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: .8,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
    });
  });

  // ---- Grouped / staggered scroll reveal ----
  gsap.utils.toArray('[data-reveal-group]').forEach(function (group) {
    var children = gsap.utils.toArray(group.children);
    if (!children.length) return;
    gsap.from(children, {
      opacity: 0,
      y: 28,
      duration: .7,
      ease: 'power3.out',
      stagger: .12,
      clearProps: 'transform',
      scrollTrigger: { trigger: group, start: 'top 87%', toggleActions: 'play none none none' }
    });
  });

  // ---- Pinned hero dissolve: the hero locks in place and dissolves as you
  // scroll, revealing the "we start with your money" panel underneath. This
  // is the scrub-linked, "whole section transforms as you scroll" moment —
  // distinct from the trigger-once reveals above. Desktop/tablet only: a
  // pinned scroll effect on a short mobile viewport feels stuck, not alive.
  var promiseEl = document.querySelector('.promise');
  if (promiseEl && window.matchMedia('(min-width: 861px)').matches) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=70%',
        scrub: .4,
        pin: true,
        pinSpacing: true
      }
    })
      .to('.hero-copy', { opacity: 0, y: -60, scale: .94, ease: 'none' }, 0)
      .to('.hero-blob-a, .hero-blob-b', { opacity: 0, scale: 1.35, ease: 'none' }, 0);
  }

  // ---- Count-up numbers ----
  gsap.utils.toArray('[data-counter-to]').forEach(function (el) {
    var to = parseInt(el.getAttribute('data-counter-to'), 10);
    var suffix = el.getAttribute('data-counter-suffix') || '';
    var obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: to,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(obj.val).toLocaleString('en-IN') + suffix;
          }
        });
      }
    });
  });
})();
