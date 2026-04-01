import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../store/useStore'

export function parseQuestLines(quests: string): string[] {
  return quests
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

type QuestChecklistProps = {
  questLines: string[]
}

export function QuestChecklist({ questLines }: QuestChecklistProps) {
  const { t } = useTranslation()
  const alignDailyQuestProgress = useStore((s) => s.alignDailyQuestProgress)
  const progress = useStore((s) => s.dailyQuestProgress)
  const setDailyQuestChecked = useStore((s) => s.setDailyQuestChecked)
  const resetDailyQuestProgress = useStore((s) => s.resetDailyQuestProgress)

  const linesSignature = questLines.join('\0')
  useEffect(() => {
    alignDailyQuestProgress(questLines.length)
  }, [alignDailyQuestProgress, questLines.length, linesSignature])

  const checkedRow =
    progress?.checked.length === questLines.length ? progress.checked : null

  if (questLines.length === 0) {
    return (
      <p className="text-sm text-brutal-black/60">{t('dashboard.questsEmpty')}</p>
    )
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3" aria-label={t('dashboard.questsHeading')}>
        {questLines.map((label, index) => (
          <li key={`${index}-${label}`} className="flex items-start gap-3">
            <input
              type="checkbox"
              id={`dashboard-quest-${index}`}
              checked={Boolean(checkedRow?.[index])}
              onChange={(e) =>
                setDailyQuestChecked(index, e.target.checked)
              }
              className="mt-1 h-4 w-4 border-brutal-black accent-brutal-black"
            />
            <label
              htmlFor={`dashboard-quest-${index}`}
              className="font-sans text-sm text-brutal-black"
            >
              {label}
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => resetDailyQuestProgress(questLines.length)}
        className="border border-brutal-black bg-brutal-white px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-brutal-black"
      >
        {t('dashboard.resetQuests')}
      </button>
    </div>
  )
}
