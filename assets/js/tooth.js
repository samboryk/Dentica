import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.querySelector(".hero");
const titleElement = document.getElementById("hero-title"); // ← ключовий елемент

// сцена
const scene = new THREE.Scene();

// камера (залишаємо Perspective, бо зуб виглядає об'ємно)
const camera = new THREE.PerspectiveCamera(
  35,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.z = 5;

// renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// світло
scene.add(new THREE.AmbientLight(0xffffff, 1));
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(3, 3, 5);
scene.add(light);

let tooth;
const loader = new GLTFLoader();

loader.load("/assets/models/tooth.glb", (gltf) => {
  tooth = gltf.scene;

  tooth.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0
      });
    }
  });

  scene.add(tooth);
  tooth.position.set(0, 0, 0); // центр
  updateToothScale();          // перше масштабування
});

// ────────────── Головна функція — масштаб зуба за текстом ──────────────
function updateToothScale() {
  if (!tooth || !titleElement) return;

  // Беремо реальний розмір заголовка на екрані
  const titleRect = titleElement.getBoundingClientRect();
  const titleWidth = titleRect.width;   // ширина в пікселях
  // або titleHeight = titleRect.height; // якщо хочеш прив'язати до висоти

  // Базова ширина заголовка, при якій масштаб зуба = 1 (підбери на десктопі)
  const baseTitleWidth = 900;   // наприклад, коли заголовок ~900–1100 px — зуб нормальний розмір

  // Розрахунок масштабу
  let scale = titleWidth / baseTitleWidth;

  // Обмежуємо, щоб на дуже вузьких екранах не зник, а на широких не велетенський
  scale = Math.max(0.45, Math.min(1.4, scale)); // налаштуй межі під себе

  // Застосовуємо
  tooth.scale.set(scale, scale, scale);

  // Опціонально: трохи зсуваємо зуб, щоб краще "сидів" відносно тексту
  // tooth.position.x = titleWidth * 0.0005; // або по Y
}

// Оновлюємо при ресайзі контейнера/вікна
const resizeObserver = new ResizeObserver(() => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  updateToothScale(); // оновлюємо зуб щоразу при зміні розміру
});

resizeObserver.observe(container);

// також реагуємо на зміну вікна (на всяк випадок)
window.addEventListener("resize", () => {
  updateToothScale();
});

function animate() {
  requestAnimationFrame(animate);

  if (tooth) {
    tooth.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}

animate();