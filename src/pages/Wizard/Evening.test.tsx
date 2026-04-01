import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  clearProtocolStorage,
  initialPersistedState,
  useStore,
} from '../../store/useStore'
import { Evening } from './Evening'

function renderEvening(initialPath = '/wizard/evening') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/wizard/evening" element={<Evening />} />
        <Route
          path="/dashboard"
          element={
            <h1 className="font-mono text-2xl font-bold uppercase tracking-tight">
              Dashboard
            </h1>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Evening synthesis', () => {
  beforeEach(async () => {
    await clearProtocolStorage()
    useStore.setState(initialPersistedState)
    await useStore.persist.rehydrate()
  })

  it('displays morning and daytime answers as read-only context', () => {
    useStore.setState({
      morning: {
        antiVision: 'Drift forever',
        vision: 'Build with focus',
      },
      daytime: {
        interrupts: {
          '1': 'Avoiding the hard email',
          '2': 'That I need rest',
        },
      },
    })

    renderEvening()

    expect(screen.getByTestId('evening-review-anti-vision')).toHaveTextContent(
      'Drift forever',
    )
    expect(screen.getByTestId('evening-review-vision')).toHaveTextContent(
      'Build with focus',
    )
    expect(screen.getByTestId('evening-review-interrupt-1')).toHaveTextContent(
      'Avoiding the hard email',
    )
    expect(screen.getByTestId('evening-review-interrupt-2')).toHaveTextContent(
      'That I need rest',
    )
  })

  it('shows not-answered for empty or whitespace-only review text and missing interrupt 3', () => {
    useStore.setState({
      morning: { antiVision: '', vision: '  \t  ' },
      daytime: {
        interrupts: {
          '1': 'First answer',
          '2': '  ',
        },
      },
    })

    renderEvening()

    const placeholder = '—'
    expect(screen.getByTestId('evening-review-anti-vision')).toHaveTextContent(
      placeholder,
    )
    expect(screen.getByTestId('evening-review-vision')).toHaveTextContent(
      placeholder,
    )
    expect(screen.getByTestId('evening-review-interrupt-1')).toHaveTextContent(
      'First answer',
    )
    expect(screen.getByTestId('evening-review-interrupt-2')).toHaveTextContent(
      placeholder,
    )
    expect(screen.getByTestId('evening-review-interrupt-3')).toHaveTextContent(
      placeholder,
    )
  })

  it('saves Mission, Boss Fight, Quests, and Rules to the store when typed', async () => {
    const user = userEvent.setup()
    renderEvening()

    await user.type(
      screen.getByTestId('evening-mission'),
      'One year: ship the product',
    )
    await user.type(
      screen.getByTestId('evening-boss-fight'),
      'Finish the core loop',
    )
    await user.type(
      screen.getByTestId('evening-quests'),
      'Deep work block daily',
    )
    await user.type(
      screen.getByTestId('evening-rules'),
      'No phone before noon',
    )

    const s = useStore.getState()
    expect(s.evening.mission).toBe('One year: ship the product')
    expect(s.evening.bossFight).toBe('Finish the core loop')
    expect(s.evening.quests).toBe('Deep work block daily')
    expect(s.evening.rules).toBe('No phone before noon')
  })

  it('marks protocol completed and navigates to dashboard on submit', async () => {
    const user = userEvent.setup()
    useStore.setState({
      morning: { antiVision: 'A', vision: 'B' },
      daytime: { interrupts: { '1': 'C' } },
    })

    renderEvening()

    await user.type(screen.getByTestId('evening-mission'), 'Mission text')
    await user.type(screen.getByTestId('evening-boss-fight'), 'Boss text')
    await user.type(screen.getByTestId('evening-quests'), 'Quest text')
    await user.type(screen.getByTestId('evening-rules'), 'Rules text')

    await user.click(screen.getByTestId('evening-complete'))

    expect(useStore.getState().status).toBe('completed')
    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument()
  })
})
