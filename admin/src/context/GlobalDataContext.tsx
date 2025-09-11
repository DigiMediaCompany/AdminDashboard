// GlobalDataContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Status } from "../types/Article";
import {getApi} from "../services/adminArticleService.ts";

interface GlobalDataContextValue {
    statuses: Status[] | null;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<Status[] | null>;
    setStatuses: React.Dispatch<React.SetStateAction<Status[] | null>>;
}

const GlobalDataContext = createContext<GlobalDataContextValue | undefined>(
    undefined
);

export const GlobalDataProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                children,
                                                                            }) => {
    const [statuses, setStatuses] = useState<Status[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Prevent duplicate concurrent fetches
    const fetchPromiseRef = useRef<Promise<Status[] | null> | null>(null);

    const fetchStatuses = async (): Promise<Status[] | null> => {
        // if (fetchPromiseRef.current) return fetchPromiseRef.current;
        //
        // setLoading(true);
        // const promise = getApi<Status[]>("statuses")
        //     .then((result) => {
        //         setStatuses(result.data);
        //         setError(null);
        //         // return result.data;
        //     })
        //     .catch((e: any) => {
        //         setError(e);
        //         // return null;
        //     })
        //     .finally(() => {
        //         setLoading(false);
        //         fetchPromiseRef.current = null;
        //     });
        //
        // fetchPromiseRef.current = promise;
        // return promise;
        return new Promise<null>(() => {
            return null
        });
    };

    // Fetch once on mount if not already loaded
    useEffect(() => {
        if (!statuses) {
            void fetchStatuses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({
            statuses,
            loading,
            error,
            refresh: fetchStatuses,
            setStatuses,
        }),
        [statuses, loading, error]
    );

    return (
        <GlobalDataContext.Provider value={value}>
            {children}
        </GlobalDataContext.Provider>
    );
};

// Hook for easy usage
export const useGlobalData = (): GlobalDataContextValue => {
    const ctx = useContext(GlobalDataContext);
    if (!ctx)
        throw new Error("useGlobalData must be used inside GlobalDataProvider");
    return ctx;
};
