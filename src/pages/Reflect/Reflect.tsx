import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  ImmersiveFieldGroup,
  ImmersiveInput,
} from '../../components/ImmersiveInput'
import { useStore } from '../../store/useStore'

const VALID_Q = new Set(['1', '2', '3'])

export function Reflect() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const qRaw = searchParams.get('q') ?? ''
  const q = VALID_Q.has(qRaw) ? qRaw : null

  const stored = useStore((s) =>
    q ? (s.daytime.interrupts[q] ?? '') : '',
  )
  const setDaytimeInterrupt = useStore((s) => s.setDaytimeInterrupt)

  const [saved, setSaved] = useState(false)

  const question = useMemo(() => {
    if (!q) return null
    return t(`reflect.questions.${q}`)
  }, [q, t])

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [saved])

  function handleChange(v: string) {
    if (!q) return
    setDaytimeInterrupt(q, v)
    setSaved(true)
  }

  if (!q) {
    return (
      <div className="mx-auto max-w-3xl">
        <p
          role="alert"
          className="font-sans text-sm text-brutal-black/80"
        >
          {t('reflect.invalid')}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="transition-opacity duration-300">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-brutal-black">
          {t('reflect.title')}
        </h1>
        <p className="mt-4 font-sans text-xl font-bold text-brutal-black">
          {question}
        </p>
      </div>

      <ImmersiveFieldGroup>
        <div className="mt-12">
          <ImmersiveInput
            data-testid="reflect-answer"
            label={t('reflect.answerLabel')}
            description={t('reflect.answerDescription')}
            value={stored}
            onChange={handleChange}
          />
        </div>
      </ImmersiveFieldGroup>

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
    </div>
  )
}
