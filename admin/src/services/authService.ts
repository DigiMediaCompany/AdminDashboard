import {supabase} from "../utils/supabase.ts";
import {constants} from "../utils/constants.ts";

export const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
    return supabase.auth.signOut()
}

export const signUp = async (email: string, password: string, name: string) => {
    return supabase.auth.signUp({ email, password, options: { data: {
        role: constants.ROLES.CREATOR,
        name: name,
    }}})
}

export const deleteUser = async (id: string) => {
    return supabase.auth.admin.deleteUser(id)
}
