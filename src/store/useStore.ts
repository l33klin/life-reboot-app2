import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'
import localforage from 'localforage'

const protocolForage = localforage.createInstance({
  name: 'life-reboot-protocol',
  storeName: 'zustand',
})

/** Clears persisted protocol data in the same IndexedDB instance as the store. */
export async function clearProtocolStorage(): Promise<void> {
  await protocolForage.clear()
}

const forageStorage: StateStorage = {
  getItem: async (name) => {
    const value = await protocolForage.getItem<string>(name)
    return value ?? null
  },
  setItem: async (name, value) => {
    await protocolForage.setItem(name, value)
  },
  removeItem: async (name) => {
    await protocolForage.removeItem(name)
  },
}

export type ProtocolStatus = 'in_progress' | 'completed'

export interface ProtocolState {
  morning: {
    antiVision: string
    vision: string
  }
  daytime: {
    interrupts: Record<string, string>
  }
  evening: {
    mission: string
    bossFight: string
    quests: string
    rules: string
  }
  status: ProtocolStatus
}

export const initialProtocolState: ProtocolState = {
  morning: { antiVision: '', vision: '' },
  daytime: { interrupts: {} },
  evening: {
    mission: '',
    bossFight: '',
    quests: '',
    rules: '',
  },
  status: 'in_progress',
}

type ProtocolActions = {
  setMorning: (partial: Partial<ProtocolState['morning']>) => void
  setDaytimeInterrupt: (questionKey: string, answer: string) => void
  setEvening: (partial: Partial<ProtocolState['evening']>) => void
  completeProtocol: () => void
}

type Store = ProtocolState & ProtocolActions

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...initialProtocolState,
      setMorning: (partial) =>
        set((s) => ({ morning: { ...s.morning, ...partial } })),
      setDaytimeInterrupt: (questionKey, answer) =>
        set((s) => ({
          daytime: {
            interrupts: { ...s.daytime.interrupts, [questionKey]: answer },
          },
        })),
      setEvening: (partial) =>
        set((s) => ({ evening: { ...s.evening, ...partial } })),
      completeProtocol: () => set({ status: 'completed' }),
    }),
    {
      name: 'protocol-state',
      storage: createJSONStorage(() => forageStorage),
      partialize: (state) => ({
        morning: state.morning,
        daytime: state.daytime,
        evening: state.evening,
        status: state.status,
      }),
    },
  ),
)
