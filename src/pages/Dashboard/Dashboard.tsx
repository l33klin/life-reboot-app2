import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { QuestChecklist, parseQuestLines } from '../../components/QuestChecklist'
import { useStore } from '../../store/useStore'

export function Dashboard() {
  const { t } = useTranslation()
  const morning = useStore((s) => s.morning)
  const evening = useStore((s) => s.evening)

  const anti = morning.antiVision.trim()
  const vision = morning.vision.trim()
  const placeholder = t('wizard.evening.notAnswered')

  const questLines = useMemo(
    () => parseQuestLines(evening.quests),
    [evening.quests],
  )

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-brutal-black">
        {t('dashboard.title')}
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <section
          data-testid="dashboard-stakes"
          aria-label={t('dashboard.stakesLabel')}
          className="border-2 border-red-900 bg-red-950/10 p-6"
        >
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red-900">
            {t('dashboard.stakesHeading')}
          </h2>
          <p className="mt-3 font-sans text-sm text-brutal-black">
            {anti || placeholder}
          </p>
        </section>
        <section
          data-testid="dashboard-win"
          aria-label={t('dashboard.winLabel')}
          className="border-2 border-green-700 bg-green-50 p-6"
        >
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-800">
            {t('dashboard.winHeading')}
          </h2>
          <p className="mt-3 font-sans text-sm text-brutal-black">
            {vision || placeholder}
          </p>
        </section>
      </div>

      <section
        aria-label={t('dashboard.objectivesHeading')}
        className="space-y-6 border border-brutal-black p-6"
      >
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brutal-black">
          {t('dashboard.objectivesHeading')}
        </h2>
        <div className="space-y-4 font-sans text-sm">
          <div data-testid="dashboard-mission">
            <span className="font-bold">{t('wizard.evening.missionLabel')}: </span>
            <span>{evening.mission.trim() || placeholder}</span>
          </div>
          <div data-testid="dashboard-boss-fight">
            <span className="font-bold">
              {t('wizard.evening.bossFightLabel')}:{' '}
            </span>
            <span>{evening.bossFight.trim() || placeholder}</span>
          </div>
          <div data-testid="dashboard-rules">
            <span className="font-bold">{t('wizard.evening.rulesLabel')}: </span>
            <span>{evening.rules.trim() || placeholder}</span>
          </div>
        </div>
      </section>

      <section
        aria-label={t('dashboard.questsSectionLabel')}
        className="border border-brutal-black p-6"
      >
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brutal-black">
          {t('dashboard.questsHeading')}
        </h2>
        <div className="mt-4">
          <QuestChecklist questLines={questLines} />
        </div>
      </section>
    </div>
  )
}
