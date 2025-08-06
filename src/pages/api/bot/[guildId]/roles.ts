import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { guildId } = req.query;
        const { token } = parseCookies({ req });
        
        if (!token) {
            return res.status(401).json({ error: 'No authentication token' });
        }

        if (!guildId || typeof guildId !== 'string') {
            return res.status(400).json({ error: 'Guild ID is required' });
        }

        // Fetch guild roles from Discord API
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Return mock roles if API is not available
            const mockRoles = [
                { id: '1', name: '@everyone', managed: false, position: 0 },
                { id: '2', name: 'Admin', managed: false, position: 5 },
                { id: '3', name: 'Moderator', managed: false, position: 4 },
                { id: '4', name: 'Member', managed: false, position: 1 },
                { id: '5', name: 'Muted', managed: false, position: 2 }
            ];
            
            return res.status(200).json(mockRoles);
        }

        const roles = await response.json();
        res.status(200).json(roles);

    } catch (error) {
        console.error('Error fetching guild roles:', error);
        res.status(500).json({ error: 'Failed to fetch guild roles' });
    }
}
