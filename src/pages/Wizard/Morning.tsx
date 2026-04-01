import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ImmersiveFieldGroup,
  ImmersiveInput,
} from '../../components/ImmersiveInput'
import { useStore } from '../../store/useStore'

export function Morning() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseInt(searchParams.get('step') || '1', 10)

  const antiVision = useStore((s) => s.morning.antiVision)
  const vision = useStore((s) => s.morning.vision)
  const setMorning = useStore((s) => s.setMorning)

  const handleNext = () => {
    if (step === 1) {
      setSearchParams({ step: '2' })
    } else {
      navigate('/wizard/daytime')
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setSearchParams({ step: '1' })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="immersive-wizard-chrome transition-opacity duration-300">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-brutal-black">
          {t('wizard.morning.title')}
        </h1>
        <p className="mt-2 font-sans text-sm text-brutal-black/70">
          {t('wizard.morning.subtitle')}
        </p>
      </div>

      <ImmersiveFieldGroup>
        <div className="mt-12">
          {step === 1 && (
            <ImmersiveInput
              data-testid="morning-anti-vision"
              label={t('wizard.morning.antiVisionLabel')}
              description={t('wizard.morning.antiVisionDescription')}
              example={t('wizard.morning.antiVisionExample')}
              value={antiVision}
              onChange={(v) => setMorning({ antiVision: v })}
            />
          )}
          {step === 2 && (
            <ImmersiveInput
              data-testid="morning-vision"
              label={t('wizard.morning.visionLabel')}
              description={t('wizard.morning.visionDescription')}
              example={t('wizard.morning.visionExample')}
              value={vision}
              onChange={(v) => setMorning({ vision: v })}
            />
          )}
        </div>
      </ImmersiveFieldGroup>

      <div className="immersive-wizard-chrome mt-16 transition-opacity duration-300 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className={`border-2 border-brutal-black bg-brutal-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-black transition-colors hover:bg-brutal-black hover:text-brutal-white ${
            step === 1 ? 'invisible' : ''
          }`}
        >
          {t('wizard.back')}
        </button>
        <button
          type="button"
          data-testid="morning-next-daytime"
          onClick={handleNext}
          className="border-2 border-brutal-black bg-brutal-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-tight text-brutal-white transition-colors hover:bg-brutal-white hover:text-brutal-black"
        >
          {step === 1 ? t('wizard.next') : t('wizard.morning.next')}
        </button>
      </div>
    </div>
  )
}
