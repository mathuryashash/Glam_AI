/**
 * 🤖 Unit Tests — Groq API Client & System Prompt Builder (lib/groq.ts)
 * Tests: buildSystemPrompt, sendMessage (with mocked fetch)
 */

import { buildSystemPrompt, sendMessage, type ChatMessage, type UserAstroContext } from '@/lib/groq'

// ── buildSystemPrompt ─────────────────────────────────────────────────────────

describe('buildSystemPrompt', () => {
  it('includes user chart details when provided', () => {
    const ctx: UserAstroContext = {
      sunSign: 'Leo',
      moonSign: 'Scorpio',
      risingSign: 'Aquarius',
    }
    const prompt = buildSystemPrompt(ctx)
    expect(prompt).toContain('Leo')
    expect(prompt).toContain('Scorpio')
    expect(prompt).toContain('Aquarius')
  })

  it('uses a generic message when no chart context provided', () => {
    const prompt = buildSystemPrompt({})
    expect(prompt).toContain('has not yet shared their birth chart details')
  })

  it('contains the AI persona identity', () => {
    const prompt = buildSystemPrompt({})
    expect(prompt).toContain('Nebula')
    expect(prompt).toContain('astrologer')
  })

  it('includes todays date string', () => {
    const prompt = buildSystemPrompt({})
    const currentYear = new Date().getFullYear().toString()
    expect(prompt).toContain(currentYear)
  })

  it('handles missing moonSign and risingSign gracefully', () => {
    const ctx: UserAstroContext = { sunSign: 'Aries' }
    const prompt = buildSystemPrompt(ctx)
    expect(prompt).toContain('Aries')
    expect(prompt).toContain('unknown') // moonSign/risingSign fallback
  })

  it('returns a string of meaningful length', () => {
    const prompt = buildSystemPrompt({ sunSign: 'Virgo', moonSign: 'Taurus', risingSign: 'Cancer' })
    expect(prompt.length).toBeGreaterThan(100)
  })
})

// ── sendMessage (mocked fetch) ────────────────────────────────────────────────

const mockMessages: ChatMessage[] = [
  { role: 'system', content: 'You are an astrologer.' },
  { role: 'user', content: 'What does Mars in Aries mean?' },
]

describe('sendMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns the assistant content from a successful API response', async () => {
    const mockContent = 'Mars in Aries brings bold, direct energy.'
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: mockContent } }],
      }),
    } as any)

    const result = await sendMessage(mockMessages, 'test-api-key')
    expect(result).toBe(mockContent)
  })

  it('uses the correct API endpoint and auth header', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
    } as any)

    await sendMessage(mockMessages, 'sk-test-123')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-test-123',
          'Content-Type': 'application/json',
        }),
      })
    )
  })

  it('throws an error on non-ok API response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    } as any)

    await expect(sendMessage(mockMessages, 'bad-key')).rejects.toThrow('Groq API error 401: Unauthorized')
  })

  it('returns the fallback message when choices are empty', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [] }),
    } as any)

    const result = await sendMessage(mockMessages, 'test-key')
    expect(result).toContain('stars are silent')
  })

  it('throws when fetch itself fails (network error)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'))

    await expect(sendMessage(mockMessages, 'test-key')).rejects.toThrow('Network request failed')
  })

  it('sends messages array in request body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'test' } }] }),
    } as any)

    await sendMessage(mockMessages, 'test-key')
    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(callArgs[1].body)
    expect(body.messages).toEqual(mockMessages)
    expect(body.model).toBe('llama3-70b-8192')
    expect(body.max_tokens).toBe(512)
  })
})
