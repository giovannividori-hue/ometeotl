import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    let messages
    try {
      const parsed = JSON.parse(rawBody)
      messages = parsed.messages
    } catch (parseErr) {
      return NextResponse.json({ error: `Invalid JSON body: ${String(parseErr)}`, bodyPreview: rawBody.slice(0, 200) }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages,
    })

    const text = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    const analysis = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Analiza esta respuesta y devuelve SOLO un JSON con tres valores del 0 al 100: {"memoria": número, "confianza": número, "dominio": número}. memoria = riesgo de pérdida de contexto, confianza = probabilidad de alucinación, dominio = qué tan fuera de entrenamiento está. Respuesta: "${text.slice(0, 500)}". Solo el JSON.`
      }]
    })

    const analysisText = analysis.content[0].type === 'text'
      ? analysis.content[0].text
      : '{"memoria":50,"confianza":50,"dominio":50}'

    let indicators
    try {
      indicators = JSON.parse(analysisText)
    } catch {
      indicators = { memoria: 50, confianza: 50, dominio: 50 }
    }

    return NextResponse.json({ text, indicators })
  } catch (err: any) {
    const message = err?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
