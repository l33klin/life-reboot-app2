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

/** Local calendar date `YYYY-MM-DD` for daily quest progress rollover. */
export function getLocalDateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export type DailyQuestProgress = {
  dateKey: string
  checked: boolean[]
}

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
  /** Checked state for parsed daily quest lines; keyed by calendar day in `dateKey`. */
  dailyQuestProgress: DailyQuestProgress | null
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
  dailyQuestProgress: null,
}

type ProtocolActions = {
  setMorning: (partial: Partial<ProtocolState['morning']>) => void
  setDaytimeInterrupt: (questionKey: string, answer: string) => void
  setEvening: (partial: Partial<ProtocolState['evening']>) => void
  completeProtocol: () => void
  alignDailyQuestProgress: (questCount: number) => void
  setDailyQuestChecked: (index: number, checked: boolean) => void
  resetDailyQuestProgress: (questCount: number) => void
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
      alignDailyQuestProgress: (questCount) =>
        set((s) => {
          const dateKey = getLocalDateKey()
          const prev = s.dailyQuestProgress
          let checked: boolean[]
          if (!prev || prev.dateKey !== dateKey) {
            checked = Array(questCount).fill(false)
          } else if (prev.checked.length === questCount) {
            checked = prev.checked
          } else {
            checked = Array.from({ length: questCount }, (_, i) =>
              Boolean(prev.checked[i]),
            )
          }
          return { dailyQuestProgress: { dateKey, checked } }
        }),
      setDailyQuestChecked: (index, checked) =>
        set((s) => {
          const p = s.dailyQuestProgress
          if (!p || index < 0 || index >= p.checked.length) {
            return {}
          }
          const next = [...p.checked]
          next[index] = checked
          return { dailyQuestProgress: { ...p, checked: next } }
        }),
      resetDailyQuestProgress: (questCount) =>
        set({
          dailyQuestProgress: {
            dateKey: getLocalDateKey(),
            checked: Array(questCount).fill(false),
          },
        }),
    }),
    {
      name: 'protocol-state',
      storage: createJSONStorage(() => forageStorage),
      partialize: (state) => ({
        morning: state.morning,
        daytime: state.daytime,
        evening: state.evening,
        status: state.status,
        dailyQuestProgress: state.dailyQuestProgress,
      }),
    },
  ),
)
