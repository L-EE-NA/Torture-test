let ctx = null;

let master = null;

let ambienceStarted = false;


/* =========================================================
   START AUDIO
   ========================================================= */

export async function startAudio() {

  if (!ctx) {

    ctx =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();


    master =
      ctx.createGain();


    master.gain.value =
      .62;


    master.connect(
      ctx.destination
    );

  }


  if (
    ctx.state ===
    "suspended"
  ) {

    await ctx.resume();

  }


  if (
    ambienceStarted
  ) {

    return;

  }


  ambienceStarted =
    true;


  /* low building rumble */

  const hum =
    ctx.createOscillator();


  hum.type =
    "sine";


  hum.frequency.value =
    42;


  const humGain =
    ctx.createGain();


  humGain.gain.value =
    .065;


  hum
    .connect(humGain)
    .connect(master);


  hum.start();


  /* electrical secondary tone */

  const electrical =
    ctx.createOscillator();


  electrical.type =
    "triangle";


  electrical.frequency.value =
    84;


  const electricalGain =
    ctx.createGain();


  electricalGain.gain.value =
    .009;


  electrical
    .connect(electricalGain)
    .connect(master);


  electrical.start();


  /* ventilation noise */

  const buffer =
    ctx.createBuffer(

      1,

      ctx.sampleRate * 3,

      ctx.sampleRate

    );


  const data =
    buffer.getChannelData(0);


  for (
    let i = 0;
    i < data.length;
    i++
  ) {

    data[i] =
      Math.random() * 2 - 1;

  }


  const noise =
    ctx.createBufferSource();


  noise.buffer =
    buffer;


  noise.loop =
    true;


  const filter =
    ctx.createBiquadFilter();


  filter.type =
    "lowpass";


  filter.frequency.value =
    700;


  const gain =
    ctx.createGain();


  gain.gain.value =
    .016;


  noise
    .connect(filter)
    .connect(gain)
    .connect(master);


  noise.start();

}


/* =========================================================
   ONE METAL HIT
   ========================================================= */

function metalHit(
  delay,
  frequency,
  volume
) {

  const time =
    ctx.currentTime +
    delay;


  const oscillator =
    ctx.createOscillator();


  const gain =
    ctx.createGain();


  oscillator.type =
    "triangle";


  oscillator.frequency
    .setValueAtTime(
      frequency,
      time
    );


  oscillator.frequency
    .exponentialRampToValueAtTime(

      frequency * .42,

      time + .25

    );


  gain.gain
    .setValueAtTime(
      volume,
      time
    );


  gain.gain
    .exponentialRampToValueAtTime(

      .0001,

      time + .42

    );


  oscillator
    .connect(gain)
    .connect(master);


  oscillator.start(
    time
  );


  oscillator.stop(
    time + .45
  );

}


/* =========================================================
   CHAIN RATTLE
   ========================================================= */

export function chainRattle() {

  if (!ctx) {

    return;

  }


  metalHit(
    0,
    1250,
    .12
  );


  metalHit(
    .045,
    820,
    .085
  );


  metalHit(
    .09,
    1580,
    .07
  );


  metalHit(
    .16,
    670,
    .055
  );


  metalHit(
    .24,
    1130,
    .045
  );


  metalHit(
    .34,
    740,
    .035
  );

}
