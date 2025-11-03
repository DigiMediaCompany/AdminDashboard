import {supabase} from "../utils/supabase.ts";
import {constants} from "../utils/constants.ts";
import {generateRandomEmail} from "../utils/helper.ts";
import {getApi} from "./commonApiService.ts";
import {User} from "../types/Admin.ts";

export const signIn = async (email: string, password: string) => {
    const result = await getApi<User>({
        model: 'users',
        module: '/admin',
        filter: {
            email
        }
    })
    const user = result.data[0] as User;
    if (user && user.is_active !== 1) {
        return {
            error: {
                message: "User deactivated"
            }
        }
    }
    return supabase.auth.signInWithPassword({ email: user.supabase_email, password })
}

export const signOut = async () => {
    return supabase.auth.signOut()
}

export const signUp = async (email: string, password: string, name: string) => {
    console.log(`Creating account for ${email}`)
    const randomEmail = generateRandomEmail()

    const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password,
        options: {
            data: {
                role: constants.ROLES.CREATOR,
                name: name,
            },
        },
    })

    if (error) {
        throw error
    }

    return { ...data, supabaseEmail: randomEmail }
}
