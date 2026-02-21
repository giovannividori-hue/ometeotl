"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas({
  className = "block h-full w-full pointer-events-none",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (didInit.current) return;
    didInit.current = true;

    let raf = 0;
    let innerCleanup: (() => void) | null = null;
    let ro: ResizeObserver | null = null;

    (async () => {
      try {
        const THREE = await import("three");

        const canvas = canvasRef.current!;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          const w = Math.max(1, Math.floor(rect.width));
          const h = Math.max(1, Math.floor(rect.height));
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };

        resize();

        // Documentary lighting (no glam)
        scene.add(new THREE.AmbientLight(0xffffff, 0.78));

        const key = new THREE.DirectionalLight(0xffffff, 0.85);
        key.position.set(3, 2, 4);
        scene.add(key);

        const rim = new THREE.DirectionalLight(0xffffff, 0.45);
        rim.position.set(-4, -1, 2);
        scene.add(rim);

        const sphereGroup = new THREE.Group();
        scene.add(sphereGroup);

        // Petrol from CSS tokens
        const css = getComputedStyle(document.documentElement);
        const petrol =
          css.getPropertyValue("--eth-petrol-120").trim() ||
          css.getPropertyValue("--eth-petrol").trim() ||
          "#00596D";

        const color = new THREE.Color(petrol);

        const geoOuter = new THREE.IcosahedronGeometry(1.6, 2);
        const matOuter = new THREE.MeshStandardMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.20,
          roughness: 1,
          metalness: 0,
        });
        sphereGroup.add(new THREE.Mesh(geoOuter, matOuter));

        const geoInner = new THREE.IcosahedronGeometry(1.05, 4);
        const matInner = new THREE.MeshStandardMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.14,
          roughness: 1,
          metalness: 0,
        });
        sphereGroup.add(new THREE.Mesh(geoInner, matInner));

        const ringGeo = new THREE.RingGeometry(1.73, 1.78, 140);
        const ringMat = new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
          roughness: 1,
          metalness: 0,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        sphereGroup.add(ring);

        camera.position.set(0, 0.06, 6.9);
        sphereGroup.scale.setScalar(0.98);

        const prefersReduced =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const animate = () => {
          sphereGroup.rotation.y += 0.0022;
          sphereGroup.rotation.x += 0.0008;
          renderer.render(scene, camera);
          raf = requestAnimationFrame(animate);
        };

        renderer.render(scene, camera);
        if (!prefersReduced) animate();

        try {
          ro = new ResizeObserver(() => {
            resize();
            renderer.render(scene, camera);
          });
          ro.observe(canvas);
        } catch {
          window.addEventListener("resize", () => {
            resize();
            renderer.render(scene, camera);
          });
        }

        innerCleanup = () => {
          cancelAnimationFrame(raf);
          ro?.disconnect();

          geoOuter.dispose();
          matOuter.dispose();
          geoInner.dispose();
          matInner.dispose();
          ringGeo.dispose();
          ringMat.dispose();

          renderer.dispose();
          (renderer as any).forceContextLoss?.();
        };
      } catch (err) {
        console.error("Failed to init 3D canvas:", err);
      }
    })();

    return () => {
      try {
        innerCleanup?.();
      } catch {}
    };
  }, []);

  return <canvas ref={canvasRef} width={1} height={1} className={className} />;
}