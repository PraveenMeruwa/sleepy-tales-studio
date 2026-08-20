/**
 * Sleepy Tales Studio — Story World: Roanoke (Beta 2.0)
 * Interactive Script & Atmospheric Web Audio Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initPerspectiveTabs();
  initNarrativeAccordion();
  initAtmosphericParticles();
  initAmbientAudioEngine();
});

/* ==========================================================================
   1. Perspective Viewpoint Tabs
   ========================================================================== */
function initPerspectiveTabs() {
  const tabs = document.querySelectorAll('.perspective-tab');
  const panels = document.querySelectorAll('.perspective-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPerspective = tab.getAttribute('data-perspective');

      // Update Tab state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update Panel visibility
      panels.forEach(panel => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      const activePanel = document.getElementById(`panel-${targetPerspective}`);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.hidden = false;
      }
    });
  });
}

/* ==========================================================================
   2. Narrative Accordion (5 Acts)
   ========================================================================== */
function initNarrativeAccordion() {
  const actCards = document.querySelectorAll('.act-card');

  actCards.forEach(card => {
    const header = card.querySelector('.act-header');
    header.addEventListener('click', () => {
      const isCurrentlyActive = card.classList.contains('active');
      
      // Close all cards
      actCards.forEach(c => c.classList.remove('active'));

      // If clicked card was not active, open it
      if (!isCurrentlyActive) {
        card.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. Ambient Fog & Particles (First Glimpse Atmosphere)
   ========================================================================== */
function initAtmosphericParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particleCount = 28;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'mist-particle';
    p.style.position = 'absolute';
    p.style.width = Math.random() * 80 + 40 + 'px';
    p.style.height = Math.random() * 80 + 40 + 'px';
    p.style.borderRadius = '50%';
    p.style.background = 'radial-gradient(circle, rgba(107, 127, 140, 0.12) 0%, rgba(107, 127, 140, 0) 70%)';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animation = `drift ${Math.random() * 15 + 15}s infinite ease-in-out alternate`;
    p.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(p);
  }

  // Inject keyframe animation for mist particles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes drift {
      0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
      50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.2); opacity: 0.5; }
      100% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0.9); opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);
}

/* ==========================================================================
   4. Atmospheric Audio Engine (Web Audio API Synthesizer)
   Generates a restrained sonic environment of coastal wind, ocean drone,
   and gentle distant bell overtones in accordance with Studio Audio Language.
   ========================================================================== */
function initAmbientAudioEngine() {
  const toggleBtn = document.getElementById('ambience-toggle');
  const label = document.getElementById('ambience-label');
  let audioCtx = null;
  let isPlaying = false;
  let windGain = null;
  let oceanGain = null;
  let bellInterval = null;

  function createNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function startAmbience() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // 1. Ocean / Wind Noise Generator
    const noiseBuffer = createNoiseBuffer(audioCtx);
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to shape into low coastal breeze / waves
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, audioCtx.currentTime);

    // LFO to create slow wave swell
    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, audioCtx.currentTime); // 10s wave cycle
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(80, audioCtx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    oceanGain = audioCtx.createGain();
    oceanGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(oceanGain);
    oceanGain.connect(audioCtx.destination);
    noiseSource.start();

    // 2. Harmonic Drone (Deep meditative foundation in D)
    const droneOsc = audioCtx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(73.42, audioCtx.currentTime); // D2
    const droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    droneOsc.connect(droneGain);
    droneGain.connect(audioCtx.destination);
    droneOsc.start();

    // 3. Periodic Distant Harbor Bell Harmonic
    function strikeHarborBell() {
      if (!isPlaying || !audioCtx) return;
      const bellOsc = audioCtx.createOscillator();
      const bellGain = audioCtx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 harmonic

      bellGain.gain.setValueAtTime(0, audioCtx.currentTime);
      bellGain.gain.linearRampToValueAtTime(0.025, audioCtx.currentTime + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);

      bellOsc.connect(bellGain);
      bellGain.connect(audioCtx.destination);
      bellOsc.start();
      bellOsc.stop(audioCtx.currentTime + 3.6);
    }

    bellInterval = setInterval(strikeHarborBell, 12000);
    setTimeout(strikeHarborBell, 1500);

    toggleBtn.classList.add('playing');
    label.textContent = 'Soundscape: On';
    isPlaying = true;
  }

  function stopAmbience() {
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    if (bellInterval) {
      clearInterval(bellInterval);
      bellInterval = null;
    }
    toggleBtn.classList.remove('playing');
    label.textContent = 'Soundscape: Off';
    isPlaying = false;
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!isPlaying) {
        startAmbience();
      } else {
        stopAmbience();
      }
    });
  }
}
