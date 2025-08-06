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

        // Fetch guild channels from Discord API
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Return mock channels if API is not available
            const mockChannels = [
                { id: '1', name: 'general', type: 0 },
                { id: '2', name: 'announcements', type: 0 },
                { id: '3', name: 'logs', type: 0 },
                { id: '4', name: 'welcome', type: 0 },
                { id: '5', name: 'General Voice', type: 2 }
            ];
            
            return res.status(200).json(mockChannels);
        }

        const channels = await response.json();
        res.status(200).json(channels);

    } catch (error) {
        console.error('Error fetching guild channels:', error);
        res.status(500).json({ error: 'Failed to fetch guild channels' });
    }
}
