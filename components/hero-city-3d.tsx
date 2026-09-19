"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const BG = 0x04060a;
const NEON = 0x34d186;

function makeGridTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(52,209,134,0.9)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(90, 90);
  return tex;
}

function makeWindowTexture() {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 32, 64);
  for (let y = 5; y < 62; y += 8) {
    for (let x = 5; x < 30; x += 9) {
      if (Math.random() > 0.4) {
        ctx.fillStyle = Math.random() > 0.35 ? "rgba(52,209,134,0.95)" : "rgba(150,245,205,0.7)";
        ctx.fillRect(x, y, 4, 5);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

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
      return; // WebGL nije dostupan — hero ostaje crn
    }
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.03);

    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 320);
    camera.position.set(0, 7, 18);
    camera.lookAt(0, 6, -50);

    scene.add(new THREE.AmbientLight(0x0a2016, 1.4));
    const key = new THREE.PointLight(NEON, 60, 160);
    key.position.set(0, 22, -35);
    scene.add(key);

    // --- pod (neon mreža) ---
    const gridTex = makeGridTexture();
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(700, 700),
      new THREE.MeshBasicMaterial({ map: gridTex, transparent: true, opacity: 0.85 }),
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // --- zgrade ---
    const DEPTH = 280;
    const COUNT = isMobile ? 42 : 68;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: NEON, transparent: true, opacity: 0.5 });

    type B = { mesh: THREE.Mesh; edges: THREE.LineSegments; mat: THREE.MeshStandardMaterial };
    const buildings: B[] = [];

    const placeBuilding = (b: B, zStart: boolean) => {
      const h = 6 + Math.random() * 36;
      const w = 4 + Math.random() * 5;
      const d = 4 + Math.random() * 5;
      const side = Math.random() > 0.5 ? -1 : 1;
      const x = side * (7 + Math.random() * 48);
      const z = zStart ? -Math.random() * DEPTH : b.mesh.position.z - DEPTH - Math.random() * 24;
      b.mesh.scale.set(w, h, d);
      b.edges.scale.set(w, h, d);
      b.mesh.position.set(x, h / 2, z);
      b.edges.position.copy(b.mesh.position);
      const em = b.mat.emissiveMap!;
      em.repeat.set(Math.max(1, Math.round(w / 2.2)), Math.max(2, Math.round(h / 3.2)));
    };

    for (let i = 0; i < COUNT; i++) {
      const emissiveMap = makeWindowTexture();
      const mat = new THREE.MeshStandardMaterial({
        color: 0x03060a,
        emissive: 0xffffff,
        emissiveMap,
        emissiveIntensity: 1,
        metalness: 0.3,
        roughness: 0.75,
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      const edges = new THREE.LineSegments(edgesGeo, edgeMat);
      const b: B = { mesh, edges, mat };
      placeBuilding(b, true);
      scene.add(mesh);
      scene.add(edges);
      buildings.push(b);
    }

    // --- auti (svjetla) ---
    const carGeo = new THREE.SphereGeometry(0.32, 8, 8);
    const cars: { mesh: THREE.Mesh; speed: number; x: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xb9ffdd : 0xffffff });
      const mesh = new THREE.Mesh(carGeo, mat);
      const x = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 4);
      mesh.position.set(x, 0.5, -Math.random() * DEPTH);
      scene.add(mesh);
      cars.push({ mesh, speed: 24 + Math.random() * 34, x });
    }

    // --- bloom ---
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(dpr);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), isMobile ? 0.9 : 1.15, 0.75, 0.015);
    composer.addPass(bloom);

    // --- animacija ---
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;

    const renderFrame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const speed = 30 * dt;
      gridTex.offset.y -= dt * 0.9;
      for (const b of buildings) {
        b.mesh.position.z += speed;
        if (b.mesh.position.z > 28) placeBuilding(b, false);
        b.edges.position.copy(b.mesh.position);
      }
      for (const c of cars) {
        c.mesh.position.z += c.speed * dt;
        if (c.mesh.position.z > 24) {
          c.mesh.position.z = -DEPTH - Math.random() * 30;
          c.mesh.position.x = c.x;
        }
      }
      const t = clock.elapsedTime;
      camera.position.x = Math.sin(t * 0.13) * 1.6;
      camera.position.y = 7 + Math.sin(t * 0.28) * 0.5;
      camera.lookAt(0, 6, -50);
      composer.render();
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      renderFrame();
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      clock.start();
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      renderFrame(); // statični kadar
    } else {
      start();
    }

    const onResize = () => {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      buildings.forEach((b) => {
        b.mat.emissiveMap?.dispose();
        b.mat.dispose();
      });
      boxGeo.dispose();
      edgesGeo.dispose();
      edgeMat.dispose();
      carGeo.dispose();
      gridTex.dispose();
      (ground.material as THREE.Material).dispose();
      ground.geometry.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
