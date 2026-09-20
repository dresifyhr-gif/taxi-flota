"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

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
  const maxW = W - 108;
  if (kind === "fleethub") {
    ctx.textAlign = "left";
    const fleet = "Fleet";
    const hub = "Hub";
    let size = 106;
    ctx.font = `800 ${size}px 'Space Grotesk', Arial, sans-serif`;
    let fw = ctx.measureText(fleet).width;
    let hw = ctx.measureText(hub).width;
    if (fw + hw > maxW) {
      size = Math.floor(size * (maxW / (fw + hw)));
      ctx.font = `800 ${size}px 'Space Grotesk', Arial, sans-serif`;
      fw = ctx.measureText(fleet).width;
      hw = ctx.measureText(hub).width;
    }
    const sx = W / 2 - (fw + hw) / 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(fleet, sx, H / 2 + 4);
    ctx.fillStyle = "#34d186";
    ctx.fillText(hub, sx + fw, H / 2 + 4);
  } else if (kind === "uber") {
    ctx.textAlign = "center";
    ctx.font = "700 168px 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#f3f6f7";
    ctx.fillText("Uber", W / 2, H / 2 + 8, maxW);
  } else {
    ctx.textAlign = "center";
    ctx.font = "800 156px 'Arial Rounded MT Bold', 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = "#34e178";
    ctx.fillText("Bolt", W / 2, H / 2 + 8, maxW);
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

export default function HeroCity3D({ dayMode = false }: { dayMode?: boolean } = {}) {
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
    // linearna magla — daleke zgrade i svjetla ostaju vidljiva, postupno blijede (ne naglo u crno)
    scene.fog = new THREE.Fog(0x08141e, isMobile ? 48 : 70, isMobile ? 300 : 390);

    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 520);
    camera.position.set(0, 7, 18);
    camera.lookAt(0, 6, -50);

    const ambient = new THREE.AmbientLight(0x0a1c14, 0.9);
    scene.add(ambient);
    const key = new THREE.PointLight(NEON, 40, 160);
    key.position.set(0, 22, -35);
    scene.add(key);
    const sunLight = new THREE.DirectionalLight(0xffffff, 0);
    sunLight.position.set(0, 120, -120);
    scene.add(sunLight);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    // tamni env (mokra cesta/auti hvataju neon; refleksije ostaju tamne, ne posive scenu)
    const envScene = new THREE.Scene();
    const envAdd = (color: number, x: number, y: number, z: number, rx: number, ry: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({ color }));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, 0);
      envScene.add(m);
    };
    envAdd(0x0a1c14, 0, 4, -9, 0, 0);
    envAdd(0x07131c, -9, 4, 0, 0, Math.PI / 2);
    envAdd(0x0c2016, 9, 4, 0, 0, -Math.PI / 2);
    envAdd(0x010203, 0, -6, 0, -Math.PI / 2, 0);
    envAdd(0x02060a, 0, 13, 0, Math.PI / 2, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = track(pmrem.fromScene(envScene, 0.12));
    scene.environment = envRT.texture;
    pmrem.dispose();
    envScene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      }
    });

    /* ---------- nebo (dan/noć) ---------- */
    const skyMat = track(
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color(0x03050c) },
          uHorizon: { value: new THREE.Color(0x0a1420) },
        },
        vertexShader:
          "varying vec3 vW; void main(){ vW = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "uniform vec3 uTop; uniform vec3 uHorizon; varying vec3 vW; void main(){ float h = clamp(normalize(vW).y*0.5+0.5, 0.0, 1.0); h = pow(h, 0.55); gl_FragColor = vec4(mix(uHorizon, uTop, h), 1.0); }",
      }),
    );
    const sky = new THREE.Mesh(track(new THREE.SphereGeometry(490, 32, 16)), skyMat);
    sky.renderOrder = -1;
    scene.add(sky);

    // sunce / mjesec
    const celTex = track(makeGlowTexture());
    const celMat = track(
      new THREE.SpriteMaterial({
        map: celTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      }),
    );
    const cel = new THREE.Sprite(celMat);
    cel.position.set(-90, 130, -330);
    cel.scale.setScalar(50);
    scene.add(cel);

    // sat kao neon natpis u sceni (visoko na skylineu, dio animacije)
    const clockCanvas = document.createElement("canvas");
    clockCanvas.width = 512;
    clockCanvas.height = 256;
    const clockCtx = clockCanvas.getContext("2d")!;
    const clockTex = track(new THREE.CanvasTexture(clockCanvas));
    clockTex.colorSpace = THREE.SRGBColorSpace;
    const drawClock = () => {
      const now = new Date();
      const s = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const c = clockCtx;
      c.clearRect(0, 0, 512, 256);
      c.fillStyle = dayMode ? "rgba(255,255,255,0.92)" : "rgba(3,7,9,0.92)";
      roundRect(c, 12, 12, 488, 232, 30);
      c.fill();
      c.lineWidth = 6;
      c.strokeStyle = dayMode ? "rgba(34,184,110,0.9)" : "rgba(52,209,134,0.85)";
      roundRect(c, 12, 12, 488, 232, 30);
      c.stroke();
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "800 176px 'Space Grotesk', 'Courier New', monospace";
      c.fillStyle = dayMode ? "#0c7a45" : "#a6ffd8";
      c.fillText(s, 256, 140);
      clockTex.needsUpdate = true;
    };
    drawClock();
    const clockMat = track(
      new THREE.MeshBasicMaterial({
        map: clockTex,
        color: new THREE.Color(2.2, 2.2, 2.2),
        transparent: true,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      }),
    );
    const clockSign = new THREE.Mesh(track(new THREE.PlaneGeometry(22, 11)), clockMat);
    clockSign.position.set(0, 76, -120); // manji, u sredini, visoko (ispod loga)
    clockSign.rotation.y = 0;
    scene.add(clockSign);

    /* ---------- cesta ---------- */
    const groundMat = track(
      new THREE.MeshStandardMaterial({ color: 0x03050a, metalness: 0.92, roughness: 0.32, envMapIntensity: 1.2 }),
    );
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
    const DEPTH = 320;
    const COUNT = isMobile ? 46 : 74;
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
        b.beacon.visible = !dayMode && h > 30;
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
        metalness: 0.45,
        roughness: 0.58,
        envMapIntensity: 0.3,
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

    const bodyGeo = track(new RoundedBoxGeometry(1.95, 0.82, 3.9, 4, 0.34));
    const bodyMat = track(
      new THREE.MeshStandardMaterial({ color: 0x04060b, metalness: 0.92, roughness: 0.3, envMapIntensity: 0.9 }),
    );
    const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, CAR_N);
    bodies.frustumCulled = false;
    scene.add(bodies);

    const cabinGeo = track(new RoundedBoxGeometry(1.62, 0.62, 2.0, 4, 0.3));
    const cabinMat = track(
      new THREE.MeshStandardMaterial({ color: 0x0a1017, metalness: 0.65, roughness: 0.22, envMapIntensity: 1.0 }),
    );
    const cabins = new THREE.InstancedMesh(cabinGeo, cabinMat, CAR_N);
    cabins.frustumCulled = false;
    scene.add(cabins);

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

    type Car = { x: number; z: number; speed: number; head: boolean; dir: number };
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
        // u dan modu desne trake voze u suprotnom smjeru (dvosmjerni promet); noć ostaje ista
        dir: head ? 1 : dayMode ? -1 : 1,
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

    /* ---------- kiša ---------- */
    const RAIN = isMobile ? 90 : 240;
    const rainPos = new Float32Array(RAIN * 6);
    const rainVel = new Float32Array(RAIN);
    for (let i = 0; i < RAIN; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = Math.random() * 62;
      const z = 12 - Math.random() * 130;
      const len = 1.3 + Math.random() * 1.9;
      rainPos[i * 6] = x;
      rainPos[i * 6 + 1] = y + len;
      rainPos[i * 6 + 2] = z;
      rainPos[i * 6 + 3] = x;
      rainPos[i * 6 + 4] = y;
      rainPos[i * 6 + 5] = z;
      rainVel[i] = 42 + Math.random() * 34;
    }
    const rainGeo = track(new THREE.BufferGeometry());
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    const rainMat = track(
      new THREE.LineBasicMaterial({
        color: 0x9ec9ff,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const rain = new THREE.LineSegments(rainGeo, rainMat);
    rain.frustumCulled = false;
    scene.add(rain);

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

    /* ---------- dan/noć prema stvarnom vremenu ---------- */
    const KF = [
      { h: 0, top: 0x03050c, hor: 0x0a1420, fog: 0x0a1420, amb: 0x0a1c14, ambI: 0.9, sunC: 0x22304a, sunI: 0.0, city: 1.0, celC: 0xcdd8ea, celS: 34, celOp: 0.8 },
      { h: 5, top: 0x0d1530, hor: 0x241f38, fog: 0x171426, amb: 0x161320, ambI: 0.7, sunC: 0xd97a45, sunI: 0.3, city: 0.95, celC: 0xff9a55, celS: 44, celOp: 0.85 },
      { h: 7, top: 0x1a3358, hor: 0xd06a34, fog: 0x4a3228, amb: 0x241d18, ambI: 0.85, sunC: 0xe08a4a, sunI: 0.75, city: 0.6, celC: 0xffb066, celS: 62, celOp: 0.9 },
      { h: 10, top: 0x0f2b4c, hor: 0x2f587e, fog: 0x25425e, amb: 0x24303a, ambI: 0.95, sunC: 0xdfeaf6, sunI: 1.0, city: 0.4, celC: 0xeef4fc, celS: 44, celOp: 0.85 },
      { h: 14, top: 0x102c50, hor: 0x325a82, fog: 0x25425e, amb: 0x24303a, ambI: 0.95, sunC: 0xeef4fc, sunI: 1.0, city: 0.38, celC: 0xf4f8ff, celS: 44, celOp: 0.85 },
      { h: 17, top: 0x1a3358, hor: 0xd06a34, fog: 0x4a3228, amb: 0x241d18, ambI: 0.85, sunC: 0xe08a4a, sunI: 0.72, city: 0.6, celC: 0xffb066, celS: 62, celOp: 0.9 },
      { h: 19, top: 0x12172f, hor: 0xc0501f, fog: 0x361c22, amb: 0x1c151a, ambI: 0.7, sunC: 0xe0662f, sunI: 0.4, city: 0.85, celC: 0xff7038, celS: 52, celOp: 0.85 },
      { h: 21, top: 0x05070f, hor: 0x0c1622, fog: 0x0c1622, amb: 0x0a1c14, ambI: 0.9, sunC: 0x22304a, sunI: 0.0, city: 1.0, celC: 0xcdd8ea, celS: 34, celOp: 0.8 },
      { h: 24, top: 0x03050c, hor: 0x0a1420, fog: 0x0a1420, amb: 0x0a1c14, ambI: 0.9, sunC: 0x22304a, sunI: 0.0, city: 1.0, celC: 0xcdd8ea, celS: 34, celOp: 0.8 },
    ];
    const cA = new THREE.Color();
    const cB = new THREE.Color();
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpHex = (out: THREE.Color, ha: number, hb: number, t: number) => out.copy(cA.setHex(ha)).lerp(cB.setHex(hb), t);
    const applyTime = () => {
      const d = new Date();
      const hour = d.getHours() + d.getMinutes() / 60;
      let a = KF[0];
      let b = KF[KF.length - 1];
      for (let i = 0; i < KF.length - 1; i++) {
        if (hour >= KF[i].h && hour <= KF[i + 1].h) {
          a = KF[i];
          b = KF[i + 1];
          break;
        }
      }
      const t = b.h === a.h ? 0 : (hour - a.h) / (b.h - a.h);
      lerpHex(skyMat.uniforms.uTop.value, a.top, b.top, t);
      lerpHex(skyMat.uniforms.uHorizon.value, a.hor, b.hor, t);
      lerpHex(scene.background as THREE.Color, a.hor, b.hor, t);
      lerpHex((scene.fog as THREE.Fog).color, a.fog, b.fog, t);
      lerpHex(ambient.color, a.amb, b.amb, t);
      ambient.intensity = lerp(a.ambI, b.ambI, t);
      lerpHex(sunLight.color, a.sunC, b.sunC, t);
      sunLight.intensity = lerp(a.sunI, b.sunI, t);
      const city = lerp(a.city, b.city, t);
      for (const bd of buildings) bd.mat.emissiveIntensity = 1.6 * city;
      lerpHex(celMat.color, a.celC, b.celC, t);
      celMat.opacity = lerp(a.celOp, b.celOp, t);
      cel.scale.setScalar(lerp(a.celS, b.celS, t));
      let cx: number;
      let cy: number;
      if (hour >= 6 && hour <= 20) {
        const p = (hour - 6) / 14;
        cx = -150 + p * 300;
        cy = 18 + Math.sin(Math.PI * p) * 178;
      } else {
        const nh = hour < 6 ? hour + 24 : hour;
        const p = Math.min(1, Math.max(0, (nh - 20) / 10));
        cx = -140 + p * 280;
        cy = 28 + Math.sin(Math.PI * p) * 140;
      }
      cel.position.set(cx, cy, -330);
      sunLight.position.set(cx, Math.max(20, cy), -120);
    };
    // "Dan" mod: zaključaj scenu na vedar dan (svijetla tema stranice).
    const applyDayMode = () => {
      renderer.toneMappingExposure = 1.16;
      // nebo + magla — vedar dan, daleke zgrade blijede u svijetlu izmaglicu
      skyMat.uniforms.uTop.value.setHex(0x3f8ed4);
      skyMat.uniforms.uHorizon.value.setHex(0xdcebf5);
      (scene.background as THREE.Color).setHex(0xd0e3ef);
      (scene.fog as THREE.Fog).color.setHex(0xdbe9f2);
      // svjetlo — jak ambient + sunce, bez zelene ispune
      ambient.color.setHex(0xd6e6f4);
      ambient.intensity = 1.55;
      key.color.setHex(0xffffff);
      key.intensity = 6;
      sunLight.color.setHex(0xfff3de);
      sunLight.intensity = 2.6;
      sunLight.position.set(150, 165, -120);
      // zgrade — obasjane fasade, prozori ugašeni, rubovi blijedi, bez crvenih bljeskalica
      for (const bd of buildings) {
        bd.mat.color.setHex(0x9fb1c0);
        // zeleni okviri prozora (boja teme) — vidljivi i danju
        bd.mat.emissive.setHex(NEON);
        bd.mat.emissiveIntensity = 0.95;
        bd.mat.metalness = 0.14;
        bd.mat.roughness = 0.92;
        bd.mat.envMapIntensity = 0.45;
        bd.mat.needsUpdate = true;
        if (bd.beacon) bd.beacon.visible = false;
      }
      // suptilni zeleni rubovi zgrada (boja teme)
      edgeMat.color.setHex(NEON);
      edgeMat.opacity = 0.16;
      // auti — svjetliji, farovi prigušeni (suha cesta, dan)
      bodyMat.color.setHex(0x8b96a3);
      bodyMat.metalness = 0.55;
      bodyMat.roughness = 0.42;
      cabinMat.color.setHex(0x9aa6b4);
      // cesta — suhi dnevni asfalt (sivi), bez zrcalnog sjaja
      groundMat.color.setHex(0x717c86);
      groundMat.metalness = 0.08;
      groundMat.roughness = 0.96;
      groundMat.envMapIntensity = 0.25;
      groundMat.needsUpdate = true;
      // dnevna svjetla: prigušeno bijelo (dolaze) / crveno (odlaze) — da se vidi smjer
      const dayWhite = new THREE.Color(0.9, 0.9, 0.85);
      const dayRed = new THREE.Color(0.95, 0.28, 0.22);
      for (let i = 0; i < CAR_N; i++) {
        const c = cars[i].head ? dayWhite : dayRed;
        lights.setColorAt(i * 2, c);
        lights.setColorAt(i * 2 + 1, c);
      }
      if (lights.instanceColor) lights.instanceColor.needsUpdate = true;
      // sunce (sprite) fiksno visoko desno
      celMat.color.setHex(0xffffff);
      cel.scale.setScalar(40);
      cel.position.set(150, 175, -330);
      // manje bloom-a i cinematic gradinga (nije noćna atmosfera)
      bloom.strength = 0.1;
      bloom.radius = 0.4;
      gradePass.uniforms.uVignette.value = 0.1;
      gradePass.uniforms.uGrain.value = 0.01;
      gradePass.uniforms.uAberration.value = 0;
      gradePass.uniforms.uGrade.value = 0;
      // sakrij noćne elemente (kiša, iskre, horizont glow, mokri odsjaji)
      rain.visible = false;
      embers.visible = false;
      horizon.visible = false;
      pools.visible = false;
      refl.visible = false;
      // natpisi — kao dnevne reklame, bez sjaja
      for (const s of signs) (s.mesh.material as THREE.MeshBasicMaterial).color.setRGB(0.92, 0.92, 0.92);
      // sat — svijetli panel danju
      clockMat.color.setRGB(1, 1, 1);
      drawClock();
    };

    let timeTimer: ReturnType<typeof setInterval> | null = null;
    if (dayMode) {
      applyDayMode();
    } else {
      applyTime();
      timeTimer = setInterval(applyTime, 60000);
    }

    /* ---------- animacija ---------- */
    const clock = new THREE.Clock();
    let motionTime = 0;
    let lastMin = -1;
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

      const dNow = new Date();
      const curMin = dNow.getHours() * 60 + dNow.getMinutes();
      if (curMin !== lastMin) {
        lastMin = curMin;
        drawClock();
      }

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
        car.z += car.dir * car.speed * mdt;
        if (car.dir > 0) {
          if (car.z > 26) car.z = -DEPTH - Math.random() * 30;
        } else if (car.z < -DEPTH - 30) {
          car.z = 26 + Math.random() * 20;
        }
        // tijelo
        dummy.position.set(car.x, 0.36, car.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        bodies.setMatrixAt(i, dummy.matrix);
        // kabina
        dummy.position.set(car.x, 0.9, car.z - 0.25);
        dummy.updateMatrix();
        cabins.setMatrixAt(i, dummy.matrix);
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
      cabins.instanceMatrix.needsUpdate = true;
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

      const rp = rainGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < RAIN; i++) {
        const fall = rainVel[i] * dt;
        const topY = rp.getY(i * 2) - fall;
        const botY = rp.getY(i * 2 + 1) - fall;
        const z = rp.getZ(i * 2) + scroll;
        if (botY < 0 || z > 22) {
          const x = (Math.random() - 0.5) * 80;
          const ny = 42 + Math.random() * 18;
          const nz = -50 - Math.random() * 80;
          const len = 1.3 + Math.random() * 1.9;
          rp.setXYZ(i * 2, x, ny + len, nz);
          rp.setXYZ(i * 2 + 1, x, ny, nz);
        } else {
          rp.setY(i * 2, topY);
          rp.setZ(i * 2, z);
          rp.setY(i * 2 + 1, botY);
          rp.setZ(i * 2 + 1, z);
        }
      }
      rp.needsUpdate = true;

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
      if (timeTimer) clearInterval(timeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      io.disconnect();
      bodies.dispose();
      cabins.dispose();
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
