'use client'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let alive = true
    let raf = 0

    ;(async () => {
      const THREE = await import("three")

      const canvas = canvasRef.current!
      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000)
      camera.position.z = 5.5

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x080808, 1)

      const resize = () => {
        const rect = canvas.getBoundingClientRect()
        const w = Math.max(1, Math.floor(rect.width))
        const h = Math.max(1, Math.floor(rect.height))
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()

      /* ── outer wireframe shell ── */
      const geoOuter = new THREE.IcosahedronGeometry(1.7, 2)
      const matOuter = new THREE.MeshBasicMaterial({
        color: 0x1a3d38,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      })
      const meshOuter = new THREE.Mesh(geoOuter, matOuter)
      scene.add(meshOuter)

      /* ── inner denser shell ── */
      const geoInner = new THREE.IcosahedronGeometry(1.1, 4)
      const matInner = new THREE.MeshBasicMaterial({
        color: 0x3d8f80,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      })
      const meshInner = new THREE.Mesh(geoInner, matInner)
      scene.add(meshInner)

      /* ── equatorial ring ── */
      const ringGeo = new THREE.RingGeometry(1.85, 1.87, 96)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2d6b62,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      scene.add(ring)

      const animate = () => {
        if (!alive) return
        meshOuter.rotation.y += 0.0018
        meshOuter.rotation.x += 0.0006
        meshInner.rotation.y -= 0.0022
        meshInner.rotation.z += 0.0008
        ring.rotation.z += 0.0004
        renderer.render(scene, camera)
        raf = requestAnimationFrame(animate)
      }
      raf = requestAnimationFrame(animate)

      window.addEventListener("resize", resize)

      return () => {
        alive = false
        cancelAnimationFrame(raf)
        window.removeEventListener("resize", resize)
        geoOuter.dispose(); matOuter.dispose()
        geoInner.dispose(); matInner.dispose()
        ringGeo.dispose();  ringMat.dispose()
        renderer.dispose()
        ;(renderer as any).forceContextLoss?.()
      }
    })()

    return () => { cancelAnimationFrame(raf) }
  }, [])

  const ResearchCard: React.FC<{c: {index: string, title: string, text: string, href: string, img: string}}> = ({ c }) => {
    const [hover, setHover] = useState(false)
    return (
      <article className="card" style={{ padding: 0, overflow: "hidden" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
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
          <div className="card-index">{c.index} —</div>
          <h3 className="cardtitle" style={{ marginBottom: "12px" }}>{c.title}</h3>
          <p className="cardtext">{c.text}</p>
          <Link className="cardlink" href={c.href}>Explore →</Link>
        </div>
      </article>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 50,
        borderBottom: "1px solid var(--rule)",
        background: "rgba(8,8,8,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}>
        <div style={{
          maxWidth: "var(--max-wide)", margin: "0 auto",
          padding: "0 40px", height: "60px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            color: "var(--fg)",
            textTransform: "uppercase",
          }}>
            OMETEOTL
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {["About", "Research", "Services"].map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} className="navlink">{s}</a>
            ))}
            <Link href="/resources" className="navlink">Resources</Link>
            <Link href="/contact" className="navlink">Contact</Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────── */}
      <section id="top" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>

        {/* gradient vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(8,8,8,0.65) 100%)",
          pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 40px",
        }}>
          <div style={{ maxWidth: "640px" }}>
            <div className="label" style={{ marginBottom: "28px", opacity: 0.5 }}>
              Lima, Peru — Est. 2024
            </div>

            <h1 style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              lineHeight: 1.05,
            }}>
              OMETEOTL
            </h1>

            <div style={{
              margin: "24px auto",
              width: "40px", height: "1px",
              background: "var(--accent)",
              opacity: 0.5,
            }} />

            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              color: "var(--fg-mid)",
              textTransform: "uppercase",
              lineHeight: 1.8,
            }}>
              AI Risk &amp; Epistemic Reliability Lab<br />
              Latin America
            </p>
          </div>

          {/* scroll indicator */}
          <div style={{
            position: "absolute", bottom: "36px",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "8px",
          }}>
            <div className="label" style={{ opacity: 0.3, fontSize: "0.55rem" }}>Scroll</div>
            <div style={{ width: "1px", height: "36px", background: "var(--rule-mid)" }} />
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────── */}
      <section id="about" style={{
        maxWidth: "var(--max-text)",
        margin: "0 auto",
        padding: "140px 40px",
      }}>
        <div className="label" style={{ marginBottom: "40px" }}>About</div>

        <h2 style={{ marginBottom: "32px" }}>
          Ometeotl is a Latin America–focused applied research lab advancing AI risk oversight, institutional accountability, and epistemic reliability
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p>
            We examine how probabilistic AI systems—particularly large-scale language and decision-support models—reconfigure standards of evidence, authority, and responsibility within public and organizational institutions.
          </p>
          <p>
            Our research integrates epistemic analysis, institutional design, and contextual adaptation to identify the conditions under which AI-assisted processes remain robust under uncertainty and model failure.
          </p>
          <p>
            We develop analytically grounded oversight frameworks that translate technical limitations into operational governance structures. Grounded in regional institutional realities, our work advances accountable, resilient AI deployment across diverse socio-technical environments.
          </p>
        </div>
      </section>

      {/* ── RESEARCH ───────────────────────────────────── */}
      <section id="research" style={{
        maxWidth: "var(--max-wide)",
        margin: "0 auto",
        padding: "0 40px 140px",
      }}>

        {/* header row */}
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          borderTop: "1px solid var(--rule-mid)",
          paddingTop: "32px",
          marginBottom: "0",
        }}>
          <div className="label">Research</div>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--fg-low)",
            letterSpacing: "0.1em",
          }}>
            3 active lines
          </span>
        </div>

        <h2 style={{ margin: "20px 0 56px", maxWidth: "520px" }}>
          Research that holds in deployment
        </h2>

        {/* card grid — horizontal rule style */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0 48px",
        }}>
          {
            (
              [
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
              ]
            ).map(c => (
              <ResearchCard key={c.index} c={c} />
            ))
          }
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────── */}
      <section id="services" style={{
        maxWidth: "var(--max-text)",
        margin: "0 auto",
        padding: "0 40px 140px",
        borderTop: "1px solid var(--rule)",
        paddingTop: "80px",
      }}>
        <div className="label" style={{ marginBottom: "40px" }}>Services</div>

        <h2 style={{ marginBottom: "32px" }}>
          Responsible AI integration frameworks
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p>
            We design and implement responsible AI integration frameworks for public institutions, NGOs, and private organizations—covering governance design, technical risk evaluation, and operational oversight.
          </p>
          <p>
            Our engagements span the full AI adoption lifecycle: epistemic risk diagnostics, model and data documentation standards, evaluation protocol design, red-teaming coordination, and deployment monitoring. We map socio-technical failure modes, structure accountability pathways, and embed escalation and audit mechanisms into institutional workflows.
          </p>
          <p>
            Our objective is institutional robustness—ensuring AI systems enhance decision quality and public trust without degrading accountability, human agency, or epistemic standards.
          </p>
        </div>

        <div style={{ marginTop: "36px" }}>
          <Link href="/services" className="cta-link">View services →</Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--rule)" }}>
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
              color: "var(--fg)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}>
              OMETEOTL
            </div>
            <p style={{ fontSize: "0.8125rem", marginBottom: "4px" }}>AI Risk &amp; Epistemic Reliability Lab</p>
            <p style={{ fontSize: "0.8125rem", marginBottom: "16px" }}>Lima, Peru</p>
            <a
              href="mailto:contact@ometeotl.org"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                color: "var(--accent)",
                borderBottom: "1px solid rgba(200,184,154,0.25)",
                paddingBottom: "2px",
                transition: "border-color 140ms",
              }}
            >
              contact@ometeotl.org
            </a>
          </div>

          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "var(--fg-low)",
            textTransform: "uppercase",
          }}>
            © 2026 Ometeotl
          </div>
        </div>
      </footer>
    </div>
  )
}
