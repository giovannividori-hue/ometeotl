'use client'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

function ResearchCard({ c }: { c: { index: string; title: string; text: string; href: string; img: string } }) {
  const [hover, setHover] = useState(false)
  return (
    <article className="card" style={{ padding: 0, overflow: "hidden", background: "#0f5460" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ overflow: "hidden" }}>
        <img
          src={c.img}
          alt={c.title}
          style={{
            width: "100%",
            aspectRatio: "16/10",
            objectFit: "cover",
            display: "block",
            transform: hover ? "scale(1.03)" : "scale(1)",
            filter: hover ? "grayscale(0%)" : "grayscale(60%)",
            transition: "transform 260ms ease, filter 260ms ease",
          }}
        />
      </div>

      <div style={{ padding: "24px" }}>
        <div className="card-index" style={{ color: "rgba(255,255,255,0.5)" }}>{c.index} —</div>
        <h3 className="cardtitle" style={{ marginBottom: "12px", color: "#ffffff" }}>{c.title}</h3>
        <p className="cardtext" style={{ color: "rgba(255,255,255,0.75)" }}>{c.text}</p>
        <Link className="cardlink" href={c.href} style={{ color: "rgba(255,255,255,0.6)" }}>Explore →</Link>
      </div>
    </article>
  )
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let alive = true
    let raf = 0
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

        const sphereScale = 0.6
        const sphereGroup = new THREE.Group()

        const geoOuter = new THREE.IcosahedronGeometry(1.7 * sphereScale, 2)
        const matOuter = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.22 })
        const meshOuter = new THREE.Mesh(geoOuter, matOuter)
        sphereGroup.add(meshOuter)

        const geoInner = new THREE.IcosahedronGeometry(1.1 * sphereScale, 4)
        const matInner = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.22 })
        const meshInner = new THREE.Mesh(geoInner, matInner)
        sphereGroup.add(meshInner)

        const ringGeo = new THREE.RingGeometry(1.85 * sphereScale, 1.87 * sphereScale, 96)
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 2
        sphereGroup.add(ring)

        sphereGroup.position.x = 2.2
        sphereGroup.position.y = 0.15
        scene.add(sphereGroup)

        const animate = () => {
          if (!alive || isPaused) return
          meshOuter.rotation.y += 0.0018
          meshOuter.rotation.x += 0.0006
          meshInner.rotation.y -= 0.0022
          meshInner.rotation.z += 0.0008
          ring.rotation.z += 0.0004
          renderer.render(scene, camera)
          raf = requestAnimationFrame(animate)
        }

        const rect = canvas.getBoundingClientRect()
        isPaused = !(rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight))

        io = new IntersectionObserver(entries => {
          const e = entries[0]
          if (!e) return
          if (e.isIntersecting) { if (isPaused) { isPaused = false; raf = requestAnimationFrame(animate) } }
          else { if (!isPaused) { isPaused = true; cancelAnimationFrame(raf) } }
        }, { threshold: 0.01 })
        try { io.observe(canvas) } catch (err) {}

        if (!isPaused) raf = requestAnimationFrame(animate)
        window.addEventListener("resize", resize)

        innerCleanup = () => {
          alive = false
          cancelAnimationFrame(raf)
          window.removeEventListener("resize", resize)
          window.removeEventListener('load', resize)
          if (ro) ro.disconnect()
          if (io) io.disconnect()
          geoOuter.dispose(); matOuter.dispose()
          geoInner.dispose(); matInner.dispose()
          ringGeo.dispose(); ringMat.dispose()
          renderer.dispose()
          ;(renderer as any).forceContextLoss?.()
        }
      } catch (err) {
        console.error('Failed to init 3D canvas:', err)
      }
    })()

    return () => {
      try { innerCleanup?.() } catch (e) {}
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a" }}>

      {/* ── HEADER — institutional charcoal (sticky); teal identity strip retained above ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, /* CHANGED: sticky header to create an institutional bar */
        background: "var(--ui-charcoal)", /* use --ui-charcoal for navbar background */
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        {/* Institutional data bar */}
        <div style={{
          background: "var(--ui-charcoal)", /* CHANGED: top strip now uses charcoal, not teal */
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "5px 40px",
        }}>
          <div style={{
            maxWidth: "var(--max-wide)", margin: "0 auto",
            color: "rgba(255,255,255,0.75)", /* top strip text per spec */
            fontFamily: "monospace", fontSize: "10px",
            letterSpacing: "0.06em"
          }}>
            Est. 2024 · Lima, Peru · 3 Active Research Lines ·{" "}
            <a href="mailto:contact@ometeotl.org" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "underline" }}>
              contact@ometeotl.org
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div style={{
          maxWidth: "var(--max-wide)", margin: "0 auto",
          padding: "0 40px", height: "56px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            letterSpacing: "0.14em",
            color: "#ffffff",
            textTransform: "uppercase",
            fontWeight: 700,
            textDecoration: "none",
          }}>
            OMETEOTL
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {["About", "Research", "Services"].map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} className="nav-link" style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                textDecoration: "none",
              }}>{s}</a>
            ))}
            <Link href="/resources" className="nav-link" style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
            }}>Resources</Link>
            <Link href="/contact" className="nav-link" style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              textDecoration: "none",
            }}>Contact</Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="top" style={{
        position: "relative",
        minHeight: "85vh",
        overflow: "hidden",
        paddingTop: "88px",
        background: "#0f5460"
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <canvas ref={canvasRef} width={1} height={1} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>

        <div style={{
          position: "relative", zIndex: 10,
          minHeight: "85vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 40px",
        }}>
          <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "left", width: "100%" }}>
            <h1 style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              lineHeight: 1.02,
              marginBottom: "8px",
            }}>
              OMETEOTL
            </h1>

            <div style={{
              margin: "12px 0",
              width: "48px", height: "2px",
              background: "#0f5460",
            }} />

            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.6,
              marginTop: "6px",
            }}>
              AI Risk & Epistemic Reliability Lab — Latin America
            </p>
          </div>

          <div style={{
            position: "absolute", bottom: "36px",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "8px",
          }}>
            <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "#aaaaaa", fontFamily: "monospace" }}>SCROLL</div>
            <div style={{ width: "1px", height: "36px", background: "#cccccc" }} />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ width: "100%", padding: "72px 0", background: "#ffffff", borderTop: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: "var(--max-text)", margin: "0 auto", padding: "0 40px" }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#0f5460",
            textTransform: "uppercase",
            marginBottom: "32px",
            fontWeight: 600,
          }}>About</div>

          <h2 style={{ marginBottom: "28px", lineHeight: 1.15 }}>
            Ometeotl is a Latin America–focused applied research lab advancing AI risk oversight, institutional accountability, and epistemic reliability
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#333333" }}>
              We examine how probabilistic AI systems—particularly large-scale language and decision-support models—reconfigure standards of evidence, authority, and responsibility within public and organizational institutions.
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#333333" }}>
              Our research integrates epistemic analysis, institutional design, and contextual adaptation to identify the conditions under which AI-assisted processes remain robust under uncertainty and model failure.
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#333333" }}>
              We develop analytically grounded oversight frameworks that translate technical limitations into operational governance structures. Grounded in regional institutional realities, our work advances accountable, resilient AI deployment across diverse socio-technical environments.
            </p>
          </div>
        </div>
      </section>

      {/* ── RESEARCH ── */}
      <section id="research" style={{
        width: "100%",
        background: "#f7f7f5",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
        padding: "56px 0 72px",
      }}>
        <div style={{ maxWidth: "var(--max-wide)", margin: "0 auto", padding: "0 40px" }}>
          <div style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            marginBottom: "0",
          }}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "#0f5460",
              textTransform: "uppercase",
              fontWeight: 600,
            }}>Research</div>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "#999999",
              letterSpacing: "0.1em",
            }}>
              3 active lines
            </span>
          </div>

          <h2 style={{ margin: "16px 0 40px", maxWidth: "520px", lineHeight: 1.15 }}>
            Research that holds in deployment
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}>
            {[
              {
                index: "01",
                title: "AI Risk & Epistemic Reliability",
                text: "Mapping systemic capability risks and the epistemic conditions under which AI-assisted processes remain robust, auditable, and decision-relevant.",
                href: "/research/ai-risk-epistemic-reliability",
                img: "/images/research/ai-risk.png",
              },
              {
                index: "02",
                title: "Governance & Institutional Accountability",
                text: "Designing decision-right structures, escalation pathways, documentation standards, and oversight mechanisms that embed AI systems within accountable institutional workflows.",
                href: "/research/governance-institutional-accountability",
                img: "/images/research/governance.png",
              },
              {
                index: "03",
                title: "Contextual Epistemic Adaptation & Cross-Cultural AI Systems",
                text: "Analyzing how AI systems interact with diverse linguistic, cultural, and institutional epistemologies—and developing integration models for context-sensitive, socially legitimate deployment.",
                href: "/research/contextual-epistemic-adaptation",
                img: "/images/research/contextual.png",
              },
            ].map(c => (
              <ResearchCard key={c.index} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ width: "100%", padding: "72px 0", background: "#ffffff", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: "var(--max-text)", margin: "0 auto", padding: "0 40px" }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#0f5460",
            textTransform: "uppercase",
            marginBottom: "32px",
            fontWeight: 600,
          }}>Services</div>

          <h2 style={{ marginBottom: "28px", lineHeight: 1.15 }}>
            Responsible AI integration frameworks
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#333333" }}>
              We design and implement responsible AI integration frameworks for public institutions, NGOs, and private organizations—covering governance design, technical risk evaluation, and operational oversight.
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#333333" }}>
              Our engagements span the full AI adoption lifecycle: epistemic risk diagnostics, model and data documentation standards, evaluation protocol design, red-teaming coordination, and deployment monitoring. We map socio-technical failure modes, structure accountability pathways, and embed escalation and audit mechanisms into institutional workflows.
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#333333" }}>
              Our objective is institutional robustness—ensuring AI systems enhance decision quality and public trust without degrading accountability, human agency, or epistemic standards.
            </p>
          </div>

          <div style={{ marginTop: "32px" }}>
            <Link href="/services" style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              color: "#0f5460",
              textDecoration: "none",
              borderBottom: "1px solid #0f5460",
              paddingBottom: "2px",
            }}>View services →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#202124" }}>
        <div style={{
          maxWidth: "var(--max-wide)",
          margin: "0 auto",
          padding: "56px 40px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: "40px",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.90)", /* CHANGED: primary footer label uses near-white */
              textTransform: "uppercase",
              marginBottom: "16px",
            }}>
              OMETEOTL
            </div>
            <p style={{ fontSize: "0.8125rem", marginBottom: "6px", color: "rgba(255,255,255,0.70)", fontFamily: "Georgia, serif" }}>AI Risk & Epistemic Reliability Lab</p>
            <p style={{ fontSize: "0.8125rem", marginBottom: "16px", color: "rgba(255,255,255,0.70)", fontFamily: "Georgia, serif" }}>Lima, Peru</p>
            <a
              href="mailto:contact@ometeotl.org"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.70)", /* CHANGED: secondary footer/contact text uses text-white/70 */
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                paddingBottom: "2px",
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              contact@ometeotl.org
            </a>
          </div>

          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.70)", /* CHANGED: secondary footer text */
            textTransform: "uppercase",
          }}>
            © 2026 Ometeotl
          </div>
        </div>
      </footer>
    </div>
  )
}