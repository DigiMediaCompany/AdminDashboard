import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Session, User } from '@supabase/supabase-js'

type AuthState = {
    user: User | null
    session: Session | null
    loading: boolean
}

const initialState: AuthState = {
    user: null,
    session: null,
    loading: true
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession(state, action: PayloadAction<{ user: User | null; session: Session | null }>) {
            state.user = action.payload.user
            state.session = action.payload.session
            state.loading = false
        },
        logout(state) {
            state.user = null
            state.session = null
            state.loading = false
        },
    },
})

export const { setSession, logout } = authSlice.actions
export default authSlice.reducer
