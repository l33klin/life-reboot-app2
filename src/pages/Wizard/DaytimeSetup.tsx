import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { generateInterrupts } from '../../utils/icsGenerator'

export function DaytimeSetup() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleDownloadIcs() {
    const ics = generateInterrupts({
      date: new Date(),
      baseUrl: window.location.origin,
    })
    const blob = new Blob([ics], {
      type: 'text/calendar;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'life-reboot-daytime-interrupts.ics'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="immersive-wizard-chrome transition-opacity duration-300">
        <h1
          data-testid="daytime-setup-heading"
          className="font-mono text-2xl font-bold uppercase tracking-tight text-brutal-black"
        >
          {t('wizard.daytime.title')}
        </h1>
        <p className="mt-2 font-sans text-sm text-brutal-black/70">
          {t('wizard.daytime.subtitle')}
        </p>
      </div>

      <div className="immersive-wizard-chrome mt-12 space-y-6 font-sans text-sm text-brutal-black/80">
        <p>{t('wizard.daytime.scheduleIntro')}</p>
        <ul className="list-inside list-disc space-y-1">
          <li>{t('wizard.daytime.slot1')}</li>
          <li>{t('wizard.daytime.slot2')}</li>
          <li>{t('wizard.daytime.slot3')}</li>
        </ul>
        <p>{t('wizard.daytime.calendarHint')}</p>
      </div>

      <div className="immersive-wizard-chrome mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          data-testid="daytime-download-ics"
          onClick={handleDownloadIcs}
          className="border-2 border-brutal-black bg-brutal-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-black transition-colors hover:bg-brutal-black hover:text-brutal-white"
        >
          {t('wizard.daytime.download')}
        </button>
        <button
          type="button"
          data-testid="daytime-next-evening"
          onClick={() => navigate('/wizard/evening')}
          className="border-2 border-brutal-black bg-brutal-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-white transition-colors hover:bg-brutal-white hover:text-brutal-black"
        >
          {t('wizard.daytime.next')}
        </button>
      </div>
    </div>
  )
}
