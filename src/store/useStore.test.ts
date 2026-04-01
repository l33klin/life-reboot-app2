import { beforeEach, describe, expect, it } from 'vitest'
import localforage from 'localforage'
import { initialProtocolState, useStore } from './useStore'

async function waitForHydration(): Promise<void> {
  await useStore.persist.rehydrate()
}

describe('useStore', () => {
  beforeEach(async () => {
    await localforage.clear()
    // Shallow merge so persist actions (e.g. setMorning) stay on the store
    useStore.setState(initialProtocolState)
    await waitForHydration()
  })

  it('has initial state with status in_progress and empty answers', async () => {
    await waitForHydration()

    const state = useStore.getState()

    expect(state.status).toBe('in_progress')
    expect(state.morning.antiVision).toBe('')
    expect(state.morning.vision).toBe('')
    expect(state.daytime.interrupts).toEqual({})
    expect(state.evening.mission).toBe('')
    expect(state.evening.bossFight).toBe('')
    expect(state.evening.quests).toBe('')
    expect(state.evening.rules).toBe('')
  })

  it('updates state via setMorning', async () => {
    await waitForHydration()

    useStore.getState().setMorning({ vision: 'Build discipline' })

    expect(useStore.getState().morning.vision).toBe('Build discipline')
    expect(useStore.getState().morning.antiVision).toBe('')
  })
})
