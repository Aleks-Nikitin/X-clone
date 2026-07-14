import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type User = {
    id: number;
    username?: string;
    fullName?: string;
    email?: string;
    pictture?:string;
};

type AuthContextValue = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    user: User | null;
    setUser: (u: User | null) => void;
    isLoading: boolean;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // stable ref to current token so authFetch can be memoized
    const accessTokenRef = useRef<string | null>(null);
    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    // bootstrap once on mount. Do not depend on authFetch here.
    useEffect(() => {
        let mounted = true;
        async function bootstrap() {
            try {
                // try refresh first (server will read httpOnly cookie)
                const refreshRes = await fetch(`${import.meta.env.VITE_BACKEND}/refresh`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!refreshRes.ok) {
                    if (mounted) setIsLoading(false);
                    return;
                }

                const refreshData = await refreshRes.json().catch(() => null);
                const token = refreshData?.accessToken;
                if (!token) {
                    if (mounted) setIsLoading(false);
                    return;
                }

                if (mounted) {
                    setAccessToken(token);
                    accessTokenRef.current = token;
                }

                // fetch current user with the fresh token
                const meRes = await fetch(`${import.meta.env.VITE_BACKEND}/users/me`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });

                if (!meRes.ok) {
                    if (mounted) setIsLoading(false);
                    return;
                }

                const body = await meRes.json().catch(() => null);
                if (mounted) setUser((body && body.user) || null);
            } catch (e) {
                // ignore bootstrap errors
            } finally {
                if (mounted) setIsLoading(false);
            }
        }

        void bootstrap();
        return () => {
            mounted = false;
        };
    }, []);

    // stable authFetch that reads token from ref so identity doesn't change
    const authFetch = useCallback(async (input: RequestInfo | URL, init: RequestInit = {}) => {
        const headers = new Headers((init && init.headers) || {});
        const token = accessTokenRef.current;
        if (token) headers.set("Authorization", `Bearer ${token}`);

        let response = await fetch(input, {
            ...init,
            headers,
            credentials: "include",
        });

        if (response.status !== 401) return response;

        // attempt refresh once
        const refreshRes = await fetch(`${import.meta.env.VITE_BACKEND}/refresh`, {
            method: "GET",
            credentials: "include",
        });

        if (!refreshRes.ok) return response;

        const refreshData = await refreshRes.json().catch(() => null);
        const newToken = refreshData?.accessToken;
        if (!newToken) return response;

        setAccessToken(newToken);
        accessTokenRef.current = newToken;
        headers.set("Authorization", `Bearer ${newToken}`);

        response = await fetch(input, {
            ...init,
            headers,
            credentials: "include",
        });

        return response;
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND}/logout`, { method: "GET", credentials: "include" });
        } catch (e) {
            // ignore
        }
        setAccessToken(null);
        accessTokenRef.current = null;
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, authFetch, user, setUser, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}