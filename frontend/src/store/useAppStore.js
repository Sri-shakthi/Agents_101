import { create } from 'zustand'

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
  isAuthenticated: false,
  user: null,
  login: (credentials) => {
    // static login: accept anything non-empty
    const ok = credentials?.username && credentials?.password
    if (ok) {
      const user = { id: 'agent-1', name: credentials.username, role: 'agent' }
      set({ isAuthenticated: true, user })
      return { success: true, user }
    }
    return { success: false, error: 'Invalid credentials' }
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}))


