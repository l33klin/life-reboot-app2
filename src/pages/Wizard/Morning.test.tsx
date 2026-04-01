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
          element={<h1 data-testid="daytime-setup-heading">Daytime Setup</h1>}
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

    const anti = screen.getByTestId('morning-anti-vision')
    const vision = screen.getByTestId('morning-vision')

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

    fireEvent.click(screen.getByTestId('morning-next-daytime'))

    expect(screen.getByTestId('daytime-setup-heading')).toBeInTheDocument()
  })
})
