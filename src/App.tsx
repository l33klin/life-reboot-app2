import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing/Landing'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Reflect } from './pages/Reflect/Reflect'
import { Settings } from './pages/Settings/Settings'
import { DaytimeSetup } from './pages/Wizard/DaytimeSetup'
import { Evening } from './pages/Wizard/Evening'
import { Morning } from './pages/Wizard/Morning'
import { useStore } from './store/useStore'

function HomeRedirect() {
  const { t } = useTranslation()
  const [hydrated, setHydrated] = useState(() =>
    useStore.persist.hasHydrated(),
  )

  useEffect(() => {
    if (useStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    return useStore.persist.onFinishHydration(() => setHydrated(true))
  }, [])

  if (!hydrated) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        role="status"
        className="font-mono text-sm uppercase tracking-tight text-brutal-black"
      >
        <span aria-hidden="true">…</span>
        <span className="sr-only">{t('home.loading')}</span>
      </div>
    )
  }

  return <Landing />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/wizard" element={<Morning />} />
          <Route path="/wizard/daytime" element={<DaytimeSetup />} />
          <Route path="/wizard/evening" element={<Evening />} />
          <Route path="/reflect" element={<Reflect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
