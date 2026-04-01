import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  clearProtocolStorage,
  initialProtocolState,
  useStore,
} from '../../store/useStore'
import { Morning } from './Morning'

function renderMorning(initialPath = '/wizard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/wizard" element={<Morning />} />
        <Route
          path="/wizard/daytime"
          element={<h1>Daytime Setup</h1>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Morning wizard', () => {
  beforeEach(async () => {
    await clearProtocolStorage()
    useStore.setState(initialProtocolState)
    await useStore.persist.rehydrate()
  })

  it('saves Anti-Vision and Vision to the store when the user types', () => {
    renderMorning()

    const anti = screen.getByRole('textbox', {
      name: /^anti-vision$/i,
    })
    const vision = screen.getByRole('textbox', { name: /^vision$/i })

    fireEvent.change(anti, { target: { value: 'A life of drift and regret' } })
    fireEvent.change(vision, {
      target: { value: 'Focused craft and deep relationships' },
    })

    expect(useStore.getState().morning.antiVision).toBe(
      'A life of drift and regret',
    )
    expect(useStore.getState().morning.vision).toBe(
      'Focused craft and deep relationships',
    )
  })

  it('navigates to daytime setup when Next is clicked', () => {
    renderMorning()

    fireEvent.click(
      screen.getByRole('button', {
        name: /next: setup daytime interrupts/i,
      }),
    )

    expect(
      screen.getByRole('heading', { name: /daytime setup/i }),
    ).toBeInTheDocument()
  })
})
