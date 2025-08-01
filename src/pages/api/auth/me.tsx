import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { '__SessionLuny': token } = parseCookies({ req });

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Fetch user info from Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userData = await userResponse.json();

        // Return sanitized user data
        const user = {
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            email: userData.email, // Optional, only if email scope was requested
        };

        res.status(200).json(user);
    } catch (error) {
        console.error('Auth me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
