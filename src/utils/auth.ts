import { parseCookies } from 'nookies';
import { GetServerSidePropsContext } from 'next';

export interface AuthState {
    isAuthenticated: boolean;
    token?: string;
}

/**
 * Check if user is authenticated based on session token
 */
export function checkAuthState(ctx?: GetServerSidePropsContext): AuthState {
    const cookies = parseCookies(ctx);
    const token = cookies['__SessionLuny'];
    
    return {
        isAuthenticated: !!token,
        token: token || undefined
    };
}

/**
 * Verify token is valid by calling Discord API
 */
export async function verifyToken(token: string): Promise<boolean> {
    try {
        const response = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}

/**
 * Get authenticated user data from Discord API
 */
export async function getAuthenticatedUser(token: string) {
    try {
        const response = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to get authenticated user:', error);
        return null;
    }
}

/**
 * Create redirect to login with proper state handling
 */
export function createLoginRedirect(redirectPath?: string) {
    const state = redirectPath ? encodeURIComponent(redirectPath) : '';
    const destination = state 
        ? `/api/auth/login?state=${state}`
        : '/api/auth/login';
        
    return {
        redirect: {
            destination,
            permanent: false,
        }
    };
}
