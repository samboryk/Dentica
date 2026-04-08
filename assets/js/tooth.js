const viewer = document.getElementById("tooth-viewer");

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

  currentTheta = lerp(currentTheta, targetTheta, 0.8);
  currentPhi   = lerp(currentPhi,   targetPhi,   0.8);


  const floatTheta = currentTheta + Math.sin(time) * 5;
  const floatPhi   = currentPhi   + Math.cos(time * 0.7) * 4;

  viewer.setAttribute(
    "camera-orbit",
    `${floatTheta}deg ${floatPhi}deg ${DISTANCE}`
  );
}

viewer.addEventListener("load", () => {
  // Початкова позиція камери
  viewer.setAttribute("camera-orbit", `${BASE_THETA}deg ${BASE_PHI}deg auto`);
  viewer.setAttribute("min-camera-orbit", "auto auto auto");
  viewer.setAttribute("max-camera-orbit", "auto auto auto");
  animate();
});

viewer.addEventListener("load", () => {

  const model = viewer.model;
  
  model.materials.forEach((material) => {

    material.pbrMetallicRoughness.setBaseColorFactor([0.9, 0.9, 0.9, 1]); // R, G, B, A

    material.pbrMetallicRoughness.setMetallicFactor(0);
    material.pbrMetallicRoughness.setRoughnessFactor(0.4); // 0 = глянець, 1 = матовий
  });

  viewer.setAttribute("camera-orbit", `${BASE_THETA}deg ${BASE_PHI}deg auto`);
  animate();
});