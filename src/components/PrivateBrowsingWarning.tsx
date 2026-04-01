import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** Below this quota (bytes), storage is treated as too small for reliable persistence. */
export const MIN_RELIABLE_STORAGE_QUOTA_BYTES = 10 * 1024 * 1024

export function PrivateBrowsingWarning() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const estimate = navigator.storage?.estimate
    if (!estimate) return

    let cancelled = false
    void estimate
      .call(navigator.storage)
      .then(({ quota }) => {
        if (cancelled) return
        if (typeof quota === 'number' && quota < MIN_RELIABLE_STORAGE_QUOTA_BYTES) {
          setShow(true)
        }
      })
      .catch(() => {
        if (!cancelled) setShow(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!show) return null

  return (
    <div
      role="alert"
      className="border-b border-brutal-black bg-amber-100 px-4 py-2 font-sans text-sm text-brutal-black"
    >
      {t('privateBrowsing.warning')}
    </div>
  )
}
