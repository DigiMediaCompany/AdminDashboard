import { createContext, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
// import type { Database } from '../types/supabase';

// type SupabaseContextType = SupabaseClient<Database>;
type SupabaseContextType = SupabaseClient<any>;

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = (): SupabaseContextType => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};