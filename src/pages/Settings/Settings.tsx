import { useCallback, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  type DailyQuestProgress,
  type ProtocolSnapshot,
  type ProtocolState,
  type ProtocolStatus,
  useStore,
} from '../../store/useStore'

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

function validateSnapshot(u: unknown): u is ProtocolSnapshot {
  if (!isRecord(u)) return false
  if (!isRecord(u.morning)) return false
  if (typeof u.morning.antiVision !== 'string') return false
  if (typeof u.morning.vision !== 'string') return false
  if (!isRecord(u.daytime) || !isStringRecord(u.daytime.interrupts)) {
    return false
  }
  if (!isRecord(u.evening)) return false
  if (typeof u.evening.mission !== 'string') return false
  if (typeof u.evening.bossFight !== 'string') return false
  if (typeof u.evening.quests !== 'string') return false
  if (typeof u.evening.rules !== 'string') return false
  if (!isProtocolStatus(u.status)) return false
  if (!validateDailyProgress(u.dailyQuestProgress)) return false
  return true
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
  if (!isRecord(parsed.morning)) {
    return { ok: false, error: 'Invalid morning section' }
  }
  if (typeof parsed.morning.antiVision !== 'string') {
    return { ok: false, error: 'Invalid morning section' }
  }
  if (typeof parsed.morning.vision !== 'string') {
    return { ok: false, error: 'Invalid morning section' }
  }
  if (!isRecord(parsed.daytime) || !isStringRecord(parsed.daytime.interrupts)) {
    return { ok: false, error: 'Invalid daytime section' }
  }
  if (!isRecord(parsed.evening)) {
    return { ok: false, error: 'Invalid evening section' }
  }
  if (
    typeof parsed.evening.mission !== 'string' ||
    typeof parsed.evening.bossFight !== 'string' ||
    typeof parsed.evening.quests !== 'string' ||
    typeof parsed.evening.rules !== 'string'
  ) {
    return { ok: false, error: 'Invalid evening section' }
  }
  if (!isProtocolStatus(parsed.status)) {
    return { ok: false, error: 'Invalid status' }
  }
  if (!validateDailyProgress(parsed.dailyQuestProgress)) {
    return { ok: false, error: 'Invalid daily quest progress' }
  }
  if (!Array.isArray(parsed.archives)) {
    return { ok: false, error: 'Invalid archives' }
  }
  for (const item of parsed.archives) {
    if (!validateSnapshot(item)) {
      return { ok: false, error: 'Invalid archive entry' }
    }
  }

  return {
    ok: true,
    data: {
      morning: {
        antiVision: parsed.morning.antiVision,
        vision: parsed.morning.vision,
      },
      daytime: { interrupts: { ...parsed.daytime.interrupts } },
      evening: {
        mission: parsed.evening.mission,
        bossFight: parsed.evening.bossFight,
        quests: parsed.evening.quests,
        rules: parsed.evening.rules,
      },
      status: parsed.status,
      dailyQuestProgress: parsed.dailyQuestProgress,
      archives: parsed.archives as ProtocolSnapshot[],
    },
  }
}

export function Settings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [importError, setImportError] = useState<string | null>(null)

  const morning = useStore((s) => s.morning)
  const daytime = useStore((s) => s.daytime)
  const evening = useStore((s) => s.evening)
  const status = useStore((s) => s.status)
  const dailyQuestProgress = useStore((s) => s.dailyQuestProgress)
  const archives = useStore((s) => s.archives)
  const archiveProtocol = useStore((s) => s.archiveProtocol)
  const replaceFromImport = useStore((s) => s.replaceFromImport)

  const handleExport = useCallback(() => {
    const json = serializeProtocolExport({
      morning,
      daytime,
      evening,
      status,
      dailyQuestProgress,
      archives,
    })
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `life-reboot-protocol-backup.json`
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [morning, daytime, evening, status, dailyQuestProgress, archives])

  const handleImportFile = useCallback(
    (file: File | undefined) => {
      setImportError(null)
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const text =
          typeof reader.result === 'string' ? reader.result : ''
        const result = parseProtocolImport(text)
        if (!result.ok) {
          setImportError(result.error)
          return
        }
        replaceFromImport(result.data)
      }
      reader.onerror = () => {
        setImportError(t('settings.importReadError'))
      }
      reader.readAsText(file, 'utf-8')
    },
    [replaceFromImport, t],
  )

  const openRebootDialog = () => {
    dialogRef.current?.showModal()
  }

  const closeRebootDialog = () => {
    dialogRef.current?.close()
  }

  const confirmReboot = () => {
    archiveProtocol()
    closeRebootDialog()
    navigate('/wizard', { replace: true })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-brutal-black">
        {t('settings.title')}
      </h1>

      <section
        aria-labelledby="settings-data-heading"
        className="space-y-4 border border-brutal-black p-6"
      >
        <h2
          id="settings-data-heading"
          className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brutal-black"
        >
          {t('settings.dataHeading')}
        </h2>
        <p className="font-sans text-sm text-brutal-black">
          {t('settings.dataDescription')}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="border-2 border-brutal-black bg-brutal-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-brutal-black hover:bg-brutal-black hover:text-brutal-white"
          >
            {t('settings.export')}
          </button>
          <label className="inline-block cursor-pointer border-2 border-brutal-black bg-brutal-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-brutal-black hover:bg-brutal-black hover:text-brutal-white">
            <span>{t('settings.import')}</span>
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => {
                handleImportFile(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>
        </div>
        {importError ? (
          <p role="alert" className="font-sans text-sm text-red-800">
            {importError}
          </p>
        ) : null}
      </section>

      <section
        aria-labelledby="settings-reboot-heading"
        className="space-y-4 border-2 border-amber-900 bg-amber-50/80 p-6"
      >
        <h2
          id="settings-reboot-heading"
          className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-950"
        >
          {t('settings.rebootHeading')}
        </h2>
        <p className="font-sans text-sm text-brutal-black">
          {t('settings.rebootDescription')}
        </p>
        <button
          type="button"
          onClick={openRebootDialog}
          className="border-2 border-amber-950 bg-amber-950 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-brutal-white hover:bg-brutal-black"
        >
          {t('settings.initiateReboot')}
        </button>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="max-w-md border-2 border-brutal-black bg-brutal-white p-6 shadow-[8px_8px_0_0_rgb(0,0,0)] backdrop:bg-black/40"
        onCancel={(e) => {
          e.preventDefault()
          closeRebootDialog()
        }}
      >
        <h3
          id={titleId}
          className="font-mono text-sm font-bold uppercase tracking-wide text-brutal-black"
        >
          {t('settings.confirmRebootTitle')}
        </h3>
        <p className="mt-3 font-sans text-sm text-brutal-black">
          {t('settings.confirmRebootBody')}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={closeRebootDialog}
            className="border-2 border-brutal-black bg-brutal-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide"
          >
            {t('settings.cancel')}
          </button>
          <button
            type="button"
            onClick={confirmReboot}
            className="border-2 border-brutal-black bg-brutal-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-brutal-white"
          >
            {t('settings.confirm')}
          </button>
        </div>
      </dialog>
    </div>
  )
}
