"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

type Message = { role: string; content: string }

export default function ResourcesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [indicators, setIndicators] = useState<{ memoria: number; confianza: number; dominio: number } | null>(null)

  useEffect(() => {
    setMessages([{ role: "system", content: "Eres AI Risk Monitor." }])
  }, [])

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const payload = await res.json()
      const aiMsg: Message = { role: "assistant", content: payload.text || "" }
      setMessages(prev => [...prev, aiMsg])
      if (payload.indicators) setIndicators(payload.indicators)
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to API." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-sans)" }}>

      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 50,
        borderBottom: "1px solid var(--rule)",
        background: "rgba(8,8,8,0.6)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: "var(--max-wide)", margin: "0 auto", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.28em", color: "var(--fg)", textTransform: "uppercase" }}>OMETEOTL</Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {['About','Research','Services'].map(s => <a key={s} href={`#${s.toLowerCase()}`} className="navlink">{s}</a>)}
            <Link href="/resources" className="navlink" style={{ color: "var(--accent)" }}>Resources</Link>
            <Link href="/contact" className="navlink">Contact</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: 88, maxWidth: "var(--max-wide)", margin: "0 auto", padding: "100px 24px 80px" }}>
        <div className="resources-grid" style={{ display: "grid", gridTemplateColumns: "65% 35%", gap: 32, alignItems: "start" }}>

          {/* Chat column */}
          <section className="resources-chat" style={{ background: "transparent", padding: 0, minHeight: 520 }}>
            <div className="label" style={{ marginBottom: 12 }}>SHIELD — AI RISK MONITOR</div>
            <h2 style={{ margin: 0, marginBottom: 8, color: "var(--fg)", fontWeight: 400 }}>AI Risk Monitor — Chat</h2>
            <p style={{ color: "var(--fg-mid)", marginBottom: 18 }}>Interroga al monitor para evaluar respuestas y riesgos del modelo.</p>

            <div className="messages-list" style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 420, overflow: 'auto', paddingRight: 8 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '10px 14px',
                    maxWidth: '78%',
                    fontFamily: m.role === 'user' ? 'var(--font-mono)' : 'var(--font-sans)',
                    color: 'var(--fg)',
                    border: m.role === 'user' ? '1px solid var(--rule-mid)' : 'none',
                    background: m.role === 'user' ? 'transparent' : 'transparent'
                  }}>{m.content}</div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="resources-form" style={{ marginTop: 18 }}>
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 12, display: 'flex', gap: 12 }}>
                <input className="resources-input" value={input} onChange={e => setInput(e.target.value)} placeholder={loading ? 'Enviando...' : 'Escribe tu consulta...'} disabled={loading}
                  style={{ flex: 1, padding: '12px 14px', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', color: 'var(--fg)', background: 'transparent' }} />
                <button className="resources-send" type="submit" disabled={loading} style={{ background: 'var(--accent)', border: 'none', color: '#04120f', padding: '10px 14px', fontWeight: 600 }}>{loading ? '...' : 'Enviar'}</button>
              </div>
            </form>
          </section>

          {/* Indicators panel */}
          <aside className="resources-indicators" style={{ background: 'transparent', padding: 0, minHeight: 520 }}>
            <div className="label" style={{ marginBottom: 12 }}>Indicadores</div>
            <div style={{ color: 'var(--fg-mid)', marginBottom: 18, fontSize: 13 }}>Memoria = pérdida de contexto · Confianza = riesgo de alucinación · Dominio = fuera de entrenamiento</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(['memoria','confianza','dominio'] as const).map((k) => {
                const val = indicators ? (indicators as any)[k] : 50
                const clamped = Math.max(0, Math.min(100, val))
                let color = '#3d8f80'
                if (clamped > 66) color = '#c0392b'
                else if (clamped > 33) color = '#c8b89a'

                return (
                  <div key={k}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg)' }}>{k}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg)' }}>{clamped}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', height: 2, borderRadius: 2 }}>
                      <div style={{ width: `${clamped}%`, height: '100%', background: color }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 26, fontSize: 12, color: 'var(--fg-mid)' }}>Última evaluación: {indicators ? 'reciente' : '—'}</div>
          </aside>

        </div>
      </main>
    </div>
  )
}
