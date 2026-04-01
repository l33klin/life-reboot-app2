import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { generateInterrupts } from '../../utils/icsGenerator'
import { useStore } from '../../store/useStore'
import { ImmersiveFieldGroup, ImmersiveInput } from '../../components/ImmersiveInput'
import { useEffect, useState } from 'react'

export function DaytimeSetup() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get('step') || '1', 10)

  const interrupts = useStore((s) => s.daytime.interrupts)
  const setDaytimeInterrupt = useStore((s) => s.setDaytimeInterrupt)

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [saved])

  function handleDownloadIcs() {
    const ics = generateInterrupts({
      date: new Date(),
      baseUrl: window.location.origin,
      titles: [
        t('reflect.titles.1'),
        t('reflect.titles.2'),
        t('reflect.titles.3'),
        t('reflect.titles.4'),
      ],
      description: t('privateBrowsing.warning'),
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

  const handleNext = () => {
    if (step < 4) {
      setSearchParams({ step: String(step + 1) })
    } else {
      navigate('/wizard/evening')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setSearchParams({ step: String(step - 1) })
    } else {
      navigate('/wizard?step=2')
    }
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

      {step === 1 && (
        <div className="immersive-wizard-chrome mt-12 space-y-6 font-sans text-sm text-brutal-black/80">
          <p>{t('wizard.daytime.scheduleIntro')}</p>
          <ul className="list-inside list-disc space-y-1">
            <li>{t('wizard.daytime.slot1')}</li>
            <li>{t('wizard.daytime.slot2')}</li>
            <li>{t('wizard.daytime.slot3')}</li>
            <li>{t('wizard.daytime.slot4')}</li>
          </ul>
          <p>{t('wizard.daytime.calendarHint')}</p>
          <button
            type="button"
            data-testid="daytime-download-ics"
            onClick={handleDownloadIcs}
            className="mt-4 border-2 border-brutal-black bg-brutal-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-black transition-colors hover:bg-brutal-black hover:text-brutal-white"
          >
            {t('wizard.daytime.download')}
          </button>
        </div>
      )}

      {step > 1 && step <= 4 && (
        <ImmersiveFieldGroup>
          <div className="mt-12">
            <p className="mb-8 font-sans text-xl font-bold text-brutal-black">
              {t(`reflect.questions.${step - 1}`)}
            </p>
            <ImmersiveInput
              data-testid="reflect-answer"
              label={t('reflect.answerLabel')}
              description={t('reflect.answerDescription')}
              value={interrupts[String(step - 1)] || ''}
              onChange={(v) => {
                setDaytimeInterrupt(String(step - 1), v)
                setSaved(true)
              }}
            />
          </div>
        </ImmersiveFieldGroup>
      )}

      {step > 1 && step <= 4 && (
        <div className="mt-10 space-y-4 h-10">
          {saved ? (
            <p
              role="status"
              data-testid="reflect-saved"
              className="font-sans text-sm text-green-800 transition-opacity duration-500"
            >
              {t('reflect.saved')}
            </p>
          ) : null}
        </div>
      )}

      <div className="immersive-wizard-chrome mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="border-2 border-brutal-black bg-brutal-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-black transition-colors hover:bg-brutal-black hover:text-brutal-white"
        >
          {t('wizard.back', 'Back')}
        </button>
        <button
          type="button"
          data-testid="daytime-next-evening"
          onClick={handleNext}
          className="border-2 border-brutal-black bg-brutal-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-white transition-colors hover:bg-brutal-white hover:text-brutal-black"
        >
          {step === 4 ? t('wizard.daytime.next') : t('wizard.next', 'Next')}
        </button>
      </div>
    </div>
  )
}
