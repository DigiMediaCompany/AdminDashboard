import { useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { setSession } from '../store/authSlice'
import {useAppDispatch} from "../store";

export function useAuthListener() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            dispatch(setSession({ user: session?.user ?? null, session }))
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            dispatch(setSession({ user: session?.user ?? null, session }))
        })

        return () => subscription.unsubscribe()
    }, [dispatch])
}
