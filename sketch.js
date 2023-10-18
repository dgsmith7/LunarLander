/*//////////////////////////////////////////////////////////
"Lunar LAnder THREE JS Website Demo" 
Original code by David Gail Smith, October 2023
Twitter: @davidgailsmith
http://www.davidgailsmith.com
Model: https://nasa3d.arc.nasa.gov/detail/lunarlandernofoil-c
*/ //////////////////////////////////////////////////////////
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let container, scene, camera, renderer, ambLt, dirLt, spotLt, controls;
let lander;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#c3ebef");
  setCamera();
  setLights();
  buildRenderer();
  document.body.appendChild(container);

  buildIt();
  addOrbitControls();
  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  updateScene();
  renderer.render(scene, camera);
}

function updateScene() {
  // put any scene updates here (rotation of objects for example, etc)
  if (lander) lander.rotateY(0.001);
  controls.update();
}

function setCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 10;
  camera.position.y = 3;
  camera.position.z = 0;
}

function setLights() {
  ambLt = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambLt);
  dirLt = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLt.position.set(5, 5, 5);
  scene.add(dirLt);
  spotLt = new THREE.SpotLight(0xffffff, 0.5);
  spotLt.position.set(5, 1, 2);
  spotLt.decay = 2.0;
  scene.add(spotLt);
}

function buildRenderer() {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = !1;
  renderer.setClearColor(0x000000, 0);
  container = renderer.domElement;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildIt() {
  const loader = new GLTFLoader().setPath("textures/");
  loader.load("lunarlandernofoil_carbajal_mod2.gltf", function (gltf) {
    lander = gltf.scene;
    lander.castShadow = true;
    lander.position.x = 0;
    lander.position.y = 0;
    lander.position.z = 0;

    scene.add(gltf.scene);
    console.log(lander);
    console.log(lander.children);
    render();
  });
}

function addOrbitControls() {
  controls = new OrbitControls(camera, container);
  controls.minDistance = 10;
  controls.maxDistance = 15;
}

init();
animate();
