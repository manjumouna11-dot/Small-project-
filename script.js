// Flower Garden & GitHub Project Interactive Experience
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const bloomBtn = document.getElementById('bloomBtn');
  const plantGardenBtn = document.getElementById('plantGardenBtn');
  const flowerStage = document.getElementById('flowerStage');
  const waterSplash = document.getElementById('waterSplash');
  const flowerArt = document.querySelector('.flower-art');
  const flowerHead = document.querySelector('.flower-head');
  const flowerStem = document.querySelector('.flower-stem');
  const leaves = document.querySelectorAll('.flower-leaf-left, .flower-leaf-right');
  const copyBtn = document.getElementById('copyBtn');
  const themeBtn = document.getElementById('themeBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const bloomCountElem = document.getElementById('bloomCount');
  const colorDots = document.querySelectorAll('.color-dot-btn');

  // State
  let bloomCount = 1;
  let soundEnabled = true;
  let currentThemeIndex = 0;
  const themes = ['default', 'sakura', 'sunflower', 'lotus', 'emerald'];

  // -------------------------------------------------------------
  // Web Audio API Synthesizer (Zero External Dependencies Sound)
  // -------------------------------------------------------------
  const audioCtx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function playChime(frequencies = [523.25, 659.25, 783.99, 1046.50]) {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    frequencies.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + index * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + index * 0.08 + 0.7);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + index * 0.08);
      osc.stop(audioCtx.currentTime + index * 0.08 + 0.75);
    });
  }

  function playWaterDrop() {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.22);
  }

  // -------------------------------------------------------------
  // Flower Blooming & Watering Logic
  // -------------------------------------------------------------
  function triggerBloom() {
    // Increment bloom counter
    bloomCount++;
    if (bloomCountElem) {
      bloomCountElem.textContent = bloomCount;
    }

    // Play water drop & peaceful bloom chime
    playWaterDrop();
    setTimeout(() => {
      playChime([440, 554.37, 659.25, 880, 1108.73]);
    }, 200);

    // Trigger splash animation
    waterSplash.classList.remove('animate');
    void waterSplash.offsetWidth; // Force reflow
    waterSplash.classList.add('animate');

    // Reset and trigger flower SVG keyframe animations
    if (flowerStem) {
      flowerStem.style.animation = 'none';
      void flowerStem.offsetWidth;
      flowerStem.style.animation = 'growStem 1.4s ease-out forwards, swayStem 4s ease-in-out infinite 1.4s';
    }

    leaves.forEach(leaf => {
      leaf.style.animation = 'none';
      void leaf.offsetWidth;
      leaf.style.animation = 'sproutLeaf 1.4s ease-out forwards';
    });

    if (flowerHead) {
      flowerHead.style.animation = 'none';
      void flowerHead.offsetWidth;
      flowerHead.style.animation = 'bloomPop 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }

    // Spawn celebratory floating petals from the flower center
    spawnBurstPetals();
  }

  if (bloomBtn) {
    bloomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerBloom();
    });
  }

  if (flowerStage) {
    flowerStage.addEventListener('click', () => {
      triggerBloom();
    });
  }

  // -------------------------------------------------------------
  // Click-to-Sprout Mini Flowers anywhere on Stage / Garden
  // -------------------------------------------------------------
  const flowerIcons = ['🌸', '🌺', '🌼', '🌻', '🌷', '✨', '💐'];

  function spawnMiniFlower(x, y) {
    const mini = document.createElement('div');
    mini.className = 'mini-flower';
    mini.textContent = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
    mini.style.left = `${x - 14}px`;
    mini.style.top = `${y - 14}px`;
    flowerStage.appendChild(mini);

    playChime([600 + Math.random() * 400]);

    setTimeout(() => {
      mini.remove();
    }, 2000);
  }

  if (plantGardenBtn) {
    plantGardenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const rect = flowerStage.getBoundingClientRect();
          const randomX = Math.random() * (rect.width - 40) + 20;
          const randomY = Math.random() * (rect.height - 40) + 20;
          spawnMiniFlower(randomX, randomY);
        }, i * 120);
      }
      triggerBloom();
    });
  }

  // -------------------------------------------------------------
  // Petal Color Palette Switcher
  // -------------------------------------------------------------
  colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const selectedTheme = dot.getAttribute('data-color');
      document.body.setAttribute('data-theme', selectedTheme);
      playChime([523.25, 659.25]);
    });
  });

  // -------------------------------------------------------------
  // Theme Switcher Button
  // -------------------------------------------------------------
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const theme = themes[currentThemeIndex];
      if (theme === 'default') {
        document.body.removeAttribute('data-theme');
      } else {
        document.body.setAttribute('data-theme', theme);
      }
      // Update color dot active status
      colorDots.forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-color') === theme);
      });
      playChime([440, 660]);
    });
  }

  // -------------------------------------------------------------
  // Sound Mute / Unmute Toggle
  // -------------------------------------------------------------
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
      soundToggleBtn.setAttribute('title', soundEnabled ? 'Sound is On' : 'Sound is Muted');
      if (soundEnabled) {
        playChime([523.25]);
      }
    });
  }

  // -------------------------------------------------------------
  // Quick Copy Repository Link
  // -------------------------------------------------------------
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeText = document.querySelector('.clone-code code').textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.backgroundColor = '#238636';
        copyBtn.style.borderColor = '#2ea043';
        playChime([659.25, 880]);

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.backgroundColor = '';
          copyBtn.style.borderColor = '';
        }, 2000);
      });
    });
  }

  // -------------------------------------------------------------
  // Background Falling Petal Particle Simulation (HTML5 Canvas)
  // -------------------------------------------------------------
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 8 + 6;
        this.speedX = Math.random() * 1.5 - 0.5;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.angle = Math.random() * 360;
        this.angularSpeed = (Math.random() - 0.5) * 2;
        this.color = Math.random() > 0.5 ? 'rgba(255, 107, 139, 0.4)' : 'rgba(255, 182, 193, 0.5)';
        this.pulse = Math.random() * Math.PI;
      }

      update() {
        this.x += this.speedX + Math.sin(this.pulse) * 0.5;
        this.y += this.speedY;
        this.pulse += 0.02;
        this.angle += this.angularSpeed;

        if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
          this.reset();
          this.y = -10;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const petals = Array.from({ length: 25 }, () => new Petal());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(petal => {
        petal.update();
        petal.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  function spawnBurstPetals() {
    if (!canvas) return;
    // Burst effect handled dynamically by canvas floating particles and stage splash
  }
});
