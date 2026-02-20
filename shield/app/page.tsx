'use client'

import Link from "next/link"
import { useEffect, useRef } from "react"

type Card = { index: string; title: string; text: string; href: string; img: string }

function ResearchCard({ c }: { c: Card }) {
  return (
    <article className="overflow-hidden bg-[#0f5460]">
      <div className="overflow-hidden">
        <img
          src={c.img}
          alt={c.title}
          className="block aspect-[16/10] w-full object-cover grayscale-[40%]"
        />
      </div>
      <div className="px-5 py-4">
        <div className="mb-4 font-mono text-[28px] font-semibold tracking-[-0.01em] text-white/30 leading-none">
          {c.index}
        </div>
        <h3 className="mb-3 font-sans text-[14px] font-semibold leading-snug text-white tracking-[-0.01em]">
          {c.title}
        </h3>
        <p className="mb-5 text-[13px] leading-[1.65] text-white/65 font-sans">
          {c.text}
        </p>
        <Link href={c.href} className="font-mono text-[10px] tracking-[0.14em] text-white/45 border-b border-white/15 pb-px">
          Explore →
        </Link>
      </div>
    </article>
  )
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    let alive = true, raf = 0
    let innerCleanup: (() => void) | null = null
    let ro: ResizeObserver | null = null
    let io: IntersectionObserver | null = null
    let isPaused = false

    ;(async () => {
      try {
        const THREE = await import("three")
        const canvas = canvasRef.current!
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000)
        camera.position.z = 5.5
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)

        const resize = () => {
          const rect = canvas.getBoundingClientRect()
          const w = Math.max(1, Math.floor(rect.width))
          const h = Math.max(1, Math.floor(rect.height))
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
        resize()
        try { ro = new ResizeObserver(() => resize()); ro.observe(canvas) }
        catch { window.addEventListener("load", resize) }

        const sphereScale = 0.62
        const sphereGroup = new THREE.Group()
        const color = 0x0b1f24

        const geoOuter = new THREE.IcosahedronGeometry(1.7 * sphereScale, 2)
        const matOuter = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.07 })
        const meshOuter = new THREE.Mesh(geoOuter, matOuter)
        sphereGroup.add(meshOuter)

        const geoInner = new THREE.IcosahedronGeometry(1.1 * sphereScale, 4)
        const matInner = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.06 })
        const meshInner = new THREE.Mesh(geoInner, matInner)
        sphereGroup.add(meshInner)

        const ringGeo = new THREE.RingGeometry(1.85 * sphereScale, 1.87 * sphereScale, 96)
        const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.025, side: THREE.DoubleSide })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 2
        sphereGroup.add(ring)

        sphereGroup.position.x = 2.65
        sphereGroup.position.y = 0.10
        scene.add(sphereGroup)

        const animate = () => {
          if (!alive || isPaused) return
          meshOuter.rotation.y += 0.0016; meshOuter.rotation.x += 0.0005
          meshInner.rotation.y -= 0.0020; meshInner.rotation.z += 0.0007
          ring.rotation.z += 0.00035
          renderer.render(scene, camera)
          raf = requestAnimationFrame(animate)
        }

        const rect = canvas.getBoundingClientRect()
        isPaused = !(rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight))

        io = new IntersectionObserver((entries) => {
          const e = entries[0]; if (!e) return
          if (e.isIntersecting) { if (isPaused) { isPaused = false; raf = requestAnimationFrame(animate) } }
          else { if (!isPaused) { isPaused = true; cancelAnimationFrame(raf) } }
        }, { threshold: 0.01 })
        try { io.observe(canvas) } catch {}
        if (!isPaused) raf = requestAnimationFrame(animate)
        window.addEventListener("resize", resize)

        innerCleanup = () => {
          alive = false; cancelAnimationFrame(raf)
          window.removeEventListener("resize", resize); window.removeEventListener("load", resize)
          ro?.disconnect(); io?.disconnect()
          geoOuter.dispose(); matOuter.dispose(); geoInner.dispose(); matInner.dispose()
          ringGeo.dispose(); ringMat.dispose(); renderer.dispose()
          ;(renderer as any).forceContextLoss?.()
        }
      } catch (err) { console.error("Failed to init 3D canvas:", err) }
    })()

    return () => { try { innerCleanup?.() } catch {}; cancelAnimationFrame(raf) }
  }, [])

  const container = "mx-auto w-full max-w-[1240px] px-6 lg:px-10"
  const teal = "bg-[#0f5460]"

  return (
    <div className="min-h-screen bg-white text-neutral-900">

      {/* HEADER */}
      <header className={`fixed inset-x-0 top-0 z-50 ${teal} border-b border-white/10`}>
        <div className="border-b border-white/10 bg-[#0a3d47]">
          <div className={`${container} py-[5px]`}>
            <div className="font-mono text-[10px] tracking-[0.08em] text-white/60">
              Est. 2024 · Lima, Peru · 3 Active Research Lines ·{" "}
              <a className="underline underline-offset-4 hover:text-white/80" href="mailto:contact@ometeotl.org">contact@ometeotl.org</a>
            </div>
          </div>
        </div>
        <div className={`${container} h-14 flex items-center justify-between`}>
          <Link href="/" className="font-sans text-[13px] font-semibold tracking-[0.18em] text-white uppercase">OMETEOTL</Link>
          <nav className="flex items-center gap-7">
            {["About", "Research", "Services"].map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`} className="font-sans text-[12px] tracking-[0.06em] text-white/75 hover:text-white transition-colors">{s}</a>
            ))}
            <Link href="/resources" className="font-sans text-[12px] tracking-[0.06em] text-white/75 hover:text-white transition-colors">Resources</Link>
            <Link href="/contact" className="font-sans text-[12px] tracking-[0.06em] text-white/75 hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* HERO — 70vh, no scroll ornament */}
      <section id="top" className={`relative min-h-[70vh] overflow-hidden ${teal} pt-20`}>
        <div className="absolute inset-0">
          <canvas ref={canvasRef} width={1} height={1} className="h-full w-full block" />
        </div>
        <div className="relative z-10 min-h-[70vh] flex items-center">
          <div className={container}>
            <div className="max-w-[52ch]">
              <h1 className="font-sans text-[36px] md:text-[40px] font-semibold tracking-[-0.02em] leading-[1.04] text-white">
                OMETEOTL
              </h1>
              <div className="mt-4 h-[1px] w-10 bg-white/35" />
              <p className="mt-4 font-sans text-[14px] md:text-[15px] leading-[1.6] text-white/65">
                AI Risk & Epistemic Reliability Lab — Latin America
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-neutral-200 bg-white py-20 md:py-24">
        <div className={container}>
          <div className="max-w-[68ch]">
            <div className="mb-6 font-mono text-[10px] tracking-[0.22em] text-[#0f5460] uppercase font-semibold">About</div>
            <h2 className="font-sans text-[26px] md:text-[30px] font-semibold leading-[1.12] text-neutral-900 tracking-[-0.015em]">
              Ometeotl is a Latin America–focused applied research lab advancing AI risk oversight, institutional accountability, and epistemic reliability
            </h2>
            <div className="mt-6 space-y-4">
              <p className="font-sans text-[14px] leading-[1.75] text-neutral-600 max-w-[66ch]">We examine how probabilistic AI systems—particularly large-scale language and decision-support models—reconfigure standards of evidence, authority, and responsibility within public and organizational institutions.</p>
              <p className="font-sans text-[14px] leading-[1.75] text-neutral-600 max-w-[66ch]">Our research integrates epistemic analysis, institutional design, and contextual adaptation to identify the conditions under which AI-assisted processes remain robust under uncertainty and model failure.</p>
              <p className="font-sans text-[14px] leading-[1.75] text-neutral-600 max-w-[66ch]">We develop analytically grounded oversight frameworks that translate technical limitations into operational governance structures. Grounded in regional institutional realities, our work advances accountable, resilient AI deployment across diverse socio-technical environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research" className="border-y border-neutral-200 bg-[#f4f4f2] py-20 md:py-24">
        <div className={container}>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[10px] tracking-[0.22em] text-[#0f5460] uppercase font-semibold">Research</div>
            <span className="font-mono text-[10px] tracking-[0.14em] text-neutral-400">3 active lines</span>
          </div>
          <h2 className="mt-4 mb-8 max-w-[34ch] font-sans text-[26px] md:text-[30px] font-semibold leading-[1.12] text-neutral-900 tracking-[-0.015em]">
            Research that holds in deployment
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { index: "01", title: "AI Risk & Epistemic Reliability", text: "Mapping systemic capability risks and the epistemic conditions under which AI-assisted processes remain robust, auditable, and decision-relevant.", href: "/research/ai-risk-epistemic-reliability", img: "/images/research/ai-risk.png" },
              { index: "02", title: "Governance & Institutional Accountability", text: "Designing decision-right structures, escalation pathways, documentation standards, and oversight mechanisms that embed AI systems within accountable institutional workflows.", href: "/research/governance-institutional-accountability", img: "/images/research/governance.png" },
              { index: "03", title: "Contextual Epistemic Adaptation & Cross-Cultural AI Systems", text: "Analyzing how AI systems interact with diverse linguistic, cultural, and institutional epistemologies—and developing integration models for context-sensitive, socially legitimate deployment.", href: "/research/contextual-epistemic-adaptation", img: "/images/research/contextual.png" },
            ].map((c) => <ResearchCard key={c.index} c={c} />)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-b border-neutral-200 bg-white py-20 md:py-24">
        <div className={container}>
          <div className="max-w-[68ch]">
            <div className="mb-6 font-mono text-[10px] tracking-[0.22em] text-[#0f5460] uppercase font-semibold">Services</div>
            <h2 className="font-sans text-[26px] md:text-[30px] font-semibold leading-[1.12] text-neutral-900 tracking-[-0.015em]">
              Responsible AI integration frameworks
            </h2>
            <div className="mt-6 space-y-4">
              <p className="font-sans text-[14px] leading-[1.75] text-neutral-600 max-w-[66ch]">We design and implement responsible AI integration frameworks for public institutions, NGOs, and private organizations—covering governance design, technical risk evaluation, and operational oversight.</p>
              <p className="font-sans text-[14px] leading-[1.75] text-neutral-600 max-w-[66ch]">Our engagements span the full AI adoption lifecycle: epistemic risk diagnostics, model and data documentation standards, evaluation protocol design, red-teaming coordination, and deployment monitoring. We map socio-technical failure modes, structure accountability pathways, and embed escalation and audit mechanisms into institutional workflows.</p>
              <p className="font-sans text-[14px] leading-[1.75] text-neutral-600 max-w-[66ch]">Our objective is institutional robustness—ensuring AI systems enhance decision quality and public trust without degrading accountability, human agency, or epistemic standards.</p>
            </div>
            <div className="mt-7">
              <Link href="/services" className="font-mono text-[10px] tracking-[0.14em] text-[#0f5460] underline decoration-[#0f5460]/35 underline-offset-[6px] hover:decoration-[#0f5460]/65">View services →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={teal}>
        <div className={`${container} py-14 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-end`}>
          <div>
            <div className="font-mono text-[10px] tracking-[0.28em] text-white/45 uppercase mb-3">OMETEOTL</div>
            <p className="font-sans text-[13px] text-white/75 mb-1">AI Risk & Epistemic Reliability Lab</p>
            <p className="font-sans text-[13px] text-white/75 mb-4">Lima, Peru</p>
            <a href="mailto:contact@ometeotl.org" className="font-mono text-[11px] tracking-[0.1em] text-white/55 underline decoration-white/20 underline-offset-[5px] hover:text-white/75">contact@ometeotl.org</a>
          </div>
          <div className="font-mono text-[10px] tracking-[0.14em] text-white/30 uppercase">© 2026 Ometeotl</div>
        </div>
      </footer>
    </div>
  )
}