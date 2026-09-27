import * as THREE from "three";


/* =========================================================
   TEXTURE HELPER
   ========================================================= */

function finishTexture(
  texture,
  repeatX,
  repeatY,
  isColour = false
) {

  texture.wrapS =
    THREE.RepeatWrapping;

  texture.wrapT =
    THREE.RepeatWrapping;

  texture.repeat.set(
    repeatX,
    repeatY
  );


  if (isColour) {

    texture.colorSpace =
      THREE.SRGBColorSpace;

  }


  return texture;

}


/* =========================================================
   CONCRETE
   ========================================================= */

function concreteTexture() {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    512;

  canvas.height =
    512;


  const ctx =
    canvas.getContext("2d");


  ctx.fillStyle =
    "#55595c";

  ctx.fillRect(
    0,
    0,
    512,
    512
  );


  /* fine pores */

  for (
    let i = 0;
    i < 10000;
    i++
  ) {

    const value =
      Math.random() > .5
        ? 255
        : 0;


    ctx.fillStyle =
      `rgba(
        ${value},
        ${value},
        ${value},
        ${Math.random() * .045}
      )`;


    const size =
      Math.random() * 2 + .2;


    ctx.fillRect(
      Math.random() * 512,
      Math.random() * 512,
      size,
      size
    );

  }


  /* construction streaks */

  for (
    let i = 0;
    i < 55;
    i++
  ) {

    ctx.strokeStyle =
      `rgba(
        10,
        12,
        13,
        ${Math.random() * .06}
      )`;


    ctx.lineWidth =
      Math.random() * 3;


    const x =
      Math.random() * 512;


    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.lineTo(
      x +
      Math.random() * 22 - 11,
      512
    );

    ctx.stroke();

  }


  return finishTexture(
    new THREE.CanvasTexture(
      canvas
    ),
    2.8,
    2.8,
    true
  );

}


/* =========================================================
   CONCRETE HEIGHT / BUMP
   ========================================================= */

function concreteHeight() {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    512;

  canvas.height =
    512;


  const ctx =
    canvas.getContext("2d");


  ctx.fillStyle =
    "#888";

  ctx.fillRect(
    0,
    0,
    512,
    512
  );


  for (
    let i = 0;
    i < 15000;
    i++
  ) {

    const shade =
      95 +
      Math.floor(
        Math.random() * 75
      );


    ctx.fillStyle =
      `rgb(
        ${shade},
        ${shade},
        ${shade}
      )`;


    const size =
      Math.random() * 2.5;


    ctx.fillRect(
      Math.random() * 512,
      Math.random() * 512,
      size,
      size
    );

  }


  return finishTexture(
    new THREE.CanvasTexture(
      canvas
    ),
    3,
    3
  );

}


/* =========================================================
   FABRIC
   ========================================================= */

function fabricTexture() {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    256;

  canvas.height =
    256;


  const ctx =
    canvas.getContext("2d");


  ctx.fillStyle =
    "#676b6e";

  ctx.fillRect(
    0,
    0,
    256,
    256
  );


  ctx.strokeStyle =
    "rgba(255,255,255,.08)";

  ctx.lineWidth =
    1;


  for (
    let i = 0;
    i < 256;
    i += 4
  ) {

    ctx.beginPath();

    ctx.moveTo(
      i,
      0
    );

    ctx.lineTo(
      i,
      256
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
      0,
      i
    );

    ctx.lineTo(
      256,
      i
    );

    ctx.stroke();

  }


  return finishTexture(
    new THREE.CanvasTexture(
      canvas
    ),
    7,
    7,
    true
  );

}


/* =========================================================
   METAL SCRATCHES
   ========================================================= */

function metalRoughness() {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    512;

  canvas.height =
    512;


  const ctx =
    canvas.getContext("2d");


  ctx.fillStyle =
    "#777";

  ctx.fillRect(
    0,
    0,
    512,
    512
  );


  for (
    let i = 0;
    i < 1300;
    i++
  ) {

    ctx.strokeStyle =
      `rgba(
        255,
        255,
        255,
        ${Math.random() * .18}
      )`;


    ctx.lineWidth =
      Math.random() * .8;


    const y =
      Math.random() * 512;


    const x =
      Math.random() * 512;


    const length =
      5 +
      Math.random() * 70;


    ctx.beginPath();

    ctx.moveTo(
      x,
      y
    );

    ctx.lineTo(
      x + length,
      y + Math.random() * 2
    );

    ctx.stroke();

  }


  return finishTexture(
    new THREE.CanvasTexture(
      canvas
    ),
    2,
    2
  );

}


/* =========================================================
   EXPORT MATERIAL SET
   ========================================================= */

export function makeMaterials() {

  const concreteMap =
    concreteTexture();


  const concreteBump =
    concreteHeight();


  const fabricMap =
    fabricTexture();


  const scratches =
    metalRoughness();


  return {


    concrete:
      new THREE.MeshStandardMaterial({

        color:
          0x62676a,

        map:
          concreteMap,

        bumpMap:
          concreteBump,

        bumpScale:
          .075,

        roughness:
          .93,

        metalness:
          .02

      }),


    concreteDark:
      new THREE.MeshStandardMaterial({

        color:
          0x33373a,

        map:
          concreteMap,

        bumpMap:
          concreteBump,

        bumpScale:
          .08,

        roughness:
          .95

      }),


    floor:
      new THREE.MeshPhysicalMaterial({

        color:
          0x24282b,

        map:
          concreteMap,

        bumpMap:
          concreteBump,

        bumpScale:
          .035,

        roughness:
          .38,

        metalness:
          .08,

        clearcoat:
          .32,

        clearcoatRoughness:
          .24

      }),


    steel:
      new THREE.MeshPhysicalMaterial({

        color:
          0x9aa2a8,

        roughnessMap:
          scratches,

        roughness:
          .28,

        metalness:
          1,

        clearcoat:
          .17,

        clearcoatRoughness:
          .2

      }),


    darkSteel:
      new THREE.MeshStandardMaterial({

        color:
          0x292d30,

        roughnessMap:
          scratches,

        roughness:
          .32,

        metalness:
          .88

      }),


    fabric:
      new THREE.MeshStandardMaterial({

        color:
          0x6d7174,

        map:
          fabricMap,

        bumpMap:
          fabricMap,

        bumpScale:
          .035,

        roughness:
          .94

      }),


    skin:
      new THREE.MeshStandardMaterial({

        color:
          0xa47b66,

        roughness:
          .68,

        metalness:
          0

      }),


    black:
      new THREE.MeshStandardMaterial({

        color:
          0x070809,

        roughness:
          .82

      }),


    red:
      new THREE.MeshStandardMaterial({

        color:
          0x770811,

        emissive:
          0x220003,

        roughness:
          .52

      }),


    light:
      new THREE.MeshStandardMaterial({

        color:
          0xffffff,

        emissive:
          0xe9f5f7,

        emissiveIntensity:
          7

      })

  };

}
