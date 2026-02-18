import Link from "next/link";

export default function Page() {
  return (
    <main style={{ background: '#000', minHeight: '100vh', padding: '120px 32px 80px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="inline-block px-5 py-1.5 rounded-full mb-16" style={{ background: 'rgba(255,255,255,0.004)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.012)' }}>
          <span className="text-white/35 text-[10px] tracking-[0.32em] font-light">RESEARCH AREAS</span>
        </div>

        <h1 className="text-white/90 font-normal text-2xl mb-12 max-w-2xl">Research that holds in deployment</h1>

        <div className="space-y-16">
          {/* AI Risk - DERECHA */}
          <div className="max-w-2xl ml-auto">
            <h3 className="text-white/92 font-medium text-xl mb-4 leading-snug">AI Risk & Epistemic Reliability</h3>
            <p className="text-white/50 text-base leading-relaxed font-light mb-4">
              Mapping systemic capability risks and institutionic conditions under which AI-assisted processes remain robust, auditable, and decision-relevant in practice.
            </p>
            <Link 
              href="/research/ai-risk-epistemic-reliability" 
              className="inline-flex items-center gap-2 text-white/60 text-sm font-light hover:text-white/80 transition-colors"
            >
              Explore <span>→</span>
            </Link>
          </div>

          {/* Governance - IZQUIERDA */}
          <div className="max-w-2xl mr-auto">
            <h3 className="text-white/92 font-medium text-xl mb-4 leading-snug">Governance & Institutional Accountability</h3>
            <p className="text-white/50 text-base leading-relaxed font-light mb-4">
              Designing decision-right structures, escalation pathways, documentation standards, and oversight mechanisms that embed AI systems within accountable institutional workflows.
            </p>
            <Link 
              href="/research/governance-institutional-accountability" 
              className="inline-flex items-center gap-2 text-white/60 text-sm font-light hover:text-white/80 transition-colors"
            >
              Explore <span>→</span>
            </Link>
          </div>

          {/* Evaluation - DERECHA */}
          <div className="max-w-2xl ml-auto">
            <h3 className="text-white/92 font-medium text-xl mb-4 leading-snug">Evaluation & Assurance</h3>
            <p className="text-white/50 text-base leading-relaxed font-light mb-4">
              Building evaluation protocols, metrics, and assurance workflows—so 'responsible AI' is measurable, monitorable, and enforceable over time.
            </p>
            <Link 
              href="/research/evaluation-and-assurance" 
              className="inline-flex items-center gap-2 text-white/60 text-sm font-light hover:text-white/80 transition-colors"
            >
              Explore <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
