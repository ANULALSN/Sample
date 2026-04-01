/* AC1 Interaction & Motion Logic — Powered by Intersection Observer */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Logic ---
  const menuBtn = document.querySelector('nav button');
  const navLinks = document.querySelector('nav .hidden.lg\\:flex');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('hidden');
      navLinks.classList.toggle('flex');
      navLinks.classList.toggle('flex-col');
      navLinks.classList.toggle('absolute');
      navLinks.classList.toggle('top-[80px]');
      navLinks.classList.toggle('left-0');
      navLinks.classList.toggle('w-full');
      navLinks.classList.toggle('bg-white');
      navLinks.classList.toggle('p-6');
      navLinks.classList.toggle('shadow-xl');
    });
  }

  // --- Scroll Observer Engine ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Trigger Stat Counters once
        if (entry.target.classList.contains('stat-counter-wrap')) {
          entry.target.querySelectorAll('.stat-number').forEach(num => animateCounter(num));
        }

        // Trigger Scan Reveal
        if (entry.target.classList.contains('scan-container')) {
          startScanAnimation(entry.target);
        }

        // Trigger Stagger Reveal — cascade children
        if (entry.target.classList.contains('stagger-reveal')) {
          const items = entry.target.querySelectorAll('.stagger-item');
          items.forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.12}s`;
            // Small RAF to let the delay apply before triggering
            requestAnimationFrame(() => {
              item.classList.add('is-visible');
            });
          });
        }
      }
    });
  }, observerOptions);

  // Letter-by-Letter Reveal logic
  document.querySelectorAll('.letter-reveal').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'letter';
      span.style.transitionDelay = `${i * 0.04}s`;
      el.appendChild(span);
    });
  });

  document.querySelectorAll('.animate-on-scroll, .stagger-reveal, .stat-counter-wrap, .letter-reveal, .scan-container').forEach(el => {
    observer.observe(el);
  });

  // Stat Counter Animation
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * (target - start) + start);
      el.textContent = current + (el.getAttribute('data-suffix') || '');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // --- Background Capability Engine ---
  const capabilitiesSection = document.querySelector('#capabilities');
  const scrollerTrack = document.querySelector('.scroller-track');
  
  function updateActiveBackground() {
    if (!capabilitiesSection || !scrollerTrack) return;
    
    const cards = document.querySelectorAll('.capability-card-scroller');
    const viewportCenterX = window.innerWidth / 2;
    
    let closestCard = null;
    let minDistance = Infinity;
    
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(viewportCenterX - cardCenterX);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });
    
    if (closestCard) {
      const targetColor = closestCard.getAttribute('data-color');
      capabilitiesSection.style.background = `radial-gradient(ellipse at center, ${targetColor}22 0%, transparent 70%)`;
    }
    
    requestAnimationFrame(updateActiveBackground);
  }
  
  if (capabilitiesSection) {
    requestAnimationFrame(updateActiveBackground);
  }

  // --- Scroll-To-Hide Navigation ---
  let lastScrollTop = 0;
  const nav = document.querySelector('nav');
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > scrollThreshold) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScrollTop = st <= 0 ? 0 : st;
    
    // Workflow Connector height calculation
    const processTimeline = document.querySelector('.process-timeline');
    const timelineFill = document.getElementById('timeline-fill');
    const processSteps = document.querySelectorAll('.process-step');
    
    if (processTimeline && timelineFill && processSteps.length) {
      const timelineRect = processTimeline.getBoundingClientRect();
      const timelineTop = timelineRect.top;
      const timelineHeight = timelineRect.height;
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.6; // trigger when 60% from top
      
      if (timelineTop < triggerPoint) {
        // Progress from 0 to 1 as we scroll through the timeline
        const scrolledPast = triggerPoint - timelineTop;
        const progress = Math.min(Math.max(scrolledPast / timelineHeight, 0), 1);
        
        // Set the fill line height
        timelineFill.style.height = `${progress * 100}%`;
        
        // Activate each step based on progress
        processSteps.forEach((step, i) => {
          const stepThreshold = (i + 0.3) / processSteps.length;
          if (progress >= stepThreshold) {
            step.classList.add('step-active');
          } else {
            step.classList.remove('step-active');
          }
        });
      } else {
        timelineFill.style.height = '0%';
        processSteps.forEach(step => step.classList.remove('step-active'));
      }
    }
  }, { passive: true });

  // --- Mobile Pulse Observer (Capabilities) ---
  const capabilityObserverOptions = {
    root: null,
    threshold: 0.6, // Trigger when 60% of card is visible
    rootMargin: '0px'
  };

  const capabilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-active-mobile');
      } else {
        entry.target.classList.remove('card-active-mobile');
      }
    });
  }, capabilityObserverOptions);

  document.querySelectorAll('.capability-card-scroller').forEach(card => {
    capabilityObserver.observe(card);
  });

  // --- Hero Code Stream Generator ---
  const heroSection = document.querySelector('#hero');
  if (heroSection) {
    const streamWrap = document.createElement('div');
    streamWrap.className = 'code-stream-wrap';
    
    const codeSnippets = [
      'def integrate_neural_engine(data): return model.predict(data)',
      'const orchestrate = (agents) => agents.map(a => a.execute())',
      'class EnterpriseAI: def __init__(self): self.scale = "unlimited"',
      'import tensorflow as tf; model = tf.keras.models.load_model("ac-1")',
      'async function getSemanticResponse(query) { return await rag.query(query) }',
      'from langchain import MultiAgentExecutor; executor = MultiAgentExecutor()'
    ];

    for (let i = 0; i < 5; i++) {
      const line = document.createElement('div');
      line.className = 'code-line';
      line.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      line.style.animationDelay = `${i * -6}s`;
      line.style.top = `${i * 40}px`;
      line.style.position = 'absolute';
      streamWrap.appendChild(line);
    }
    heroSection.appendChild(streamWrap);
  }

  // --- Scan Reveal Logic ---
  function startScanAnimation(container) {
    if (!container.querySelector('.scan-line')) {
      const line = document.createElement('div');
      line.className = 'scan-line';
      container.appendChild(line);
    }
  }

  // ============================================================
  // ENERGY SURGES — High-Performance Blueprint Grid Particle System
  // Particles travel strictly along horizontal/vertical grid lines
  // using requestAnimationFrame with mobile idle-timeout protection
  // ============================================================
  (function initEnergySurges() {
    const canvas = document.getElementById('energy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const GRID_SIZE = 50;          // must match CSS logic-grid
    const PARTICLE_COUNT = 18;     // max simultaneous surges
    const SPEED_MIN = 1.2;
    const SPEED_MAX = 3.5;
    const COLORS = [
      'rgba(79, 70, 229, 0.7)',    // brand blue
      'rgba(0, 191, 234, 0.6)',    // cyan accent
      'rgba(147, 51, 234, 0.5)',   // purple
      'rgba(249, 115, 22, 0.5)',   // orange
    ];
    const TAIL_LENGTH = 60;        // px trail behind each surge

    let W, H, cols, rows;
    let particles = [];
    let rafId = null;
    let isVisible = true;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cols = Math.ceil(W / GRID_SIZE);
      rows = Math.ceil(H / GRID_SIZE);
    }

    function snapToGrid(val) {
      return Math.round(val / GRID_SIZE) * GRID_SIZE;
    }

    function randomColor() {
      return COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    function createParticle() {
      // Choose axis: 0 = horizontal, 1 = vertical
      const axis = Math.random() < 0.5 ? 0 : 1;
      const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      const color = randomColor();

      if (axis === 0) {
        // Horizontal — travel left→right or right→left
        const row = Math.floor(Math.random() * rows);
        const y = snapToGrid(row * GRID_SIZE);
        const dir = Math.random() < 0.5 ? 1 : -1;
        return {
          x: dir === 1 ? -TAIL_LENGTH : W + TAIL_LENGTH,
          y, axis, dir, speed, color,
          tail: []
        };
      } else {
        // Vertical — travel top→bottom or bottom→top
        const col = Math.floor(Math.random() * cols);
        const x = snapToGrid(col * GRID_SIZE);
        const dir = Math.random() < 0.5 ? 1 : -1;
        return {
          x,
          y: dir === 1 ? -TAIL_LENGTH : H + TAIL_LENGTH,
          axis, dir, speed, color,
          tail: []
        };
      }
    }

    function updateParticle(p) {
      p.tail.push({ x: p.x, y: p.y });
      if (p.tail.length > Math.ceil(TAIL_LENGTH / p.speed)) {
        p.tail.shift();
      }
      if (p.axis === 0) p.x += p.speed * p.dir;
      else              p.y += p.speed * p.dir;
    }

    function isOffScreen(p) {
      if (p.axis === 0) return p.dir === 1 ? p.x > W + TAIL_LENGTH : p.x < -TAIL_LENGTH;
      else              return p.dir === 1 ? p.y > H + TAIL_LENGTH : p.y < -TAIL_LENGTH;
    }

    function drawParticle(p) {
      if (p.tail.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(p.tail[0].x, p.tail[0].y);
      for (let i = 1; i < p.tail.length; i++) {
        ctx.lineTo(p.tail[i].x, p.tail[i].y);
      }
      ctx.lineTo(p.x, p.y);

      const grad = p.axis === 0
        ? ctx.createLinearGradient(p.tail[0].x, p.y, p.x, p.y)
        : ctx.createLinearGradient(p.x, p.tail[0].y, p.x, p.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, p.color);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glowing head
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 14;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function frame() {
      if (!isVisible) { rafId = null; return; }

      ctx.clearRect(0, 0, W, H);

      // Spawn new particles if under limit
      while (particles.length < PARTICLE_COUNT) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        updateParticle(particles[i]);
        if (isOffScreen(particles[i])) {
          particles.splice(i, 1);
        } else {
          drawParticle(particles[i]);
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    // Pause when tab is hidden (battery saver)
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible && !rafId) rafId = requestAnimationFrame(frame);
    });

    // Mobile: reduce particle count for battery
    const isMobile = window.innerWidth < 768;
    const ACTIVE_COUNT = isMobile ? 6 : PARTICLE_COUNT;

    window.addEventListener('resize', resize, { passive: true });
    resize();
    // Override with mobile-safe count
    Object.defineProperty({ PARTICLE_COUNT }, 'PARTICLE_COUNT', { value: ACTIVE_COUNT });
    rafId = requestAnimationFrame(frame);
  })();

});
