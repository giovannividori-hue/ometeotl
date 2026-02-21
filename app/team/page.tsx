import Link from "next/link"

export default function TeamPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "var(--fg)", padding: "56px 20px" }}>
      <div style={{ maxWidth: "var(--max-text)", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1 style={{ marginBottom: "6px", fontFamily: "var(--font-sans)", fontWeight: 700 }}>Team</h1>
          <hr style={{ border: "none", borderTop: "1px solid var(--rule-mid)", margin: "8px 0 24px" }} />

          <section style={{ padding: "28px 0", borderTop: "1px solid var(--rule-mid)" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", marginBottom: "8px" }}>Founder</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ color: "var(--fg-mid)", fontSize: "0.95rem" }}>
                Name: <strong style={{ color: "var(--fg)" }}>Founder Name</strong>
              </div>
              <div style={{ color: "var(--fg-mid)" }}>
                Role: Director, AI Risk & Epistemic Reliability
              </div>
              <p style={{ marginTop: "12px" }}>
                The founder leads the lab’s research agenda on AI risk, institutional accountability, and epistemic reliability across Latin America. For inquiries, <Link href="/contact" className="cardlink">contact us</Link>.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
