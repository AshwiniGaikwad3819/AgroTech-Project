import { createSlice } from '@reduxjs/toolkit'

const storedUser = localStorage.getItem('agro_user')
const storedAccess = localStorage.getItem('agro_access')
const storedRefresh = localStorage.getItem('agro_refresh')

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  access: storedAccess || null,
  refresh: storedRefresh || null,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { user, access, refresh } = action.payload
      state.user = user
      state.access = access
      state.refresh = refresh
      localStorage.setItem('agro_user', JSON.stringify(user))
      localStorage.setItem('agro_access', access)
      localStorage.setItem('agro_refresh', refresh)
    },
    logout(state) {
      state.user = null
      state.access = null
      state.refresh = null
      localStorage.removeItem('agro_user')
      localStorage.removeItem('agro_access')
      localStorage.removeItem('agro_refresh')
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('agro_user', JSON.stringify(state.user))
    },
  },
})

export const { loginSuccess, logout, updateProfile } = authSlice.actions

export default authSlice.reducer







