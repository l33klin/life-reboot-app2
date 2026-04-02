import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing/Landing'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Settings } from './pages/Settings/Settings'
import { DaytimeSetup } from './pages/Wizard/DaytimeSetup'
import { Evening } from './pages/Wizard/Evening'
import { Morning } from './pages/Wizard/Morning'
import { useStore } from './store/useStore'

const ALLOWED_HOSTS = import.meta.env.VITE_ALLOWED_HOSTS?.split(',').map((h: string) => h.trim()) || []

function HostGuard({ children }: { children: React.ReactNode }) {
  const currentHost = window.location.hostname
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  if (ALLOWED_HOSTS.length > 0 && !ALLOWED_HOSTS.includes(currentHost)) {
    return (
      <div className="min-h-screen bg-brutal-black text-brutal-white flex items-center justify-center p-8 font-mono">
        <div className="border-4 border-brutal-white p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-6 text-red-500">
            {isZh ? '访问被拒绝' : 'Access Denied'}
          </h1>
          <p className="text-lg mb-4">
            {isZh ? '当前域名未被授权访问此应用：' : 'The current host is not authorized to serve this application:'}
          </p>
          <div className="bg-brutal-white text-brutal-black p-4 font-bold text-xl mb-8">
            {currentHost}
          </div>
          <p className="text-sm text-brutal-white/70">
            {isZh ? '如果您是管理员，请检查 VITE_ALLOWED_HOSTS 环境变量配置。' : 'If you are the administrator, please check the VITE_ALLOWED_HOSTS environment variable.'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function ReflectRedirect() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')
  if (q && ['1', '2', '3'].includes(q)) {
    return <Navigate to={`/wizard/daytime?step=${parseInt(q) + 1}`} replace />
  }
  return <Navigate to="/wizard/daytime" replace />
}

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
      <HostGuard>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/wizard" element={<Morning />} />
            <Route path="/wizard/daytime" element={<DaytimeSetup />} />
            <Route path="/wizard/evening" element={<Evening />} />
            <Route path="/reflect" element={<ReflectRedirect />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HostGuard>
    </BrowserRouter>
  )
}

export default App
