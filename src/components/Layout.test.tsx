import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout'
import { MIN_RELIABLE_STORAGE_QUOTA_BYTES } from './PrivateBrowsingWarning'
import i18n from '../i18n/config'

function renderLayoutAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<span>home</span>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Layout', () => {
  beforeEach(() => {
    void i18n.changeLanguage('en')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('LanguageToggle switches language', async () => {
    renderLayoutAt('/')

    expect(i18n.language).toMatch(/^en/)

    fireEvent.click(screen.getByRole('button', { name: '中文' }))
    await waitFor(() => {
      expect(i18n.language).toMatch(/^zh/)
    })

    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    await waitFor(() => {
      expect(i18n.language).toMatch(/^en/)
    })
  })

  it('PrivateBrowsingWarning renders when storage quota is minimal', async () => {
    vi.stubGlobal('navigator', {
      ...globalThis.navigator,
      storage: {
        estimate: vi.fn().mockResolvedValue({
          quota: MIN_RELIABLE_STORAGE_QUOTA_BYTES - 1,
          usage: 0,
        }),
      },
    })

    renderLayoutAt('/')

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByRole('alert')).toHaveTextContent(
      /private|隐私|limited|存储/i,
    )
  })

  it('PrivateBrowsingWarning renders when storage estimate rejects', async () => {
    vi.stubGlobal('navigator', {
      ...globalThis.navigator,
      storage: {
        estimate: vi.fn().mockRejectedValue(new Error('denied')),
      },
    })

    renderLayoutAt('/')

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByRole('alert')).toHaveTextContent(
      /private|隐私|limited|存储/i,
    )
  })

  it('PrivateBrowsingWarning does not render when quota is ample', async () => {
    vi.stubGlobal('navigator', {
      ...globalThis.navigator,
      storage: {
        estimate: vi.fn().mockResolvedValue({
          quota: 500 * 1024 * 1024,
          usage: 0,
        }),
      },
    })

    renderLayoutAt('/')

    await waitFor(() => {
      expect(navigator.storage.estimate).toHaveBeenCalled()
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
