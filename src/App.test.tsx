import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import {
  clearProtocolStorage,
  initialProtocolState,
  useStore,
} from './store/useStore'

describe('App', () => {
  beforeEach(async () => {
    window.history.pushState({}, '', '/')
    await clearProtocolStorage()
    useStore.setState(initialProtocolState)
    await useStore.persist.rehydrate()
  })

  it('redirects home to wizard when protocol is in progress', async () => {
    render(<App />)
    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', {
            name: /psychological excavation/i,
          }),
        ).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('redirects home to dashboard when protocol is completed', async () => {
    useStore.setState({ status: 'completed' })
    render(<App />)
    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /dashboard/i }),
        ).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })
})
