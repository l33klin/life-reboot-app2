import { createEvents, type EventAttributes } from 'ics'

/** Same copy as `privateBrowsing.warning` (en) — embedded in calendar imports. */
export const ICS_WEBVIEW_STORAGE_WARNING =
  'Limited browser storage detected (often in private or incognito mode). Your progress may not persist after you close this tab.'

const INTERRUPT_SCHEDULE: readonly [hour: number, minute: number][] = [
  [11, 0],
  [13, 30],
  [15, 15],
  [20, 0], // Evening Synthesis
]

function reflectUrl(baseUrl: string, q: number): string {
  const origin = baseUrl.replace(/\/$/, '')
  // The 4th event links to evening synthesis
  if (q === 4) {
    return `${origin}/wizard/evening`
  }
  return `${origin}/reflect?q=${q}`
}

export type GenerateInterruptsOptions = {
  date: Date
  /** Calendar URL field requires an absolute URL (ics schema). Use `window.location.origin` in the app. */
  baseUrl: string
  titles?: string[]
  calName?: string
  description?: string
}

/**
 * Builds a single .ics document with daytime interrupt reminders for `date`.
 */
export function generateInterrupts(options: GenerateInterruptsOptions): string {
  const y = options.date.getFullYear()
  const m = options.date.getMonth() + 1
  const d = options.date.getDate()

  const events: EventAttributes[] = INTERRUPT_SCHEDULE.map(([hour, minute], i) => {
    const q = i + 1
    const title = options.titles?.[i] ?? `Life Reboot — Daytime interrupt ${q}`
    return {
      start: [y, m, d, hour, minute],
      startInputType: 'local',
      startOutputType: 'local',
      duration: { minutes: 15 },
      title: title,
      description: options.description ?? ICS_WEBVIEW_STORAGE_WARNING,
      url: reflectUrl(options.baseUrl, q),
      uid: `life-reboot-daytime-${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}-${q}@life-reboot-protocol`,
    }
  })

  const { error, value } = createEvents(events, {
    productId: 'life-reboot-protocol/daytime',
    calName: options.calName ?? 'Life Reboot — Daytime interrupts',
  })

  if (error) {
    throw error
  }
  if (!value) {
    throw new Error('ICS generation returned no value')
  }
  return value
}
