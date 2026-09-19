"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const NEON = 0x34d186;
const BG = 0x04060a;
const SPEED = 0.6; // globalni multiplikator brzine (manji = sporije)

/* ---------- teksture ---------- */
function makeWindowTexture() {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 32, 64);
  for (let y = 5; y < 62; y += 8) {
    for (let x = 5; x < 30; x += 9) {
      if (Math.random() > 0.52) {
        const bright = Math.random();
        ctx.fillStyle =
          bright > 0.9 ? "rgba(170,240,210,0.85)" : bright > 0.45 ? "rgba(52,209,134,0.65)" : "rgba(120,215,175,0.38)";
        ctx.fillRect(x, y, 4, 5);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makeRoadTexture() {
  const W = 256;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#090a0e";
  ctx.fillRect(0, 0, W, H);
  // pločnik/rubovi (tamniji)
  ctx.fillStyle = "#06070a";
  ctx.fillRect(0, 0, W * 0.11, H);
  ctx.fillRect(W * 0.89, 0, W * 0.11, H);
  // neonski rubnjaci
  ctx.fillStyle = "rgba(52,209,134,0.9)";
  ctx.fillRect(W * 0.11 - 2, 0, 3, H);
  ctx.fillRect(W * 0.89 - 1, 0, 3, H);
  // središnja dvostruka linija
  ctx.fillStyle = "rgba(52,209,134,0.85)";
  ctx.fillRect(W * 0.5 - 4, 0, 2, H);
  ctx.fillRect(W * 0.5 + 2, 0, 2, H);
  // isprekidane linije traka (bijele)
  ctx.fillStyle = "rgba(228,240,232,0.85)";
  const dash = H * 0.34;
  for (const fx of [0.28, 0.72]) {
    for (let y = 0; y < H; y += dash * 1.7) {
      ctx.fillRect(W * fx - 1.5, y, 3, dash);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 60);
  tex.anisotropy = 4;
  return tex;
}

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

function makeHorizonTexture() {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "rgba(4,6,10,0)");
  g.addColorStop(0.62, "rgba(20,90,60,0.35)");
  g.addColorStop(0.78, "rgba(52,209,134,0.28)");
  g.addColorStop(1, "rgba(4,6,10,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type SignKind = "fleethub" | "uber" | "bolt";
function makeSignTexture(kind: SignKind) {
  const W = 512;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  // panel
  ctx.fillStyle = "rgba(4,7,10,0.9)";
  roundRect(ctx, 12, 12, W - 24, H - 24, 24);
  ctx.fill();
  // rub (u boji brenda)
  ctx.lineWidth = 5;
  ctx.strokeStyle =
    kind === "bolt" ? "rgba(52,225,120,0.7)" : kind === "uber" ? "rgba(210,222,228,0.45)" : "rgba(52,209,134,0.75)";
  roundRect(ctx, 12, 12, W - 24, H - 24, 24);
  ctx.stroke();
  ctx.textBaseline = "middle";
  if (kind === "fleethub") {
    ctx.font = "800 116px 'Space Grotesk', Arial, sans-serif";
    ctx.textAlign = "left";
    const fleet = "Fleet";
    const hub = "Hub";
    const fw = ctx.measureText(fleet).width;
    const hw = ctx.measureText(hub).width;
    const sx = W / 2 - (fw + hw) / 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(fleet, sx, H / 2 + 4);
    ctx.fillStyle = "#34d186";
    ctx.fillText(hub, sx + fw, H / 2 + 4);
  } else if (kind === "uber") {
    ctx.textAlign = "center";
    ctx.font = "700 172px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#f3f6f7";
    ctx.fillText("Uber", W / 2, H / 2 + 8);
  } else {
    ctx.textAlign = "center";
    ctx.font = "800 160px 'Arial Rounded MT Bold', 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = "#34e178";
    ctx.fillText("Bolt", W / 2, H / 2 + 8);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---------- film grade shader ---------- */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uVignette: { value: 0.26 },
    uGrain: { value: 0.045 },
    uAberration: { value: 0.0016 },
    uShadowTint: { value: new THREE.Color(0x0a1f2a) },
    uHighTint: { value: new THREE.Color(NEON) },
    uGrade: { value: 0.14 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime,uAspect,uVignette,uGrain,uAberration,uGrade;
    uniform vec3 uShadowTint,uHighTint; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    void main(){
      vec2 uv = vUv; vec2 d = uv - 0.5;
      float ca = uAberration * dot(d,d) * 4.0;
      vec3 c;
      c.r = texture2D(tDiffuse, uv + d*ca).r;
      c.g = texture2D(tDiffuse, uv).g;
      c.b = texture2D(tDiffuse, uv - d*ca).b;
      float luma = dot(c, vec3(0.2126,0.7152,0.0722));
      c = mix(c, c*(uShadowTint*2.0), (1.0 - smoothstep(0.0,0.5,luma)) * uGrade);
      c += uHighTint * smoothstep(0.55,1.0,luma) * uGrade;
      float vig = smoothstep(0.95, 0.25, length(d * vec2(uAspect,1.0)));
      c *= mix(1.0, vig, uVignette);
      float g = hash(uv * vec2(uAspect,1.0) * 900.0 + uTime*60.0) - 0.5;
      c += g * uGrain;
      gl_FragColor = vec4(c, 1.0);
    }`,
};

export default function HeroCity3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = width < 640;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(0x06121a, isMobile ? 0.04 : 0.03);

    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 340);
    camera.position.set(0, 7, 18);
    camera.lookAt(0, 6, -50);

    scene.add(new THREE.AmbientLight(0x0a1c14, 0.9));
    const key = new THREE.PointLight(NEON, 40, 160);
    key.position.set(0, 22, -35);
    scene.add(key);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    /* ---------- cesta ---------- */
    const groundMat = track(new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: 0.5, roughness: 0.55 }));
    const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(800, 800)), groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const roadTex = track(makeRoadTexture());
    const roadMat = track(new THREE.MeshBasicMaterial({ map: roadTex, transparent: true }));
    const road = new THREE.Mesh(track(new THREE.PlaneGeometry(24, 760)), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.02;
    scene.add(road);

    /* ---------- zgrade ---------- */
    const DEPTH = 280;
    const COUNT = isMobile ? 38 : 60;
    const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
    const edgesGeo = track(new THREE.EdgesGeometry(boxGeo));
    const edgeMat = track(new THREE.LineBasicMaterial({ color: NEON, transparent: true, opacity: 0.24 }));
    const beaconGeo = track(new THREE.SphereGeometry(0.5, 8, 8));
    const beaconMat = track(new THREE.MeshBasicMaterial({ color: 0xff2a33 }));

    type B = {
      mesh: THREE.Mesh;
      edges: THREE.LineSegments;
      mat: THREE.MeshStandardMaterial;
      beacon: THREE.Mesh | null;
      phase: number;
    };
    const buildings: B[] = [];

    const placeBuilding = (b: B, first: boolean) => {
      const h = 7 + Math.random() * 40;
      const w = 4.5 + Math.random() * 5.5;
      const d = 4.5 + Math.random() * 5.5;
      const side = Math.random() > 0.5 ? -1 : 1;
      const x = side * (14 + Math.random() * 46);
      const z = first ? -Math.random() * DEPTH : b.mesh.position.z - DEPTH - Math.random() * 24;
      b.mesh.scale.set(w, h, d);
      b.edges.scale.set(w, h, d);
      b.mesh.position.set(x, h / 2, z);
      b.edges.position.copy(b.mesh.position);
      const em = b.mat.emissiveMap!;
      em.repeat.set(Math.max(1, Math.round(w / 2.2)), Math.max(2, Math.round(h / 3.2)));
      if (b.beacon) {
        b.beacon.visible = h > 30;
        b.beacon.position.set(x, h + 0.3, z);
      }
    };

    for (let i = 0; i < COUNT; i++) {
      const emissiveMap = makeWindowTexture();
      const mat = new THREE.MeshStandardMaterial({
        color: 0x03060a,
        emissive: 0xffffff,
        emissiveMap,
        emissiveIntensity: 1.6,
        metalness: 0.3,
        roughness: 0.72,
      });
      track(mat);
      track(emissiveMap);
      const mesh = new THREE.Mesh(boxGeo, mat);
      const edges = new THREE.LineSegments(edgesGeo, edgeMat);
      const beacon = i % 4 === 0 ? new THREE.Mesh(beaconGeo, beaconMat) : null;
      const b: B = { mesh, edges, mat, beacon, phase: Math.random() * 6.28 };
      placeBuilding(b, true);
      scene.add(mesh);
      scene.add(edges);
      if (beacon) scene.add(beacon);
      buildings.push(b);
    }

    /* ---------- auti (instancirani): tijelo + far/stop svjetla + odsjaj na cesti ---------- */
    const CAR_N = isMobile ? 22 : 40;
    const LANES = [-6.6, -3.3, 3.3, 6.6];
    const dummy = new THREE.Object3D();

    const bodyGeo = track(new THREE.BoxGeometry(1.9, 0.7, 3.8));
    const bodyMat = track(new THREE.MeshStandardMaterial({ color: 0x04060b, metalness: 0.9, roughness: 0.35 }));
    const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, CAR_N);
    bodies.frustumCulled = false;
    scene.add(bodies);

    const lightGeo = track(new THREE.SphereGeometry(0.26, 8, 8));
    const lightMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const lights = new THREE.InstancedMesh(lightGeo, lightMat, CAR_N * 2);
    lights.frustumCulled = false;
    scene.add(lights);

    const glowTex = track(makeGlowTexture());
    const poolGeo = track(new THREE.PlaneGeometry(1, 1));
    poolGeo.rotateX(-Math.PI / 2);
    const poolMat = track(
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    const pools = new THREE.InstancedMesh(poolGeo, poolMat, CAR_N);
    pools.frustumCulled = false;
    scene.add(pools);

    // refleksije svjetala na mokrom asfaltu (zrcaljena, razvučena, prigušena)
    const reflMat = track(new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    const refl = new THREE.InstancedMesh(lightGeo, reflMat, CAR_N * 2);
    refl.frustumCulled = false;
    scene.add(refl);

    type Car = { x: number; z: number; speed: number; head: boolean };
    const cars: Car[] = [];
    const cWhite = new THREE.Color(1.7, 1.7, 1.7);
    const cRed = new THREE.Color(2.0, 0.09, 0.09);
    const cWarm = new THREE.Color(0.85, 0.34, 0.14);
    const cCool = new THREE.Color(0.34, 0.68, 0.52);
    const cWhiteR = new THREE.Color(0.7, 0.75, 0.72);
    const cRedR = new THREE.Color(0.85, 0.06, 0.06);
    for (let i = 0; i < CAR_N; i++) {
      const lane = LANES[i % LANES.length];
      const head = lane < 0; // lijeve trake dolaze prema nama → bijeli farovi; desne → crvena stop svjetla
      const car: Car = {
        x: lane,
        z: -Math.random() * DEPTH,
        speed: head ? 30 + Math.random() * 12 : 16 + Math.random() * 8,
        head,
      };
      cars.push(car);
      lights.setColorAt(i * 2, head ? cWhite : cRed);
      lights.setColorAt(i * 2 + 1, head ? cWhite : cRed);
      refl.setColorAt(i * 2, head ? cWhiteR : cRedR);
      refl.setColorAt(i * 2 + 1, head ? cWhiteR : cRedR);
      pools.setColorAt(i, head ? cCool : cWarm);
    }
    if (lights.instanceColor) lights.instanceColor.needsUpdate = true;
    if (refl.instanceColor) refl.instanceColor.needsUpdate = true;
    if (pools.instanceColor) pools.instanceColor.needsUpdate = true;

    /* ---------- embers (čestice) ---------- */
    const EMB = isMobile ? 60 : 130;
    const embPos = new Float32Array(EMB * 3);
    for (let i = 0; i < EMB; i++) {
      embPos[i * 3] = (Math.random() - 0.5) * 90;
      embPos[i * 3 + 1] = Math.random() * 44;
      embPos[i * 3 + 2] = -Math.random() * DEPTH;
    }
    const embGeo = track(new THREE.BufferGeometry());
    embGeo.setAttribute("position", new THREE.BufferAttribute(embPos, 3));
    const embMat = track(
      new THREE.PointsMaterial({
        map: glowTex,
        size: 1.1,
        color: new THREE.Color(1.6, 2.4, 2.0),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    );
    const embers = new THREE.Points(embGeo, embMat);
    embers.frustumCulled = false;
    scene.add(embers);

    /* ---------- horizont glow ---------- */
    const horizonTex = track(makeHorizonTexture());
    const horizonMat = track(
      new THREE.MeshBasicMaterial({ map: horizonTex, transparent: true, depthWrite: false, fog: false }),
    );
    const horizon = new THREE.Mesh(track(new THREE.PlaneGeometry(1400, 360)), horizonMat);
    horizon.position.set(0, 120, -DEPTH - 30);
    scene.add(horizon);

    /* ---------- natpisi (FleetHub / UBER / BOLT) ---------- */
    const signDefs: { kind: SignKind; w: number; h: number }[] = [
      { kind: "fleethub", w: 8, h: 4 },
      { kind: "uber", w: 5.6, h: 2.8 },
      { kind: "bolt", w: 5.6, h: 2.8 },
      { kind: "fleethub", w: 6.6, h: 3.3 },
      { kind: "uber", w: 5, h: 2.5 },
      { kind: "bolt", w: 5, h: 2.5 },
      { kind: "fleethub", w: 5.6, h: 2.8 },
      { kind: "bolt", w: 5.2, h: 2.6 },
    ];
    type Sign = { mesh: THREE.Mesh; i: number };
    const signs: Sign[] = [];
    const signGap = DEPTH / signDefs.length;
    const placeSign = (s: Sign, first: boolean) => {
      const side = Math.random() > 0.5 ? -1 : 1;
      const x = side * (12.5 + Math.random() * 4); // uz prednje pročelje zgrada
      const y = 5 + Math.random() * 20; // na fasadi, kao reklama
      const z = first ? -s.i * signGap - Math.random() * signGap * 0.5 : -DEPTH - Math.random() * 30;
      s.mesh.position.set(x, y, z);
      s.mesh.rotation.y = side > 0 ? -0.5 : 0.5; // okrenuto prema cesti
    };
    signDefs.forEach((def, i) => {
      const tex = track(makeSignTexture(def.kind));
      const mat = track(
        new THREE.MeshBasicMaterial({
          map: tex,
          color: new THREE.Color(1.05, 1.05, 1.05),
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      const mesh = new THREE.Mesh(track(new THREE.PlaneGeometry(def.w, def.h)), mat);
      const s: Sign = { mesh, i };
      placeSign(s, true);
      scene.add(mesh);
      signs.push(s);
    });

    /* ---------- post-processing (HDR) ---------- */
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(dpr);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(width * 0.5, height * 0.5),
      isMobile ? 0.5 : 0.66,
      0.5,
      0.6,
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const gradePass = new ShaderPass(GradeShader);
    gradePass.uniforms.uAspect.value = width / height;
    if (isMobile) {
      gradePass.uniforms.uAberration.value = 0;
      gradePass.uniforms.uGrain.value = 0.03;
    }
    composer.addPass(gradePass);

    /* ---------- animacija ---------- */
    const clock = new THREE.Clock();
    let motionTime = 0;
    let raf = 0;
    let running = false;
    let visible = !document.hidden;
    let onScreen = false;
    let pointerX = 0;
    let pointerY = 0;
    let pX = 0;
    let pY = 0;

    const renderFrame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const mdt = dt * SPEED;
      motionTime += mdt;
      const scroll = 30 * mdt;

      roadTex.offset.y -= 0.9 * mdt;

      for (const b of buildings) {
        b.mesh.position.z += scroll;
        if (b.mesh.position.z > 30) placeBuilding(b, false);
        b.edges.position.copy(b.mesh.position);
        if (b.beacon && b.beacon.visible) {
          b.beacon.position.z = b.mesh.position.z;
          b.beacon.visible = Math.sin(motionTime * 2.3 + b.phase) > 0.5;
        }
      }

      for (const s of signs) {
        s.mesh.position.z += scroll;
        if (s.mesh.position.z > 34) placeSign(s, false);
      }

      for (let i = 0; i < CAR_N; i++) {
        const car = cars[i];
        car.z += car.speed * mdt;
        if (car.z > 26) {
          car.z = -DEPTH - Math.random() * 30;
        }
        // tijelo
        dummy.position.set(car.x, 0.36, car.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        bodies.setMatrixAt(i, dummy.matrix);
        // svjetla (na strani prema kameri = +z kraj)
        const lz = car.z + 1.9;
        dummy.scale.set(1, 1, 1);
        dummy.position.set(car.x - 0.6, 0.5, lz);
        dummy.updateMatrix();
        lights.setMatrixAt(i * 2, dummy.matrix);
        dummy.position.set(car.x + 0.6, 0.5, lz);
        dummy.updateMatrix();
        lights.setMatrixAt(i * 2 + 1, dummy.matrix);
        // refleksija na mokrom asfaltu (razvučena prema dolje)
        dummy.scale.set(1.1, 3.4, 1.1);
        dummy.position.set(car.x - 0.6, -0.35, lz);
        dummy.updateMatrix();
        refl.setMatrixAt(i * 2, dummy.matrix);
        dummy.position.set(car.x + 0.6, -0.35, lz);
        dummy.updateMatrix();
        refl.setMatrixAt(i * 2 + 1, dummy.matrix);
        // odsjaj na cesti
        dummy.position.set(car.x, 0.03, car.z + 2.4);
        dummy.scale.set(3.2, 1, 7);
        dummy.updateMatrix();
        pools.setMatrixAt(i, dummy.matrix);
      }
      bodies.instanceMatrix.needsUpdate = true;
      lights.instanceMatrix.needsUpdate = true;
      refl.instanceMatrix.needsUpdate = true;
      pools.instanceMatrix.needsUpdate = true;

      const ep = embGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < EMB; i++) {
        let y = ep.getY(i) + dt * 1.4;
        let z = ep.getZ(i) + scroll;
        if (y > 46 || z > 26) {
          y = Math.random() * 6;
          z = -DEPTH - Math.random() * 20;
          ep.setX(i, (Math.random() - 0.5) * 90);
        }
        ep.setY(i, y);
        ep.setZ(i, z);
      }
      ep.needsUpdate = true;

      pX += (pointerX - pX) * 0.04;
      pY += (pointerY - pY) * 0.04;
      camera.position.x = Math.sin(motionTime * 0.13) * 1.5 + pX * 5;
      camera.position.y = 7 + Math.sin(motionTime * 0.26) * 0.45 - pY * 2.4;
      camera.lookAt(pX * 2, 6 - pY * 1.5, -50);

      gradePass.uniforms.uTime.value = motionTime;
      composer.render();
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      renderFrame();
    };
    const start = () => {
      if (running || reduced || !visible || !onScreen) return;
      running = true;
      clock.start();
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onResize = () => {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloom.setSize(width * 0.5, height * 0.5);
      gradePass.uniforms.uAspect.value = width / height;
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const onVis = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);

    const onPointer = (e: PointerEvent) => {
      pointerX = e.clientX / window.innerWidth - 0.5;
      pointerY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    // prvi kadar odmah (i za reduced-motion)
    onScreen = true;
    renderFrame();
    start();

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      io.disconnect();
      bodies.dispose();
      lights.dispose();
      refl.dispose();
      pools.dispose();
      disposables.forEach((d) => d.dispose());
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
