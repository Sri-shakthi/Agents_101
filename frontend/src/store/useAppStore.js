import { create } from 'zustand'

const persistedAuth = (() => {
  try {
    const raw = localStorage.getItem('app_auth')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

const persistedGuest = (() => {
  try {
    const raw = localStorage.getItem('app_guest')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

export const useAppStore = create((set, get) => ({
  theme: 'dark',
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  },
  brand: 'acko',
  setBrand: (brand) => {
    document.documentElement.setAttribute('data-brand', brand)
    set({ brand })
  },
  // auth
  isAuthenticated: persistedAuth?.isAuthenticated ?? false,
  user: persistedAuth?.user ?? null,
  // guest
  isGuest: persistedGuest?.isGuest ?? false,
  guestId: persistedGuest?.guestId ?? null,
  login: async (credentials) => {
    // simulate a network delay
    await new Promise((r) => setTimeout(r, 800))
    const ok = credentials?.username && credentials?.password
    if (ok) {
      const user = { id: 'agent-1', name: credentials.username, role: 'agent' }
      set({ isAuthenticated: true, user })
      try {
        localStorage.setItem('app_auth', JSON.stringify({ isAuthenticated: true, user }))
      } catch {}
      return { success: true, user }
    }
    return { success: false, error: 'Invalid credentials' }
  },
  guestLogin: async (credentials) => {
    // simulate a network delay
    await new Promise((r) => setTimeout(r, 500))
    const ok = credentials?.guestId && credentials.guestId.trim().length > 0
    if (ok) {
      const guestId = credentials.guestId.trim()
      set({ isGuest: true, guestId, isAuthenticated: false, user: null })
      try {
        localStorage.setItem('app_guest', JSON.stringify({ isGuest: true, guestId }))
        localStorage.removeItem('app_auth') // Clear doctor auth if exists
      } catch {}
      return { success: true, guestId }
    }
    return { success: false, error: 'Please enter a valid guest ID' }
  },
  logout: async () => {
    await new Promise((r) => setTimeout(r, 600))
    set({ isAuthenticated: false, user: null, isGuest: false, guestId: null })
    try {
      localStorage.removeItem('app_auth')
      localStorage.removeItem('app_guest')
    } catch {}
  },
}))


