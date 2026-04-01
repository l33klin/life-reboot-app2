import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { ArticleZh } from './ArticleZh'
import { useTranslation } from 'react-i18next'

export function Landing() {
  const { i18n } = useTranslation()
  const status = useStore((s) => s.status)
  const isZh = i18n.language.startsWith('zh')

  return (
    <div className="mx-auto max-w-4xl">
      {/* Hero Section */}
      <div className="bg-brutal-black text-brutal-white p-10 sm:p-16 mb-16 shadow-[12px_12px_0_0_rgba(0,0,0,0.15)]">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-8">
          {isZh ? (
            <>
              大多数人试图在腐烂的地基上建立美好的生活。<br />
              <span className="text-red-500">今天，我们将彻底摧毁它。</span>
            </>
          ) : (
            <>
              Most people try to build a great life on a rotting foundation.<br />
              <span className="text-red-500">Today, we tear it down.</span>
            </>
          )}
        </h1>
        <p className="text-xl sm:text-2xl font-sans mb-12 opacity-90 leading-relaxed font-bold">
          {isZh ? (
            <>
              你之所以没有过上想要的生活，是因为你害怕到达那里。<br />
              打破自动驾驶模式。直面你最深层的恐惧。把人生变成一场游戏。
            </>
          ) : (
            <>
              You aren't where you want to be because you're afraid to be there.<br />
              Break the autopilot. Face your deepest fears. Turn your life into a video game.
            </>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            to={status === 'completed' ? '/dashboard' : '/wizard?step=1'}
            className="bg-brutal-white text-brutal-black border-4 border-brutal-white px-8 py-4 font-mono font-black text-lg uppercase tracking-widest hover:bg-transparent hover:text-brutal-white transition-colors text-center"
          >
            {status === 'completed'
              ? (isZh ? '进入控制台 (Dashboard)' : 'Go to Dashboard')
              : (isZh ? '开始人生重启协议' : 'Start Life Reboot Protocol')}
          </Link>
          <a
            href="#article"
            className="bg-transparent text-brutal-white border-4 border-brutal-white px-8 py-4 font-mono font-black text-lg uppercase tracking-widest hover:bg-brutal-white hover:text-brutal-black transition-colors text-center"
          >
            {isZh ? '阅读理论来源 ↓' : 'Read the Theory ↓'}
          </a>
        </div>
      </div>

      {/* Article Section */}
      <div id="article" className="mt-20">
        {isZh ? (
          <ArticleZh />
        ) : (
          <div className="font-sans text-brutal-black/90 leading-relaxed space-y-6 pb-20">
            <header className="mb-12 border-b-4 border-brutal-black pb-8">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">How to fix your entire life in 1 day</h1>
              <p className="text-xl font-mono text-brutal-black/60 uppercase tracking-widest">do this before 2026</p>
              <p className="mt-6 font-bold">By DAN KOE</p>
            </header>
            <p className="italic">
              This application is based on the framework designed by Dan Koe.
              To read the full original article, please visit his newsletter:
            </p>
            <a
              href="https://letters.thedankoe.com/p/how-to-fix-your-entire-life-in-1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-bold underline hover:text-red-600 transition-colors"
            >
              Read the original article on The Dan Koe Letter
            </a>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t-4 border-brutal-black pt-12 pb-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">
          {isZh ? '准备好开始了吗？' : 'Ready to begin?'}
        </h2>
        <Link
          to={status === 'completed' ? '/dashboard' : '/wizard?step=1'}
          className="inline-block bg-brutal-black text-brutal-white border-4 border-brutal-black px-10 py-5 font-mono font-black text-xl uppercase tracking-widest hover:bg-transparent hover:text-brutal-black transition-colors"
        >
          {status === 'completed'
            ? (isZh ? '进入控制台 (Dashboard)' : 'Go to Dashboard')
            : (isZh ? '开始人生重启协议' : 'Start Life Reboot Protocol')}
        </Link>
      </div>
    </div>
  )
}
