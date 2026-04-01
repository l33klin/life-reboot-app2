import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ImmersiveFieldGroup,
  ImmersiveInput,
} from '../../components/ImmersiveInput'
import { useStore } from '../../store/useStore'

const INTERRUPT_KEYS = ['1', '2', '3'] as const

export function Evening() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get('step') || '1', 10)

  const morning = useStore((s) => s.morning)
  const interrupts = useStore((s) => s.daytime.interrupts)
  const evening = useStore((s) => s.evening)
  const setEvening = useStore((s) => s.setEvening)
  const completeProtocol = useStore((s) => s.completeProtocol)

  const morningAntiVision = morning.antiVision.trim()
  const morningVision = morning.vision.trim()

  function handleComplete() {
    completeProtocol()
    // `HomeRedirect` only reacts on `/`; imperative navigation keeps a single
    // completion path from this route even if global guards change later.
    navigate('/dashboard')
  }

  const handleNext = () => {
    if (step < 4) {
      setSearchParams({ step: String(step + 1) })
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setSearchParams({ step: String(step - 1) })
    } else {
      navigate('/wizard/daytime')
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="immersive-wizard-chrome transition-opacity duration-300">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-brutal-black">
          {t('wizard.evening.title')}
        </h1>
        <p className="mt-2 font-sans text-sm text-brutal-black/70">
          {t('wizard.evening.subtitle')}
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-16">
        <section
          aria-label={t('wizard.evening.reviewHeading')}
          className="immersive-wizard-chrome space-y-10 font-sans text-sm text-brutal-black/90"
        >
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brutal-black">
            {t('wizard.evening.reviewHeading')}
          </h2>

          <div className="space-y-6">
            <div>
              <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brutal-black/50">
                {t('wizard.morning.antiVisionLabel')}
              </p>
              <p
                data-testid="evening-review-anti-vision"
                className="mt-2 whitespace-pre-wrap border-l-2 border-brutal-black/20 pl-4 font-sans text-base leading-relaxed text-brutal-black"
              >
                {morningAntiVision || t('wizard.evening.notAnswered')}
              </p>
            </div>
            <div>
              <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brutal-black/50">
                {t('wizard.morning.visionLabel')}
              </p>
              <p
                data-testid="evening-review-vision"
                className="mt-2 whitespace-pre-wrap border-l-2 border-brutal-black/20 pl-4 font-sans text-base leading-relaxed text-brutal-black"
              >
                {morningVision || t('wizard.evening.notAnswered')}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brutal-black/50">
              {t('wizard.daytime.title')}
            </p>
            <ul className="space-y-6">
              {INTERRUPT_KEYS.map((key) => {
                const text = interrupts[key]?.trim() ?? ''
                return (
                  <li key={key}>
                    <p className="font-sans text-xs text-brutal-black/60">
                      {t(`reflect.questions.${key}`)}
                    </p>
                    <p
                      data-testid={`evening-review-interrupt-${key}`}
                      className="mt-2 whitespace-pre-wrap border-l-2 border-brutal-black/20 pl-4 font-sans text-base leading-relaxed text-brutal-black"
                    >
                      {text || t('wizard.evening.notAnswered')}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section aria-label={t('wizard.evening.synthesisHeading')} className="flex flex-col">
          <h2 className="immersive-wizard-chrome font-mono text-xs font-bold uppercase tracking-[0.2em] text-brutal-black">
            {t('wizard.evening.synthesisHeading')}
          </h2>

          <ImmersiveFieldGroup>
            <div className="mt-8 flex-grow">
              {step === 1 && (
                <ImmersiveInput
                  data-testid="evening-mission"
                  label={t('wizard.evening.missionLabel')}
                  description={t('wizard.evening.missionDescription')}
                  example={t('wizard.evening.missionExample')}
                  value={evening.mission}
                  onChange={(v) => setEvening({ mission: v })}
                />
              )}
              {step === 2 && (
                <ImmersiveInput
                  data-testid="evening-boss-fight"
                  label={t('wizard.evening.bossFightLabel')}
                  description={t('wizard.evening.bossFightDescription')}
                  example={t('wizard.evening.bossFightExample')}
                  value={evening.bossFight}
                  onChange={(v) => setEvening({ bossFight: v })}
                />
              )}
              {step === 3 && (
                <ImmersiveInput
                  data-testid="evening-quests"
                  label={t('wizard.evening.questsLabel')}
                  description={t('wizard.evening.questsDescription')}
                  example={t('wizard.evening.questsExample')}
                  value={evening.quests}
                  onChange={(v) => setEvening({ quests: v })}
                />
              )}
              {step === 4 && (
                <ImmersiveInput
                  data-testid="evening-rules"
                  label={t('wizard.evening.rulesLabel')}
                  description={t('wizard.evening.rulesDescription')}
                  example={t('wizard.evening.rulesExample')}
                  value={evening.rules}
                  onChange={(v) => setEvening({ rules: v })}
                />
              )}
            </div>
          </ImmersiveFieldGroup>

          <div className="immersive-wizard-chrome mt-16 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="border-2 border-brutal-black bg-brutal-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-black transition-colors hover:bg-brutal-black hover:text-brutal-white"
            >
              {t('wizard.back', 'Back')}
            </button>
            <button
              type="button"
              data-testid="evening-complete"
              onClick={handleNext}
              className="border-2 border-brutal-black bg-brutal-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-white transition-colors hover:bg-brutal-white hover:text-brutal-black"
            >
              {step === 4 ? t('wizard.evening.complete') : t('wizard.next', 'Next')}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
