import type {
  DailyQuestProgress,
  ProtocolSnapshot,
  ProtocolState,
  ProtocolStatus,
} from '../store/useStore'

export const PROTOCOL_EXPORT_VERSION = 1 as const

export type ValidatedProtocolImport = {
  morning: ProtocolState['morning']
  daytime: ProtocolState['daytime']
  evening: ProtocolState['evening']
  status: ProtocolStatus
  dailyQuestProgress: DailyQuestProgress | null
  archives: ProtocolSnapshot[]
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isProtocolStatus(s: unknown): s is ProtocolStatus {
  return s === 'in_progress' || s === 'completed'
}

function isStringRecord(v: unknown): v is Record<string, string> {
  if (!isRecord(v)) return false
  return Object.entries(v).every(
    ([k, val]) => typeof k === 'string' && typeof val === 'string',
  )
}

function validateDailyProgress(
  v: unknown,
): v is DailyQuestProgress | null {
  if (v === null) return true
  if (!isRecord(v)) return false
  if (typeof v.dateKey !== 'string') return false
  if (!Array.isArray(v.checked)) return false
  return v.checked.every((c) => typeof c === 'boolean')
}

/**
 * Validates and normalizes a single protocol snapshot (active protocol or one archive entry).
 * Extra keys on the object are ignored.
 */
export function parseProtocolSnapshot(u: unknown): ProtocolSnapshot | null {
  if (!isRecord(u)) return null
  if (!isRecord(u.morning)) return null
  if (typeof u.morning.antiVision !== 'string') return null
  if (typeof u.morning.vision !== 'string') return null
  if (!isRecord(u.daytime) || !isStringRecord(u.daytime.interrupts)) {
    return null
  }
  if (!isRecord(u.evening)) return null
  if (typeof u.evening.mission !== 'string') return null
  if (typeof u.evening.bossFight !== 'string') return null
  if (typeof u.evening.quests !== 'string') return null
  if (typeof u.evening.rules !== 'string') return null
  if (!isProtocolStatus(u.status)) return null
  if (!validateDailyProgress(u.dailyQuestProgress)) return null

  const dailyQuestProgress =
    u.dailyQuestProgress === null
      ? null
      : {
          dateKey: u.dailyQuestProgress.dateKey,
          checked: [...u.dailyQuestProgress.checked],
        }

  return {
    morning: {
      antiVision: u.morning.antiVision,
      vision: u.morning.vision,
    },
    daytime: { interrupts: { ...u.daytime.interrupts } },
    evening: {
      mission: u.evening.mission,
      bossFight: u.evening.bossFight,
      quests: u.evening.quests,
      rules: u.evening.rules,
    },
    status: u.status,
    dailyQuestProgress,
  }
}

export function serializeProtocolExport(state: {
  morning: ProtocolState['morning']
  daytime: ProtocolState['daytime']
  evening: ProtocolState['evening']
  status: ProtocolStatus
  dailyQuestProgress: DailyQuestProgress | null
  archives: ProtocolSnapshot[]
}): string {
  const payload = {
    version: PROTOCOL_EXPORT_VERSION,
    morning: state.morning,
    daytime: state.daytime,
    evening: state.evening,
    status: state.status,
    dailyQuestProgress: state.dailyQuestProgress,
    archives: state.archives,
  }
  return `${JSON.stringify(payload, null, 2)}\n`
}

export function parseProtocolImport(
  json: string,
):
  | { ok: true; data: ValidatedProtocolImport }
  | { ok: false; error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(json) as unknown
  } catch {
    return { ok: false, error: 'Invalid JSON' }
  }
  if (!isRecord(parsed)) {
    return { ok: false, error: 'Backup must be a JSON object' }
  }
  if (parsed.version !== PROTOCOL_EXPORT_VERSION) {
    return { ok: false, error: 'Unsupported backup version' }
  }

  const active = parseProtocolSnapshot(parsed)
  if (!active) {
    return { ok: false, error: 'Invalid protocol data' }
  }

  if (!Array.isArray(parsed.archives)) {
    return { ok: false, error: 'Invalid archives' }
  }

  const archives: ProtocolSnapshot[] = []
  for (const item of parsed.archives) {
    const snap = parseProtocolSnapshot(item)
    if (!snap) {
      return { ok: false, error: 'Invalid archive entry' }
    }
    archives.push(snap)
  }

  return {
    ok: true,
    data: {
      morning: active.morning,
      daytime: active.daytime,
      evening: active.evening,
      status: active.status,
      dailyQuestProgress: active.dailyQuestProgress,
      archives,
    },
  }
}
