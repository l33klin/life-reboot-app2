import { Outlet, Link } from 'react-router-dom'
import { LanguageToggle } from './LanguageToggle'
import { PrivateBrowsingWarning } from './PrivateBrowsingWarning'
import { Settings, Github } from 'lucide-react'

export function Layout() {
  return (
    <div className="min-h-screen bg-brutal-white font-sans text-brutal-black">
      <PrivateBrowsingWarning />
      <header className="flex items-center justify-between border-b border-brutal-black px-4 py-3">
        <Link to="/" className="font-bold text-xl tracking-tight uppercase hover:bg-brutal-black hover:text-brutal-white px-2 py-1 transition-colors">
          Life Reboot
        </Link>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <a 
            href="https://github.com/l33klin/life-reboot-app2" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 hover:bg-brutal-black hover:text-brutal-white transition-colors" 
            aria-label="GitHub Repository"
          >
            <Github size={20} />
          </a>
          <Link to="/settings" className="p-2 hover:bg-brutal-black hover:text-brutal-white transition-colors" aria-label="Settings">
            <Settings size={20} />
          </Link>
        </div>
      </header>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  )
}
