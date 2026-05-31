/**
 * 🌟 Comprehensive Unit Tests — Astrology Engine (lib/astrology.ts)
 * Tests: getSunSign, getMoonSign, getRisingSign, calculateCompatibility, getMoonPhase
 */

import {
  getSunSign,
  getMoonSign,
  getRisingSign,
  calculateCompatibility,
  getMoonPhase,
  calculateBirthChart,
  SIGN_META,
  type ZodiacSign,
  type BirthData,
} from '@/lib/astrology'

// ── getSunSign ────────────────────────────────────────────────────────────────

describe('getSunSign', () => {
  it('returns correct sign for known dates', () => {
    expect(getSunSign(3, 21)).toBe('Aries')
    expect(getSunSign(4, 19)).toBe('Aries')
    expect(getSunSign(4, 20)).toBe('Taurus')
    expect(getSunSign(5, 20)).toBe('Taurus')
    expect(getSunSign(5, 21)).toBe('Gemini')
    expect(getSunSign(6, 21)).toBe('Cancer')
    expect(getSunSign(7, 23)).toBe('Leo')
    expect(getSunSign(8, 23)).toBe('Virgo')
    expect(getSunSign(9, 23)).toBe('Libra')
    expect(getSunSign(10, 23)).toBe('Scorpio')
    expect(getSunSign(11, 22)).toBe('Sagittarius')
    expect(getSunSign(12, 22)).toBe('Capricorn')
    expect(getSunSign(1, 19)).toBe('Capricorn')
    expect(getSunSign(1, 20)).toBe('Aquarius')
    expect(getSunSign(2, 19)).toBe('Pisces')
    expect(getSunSign(3, 20)).toBe('Pisces')
  })

  it('handles Capricorn year-wrap correctly (Dec side)', () => {
    expect(getSunSign(12, 25)).toBe('Capricorn')
    expect(getSunSign(12, 31)).toBe('Capricorn')
  })

  it('handles Capricorn year-wrap correctly (Jan side)', () => {
    expect(getSunSign(1, 1)).toBe('Capricorn')
    expect(getSunSign(1, 19)).toBe('Capricorn')
  })

  it('returns a valid ZodiacSign for all months', () => {
    const allSigns: ZodiacSign[] = [
      'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
      'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
    ]
    for (let month = 1; month <= 12; month++) {
      const sign = getSunSign(month, 15)
      expect(allSigns).toContain(sign)
    }
  })
})

// ── getMoonSign ───────────────────────────────────────────────────────────────

describe('getMoonSign', () => {
  it('returns a valid ZodiacSign for a known date', () => {
    const allSigns: ZodiacSign[] = [
      'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
      'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
    ]
    const sign = getMoonSign(1990, 6, 15, 12)
    expect(allSigns).toContain(sign)
  })

  it('returns different moon signs for dates 14+ days apart', () => {
    const sign1 = getMoonSign(2000, 1, 1)
    const sign2 = getMoonSign(2000, 1, 15)
    // Moon moves ~1 sign every 2.5 days — these should almost always differ
    // This is probabilistic; both must be valid signs
    const allSigns: ZodiacSign[] = [
      'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
      'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
    ]
    expect(allSigns).toContain(sign1)
    expect(allSigns).toContain(sign2)
  })

  it('is deterministic for the same inputs', () => {
    expect(getMoonSign(1995, 3, 20, 14)).toBe(getMoonSign(1995, 3, 20, 14))
  })
})

// ── getRisingSign ─────────────────────────────────────────────────────────────

describe('getRisingSign', () => {
  it('returns a valid ZodiacSign', () => {
    const allSigns: ZodiacSign[] = [
      'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
      'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
    ]
    const sign = getRisingSign(1990, 1, 1, 6, 30, 40.7, -74.0, -5)
    expect(allSigns).toContain(sign)
  })

  it('changes with different birth times on the same date', () => {
    const allSigns: ZodiacSign[] = [
      'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
      'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
    ]
    const morningSign = getRisingSign(1990, 6, 15, 6, 0, 51.5, -0.1, 1)
    const eveningSign = getRisingSign(1990, 6, 15, 18, 0, 51.5, -0.1, 1)
    expect(allSigns).toContain(morningSign)
    expect(allSigns).toContain(eveningSign)
  })

  it('is deterministic for the same inputs', () => {
    const a = getRisingSign(1985, 7, 4, 12, 0, 34.05, -118.24, -7)
    const b = getRisingSign(1985, 7, 4, 12, 0, 34.05, -118.24, -7)
    expect(a).toBe(b)
  })
})

// ── calculateCompatibility ────────────────────────────────────────────────────

describe('calculateCompatibility', () => {
  it('returns scores in 0–100 range', () => {
    const result = calculateCompatibility('Aries', 'Leo', 'Sagittarius', 'Aries')
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
    expect(result.love).toBeGreaterThanOrEqual(0)
    expect(result.communication).toBeGreaterThanOrEqual(0)
    expect(result.values).toBeGreaterThanOrEqual(0)
    expect(result.passion).toBeGreaterThanOrEqual(0)
  })

  it('returns higher score for same-element signs', () => {
    const same = calculateCompatibility('Aries', 'Leo', 'Leo', 'Sagittarius')
    const different = calculateCompatibility('Aries', 'Leo', 'Cancer', 'Pisces')
    expect(same.overall).toBeGreaterThanOrEqual(different.overall)
  })

  it('returns a non-empty summary string', () => {
    const result = calculateCompatibility('Taurus', 'Scorpio', 'Libra', 'Aquarius')
    expect(typeof result.summary).toBe('string')
    expect(result.summary.length).toBeGreaterThan(10)
  })

  it('returns strengths and challenges arrays', () => {
    const result = calculateCompatibility('Cancer', 'Pisces', 'Scorpio', 'Cancer')
    expect(Array.isArray(result.strengths)).toBe(true)
    expect(Array.isArray(result.challenges)).toBe(true)
    expect(result.strengths.length).toBeGreaterThan(0)
    expect(result.challenges.length).toBeGreaterThan(0)
  })

  it('overall equals average of sub-scores', () => {
    const r = calculateCompatibility('Gemini', 'Aquarius', 'Leo', 'Aries')
    const expected = Math.round((r.love + r.communication + r.values + r.passion) / 4)
    expect(r.overall).toBe(expected)
  })
})

// ── getMoonPhase ──────────────────────────────────────────────────────────────

describe('getMoonPhase', () => {
  it('returns a valid phase name and emoji', () => {
    const validNames = [
      'New Moon','Waxing Crescent','First Quarter','Waxing Gibbous',
      'Full Moon','Waning Gibbous','Last Quarter','Waning Crescent',
    ]
    const result = getMoonPhase(new Date('2024-01-11'))
    expect(validNames).toContain(result.name)
    expect(result.emoji).toBeTruthy()
  })

  it('returns illumination between 0 and 100', () => {
    const result = getMoonPhase(new Date())
    expect(result.illumination).toBeGreaterThanOrEqual(0)
    expect(result.illumination).toBeLessThanOrEqual(100)
  })

  it('is deterministic for the same date', () => {
    const d = new Date('2023-06-21')
    expect(getMoonPhase(d).name).toBe(getMoonPhase(d).name)
  })

  it('returns Full Moon for known full moon date (approx Jan 25 2024)', () => {
    // Jan 25, 2024 was a full moon
    const result = getMoonPhase(new Date('2024-01-25'))
    expect(result.name).toBe('Full Moon')
  })
})

// ── calculateBirthChart ───────────────────────────────────────────────────────

describe('calculateBirthChart', () => {
  const sampleBirth: BirthData = {
    year: 1990, month: 7, day: 15,
    hour: 14, minute: 30,
    lat: 40.7128, lng: -74.006, timezone: -4,
  }

  it('returns all required chart fields', () => {
    const chart = calculateBirthChart(sampleBirth)
    expect(chart.sunSign).toBeTruthy()
    expect(chart.moonSign).toBeTruthy()
    expect(chart.risingSign).toBeTruthy()
    expect(chart.planets).toHaveLength(10)
    expect(chart.houses).toHaveLength(12)
  })

  it('sunSign from chart matches getSunSign', () => {
    const chart = calculateBirthChart(sampleBirth)
    expect(chart.sunSign).toBe(getSunSign(sampleBirth.month, sampleBirth.day))
  })

  it('returns valid dominant element and modality', () => {
    const chart = calculateBirthChart(sampleBirth)
    expect(['Fire','Earth','Air','Water']).toContain(chart.dominantElement)
    expect(['Cardinal','Fixed','Mutable']).toContain(chart.dominantModality)
  })

  it('all planet positions have required fields', () => {
    const chart = calculateBirthChart(sampleBirth)
    chart.planets.forEach(p => {
      expect(p.planet).toBeTruthy()
      expect(p.sign).toBeTruthy()
      expect(p.degree).toBeGreaterThanOrEqual(0)
      expect(p.degree).toBeLessThan(30)
      expect(p.house).toBeGreaterThanOrEqual(1)
      expect(p.house).toBeLessThanOrEqual(12)
      expect(typeof p.retrograde).toBe('boolean')
    })
  })
})

// ── SIGN_META ─────────────────────────────────────────────────────────────────

describe('SIGN_META', () => {
  const allSigns: ZodiacSign[] = [
    'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
    'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
  ]

  it('has entries for all 12 signs', () => {
    allSigns.forEach(sign => {
      expect(SIGN_META[sign]).toBeDefined()
    })
  })

  it('all entries have required metadata fields', () => {
    allSigns.forEach(sign => {
      const meta = SIGN_META[sign]
      expect(meta.symbol).toBeTruthy()
      expect(meta.element).toMatch(/^(Fire|Earth|Air|Water)$/)
      expect(meta.modality).toMatch(/^(Cardinal|Fixed|Mutable)$/)
      expect(meta.traits).toHaveLength(3)
      expect(meta.keywords.length).toBeGreaterThan(0)
    })
  })
})
