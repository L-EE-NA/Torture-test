import * as THREE from "three";

import {
  RoundedBoxGeometry
}
from
"three/addons/geometries/RoundedBoxGeometry.js";


/* =========================================================
   HELPER
   ========================================================= */

function addMesh(
  scene,
  geometry,
  material,
  position,
  rotation = [0,0,0]
) {

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );


  mesh.position.set(
    ...position
  );


  mesh.rotation.set(
    ...rotation
  );


  mesh.castShadow =
    true;


  mesh.receiveShadow =
    true;


  scene.add(mesh);


  return mesh;

}


/* =========================================================
   BUILD ENVIRONMENT
   ========================================================= */

export function buildScene(
  scene,
  materials
) {


  /* =====================================================
     ROOM
     ===================================================== */

  addMesh(

    scene,

    new THREE.BoxGeometry(
      12,
      .32,
      18
    ),

    materials.floor,

    [
      0,
      -.18,
      -2
    ]

  );


  addMesh(

    scene,

    new THREE.BoxGeometry(
      .45,
      8,
      18
    ),

    materials.concreteDark,

    [
      -6,
      3.75,
      -2
    ]

  );


  addMesh(

    scene,

    new THREE.BoxGeometry(
      .45,
      8,
      18
    ),

    materials.concreteDark,

    [
      6,
      3.75,
      -2
    ]

  );


  addMesh(

    scene,

    new THREE.BoxGeometry(
      12,
      .45,
      18
    ),

    materials.concreteDark,

    [
      0,
      7.65,
      -2
    ]

  );


  /* =====================================================
     CONCRETE WALL PANELS
     ===================================================== */

  for (
    const side of [-1, 1]
  ) {

    for (
      let z = 4;
      z >= -9;
      z -= 2.4
    ) {

      addMesh(

        scene,

        new RoundedBoxGeometry(
          .12,
          2,
          1.85,
          3,
          .05
        ),

        materials.concrete,

        [
          side * 5.74,
          2.7,
          z
        ]

      );


      addMesh(

        scene,

        new THREE.BoxGeometry(
          .13,
          .075,
          1.2
        ),

        materials.darkSteel,

        [
          side * 5.64,
          1.15,
          z
        ]

      );

    }

  }


  /* =====================================================
     CABLE TRAYS
     ===================================================== */

  for (
    const side of [-1,1]
  ) {

    addMesh(

      scene,

      new THREE.BoxGeometry(
        .22,
        .18,
        17
      ),

      materials.darkSteel,

      [
        side * 5.55,
        5.25,
        -2
      ]

    );


    for (
      let z = 5;
      z >= -9;
      z -= .8
    ) {

      addMesh(

        scene,

        new THREE.BoxGeometry(
          .28,
          .03,
          .05
        ),

        materials.steel,

        [
          side * 5.54,
          5.3,
          z
        ]

      );

    }

  }


  /* =====================================================
     RED FLOOR ROUTE
     ===================================================== */

  addMesh(

    scene,

    new THREE.BoxGeometry(
      .42,
      .022,
      18
    ),

    materials.red,

    [
      2.6,
      .005,
      -2
    ]

  );


  /* =====================================================
     CEILING RAIL
     ===================================================== */

  addMesh(

    scene,

    new THREE.BoxGeometry(
      4.8,
      .18,
      .22
    ),

    materials.darkSteel,

    [
      0,
      7.05,
      .4
    ]

  );


  addMesh(

    scene,

    new THREE.BoxGeometry(
      4.8,
      .04,
      .52
    ),

    materials.steel,

    [
      0,
      7.11,
      .4
    ]

  );


  /* trolley */

  const trolley =
    addMesh(

      scene,

      new RoundedBoxGeometry(
        .48,
        .25,
        .42,
        5,
        .06
      ),

      materials.darkSteel,

      [
        0,
        6.86,
        .4
      ]

    );


  /* wheels */

  for (
    const x of [-.18,.18]
  ) {

    addMesh(

      scene,

      new THREE.CylinderGeometry(
        .075,
        .075,
        .08,
        16
      ),

      materials.steel,

      [
        x,
        7.02,
        .22
      ],

      [
        Math.PI / 2,
        0,
        0
      ]

    );

  }


  /* =====================================================
     FOREGROUND PRISONER
     ===================================================== */

  const prisoner =
    new THREE.Group();


  scene.add(
    prisoner
  );


  /* torso */

  const torso =
    new THREE.Mesh(

      new RoundedBoxGeometry(
        1.5,
        2.35,
        .72,
        8,
        .16
      ),

      materials.fabric
    );


  torso.position.set(
    0,
    2.15,
    0
  );


  torso.castShadow =
    true;


  prisoner.add(
    torso
  );


  /* neck */

  const neck =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        .18,
        .2,
        .34,
        16
      ),

      materials.skin

    );


  neck.position.set(
    0,
    3.48,
    0
  );


  prisoner.add(
    neck
  );


  /* partial head */

  const head =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        .37,
        28,
        20
      ),

      materials.skin

    );


  head.scale.set(
    .86,
    1,
    .9
  );


  head.position.set(
    0,
    3.88,
    0
  );


  prisoner.add(
    head
  );


  /* =====================================================
     RESTRAINT / HAND GROUP
     ===================================================== */

  const restraints =
    new THREE.Group();


  prisoner.add(
    restraints
  );


  restraints.position.z =
    .48;


  /* forearms */

  const armGeometry =
    new THREE.CapsuleGeometry(
      .145,
      .76,
      10,
      18
    );


  const leftArm =
    new THREE.Mesh(
      armGeometry,
      materials.fabric
    );


  leftArm.position.set(
    -.34,
    1.72,
    .04
  );


  leftArm.rotation.z =
    -.31;


  restraints.add(
    leftArm
  );


  const rightArm =
    leftArm.clone();


  rightArm.position.x =
    .34;


  rightArm.rotation.z =
    .31;


  restraints.add(
    rightArm
  );


  /* =====================================================
     HANDS
     ===================================================== */

  function hand(
    x
  ) {

    const group =
      new THREE.Group();


    const palm =
      new THREE.Mesh(

        new RoundedBoxGeometry(
          .26,
          .34,
          .17,
          5,
          .07
        ),

        materials.skin

      );


    palm.castShadow =
      true;


    group.add(
      palm
    );


    /* fingers */

    for (
      let i = 0;
      i < 4;
      i++
    ) {

      const finger =
        new THREE.Mesh(

          new THREE.CapsuleGeometry(
            .027,
            .115,
            5,
            9
          ),

          materials.skin

        );


      finger.position.set(

        -.095 +
        i * .063,

        -.235,

        0

      );


      finger.rotation.z =
        (
          i -
          1.5
        ) * .025;


      group.add(
        finger
      );

    }


    group.position.set(
      x,
      1.09,
      .08
    );


    restraints.add(
      group
    );


    return group;

  }


  const leftHand =
    hand(
      -.17
    );


  const rightHand =
    hand(
      .17
    );


  /* =====================================================
     CUFFS
     ===================================================== */

  const cuffGeometry =
    new THREE.TorusGeometry(
      .135,
      .038,
      12,
      36
    );


  const cuffs =
    new THREE.Group();


  restraints.add(
    cuffs
  );


  for (
    const x of [-.17,.17]
  ) {

    const cuff =
      new THREE.Mesh(

        cuffGeometry,

        materials.steel

      );


    cuff.position.set(
      x,
      1.28,
      .08
    );


    cuff.rotation.x =
      Math.PI / 2;


    cuff.castShadow =
      true;


    cuffs.add(
      cuff
    );

  }


  /* small connector */

  const connector =
    new THREE.Mesh(

      new THREE.TorusGeometry(
        .085,
        .025,
        10,
        24
      ),

      materials.steel

    );


  connector.position.set(
    0,
    1.31,
    .12
  );


  connector.rotation.y =
    Math.PI / 2;


  cuffs.add(
    connector
  );


  /* =====================================================
     PHYSICAL CHAIN LINKS
     ===================================================== */

  const chainGroup =
    new THREE.Group();


  scene.add(
    chainGroup
  );


  const linkGeometry =
    new THREE.TorusGeometry(
      .115,
      .026,
      10,
      24
    );


  const linkCount =
    24;


  for (
    let i = 0;
    i < linkCount;
    i++
  ) {

    const link =
      new THREE.Mesh(

        linkGeometry,

        materials.steel

      );


    link.scale.y =
      1.42;


    link.position.set(

      0,

      1.46 +
      i * .225,

      .58

    );


    if (
      i % 2 === 1
    ) {

      link.rotation.y =
        Math.PI / 2;

    }


    link.castShadow =
      true;


    chainGroup.add(
      link
    );

  }


  /* =====================================================
     BACKGROUND PRISONERS

     Intentionally less detailed because
     they are far from the focal plane.
     ===================================================== */

  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const person =
      new THREE.Group();


    const x =
      -3 +
      (
        i % 3
      ) * 3;


    const z =
      -3.2 -
      Math.floor(
        i / 3
      ) * 3;


    person.position.set(
      x,
      0,
      z
    );


    const body =
      new THREE.Mesh(

        new RoundedBoxGeometry(
          1.05,
          1.9,
          .58,
          6,
          .12
        ),

        materials.fabric

      );


    body.position.y =
      1.55;


    person.add(
      body
    );


    const bgHead =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          .27,
          18,
          14
        ),

        materials.skin

      );


    bgHead.position.y =
      2.74;


    person.add(
      bgHead
    );


    const chain =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          .016,
          .016,
          4.1,
          8
        ),

        materials.steel

      );


    chain.position.set(
      0,
      4.75,
      .12
    );


    person.add(
      chain
    );


    scene.add(
      person
    );

  }


  /* =====================================================
     FLUORESCENT FIXTURES
     ===================================================== */

  for (
    const x of [-2.8,0,2.8]
  ) {

    addMesh(

      scene,

      new RoundedBoxGeometry(
        1.65,
        .08,
        .23,
        4,
        .03
      ),

      materials.light,

      [
        x,
        7.25,
        2.3
      ]

    );

  }


  /* =====================================================
     LIGHTING
     ===================================================== */

  const hemi =
    new THREE.HemisphereLight(

      0x9da8ae,

      0x050607,

      1.05

    );


  scene.add(
    hemi
  );


  /* main overhead */

  const key =
    new THREE.SpotLight(

      0xeaf3f5,

      380

    );


  key.position.set(
    1.4,
    6.8,
    4
  );


  key.angle =
    .62;


  key.penumbra =
    .58;


  key.decay =
    1.65;


  key.distance =
    16;


  key.castShadow =
    true;


  key.shadow.mapSize.set(
    2048,
    2048
  );


  key.shadow.bias =
    -.00035;


  key.target.position.set(
    0,
    1.45,
    .5
  );


  scene.add(
    key
  );


  scene.add(
    key.target
  );


  /* side fill */

  const sideLight =
    new THREE.RectAreaLight(

      0xbad6dc,

      14,

      2.5,

      5

    );


  sideLight.position.set(
    -4.7,
    3.6,
    2.7
  );


  sideLight.lookAt(
    0,
    1.5,
    .5
  );


  scene.add(
    sideLight
  );


  /* red institutional light */

  const redLight =
    new THREE.PointLight(

      0xff1022,

      48,

      8,

      2

    );


  redLight.position.set(
    4.4,
    1.35,
    -2.5
  );


  scene.add(
    redLight
  );


  return {

    prisoner,
    restraints,

    leftHand,
    rightHand,

    cuffs,

    chainGroup,

    trolley,

    redLight,

    key

  };

}
