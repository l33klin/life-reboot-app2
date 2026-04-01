import { Outlet } from 'react-router-dom'
import { LanguageToggle } from './LanguageToggle'
import { PrivateBrowsingWarning } from './PrivateBrowsingWarning'

export function Layout() {
  return (
    <div className="min-h-screen bg-brutal-white font-sans text-brutal-black">
      <PrivateBrowsingWarning />
      <header className="flex items-center justify-end border-b border-brutal-black px-4 py-3">
        <LanguageToggle />
      </header>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  )
}
