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
import { components } from "/js/components.js";

let container, scene, camera, renderer, ambLt, dirLt, spotLt, controls;
let lander;

const pickableObjects = [];
let intersectedObject;
const originalMaterials = {};
const highlightedMaterial = new THREE.MeshBasicMaterial({
  wireframe: false,
  color: 0x526f93 /*0x29789f,*/,
  transparent: true,
  opacity: 0.8,
});
const raycaster = new THREE.Raycaster();
let intersects;
const mouse = new THREE.Vector2();
let holder = document.querySelector("#holder");
let which;

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
  document.body.appendChild(container);
  // document.getElementById("keeper").appendChild(container);
  buildIt();
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("click", onClick);
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
  camera.position.set(10, 5, 10);
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
  render();
}

function buildIt() {
  const loader = new GLTFLoader().setPath("assets/model/");
  loader.load(
    "lunarlandernofoil_carbajal_mod4.gltf",
    function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          const m = child;
          m.castShadow = true;
          pickableObjects.push(m);
          //store reference to original materials for later
          originalMaterials[m.id] = m.material;
        }
      });

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
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );
}

function addOrbitControls() {
  controls = new OrbitControls(camera, container);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enablePan = false;
  controls.minDistance = 7;
  controls.maxDistance = 13;
}

function onDocumentMouseMove(event) {
  mouse.set(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  );

  holder.style.left = event.clientX + 25 + "px";
  holder.style.top = event.clientY + 25 + "px";

  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(pickableObjects, true);
  if (intersects.length > 0) {
    intersectedObject = intersects[0].object;
  } else {
    intersectedObject = null;
  }
  // pickableObjects.forEach((o, i) => {
  //   if (intersectedObject && intersectedObject.name === o.name) {
  //     console.log(
  //       "For id# " +
  //         intersectedObject.id +
  //         " - " +
  //         components.get(intersectedObject.id)
  //     );
  //     pickableObjects[i].material = highlightedMaterial;
  //   } else {
  //     pickableObjects[i].material = originalMaterials[o.name];
  //   }
  // });

  which = [];
  if (intersectedObject) {
    which = components.get(intersectedObject.id).children;
    holder.innerHTML = components.get(intersectedObject.id).title;
    holder.style.padding = "5px";
    holder.style.border = "1px white solid";
  } else {
    holder.innerHTML = "";
    holder.style.padding = "0px";
    holder.style.border = "none";
  }
  pickableObjects.forEach((o, i) => {
    if (intersectedObject && which.includes(o.id)) {
      pickableObjects[i].material = highlightedMaterial;
    } else {
      pickableObjects[i].material = originalMaterials[o.id];
    }
  });
}

function onClick(event) {
  intersectedObject != null
    ? console.log(components.get(intersectedObject.id).title)
    : console.log("null");

  /*
stop rotation
stop raycasting
rotate into position with easing?
invert materials
display modal
start all of that back up when modal closed
    */
}

init();
animate();
