import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import {
  clearProtocolStorage,
  initialPersistedState,
  useStore,
} from './store/useStore'

describe('App', () => {
  beforeEach(async () => {
    window.history.pushState({}, '', '/')
    await clearProtocolStorage()
    useStore.setState(initialPersistedState)
    await useStore.persist.rehydrate()
  })

  it('renders landing page when protocol is in progress', async () => {
    render(<App />)
    await waitFor(
      () => {
        expect(
          screen.getByText(/Most people try to build a great life/i),
        ).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })

  it('renders landing page with dashboard link when protocol is completed', async () => {
    useStore.setState({ status: 'completed' })
    render(<App />)
    await waitFor(
      () => {
        expect(
          screen.getByText(/Go to Dashboard/i),
        ).toBeInTheDocument()
      },
      { timeout: 5000 },
    )
  })
})
