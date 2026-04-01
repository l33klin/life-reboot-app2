import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const isEn = (i18n.language ?? 'en').startsWith('en')

  return (
    <div className="flex gap-1 font-mono text-xs uppercase tracking-wide">
      <button
        type="button"
        className={`rounded border border-brutal-black px-2 py-1 ${
          isEn ? 'bg-brutal-black text-brutal-white' : 'bg-transparent'
        }`}
        aria-pressed={isEn}
        onClick={() => void i18n.changeLanguage('en')}
      >
        {t('layout.langEn')}
      </button>
      <button
        type="button"
        className={`rounded border border-brutal-black px-2 py-1 ${
          !isEn ? 'bg-brutal-black text-brutal-white' : 'bg-transparent'
        }`}
        aria-pressed={!isEn}
        onClick={() => void i18n.changeLanguage('zh')}
      >
        {t('layout.langZh')}
      </button>
    </div>
  )
}
