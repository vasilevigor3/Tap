import { create } from 'zustand'

export const useBaseStore = create((set) => ({
    tg: null,
    userId: null,
    setTg: (tg: TGUser) => set(() => ({
        tg: tg,
        userId: tg?.initDataUnsafe?.user?.id
    })),
    removeTg: () => set({ tg: null }),
    removeUserId: () => set({ userId: null }),
}))