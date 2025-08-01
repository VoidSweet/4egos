import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    email?: string;
}

interface UseDiscordAuthReturn {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (redirectTo?: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export function useDiscordAuth(): UseDiscordAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                credentials: 'include',
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (redirectTo?: string) => {
        const loginUrl = redirectTo 
            ? `/api/auth/login?state=${encodeURIComponent(redirectTo)}`
            : '/api/auth/login';
        window.location.href = loginUrl;
    };

    const logout = () => {
        window.location.href = '/api/auth/logout';
    };

    const refreshUser = async () => {
        setIsLoading(true);
        await fetchUser();
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser
    };
}
