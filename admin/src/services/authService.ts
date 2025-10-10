import { supabase } from "../utils/supabase.ts";
import { constants } from "../utils/constants.ts";

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const signUp = async (email: string, password: string, name: string) => {
<<<<<<< HEAD
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
=======
    return supabase.auth.signUp({ email, password, options: { data: {
>>>>>>> origin/main
        role: constants.ROLES.ADMIN,
        name: name,
      },
    },
  });
};
