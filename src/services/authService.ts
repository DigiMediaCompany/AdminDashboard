import {supabase} from "../utils/supabase.ts";

export const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
    return supabase.auth.signOut()
}

export const signUp = async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password })
}
