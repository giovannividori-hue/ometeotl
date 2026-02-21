"use client";

import Link from "next/link";
import Image from "next/image";

import HeroCanvas from "./components/HeroCanvas";
import SpecPanel from "./components/SpecPanel";
import ResearchCard, { type Card } from "./components/ResearchCard";

const HERO_IMAGE = "/hero-risk-structure.jpg";

const RESEARCH: Card[] = [
  {
    index: "01",
    title: "AI Risk & Epistemic Reliability",
    text:
      "Mapping systemic capability risks and the epistemic conditions under which AI-assisted processes remain robust, auditable, and decision-relevant.",
    href: "/research/ai-risk-epistemic-reliability",
    img: "/images/research/ai-risk.png",
  },
  {
    index: "02",
    title: "Governance & Institutional Accountability",
    text:
      "Designing decision-right structures, escalation pathways, documentation standards, and oversight mechanisms that embed AI systems within accountable workflows.",
    href: "/research/governance-institutional-accountability",
    img: "/images/research/governance.png",
  },
  {
    index: "03",
    title: "Contextual Epistemic Adaptation & Cross-Cultural AI Systems",
    text:
      "Analysing how AI systems interact with diverse linguistic, cultural, and institutional epistemologies—and developing integration models for context-sensitive deployment.",
    href: "/research/contextual-epistemic-adaptation",
    img: "/images/research/contextual.png",
  },
];

export default function Home() {
  return (
    <>
      {/* Header — strict ETH: white, thin rules; petrol as structural cue */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[var(--stroke-soft)]">
        <div className="h-[3px] bg-[var(--eth-petrol)]" />

        <div className="eth-container py-[var(--space-8)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-black/55 uppercase">
            <span>Est. 2024</span>
            <span className="text-black/25">·</span>
            <span>Lima, Peru</span>
            <span className="text-black/25">·</span>
            <span>3 active research lines</span>
            <span className="text-black/25">·</span>
            <a href="mailto:contact@ometeotl.org" className="eth-link">
              contact@ometeotl.org
            </a>
          </div>
        </div>

        <div className="eth-container h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[12px] font-semibold tracking-[0.16em] text-black uppercase"
          >
            OMETEOTL
          </Link>

          {/* Keep spacing token-driven (avoid random gaps) */}
          <nav className="flex items-center gap-[var(--space-24)]">
            {["About", "Research", "Services"].map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`} className="eth-navlink">
                {s}
              </a>
            ))}
            <Link href="/resources" className="eth-navlink">
              Resources
            </Link>
            <Link href="/contact" className="eth-navlink">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Offset under fixed header */}
      <div className="pt-[104px]">
        {/* HERO */}
        <section id="top" className="relative bg-white">
          <div className="eth-container py-[var(--space-curve-64)]">
            <div className="eth-grid items-start">
              <div className="col-span-12 lg:col-span-7">
                <div className="font-mono text-[10px] tracking-[0.22em] text-black/60 uppercase">
                  AI Risk & Epistemic Reliability Lab
                </div>

                <h1 className="mt-[var(--space-curve-24)] text-black text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.02]">
                  OMETEOTL
                </h1>

                <div className="mt-[var(--space-curve-24)] h-[1px] w-16 bg-[var(--stroke)]" />

                <p className="mt-[var(--space-curve-40)] text-black/75 text-lg leading-[1.7]">
                  Latin America · Applied Oversight · Deployment-real
                </p>

                <p className="mt-[var(--space-curve-16)] text-black/70 leading-[1.75] max-w-[62ch]">
                  Mapping systemic capability risks and institutional epistemic
                  conditions under which AI-assisted processes remain robust,
                  auditable, and decision-relevant in practice.
                </p>

                <div className="mt-[var(--space-curve-40)] flex flex-wrap items-center gap-[var(--gutter)]">
                  <a href="#research" className="eth-btn eth-btn-primary">
                    View research <span aria-hidden>→</span>
                  </a>
                  <Link href="/contact" className="eth-btn eth-btn-secondary">
                    Contact <span aria-hidden>→</span>
                  </Link>
                </div>

                <div className="mt-[var(--space-curve-48)] font-mono text-[10px] tracking-[0.22em] text-black/50 uppercase">
                  Reliability · Oversight · Deployment
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <div className="relative">
                  {/* Panel: token strokes + documentary image as subtle support */}
                  <div className="relative overflow-hidden border border-[var(--stroke)] bg-white">
                    <div className="absolute inset-0">
                      <Image
                        src={HERO_IMAGE}
                        alt=""
                        fill
                        priority
                        className="object-cover opacity-[0.10]"
                      />
                    </div>

                    <div className="relative aspect-square">
                      <HeroCanvas />
                    </div>
                  </div>

                  <div className="mt-[var(--space-curve-12)] flex items-center justify-between">
                    <div className="font-mono text-[10px] tracking-[0.18em] text-black/55 uppercase">
                      Visualisation
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.18em] text-black/45 uppercase">
                      Risk topology proxy
                    </div>
                  </div>

                  <div className="mt-[var(--space-curve-12)] eth-rule" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="border-t border-[var(--stroke-soft)] bg-white">
          <div className="eth-container py-[var(--space-curve-64)]">
            <div className="eth-grid">
              <div className="col-span-12 lg:col-span-7">
                <div className="mb-[var(--space-curve-40)] font-mono text-[10px] tracking-[0.22em] text-black/70 uppercase">
                  About
                  <span className="ml-2 inline-block align-middle h-[2px] w-10 bg-[var(--eth-petrol)] opacity-80" />
                </div>

                <h2 className="font-sans text-[30px] md:text-[34px] font-semibold leading-[1.10] text-black tracking-[-0.02em]">
                  Ometeotl is a Latin America–focused applied research lab advancing AI risk oversight,
                  institutional accountability, and epistemic reliability.
                </h2>

                <div className="mt-[var(--space-curve-40)] space-y-[var(--space-curve-16)]">
                  <p className="font-sans text-[14px] leading-[1.8] text-black/70 max-w-[70ch]">
                    We examine how probabilistic AI systems—particularly large-scale language and decision-support
                    models—reconfigure standards of evidence, authority, and responsibility within public and
                    organizational institutions.
                  </p>
                  <p className="font-sans text-[14px] leading-[1.8] text-black/70 max-w-[70ch]">
                    Our research integrates epistemic analysis, institutional design, and contextual adaptation to
                    identify the conditions under which AI-assisted processes remain robust under uncertainty and model
                    failure.
                  </p>
                  <p className="font-sans text-[14px] leading-[1.8] text-black/70 max-w-[70ch]">
                    We develop analytically grounded oversight frameworks that translate technical limitations into
                    operational governance structures—grounded in regional institutional realities.
                  </p>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <SpecPanel
                  title="Focus"
                  items={[
                    "Capability & deployment risk mapping",
                    "Auditability & documentation standards",
                    "Institutional decision-right design",
                    "Cross-context epistemic adaptation",
                  ]}
                  footer="Method: applied oversight"
                />
              </div>
            </div>
          </div>
        </section>

        {/* RESEARCH */}
        <section id="research" className="bg-white border-y border-[var(--stroke-soft)]">
          <div className="eth-container py-[var(--space-curve-64)]">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] tracking-[0.22em] text-black/70 uppercase">
                Research
                <span className="ml-2 inline-block align-middle h-[2px] w-10 bg-[var(--eth-petrol)] opacity-80" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.18em] text-black/50 uppercase">
                3 active lines
              </span>
            </div>

            <h2 className="mt-[var(--space-curve-24)] mb-[var(--space-curve-40)] max-w-[40ch] font-sans text-[28px] md:text-[32px] font-semibold leading-[1.10] text-black tracking-[-0.02em]">
              Research that holds in deployment
            </h2>

            <div className="eth-rule mb-[var(--space-curve-40)]" />

            <div className="eth-grid">
              {RESEARCH.map((c) => (
                <div key={c.index} className="col-span-12 md:col-span-4">
                  <ResearchCard c={c} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-white border-b border-[var(--stroke-soft)]">
          <div className="eth-container py-[var(--space-curve-64)]">
            <div className="eth-grid">
              <div className="col-span-12 lg:col-span-7">
                <div className="mb-[var(--space-curve-40)] font-mono text-[10px] tracking-[0.22em] text-black/70 uppercase">
                  Services
                  <span className="ml-2 inline-block align-middle h-[2px] w-10 bg-[var(--eth-petrol)] opacity-80" />
                </div>

                <h2 className="font-sans text-[30px] md:text-[34px] font-semibold leading-[1.10] text-black tracking-[-0.02em]">
                  Responsible AI integration frameworks
                </h2>

                <div className="mt-[var(--space-curve-40)] space-y-[var(--space-curve-16)]">
                  <p className="font-sans text-[14px] leading-[1.8] text-black/70 max-w-[72ch]">
                    We design and implement responsible AI integration frameworks for public institutions, NGOs, and
                    private organisations—covering governance design, technical risk evaluation, and operational oversight.
                  </p>
                  <p className="font-sans text-[14px] leading-[1.8] text-black/70 max-w-[72ch]">
                    Our engagements span the full AI adoption lifecycle: epistemic risk diagnostics, model and data
                    documentation standards, evaluation protocol design, red-teaming coordination, and deployment monitoring.
                    We map socio-technical failure modes, structure accountability pathways, and embed escalation and audit
                    mechanisms into institutional workflows.
                  </p>
                  <p className="font-sans text-[14px] leading-[1.8] text-black/70 max-w-[72ch]">
                    Our objective is institutional robustness—ensuring AI systems enhance decision quality and public trust
                    without degrading accountability, human agency, or epistemic standards.
                  </p>
                </div>

                <div className="mt-[var(--space-curve-40)]">
                  <Link href="/services" className="eth-link inline-flex items-center gap-2">
                    View services <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <SpecPanel
                  title="Engagement scope"
                  items={[
                    "Risk diagnostics & failure modes",
                    "Model/data documentation (audit-ready)",
                    "Evaluation protocols & governance gates",
                    "Red-teaming coordination",
                    "Deployment monitoring & escalation pathways",
                  ]}
                  footer="Outcome: accountable deployment"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white">
          <div className="h-[3px] bg-[var(--eth-petrol)]" />
          <div className="eth-container py-[var(--space-curve-48)] border-t border-[var(--stroke-soft)]">
            <div className="eth-grid items-end">
              <div className="col-span-12 md:col-span-8">
                <div className="font-mono text-[10px] tracking-[0.28em] text-black/55 uppercase mb-[var(--space-curve-12)]">
                  OMETEOTL
                </div>
                <p className="font-sans text-[13px] text-black/70 mb-1">
                  AI Risk & Epistemic Reliability Lab
                </p>
                <p className="font-sans text-[13px] text-black/70 mb-[var(--space-curve-16)]">
                  Lima, Peru
                </p>
                <a href="mailto:contact@ometeotl.org" className="eth-link">
                  contact@ometeotl.org
                </a>
              </div>

              <div className="col-span-12 md:col-span-4 md:text-right font-mono text-[10px] tracking-[0.12em] text-black/40 uppercase">
                © 2026 Ometeotl
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}