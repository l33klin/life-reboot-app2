import { describe, expect, it } from 'vitest'
import {
  generateInterrupts,
  ICS_WEBVIEW_STORAGE_WARNING,
} from './icsGenerator'

describe('generateInterrupts', () => {
  it('returns valid VCALENDAR content with three events', () => {
    const date = new Date(2026, 5, 15)
    const ics = generateInterrupts({
      date,
      baseUrl: 'https://life-reboot.test',
    })

    expect(ics).toMatch(/^BEGIN:VCALENDAR/)
    expect(ics).toMatch(/END:VCALENDAR\r?\n?$/)
    const events = ics.match(/BEGIN:VEVENT/g)
    expect(events).toHaveLength(3)
  })

  it('uses local start times 11:00, 13:30, and 15:15 on the given date', () => {
    const date = new Date(2026, 5, 15)
    const ics = generateInterrupts({
      date,
      baseUrl: 'https://life-reboot.test',
    })

    expect(ics).toContain('DTSTART:20260615T110000')
    expect(ics).toContain('DTSTART:20260615T133000')
    expect(ics).toContain('DTSTART:20260615T151500')
  })

  it('embeds reflect deep links with q=1, q=2, and q=3', () => {
    const date = new Date(2026, 3, 1)
    const ics = generateInterrupts({
      date,
      baseUrl: 'https://app.example',
    })

    expect(ics).toContain('/reflect?q=1')
    expect(ics).toContain('/reflect?q=2')
    expect(ics).toContain('/reflect?q=3')
    expect(ics).toContain('https://app.example/reflect?q=1')
  })

  it('includes the WebView / storage warning in the description', () => {
    const ics = generateInterrupts({
      date: new Date(2026, 1, 1),
      baseUrl: 'https://life-reboot.test',
    })

    expect(ics).toContain('DESCRIPTION')
    // RFC 5545 folds long lines; unwrap continuation lines for the assertion.
    const unfolded = ics.replace(/\r\n[ \t]/g, '')
    expect(unfolded).toContain(ICS_WEBVIEW_STORAGE_WARNING)
  })

  it('sets 15-minute duration on each event', () => {
    const ics = generateInterrupts({
      date: new Date(2026, 7, 20),
      baseUrl: 'https://life-reboot.test',
    })

    const durations = ics.match(/DURATION:PT15M/g)
    expect(durations).toHaveLength(3)
  })
})
