import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { Layout } from './components/Layout'
import { Morning } from './pages/Wizard/Morning'
import { useStore } from './store/useStore'

function HomeRedirect() {
  const { t } = useTranslation()
  const status = useStore((s) => s.status)
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

  if (status === 'completed') {
    return <Navigate to="/dashboard" replace />
  }
  return <Navigate to="/wizard" replace />
}

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-mono text-2xl font-bold uppercase tracking-tight">
        {title}
      </h1>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/wizard" element={<Morning />} />
          <Route
            path="/wizard/daytime"
            element={<Placeholder title="Daytime Setup" />}
          />
          <Route path="/reflect" element={<Placeholder title="Reflect" />} />
          <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
