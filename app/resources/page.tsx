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
    <div style={{ minHeight: "100vh", background: "#080808", color: "#eaeaea", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,700&family=DM+Sans:wght@300;400;700&display=swap');"}</style>

      <header style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.85)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.28em", color: "#eaeaea", textTransform: "uppercase" }}>OMETEOTL</Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {['About','Research','Services'].map(s => <a key={s} href={`#${s.toLowerCase()}`} style={{ color: "#eaeaea", opacity: 0.9 }}>{s}</a>)}
            <Link href="/resources" style={{ color: "#3d8f80" }}>Resources</Link>
            <Link href="/contact" style={{ color: "#eaeaea" }}>Contact</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: 80, maxWidth: 1200, margin: "0 auto", padding: "100px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>

          <section style={{ background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 8, padding: 20, minHeight: 520 }}>
            <h2 style={{ margin: 0, marginBottom: 12, fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 400 }}>AI Risk Monitor — Chat</h2>
            <div style={{ marginBottom: 12, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Interroga al monitor para evaluar respuestas y riesgos del modelo.</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 380, overflow: "auto", padding: 8 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#1b4f45' : 'transparent', border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.03)' : 'none', padding: '10px 12px', borderRadius: 6, maxWidth: '78%' }}>
                  <div style={{ fontSize: 13, color: m.role === 'user' ? '#e6fff9' : '#e7e7e7', fontFamily: m.role === 'user' ? "'DM Mono'" : "'DM Sans'" }}>{m.content}</div>
                </div>
              ))}
            </div>

            <form onSubmit={send} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={loading ? 'Enviando...' : 'Escribe tu consulta...'} disabled={loading} style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)', background: '#060606', color: '#fff' }} />
              <button type="submit" disabled={loading} style={{ background: '#3d8f80', border: 'none', color: '#04120f', padding: '10px 14px', borderRadius: 6, fontWeight: 600 }}>{loading ? '...' : 'Enviar'}</button>
            </form>
          </section>

          <aside style={{ background: '#070707', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8, padding: 20, height: 520 }}>
            <h3 style={{ margin: 0, marginBottom: 14 }}>Indicadores</h3>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 18 }}>Memoria = pérdida de contexto · Confianza = riesgo de alucinación · Dominio = fuera de entrenamiento</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {['memoria','confianza','dominio'].map((k) => {
                const val = indicators ? (indicators as any)[k] : 50
                return (
                  <div key={k}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: "'DM Mono'", fontSize: 13 }}>
                      <div style={{ textTransform: 'capitalize' }}>{k}</div>
                      <div>{val}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', height: 10, borderRadius: 6 }}>
                      <div style={{ width: `${Math.max(0, Math.min(100, val))}%`, height: '100%', background: '#3d8f80', borderRadius: 6 }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 26, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Última evaluación: {indicators ? 'reciente' : '—'}</div>
          </aside>

        </div>
      </main>
    </div>
  )
}
