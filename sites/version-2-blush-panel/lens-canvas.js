/* =============================================================================
   THE THREE LENSES — live particle canvases
   -----------------------------------------------------------------------------
   A direct port of the Lovable build's <LensCanvas> (React + canvas 2D) to plain
   JS for this site. The physics, constants and respawn rules are kept as they
   are there, because the behaviour IS the design:

     leakage        a container with a hole in its floor. Particles drift inside,
                    get drawn toward the hole, escape, accelerate away and fade.
     concentration  particles are pulled to a centre node and CONSUMED on arrival,
                    each drawn with a connecting line that fades with distance.
                    The node pulses on time plus how many it swallowed this frame,
                    so the hub visibly swells as it takes on more.
     gap            particles radiate outward, accelerating, and go GREY as they
                    fade — an enquiry going cold rather than simply leaving.

   Differences from the source, all deliberate:
     - no React: one IntersectionObserver gates the loop instead of `useInView`
     - hover state is read from the card element, not component state
     - a single shared rAF drives every canvas, rather than one loop per card
   ========================================================================== */
(function () {
  'use strict';

  var INK_ON_ACCENT = 'rgba(52,42,31,0.78)';   // particle colour once a card is hovered
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = matchMedia('(max-width: 760px)').matches;

  function rand(n) { return Math.random() * (n === undefined ? 1 : n); }

  function Lens(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = canvas.getAttribute('data-lens');
    this.hex = canvas.getAttribute('data-hex');
    this.card = canvas.closest('.leak-card');
    this.parts = [];
    this.t = 0;
    this.inView = false;
    this.w = 0; this.h = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.count = mobile ? 26 : 54;
    this.resize();
    for (var i = 0; i < this.count; i++) this.parts.push(this.spawn());
  }

  Lens.prototype.resize = function () {
    var r = this.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.w = r.width; this.h = r.height;
    this.canvas.width = Math.max(1, Math.floor(r.width * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(r.height * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  Lens.prototype.spawn = function () {
    var w = this.w, h = this.h, ang, rad;
    if (this.mode === 'leakage') {
      return { x: w * (0.22 + rand(0.56)), y: h * (0.18 + rand(0.34)),
               vx: (rand(1) - 0.5) * 0.25, vy: rand(0.2), a: 1,
               r: 1.6 + rand(2.2), seed: rand(6.28) };
    }
    if (this.mode === 'concentration') {
      ang = rand(6.28);
      rad = Math.max(w, h) * (0.35 + rand(0.35));
      return { x: w / 2 + Math.cos(ang) * rad, y: h / 2 + Math.sin(ang) * rad,
               vx: 0, vy: 0, a: 1, r: 1.6 + rand(2), seed: rand(6.28) };
    }
    ang = rand(6.28);
    return { x: w / 2 + Math.cos(ang) * rand(14), y: h / 2 + Math.sin(ang) * rand(14),
             vx: Math.cos(ang) * (0.5 + rand(0.9)), vy: Math.sin(ang) * (0.4 + rand(0.7)),
             a: 1, r: 1.6 + rand(2), seed: rand(6.28) };
  };

  Lens.prototype.draw = function () {
    var ctx = this.ctx, w = this.w, h = this.h, parts = this.parts;
    if (!w || !h) return;
    var hover = this.card && this.card.classList.contains('is-hover');
    var speed = hover ? 1.7 : 1;
    var color = hover ? INK_ON_ACCENT : this.hex;
    this.t += 0.016 * speed;
    ctx.clearRect(0, 0, w, h);
    var p, i;

    if (this.mode === 'leakage') {
      // the vessel: two walls and a floor broken by a hole in the middle
      ctx.strokeStyle = hover ? 'rgba(52,42,31,0.34)' : 'rgba(52,42,31,0.22)';
      ctx.lineWidth = 1;
      var bx = w * 0.2, by = h * 0.14, bw = w * 0.6, bh = h * 0.44;
      ctx.beginPath();
      ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw * 0.42, by + bh);
      ctx.moveTo(bx + bw * 0.58, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by);
      ctx.stroke();

      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        if (p.y < by + bh - 2) {                      // still inside the vessel
          p.x += Math.sin(this.t + p.seed) * 0.18 * speed;
          p.y += (0.25 + Math.abs(Math.sin(p.seed))) * 0.5 * speed;
          p.x += ((bx + bw * 0.5) - p.x) * 0.012 * speed;   // drawn toward the hole
        } else {                                      // escaped
          p.y += (1.1 + p.r * 0.25) * speed;
          p.x += Math.sin(this.t * 2 + p.seed) * 0.5;
          p.a -= 0.012 * speed;
        }
        if (p.a <= 0 || p.y > h + 10) parts[i] = p = this.spawn();
        ctx.globalAlpha = Math.max(0, p.a) * 0.9;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }

    } else if (this.mode === 'concentration') {
      var cx = w / 2, cy = h * 0.52, load = 0;
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        var dx = cx - p.x, dy = cy - p.y;
        var d = Math.hypot(dx, dy) || 1;
        var pull = (hover ? 0.035 : 0.02) * speed;
        p.vx += (dx / d) * pull; p.vy += (dy / d) * pull;
        p.vx *= 0.94; p.vy *= 0.94;                   // damping
        p.x += p.vx; p.y += p.vy;
        if (d < 16) { load++; parts[i] = p = this.spawn(); }
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.6;
        ctx.globalAlpha = Math.max(0, 0.25 - d / (w * 2.2));   // line fades with distance
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(cx, cy); ctx.stroke();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      // the hub swells with what it just swallowed
      var pulse = 12 + Math.sin(this.t * 3) * 3 + load * 0.6;
      ctx.globalAlpha = 0.18; ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(cx, cy, pulse * 2.2, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, pulse, 0, 6.2832); ctx.fill();

    } else {                                          // gap
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        p.vx *= 1.004; p.vy *= 1.004;                 // accelerating away
        p.x += p.vx * speed; p.y += p.vy * speed;
        p.a -= 0.0032 * speed;
        var off = p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10;
        if (p.a <= 0 || off) parts[i] = p = this.spawn();
        var cool = Math.max(0, Math.min(1, 1 - p.a));
        ctx.globalAlpha = Math.max(0, p.a) * 0.9;
        ctx.fillStyle = cool > 0.55 ? 'rgba(107,91,73,0.6)' : color;   // going cold
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  // ---- wire up -------------------------------------------------------------
  var nodes = [].slice.call(document.querySelectorAll('[data-lens]'));
  if (!nodes.length) return;
  var lenses = nodes.map(function (c) { return new Lens(c); });

  // hover drives both the card styling and the simulation, so it lives here
  lenses.forEach(function (L) {
    if (!L.card) return;
    L.card.addEventListener('pointerenter', function () { L.card.classList.add('is-hover'); });
    L.card.addEventListener('pointerleave', function () { L.card.classList.remove('is-hover'); });
    L.card.addEventListener('focusin',  function () { L.card.classList.add('is-hover'); });
    L.card.addEventListener('focusout', function () { L.card.classList.remove('is-hover'); });
  });

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) {
      entries.forEach(function (e) {
        var L = lenses[nodes.indexOf(e.target)];
        if (L) { L.resize(); if (reduce) L.draw(); }
      });
    });
    nodes.forEach(function (n) { ro.observe(n); });
  } else {
    addEventListener('resize', function () { lenses.forEach(function (L) { L.resize(); }); }, { passive: true });
  }

  if (reduce) {
    // one frame only: the shape of each idea still reads, nothing moves
    requestAnimationFrame(function () { lenses.forEach(function (L) { L.resize(); L.draw(); }); });
    return;
  }

  // Only simulate what is on screen. One shared loop for all three canvases
  // rather than one per card.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var L = lenses[nodes.indexOf(e.target)];
        if (L) L.inView = e.isIntersecting;
      });
      kick();
    }, { rootMargin: '10% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  } else {
    lenses.forEach(function (L) { L.inView = true; });
  }

  var running = false;
  function frame() {
    var any = false;
    for (var i = 0; i < lenses.length; i++) {
      if (lenses[i].inView) { lenses[i].draw(); any = true; }
    }
    if (any) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
  kick();
})();
