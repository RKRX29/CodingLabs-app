import { NextResponse } from 'next/server'
import { applyRateLimit } from '@/app/lib/rateLimit'

type ExecuteRequestBody = {
  language: string
  code: string
  stdin?: string
}

const LANGUAGE_ID_MAP: Record<string, number> = {
  python: 71,
  javascript: 63,
  cpp: 54
}

export async function POST(req: Request) {
  try {
    const rate = applyRateLimit(req, {
      keyPrefix: 'code-execute',
      limit: 30,
      windowMs: 5 * 60 * 1000
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many code execution requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
      )
    }

    const { language, code, stdin = '' } = (await req.json()) as ExecuteRequestBody

    if (!language || !code) {
      return NextResponse.json({ error: 'language and code are required' }, { status: 400 })
    }

    const normalizedLanguage = language.toLowerCase()
    const languageId = LANGUAGE_ID_MAP[normalizedLanguage]

    if (!languageId) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_ID_MAP).join(', ')}` },
        { status: 400 }
      )
    }

    const judgeRes = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin
      })
    })

    const data = await judgeRes.json()

    if (!judgeRes.ok) {
      return NextResponse.json(
        { error: 'Code execution failed', details: data?.message || data },
        { status: judgeRes.status }
      )
    }

    return NextResponse.json({
      language: normalizedLanguage,
      stdout: data.stdout,
      stderr: data.stderr,
      compile_output: data.compile_output,
      message: data.message,
      status: data.status,
      time: data.time,
      memory: data.memory
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 })
  }
}
