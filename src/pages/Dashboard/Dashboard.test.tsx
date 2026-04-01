import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import {
  clearProtocolStorage,
  initialPersistedState,
  useStore,
} from '../../store/useStore'
import { Dashboard } from './Dashboard'

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  )
}

describe('Dashboard', () => {
  beforeEach(async () => {
    await clearProtocolStorage()
    useStore.setState(initialPersistedState)
    await useStore.persist.rehydrate()
  })

  it('renders Stakes (Anti-Vision), Win (Vision), Mission, Boss Fight, and Rules', () => {
    useStore.setState({
      status: 'completed',
      morning: {
        antiVision: 'A life of regret',
        vision: 'A life of craft',
      },
      evening: {
        mission: 'Ship the reboot app',
        bossFight: 'Finish dashboard UX',
        quests: 'Line one\nLine two',
        rules: 'No doomscroll before noon',
      },
    })

    renderDashboard()

    expect(screen.getByTestId('dashboard-stakes')).toHaveTextContent(
      'A life of regret',
    )
    expect(screen.getByTestId('dashboard-win')).toHaveTextContent(
      'A life of craft',
    )
    expect(screen.getByTestId('dashboard-mission')).toHaveTextContent(
      'Ship the reboot app',
    )
    expect(screen.getByTestId('dashboard-boss-fight')).toHaveTextContent(
      'Finish dashboard UX',
    )
    expect(screen.getByTestId('dashboard-rules')).toHaveTextContent(
      'No doomscroll before noon',
    )
  })

  it('renders Daily Quests as checkboxes and allows toggling them', async () => {
    const user = userEvent.setup()
    useStore.setState({
      status: 'completed',
      evening: {
        mission: '',
        bossFight: '',
        quests: 'Morning walk\nDeep work block',
        rules: '',
      },
    })

    renderDashboard()

    const q1 = screen.getByRole('checkbox', { name: /morning walk/i })
    const q2 = screen.getByRole('checkbox', { name: /deep work block/i })

    expect(q1).not.toBeChecked()
    expect(q2).not.toBeChecked()

    await user.click(q1)
    expect(q1).toBeChecked()
    expect(q2).not.toBeChecked()

    await user.click(q1)
    expect(q1).not.toBeChecked()

    await user.click(q2)
    expect(q2).toBeChecked()
  })

  it('unchecks all quests when Reset daily quests is used', async () => {
    const user = userEvent.setup()
    useStore.setState({
      status: 'completed',
      evening: {
        mission: '',
        bossFight: '',
        quests: 'One\nTwo',
        rules: '',
      },
    })

    renderDashboard()

    await user.click(screen.getByRole('checkbox', { name: /^one$/i }))
    await user.click(screen.getByRole('checkbox', { name: /^two$/i }))
    expect(screen.getByRole('checkbox', { name: /^one$/i })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /^two$/i })).toBeChecked()

    await user.click(
      screen.getByRole('button', { name: /reset daily quests/i }),
    )
    expect(screen.getByRole('checkbox', { name: /^one$/i })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: /^two$/i })).not.toBeChecked()
  })
})
