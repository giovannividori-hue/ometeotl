'use client'

import { useState } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }
type Indicators = { memoria: number; confianza: number; dominio: number }

export default function Shield() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [indicators, setIndicators] = useState<Indicators>({ memoria: 0, confianza: 0, dominio: 0 })
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const newMessages: Message[] = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    })

    const data = await res.json()
    setMessages([...newMessages, { role: 'assistant', content: data.text }])
    setIndicators(data.indicators)
    setLoading(false)
  }

  const getRisk = (val: number) => {
    if (val < 35) return '#3d8f80'
    if (val < 65) return '#c8b89a'
    return '#c0392b'
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080808', color: '#f0efed', fontFamily: 'system-ui' }}>
      
      {/* Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#9a9691' }}>OMETEOTL</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 300, marginTop: '8px' }}>Shield</div>
          <div style={{ fontSize: '0.75rem', color: '#9a9691', marginTop: '4px' }}>AI Risk Monitor</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              background: m.role === 'user' ? 'rgba(61,143,128,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${m.role === 'user' ? 'rgba(61,143,128,0.3)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: '#f0efed',
            }}>
              {m.content}
            </div>
          ))}
          {loading && <div style={{ color: '#9a9691', fontSize: '0.8rem' }}>Analizando...</div>}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Escribe tu pregunta..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '12px 16px',
              color: '#f0efed', fontSize: '0.875rem', outline: 'none',
            }}
          />
          <button onClick={send} style={{
            background: '#3d8f80', border: 'none', borderRadius: '8px',
            padding: '12px 24px', color: '#fff', cursor: 'pointer',
            fontSize: '0.8rem', letterSpacing: '0.1em',
          }}>
            SEND
          </button>
        </div>
      </div>

      {/* Panel de indicadores */}
      <div style={{
        width: '280px', borderLeft: '1px solid rgba(255,255,255,0.07)',
        padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '40px',
      }}>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#9a9691', marginBottom: '32px' }}>RISK INDICATORS</div>
          
          {[
            { key: 'memoria', label: 'Context Memory', desc: 'Risk of context loss' },
            { key: 'confianza', label: 'Confidence', desc: 'Hallucination probability' },
            { key: 'dominio', label: 'Domain', desc: 'Training boundary risk' },
          ].map(({ key, label, desc }) => {
            const val = indicators[key as keyof Indicators]
            return (
              <div key={key} style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#f0efed' }}>{label}</span>
                  <span style={{ fontSize: '0.75rem', color: getRisk(val), fontVariantNumeric: 'tabular-nums' }}>{val}</span>
                </div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.07)', borderRadius: '1px' }}>
                  <div style={{
                    height: '100%', width: `${val}%`,
                    background: getRisk(val),
                    borderRadius: '1px',
                    transition: 'width 600ms ease, background 600ms ease',
                  }} />
                </div>
                <div style={{ fontSize: '0.65rem', color: '#3d3c3a', marginTop: '4px' }}>{desc}</div>
              </div>
            )
          })}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '24px' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#9a9691', marginBottom: '12px' }}>LEGEND</div>
          {[['#3d8f80', 'Low risk'], ['#c8b89a', 'Moderate'], ['#c0392b', 'High risk']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              <span style={{ fontSize: '0.7rem', color: '#9a9691' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
