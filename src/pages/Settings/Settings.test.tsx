import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import {
  clearProtocolStorage,
  initialPersistedState,
  initialProtocolState,
  useStore,
} from '../../store/useStore'
import {
  parseProtocolImport,
  serializeProtocolExport,
  Settings,
} from './Settings'

function renderSettings() {
  return render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>,
  )
}

describe('archiveProtocol', () => {
  beforeEach(async () => {
    await clearProtocolStorage()
    useStore.setState({ ...initialPersistedState })
    await useStore.persist.rehydrate()
  })

  it('appends current protocol to archives and resets active state to in_progress', () => {
    useStore.setState({
      status: 'completed',
      morning: { antiVision: 'old anti', vision: 'old vision' },
      daytime: { interrupts: { '1': 'a' } },
      evening: {
        mission: 'm',
        bossFight: 'b',
        quests: 'q',
        rules: 'r',
      },
      dailyQuestProgress: { dateKey: '2026-01-01', checked: [true, false] },
      archives: [],
    })

    useStore.getState().archiveProtocol()

    const s = useStore.getState()
    expect(s.status).toBe('in_progress')
    expect(s.morning).toEqual(initialProtocolState.morning)
    expect(s.daytime).toEqual(initialProtocolState.daytime)
    expect(s.evening).toEqual(initialProtocolState.evening)
    expect(s.dailyQuestProgress).toBeNull()
    expect(s.archives).toHaveLength(1)
    expect(s.archives[0]).toEqual({
      morning: { antiVision: 'old anti', vision: 'old vision' },
      daytime: { interrupts: { '1': 'a' } },
      evening: {
        mission: 'm',
        bossFight: 'b',
        quests: 'q',
        rules: 'r',
      },
      status: 'completed',
      dailyQuestProgress: { dateKey: '2026-01-01', checked: [true, false] },
    })
  })

  it('preserves existing archives when archiving again', () => {
    const first = {
      morning: { antiVision: 'one', vision: 'v1' },
      daytime: { interrupts: {} as Record<string, string> },
      evening: initialProtocolState.evening,
      status: 'completed' as const,
      dailyQuestProgress: null as null,
    }
    useStore.setState({
      ...initialProtocolState,
      morning: { antiVision: 'two', vision: 'v2' },
      archives: [first],
    })

    useStore.getState().archiveProtocol()

    expect(useStore.getState().archives).toHaveLength(2)
    expect(useStore.getState().archives[0]).toEqual(first)
    expect(useStore.getState().morning.antiVision).toBe('')
  })
})

describe('serializeProtocolExport / parseProtocolImport', () => {
  it('round-trips valid export JSON', () => {
    const state = {
      morning: { antiVision: 'x', vision: 'y' },
      daytime: { interrupts: {} },
      evening: initialProtocolState.evening,
      status: 'in_progress' as const,
      dailyQuestProgress: null,
      archives: [
        {
          morning: { antiVision: 'a', vision: 'b' },
          daytime: { interrupts: {} },
          evening: initialProtocolState.evening,
          status: 'completed' as const,
          dailyQuestProgress: null,
        },
      ],
    }
    const json = serializeProtocolExport(state)
    const parsed = parseProtocolImport(json)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.data.morning).toEqual(state.morning)
    expect(parsed.data.archives).toEqual(state.archives)
  })

  it('rejects invalid JSON', () => {
    const r = parseProtocolImport('not json')
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.error).toMatch(/json/i)
  })

  it('rejects wrong version', () => {
    const r = parseProtocolImport(
      JSON.stringify({
        version: 999,
        morning: initialProtocolState.morning,
        daytime: initialProtocolState.daytime,
        evening: initialProtocolState.evening,
        status: 'in_progress',
        dailyQuestProgress: null,
        archives: [],
      }),
    )
    expect(r.ok).toBe(false)
  })

  it('rejects malformed protocol shape', () => {
    const r = parseProtocolImport(
      JSON.stringify({
        version: 1,
        morning: null,
        daytime: initialProtocolState.daytime,
        evening: initialProtocolState.evening,
        status: 'in_progress',
        dailyQuestProgress: null,
        archives: [],
      }),
    )
    expect(r.ok).toBe(false)
  })
})

describe('Settings UI', () => {
  beforeEach(async () => {
    await clearProtocolStorage()
    useStore.setState({ ...initialPersistedState })
    await useStore.persist.rehydrate()
    vi.restoreAllMocks()
  })

  it('Initiate New Reboot opens confirmation and archives on confirm', async () => {
    const user = userEvent.setup()
    useStore.setState({
      status: 'completed',
      morning: { antiVision: 'keep', vision: 'me' },
    })

    renderSettings()

    await user.click(
      screen.getByRole('button', { name: /initiate new reboot/i }),
    )
    expect(
      screen.getByRole('dialog', { name: /confirm new reboot/i }),
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: /^confirm$/i }))

    await waitFor(() => {
      expect(useStore.getState().archives).toHaveLength(1)
      expect(useStore.getState().status).toBe('in_progress')
    })
  })

  it('cancel closes reboot confirmation without archiving', async () => {
    const user = userEvent.setup()
    useStore.setState({
      morning: { antiVision: 'n', vision: 'o' },
    })

    renderSettings()
    await user.click(
      screen.getByRole('button', { name: /initiate new reboot/i }),
    )
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(useStore.getState().archives).toHaveLength(0)
    expect(useStore.getState().morning.antiVision).toBe('n')
  })

  it('import applies valid JSON to the store', async () => {
    const user = userEvent.setup()
    const json = serializeProtocolExport({
      morning: { antiVision: 'imp', vision: 'orted' },
      daytime: { interrupts: { '2': 'x' } },
      evening: {
        mission: 'M',
        bossFight: 'B',
        quests: 'Q',
        rules: 'R',
      },
      status: 'completed',
      dailyQuestProgress: null,
      archives: [],
    })

    renderSettings()

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    const file = new File([json], 'backup.json', { type: 'application/json' })
    await user.upload(input, file)

    await waitFor(() => {
      expect(useStore.getState().morning.antiVision).toBe('imp')
      expect(useStore.getState().status).toBe('completed')
      expect(useStore.getState().daytime.interrupts['2']).toBe('x')
    })
  })

  it('import shows error for invalid file', async () => {
    const user = userEvent.setup()
    renderSettings()

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    const file = new File(['{'], 'bad.json', { type: 'application/json' })
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
