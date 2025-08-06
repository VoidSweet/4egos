import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

interface ActivityLog {
    id: string;
    type: 'moderation' | 'command' | 'auto_mod' | 'join' | 'leave' | 'config';
    message: string;
    user?: {
        id: string;
        username: string;
        avatar?: string;
    };
    timestamp: string;
    details?: any;
}

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

        // Fetch activity logs from bot API
        const botApiUrl = process.env.DASHBOARD_API_URL;
        const botApiKey = process.env.DASHBOARD_API_KEY;
        
        const response = await fetch(`${botApiUrl}/guilds/${guildId}/activity`, {
            headers: {
                'Authorization': `Bearer ${botApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Return mock data for now if API is not available
            const mockLogs: ActivityLog[] = [
                {
                    id: '1',
                    type: 'moderation',
                    message: 'User was banned for spam',
                    user: { id: '123', username: 'ModeratorBot', avatar: null },
                    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                    details: { reason: 'Spam', duration: 'permanent' }
                },
                {
                    id: '2',
                    type: 'command',
                    message: '/ban command executed',
                    user: { id: '456', username: 'Admin', avatar: null },
                    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
                    details: { command: '/ban', target: 'BadUser#1234' }
                },
                {
                    id: '3',
                    type: 'auto_mod',
                    message: 'Automatic deletion of inappropriate message',
                    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                    details: { reason: 'Inappropriate language detected' }
                },
                {
                    id: '4',
                    type: 'join',
                    message: 'New member joined the server',
                    user: { id: '789', username: 'NewUser', avatar: null },
                    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                    details: { inviter: 'Admin#0001' }
                },
                {
                    id: '5',
                    type: 'config',
                    message: 'Auto-moderation settings updated',
                    user: { id: '456', username: 'Admin', avatar: null },
                    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                    details: { setting: 'spam_filter', value: 'enabled' }
                }
            ];
            
            return res.status(200).json(mockLogs);
        }

        const logs = await response.json();
        res.status(200).json(logs);

    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
}
