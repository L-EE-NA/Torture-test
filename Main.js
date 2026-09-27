import * as THREE from "three";

import {
  RoomEnvironment
}
from
"three/addons/environments/RoomEnvironment.js";


import {
  EffectComposer
}
from
"three/addons/postprocessing/EffectComposer.js";


import {
  RenderPass
}
from
"three/addons/postprocessing/RenderPass.js";


import {
  SSAOPass
}
from
"three/addons/postprocessing/SSAOPass.js";


import {
  UnrealBloomPass
}
from
"three/addons/postprocessing/UnrealBloomPass.js";


import {
  OutputPass
}
from
"three/addons/postprocessing/OutputPass.js";


import {
  makeMaterials
}
from
"./materials.js";


import {
  buildScene
}
from
"./scene.js";


import {
  startAudio,
  chainRattle
}
from
"./audio.js";


/* =========================================================
   DOM
   ========================================================= */

const stage =
  document.querySelector(
    "#stage"
  );


const startButton =
  document.querySelector(
    "#start"
  );


const hint =
  document.querySelector(
    "#hint"
  );


/* =========================================================
   SCENE
   ========================================================= */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x080a0b
  );


scene.fog =
  new THREE.FogExp2(

    0x090b0c,

    .026

  );


/* =========================================================
   CAMERA
   ========================================================= */

const camera =
  new THREE.PerspectiveCamera(

    48,

    stage.clientWidth /
    stage.clientHeight,

    .1,

    120

  );


camera.position.set(

  0,
  1.72,
  5.15

);


camera.lookAt(

  0,
  1.62,
  .45

);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    antialias:
      true,

    powerPreference:
      "high-performance"

  });


renderer.setPixelRatio(

  Math.min(

    window.devicePixelRatio,

    1.7

  )

);


renderer.setSize(

  stage.clientWidth,

  stage.clientHeight,

  false

);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  1.08;


renderer.shadowMap.enabled =
  true;


renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;


stage.prepend(
  renderer.domElement
);


/* =========================================================
   ENVIRONMENT REFLECTIONS
   ========================================================= */

const pmrem =
  new THREE.PMREMGenerator(
    renderer
  );


const environment =
  pmrem.fromScene(

    new RoomEnvironment(),

    .04

  ).texture;


scene.environment =
  environment;


/* =========================================================
   MATERIALS + WORLD
   ========================================================= */

const materials =
  makeMaterials();


const refs =
  buildScene(
    scene,
    materials
  );


/* =========================================================
   POST PROCESSING
   ========================================================= */

const width =
  stage.clientWidth;


const height =
  stage.clientHeight;


const target =
  new THREE.WebGLRenderTarget(

    width,

    height,

    {
      samples:
        4
    }

  );


const composer =
  new EffectComposer(
    renderer,
    target
  );


const renderPass =
  new RenderPass(

    scene,

    camera

  );


composer.addPass(
  renderPass
);


/* ambient/contact shading */

const ssao =
  new SSAOPass(

    scene,

    camera,

    width,

    height

  );


ssao.kernelRadius =
  12;


ssao.minDistance =
  .001;


ssao.maxDistance =
  .16;


composer.addPass(
  ssao
);


/* subtle fluorescent bloom */

const bloom =
  new UnrealBloomPass(

    new THREE.Vector2(
      width,
      height
    ),

    .22,

    .5,

    .82

  );


composer.addPass(
  bloom
);


composer.addPass(
  new OutputPass()
);


/* =========================================================
   ANIMATION
   ========================================================= */

let started =
  false;


let startTime =
  0;


let rattlePlayed =
  false;


/* original values */

const chainBaseX =
  refs.chainGroup.position.x;


const trolleyBaseX =
  refs.trolley.position.x;


const restraintBaseZ =
  refs.restraints.position.z;


function dampedJerk(
  time
) {

  if (
    time < 2.45
  ) {

    return 0;

  }


  const x =
    time -
    2.45;


  return (

    Math.sin(
      x * 34
    )

    *

    Math.exp(
      -x * 5.3
    )

  );

}


function animate(
  now
) {

  const time =

    started

      ?

    (
      now -
      startTime
    )

    / 1000

      :

    0;


  /* =====================================================
     CAMERA MICRO MOVEMENT
     ===================================================== */

  const breathing =

    Math.sin(
      time * 1.45
    );


  camera.position.x =

    Math.sin(
      time * .72
    )

    * .018;


  camera.position.y =

    1.72 +

    breathing *
    .012;


  camera.position.z =

    5.15 -

    Math.min(
      time,
      5
    )

    * .018;


  camera.lookAt(

    0,

    1.56 +

    breathing * .006,

    .45

  );


  /* =====================================================
     PRISONER BREATHING
     ===================================================== */

  refs.prisoner.scale.x =

    1 +

    breathing * .0035;


  refs.prisoner.position.y =

    breathing * .006;


  /* =====================================================
     CHAIN JERK
     ===================================================== */

  const jerk =
    dampedJerk(
      time
    );


  refs.restraints.position.z =

    restraintBaseZ +

    Math.abs(jerk)
    * .075;


  refs.restraints.position.y =

    -Math.abs(jerk)
    * .025;


  refs.chainGroup.position.x =

    chainBaseX +

    jerk * .055;


  refs.chainGroup.rotation.z =

    jerk * .022;


  refs.trolley.position.x =

    trolleyBaseX +

    jerk * .035;


  /* tiny light reaction */

  refs.redLight.intensity =

    42 +

    Math.sin(
      time * 2.8
    )

    * 8;


  /* =====================================================
     SOUND
     ===================================================== */

  if (
    started &&
    time > 2.45 &&
    !rattlePlayed
  ) {

    rattlePlayed =
      true;


    chainRattle();

  }


  composer.render();


  requestAnimationFrame(
    animate
  );

}


requestAnimationFrame(
  animate
);


/* =========================================================
   START
   ========================================================= */

startButton.addEventListener(

  "click",

  async () => {

    started =
      true;


    startTime =
      performance.now();


    rattlePlayed =
      false;


    startButton.style.display =
      "none";


    hint.textContent =
      "LIVE WEBGL // PROCEDURAL MATERIALS";


    await startAudio();

  }

);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(

  "resize",

  () => {

    const width =
      stage.clientWidth;


    const height =
      stage.clientHeight;


    camera.aspect =
      width /
      height;


    camera.updateProjectionMatrix();


    renderer.setSize(

      width,

      height,

      false

    );


    composer.setSize(

      width,

      height

    );

  }

);
