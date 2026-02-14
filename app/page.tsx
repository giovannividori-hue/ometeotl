export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(148,163,184,0.18),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.85))]" />
      </div>

      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/5" />
            <span className="tracking-[0.25em] text-sm font-semibold">OMETEOTL</span>
          </div>

          <nav className="hidden items-center gap-8 text-xs tracking-[0.18em] text-white/80 md:flex">
            <a className="hover:text-white" href="#briefs">RESEARCH BRIEFS</a>
            <a className="hover:text-white" href="#policy">POLICY FRAMEWORKS</a>
            <a className="hover:text-white" href="#risk">RISK OBSERVATORY</a>
          </nav>

          <div className="flex items-center gap-3">
            <a className="hidden text-xs text-white/70 hover:text-white md:inline" href="#about">ABOUT</a>
            <a className="hidden text-xs text-white/70 hover:text-white md:inline" href="#contact">CONTACT</a>
            <button className="rounded-md bg-blue-600/80 px-4 py-2 text-xs font-semibold tracking-wide hover:bg-blue-600">
              JOIN OUR NEWSLETTER
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6">
        <section className="py-16 md:py-24">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-14 shadow-[0_0_120px_rgba(59,130,246,0.12)]">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-semibold tracking-[0.22em] md:text-6xl">
                OMETEOTL
              </h1>
              <p className="mt-4 text-lg text-white/80 md:text-xl">
                AI Risk &amp; Epistemic Safety Observatory
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/65">
                Research and operational frameworks for emerging AI governance,
                with focus on Global South deployment risks.
              </p>

              <div className="mt-8 flex justify-center">
                <a
                  href="#briefs"
                  className="rounded-md border border-white/15 bg-blue-600/35 px-6 py-3 text-sm font-semibold hover:bg-blue-600/45"
                >
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Cards row */}
        <section className="grid gap-6 pb-10 md:grid-cols-4">
          <Card
            id="briefs"
            title="Research Briefs"
            subtitle="GenAI Disinformation in Latin American Elections"
            meta="APRIL 2024"
            cta="READ BRIEF"
          />
          <Card
            id="policy"
            title="Policy Frameworks"
            subtitle="AI Safety Challenges for the Global South"
            meta="APRIL 2024"
            cta="READ PAPER"
          />
          <Card
            id="risk"
            title="Risk Observatory"
            subtitle="Hallucination Risks in Non-English Language Models"
            meta="APRIL 26, 2024"
            cta="READ ANALYSIS"
          />
          <Card
            title="Epistemic Agent"
            subtitle="Ask: “What’s the latest risk on X?”"
            meta="Reliability: High (web sources cited)"
            cta="TRY LIVE DEMO"
            accent
          />
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} OMETEOTL. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

function Card(props: {
  id?: string;
  title: string;
  subtitle: string;
  meta: string;
  cta: string;
  accent?: boolean;
}) {
  return (
    <div
      id={props.id}
      className={[
        "rounded-2xl border border-white/10 bg-white/5 p-5",
        "shadow-[0_0_70px_rgba(0,0,0,0.35)]",
        props.accent ? "bg-blue-500/10" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white/90">
          {props.title}
        </h3>
        <span className="text-[10px] tracking-[0.2em] text-white/45">VIEW ALL</span>
      </div>

      <div className="mt-4">
        <div className="text-[10px] tracking-[0.18em] text-white/45">{props.meta}</div>
        <div className="mt-2 text-sm font-semibold leading-5 text-white/85">
          {props.subtitle}
        </div>
      </div>

      <button className="mt-5 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold tracking-wide text-white/85 hover:bg-white/10">
        {props.cta}
      </button>
    </div>
  );
}
