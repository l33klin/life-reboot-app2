import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearProtocolStorage,
  initialProtocolState,
  useStore,
} from './useStore'

describe('useStore', () => {
  beforeEach(async () => {
    await clearProtocolStorage()
    // Shallow merge so persist actions (e.g. setMorning) stay on the store
    useStore.setState(initialProtocolState)
    await useStore.persist.rehydrate()
  })

  it('has initial state with status in_progress and empty answers', () => {
    const state = useStore.getState()

    expect(state.status).toBe('in_progress')
    expect(state.morning.antiVision).toBe('')
    expect(state.morning.vision).toBe('')
    expect(state.daytime.interrupts).toEqual({})
    expect(state.evening.mission).toBe('')
    expect(state.evening.bossFight).toBe('')
    expect(state.evening.quests).toBe('')
    expect(state.evening.rules).toBe('')
    expect(state.dailyQuestProgress).toBeNull()
  })

  it('updates state via setMorning', () => {
    useStore.getState().setMorning({ vision: 'Build discipline' })

    expect(useStore.getState().morning.vision).toBe('Build discipline')
    expect(useStore.getState().morning.antiVision).toBe('')
  })

  it('updates daytime interrupt answers via setDaytimeInterrupt', () => {
    useStore.getState().setDaytimeInterrupt('1', 'Email I keep postponing')

    expect(useStore.getState().daytime.interrupts['1']).toBe(
      'Email I keep postponing',
    )
  })
})
