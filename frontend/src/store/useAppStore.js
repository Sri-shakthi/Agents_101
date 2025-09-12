import { create } from 'zustand'

const persistedAuth = (() => {
  try {
    const raw = localStorage.getItem('app_auth')
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
  logout: async () => {
    await new Promise((r) => setTimeout(r, 600))
    set({ isAuthenticated: false, user: null })
    try {
      localStorage.removeItem('app_auth')
    } catch {}
  },
}))


