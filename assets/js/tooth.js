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


/* ── 3D модель зуба ── */
const viewer = document.getElementById("tooth-viewer");

// Відслідковуємо прогрес завантаження моделі
viewer.addEventListener('progress', (event) => {
  // event.detail.totalProgress повертає значення від 0 до 1
  const percentComplete = (event.detail.totalProgress * 100).toFixed(0);
  
  if (progressText && progressFill) {
      progressText.innerText = `${percentComplete}%`;
      progressFill.style.width = `${percentComplete}%`;
  }
});

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

  viewer.setAttribute(
    "camera-orbit",
    `${floatTheta}deg ${floatPhi}deg ${DISTANCE}`
  );
}

// Подія успішного завантаження
viewer.addEventListener("load", () => {
  /* ── Приховуємо прелоадер ── */
  if (progressText && progressFill && preloader) {
      progressText.innerText = '100%';
      progressFill.style.width = '100%';
      
      setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.pointerEvents = 'none'; // Блокуємо перехоплення подій відразу
          
          setTimeout(() => {
              preloader.style.display = 'none'; // Повністю видаляємо з DOM-дерева
              
              /* ── ЗАПУСК ТА ОНОВЛЕННЯ АНІМАЦІЙ ── */
              if (typeof AOS !== 'undefined') {
                  AOS.init({
                    once: false,
                    mirror: true,
                    offset: 20,    
                    duration: 800 
                  });
                  AOS.refresh();
              }

              /* Оновлюємо GSAP ScrollTrigger для перерахунку координат */
              if (typeof ScrollTrigger !== 'undefined') {
                  ScrollTrigger.refresh();
              }
              
          }, 600); // Чекаємо завершення CSS-транзиції
      }, 200); 
  }

  /* ── Ініціалізація сцени ── */
  viewer.setAttribute("camera-orbit", `${BASE_THETA}deg ${BASE_PHI}deg auto`);
  viewer.setAttribute("min-camera-orbit", "auto auto auto");
  viewer.setAttribute("max-camera-orbit", "auto auto auto");

  const model = viewer.model;
  model.materials.forEach((material) => {
    material.pbrMetallicRoughness.setBaseColorFactor([0.9, 0.9, 0.9, 1]);
    material.pbrMetallicRoughness.setMetallicFactor(0);
    material.pbrMetallicRoughness.setRoughnessFactor(0.4);
  });

  animate();
});