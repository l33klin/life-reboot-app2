import { useCallback, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  parseProtocolImport,
  serializeProtocolExport,
} from '../../utils/protocolBackup'
import { useStore } from '../../store/useStore'

const EXPORT_FILENAME = 'life-reboot-protocol-backup.json'

export function Settings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const importInputId = useId()
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
    a.download = EXPORT_FILENAME
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
          <label
            htmlFor={importInputId}
            className="inline-block cursor-pointer border-2 border-brutal-black bg-brutal-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-brutal-black hover:bg-brutal-black hover:text-brutal-white"
          >
            {t('settings.import')}
          </label>
          <input
            id={importInputId}
            data-testid="settings-import-input"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              handleImportFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
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
