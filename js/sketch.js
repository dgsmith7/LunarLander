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
  //  scene.background = new THREE.Color("#000");

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  // //Load background texture
  // const loader = new THREE.TextureLoader();
  // loader.load(
  //   "https://images-assets.nasa.gov/image/as11-44-6552/as11-44-6552~orig.jpg",
  //   function (texture) {
  //     scene.background = texture;
  //   }
  // );

  setCamera();
  setLights();
  buildRenderer();
  //document.body.appendChild(container);
  document.getElementById("keeper").appendChild(container);
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
  controls.update();
}

function setCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(10, 7, 10);
}

function setLights() {
  ambLt = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambLt);
  dirLt = new THREE.DirectionalLight(0xffffff, 0.75);
  dirLt.position.set(4, 3, 6);
  dirLt.castShadows = true;
  scene.add(dirLt);
  spotLt = new THREE.SpotLight(0xffffff, 0.85);
  spotLt.position.set(4, 3, 6);
  spotLt.decay = 2.0;
  scene.add(spotLt);
}

function buildRenderer() {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
  });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = 1;
  renderer.setClearColor(0x000000, 0);

  container = renderer.domElement;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildIt() {
  let geom = new THREE.PlaneGeometry(100, 100);
  let material = new THREE.MeshPhongMaterial(0.1, 0.1, 0.1);
  let mesh = new THREE.Mesh(geom, material);
  mesh.rotateX(-Math.PI / 2);
  mesh.position.set(0, -3, 0);
  // scene.add(mesh);

  const loader = new GLTFLoader().setPath("assets/model/");
  loader.load("lunarlandernofoil_carbajal_mod4.gltf", function (gltf) {
    lander = gltf.scene;
    lander.position.x = 0;
    lander.position.y = -3;
    lander.position.z = 0;
    lander.castShadows = true;
    lander.receiveShadows = true;
    scene.add(gltf.scene);
    console.log(lander);
    console.log(lander.children);
    render();
  });
}

function addOrbitControls() {
  controls = new OrbitControls(camera, container);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enablePan = false;
  controls.minDistance = 10;
  controls.maxDistance = 13;
}

init();
animate();
