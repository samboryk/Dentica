/* ── Зміна слів у фоновому тексті ── */
const words = [
  "Інноваційні",
  "Комфортні",
  "Ефективні",
  "Безболісні",
];
let wordIndex = 0;
const changingText = document.getElementById("changing-text");

function cycleWord() {
  // Fade out
  changingText.classList.add("fade-out");

  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    changingText.textContent = words[wordIndex];
    changingText.classList.remove("fade-out");
  }, 600); // збігається з тривалістю transition
}

setInterval(cycleWord, 4000);


/* ── Елементи прелоадера ── */
const preloader = document.getElementById('preloader');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

// Імітація прогресу до 67% (відсилка/стиль)
let fakeProgress = 0;
const fakeInterval = setInterval(() => {
    if (fakeProgress < 67) {
        // Миттєвий підйом до 67
        fakeProgress += Math.random() * 30;
        if (fakeProgress >= 67) {
            fakeProgress = 67;
            clearInterval(fakeInterval);
        }
        updateUI(fakeProgress.toFixed(0));
    }
}, 100);

function updateUI(percent) {
    if (progressText && progressFill) {
        const current = parseInt(progressText.innerText) || 0;
        if (percent > current) {
            progressText.innerText = `${percent}%`;
            progressFill.style.width = `${percent}%`;
        }
    }
}

/* ── 3D модель зуба ── */
const viewer = document.getElementById("tooth-viewer");
let modelLoaded = false;
let windowLoaded = false;

function checkAllLoaded() {
    if (modelLoaded && windowLoaded) {
        hidePreloader();
    }
}

// Відслідковуємо прогрес завантаження моделі
if (viewer) {
  viewer.addEventListener('progress', (event) => {
    const realPercent = (event.detail.totalProgress * 100);
    if (!preloader.classList.contains('is-hidden') && realPercent > 80) {
        updateUI(realPercent.toFixed(0));
    }
  });

  viewer.addEventListener("load", () => {
    modelLoaded = true;
    
    /* ── Ініціалізація сцени ── */
    viewer.setAttribute("camera-orbit", `${BASE_THETA}deg ${BASE_PHI}deg auto`);
    viewer.setAttribute("min-camera-orbit", "auto auto auto");
    viewer.setAttribute("max-camera-orbit", "auto auto auto");

    const model = viewer.model;
    if (model && model.materials) {
      model.materials.forEach((material) => {
        material.pbrMetallicRoughness.setBaseColorFactor([0.9, 0.9, 0.9, 1]);
        material.pbrMetallicRoughness.setMetallicFactor(0);
        material.pbrMetallicRoughness.setRoughnessFactor(0.4);
      });
    }

    animate();
    checkAllLoaded();
  });
} else {
  modelLoaded = true; // Якщо в'ювера немає, вважаємо модель "завантаженою"
}

// Приховуємо прелоадер як тільки завантажиться основне вікно
window.addEventListener('load', () => {
    windowLoaded = true;
    checkAllLoaded();
});

// Захисний тайм-аут: якщо щось пішло не так, все одно пускаємо користувача
const safetyTimeout = setTimeout(() => {
    if (!preloader.classList.contains('is-hidden')) {
        hidePreloader();
    }
}, 5000); 

function hidePreloader() {
    if (!preloader || preloader.classList.contains('is-hidden')) return;
    
    clearInterval(fakeInterval);
    clearTimeout(safetyTimeout);
    
    if (progressText && progressFill) {
        progressText.innerText = '100%';
        progressFill.style.width = '100%';
    }

    // Плавно приховуємо
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        preloader.classList.add('is-hidden');

        if (typeof window.initAllAnimations === 'function') {
            window.initAllAnimations();
        }
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 400); 
    }, 100); 
}

const BASE_THETA = 0;
const BASE_PHI = 90;
const DISTANCE = "auto";

let currentTheta = BASE_THETA;
let currentPhi = BASE_PHI;
let targetTheta = BASE_THETA;
let targetPhi = BASE_PHI;

document.addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const nx = (e.clientX - cx) / cx;
  const ny = (e.clientY - cy) / cy;
  targetTheta = BASE_THETA + nx * 20;
  targetPhi   = BASE_PHI   - ny * 15;
});

function lerp(a, b, t) {
  return a + (b - a) * t;
}

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  currentTheta = lerp(currentTheta, targetTheta, 0.08);
  currentPhi   = lerp(currentPhi,   targetPhi,   0.08);

  const floatTheta = currentTheta + Math.sin(time) * 5;
  const floatPhi   = currentPhi   + Math.cos(time * 0.7) * 4;

  if (viewer) {
    viewer.setAttribute(
      "camera-orbit",
      `${floatTheta}deg ${floatPhi}deg ${DISTANCE}`
    );
  }
}