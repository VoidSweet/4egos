import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

interface BotStats {
    guild: {
        id: string;
        name: string;
        memberCount: number;
        botJoinedAt: string;
    };
    commands: {
        total: number;
        daily: number;
        weekly: number;
        topCommands: Array<{ name: string; count: number }>;
    };
    moderation: {
        totalActions: number;
        bans: number;
        kicks: number;
        warnings: number;
        mutes: number;
        autoModActions: number;
    };
    activity: {
        messagesProcessed: number;
        activeUsers: number;
        newMembers: number;
        leftMembers: number;
    };
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

        // Fetch bot statistics from bot API
        const botApiUrl = process.env.DASHBOARD_API_URL;
        const botApiKey = process.env.DASHBOARD_API_KEY;
        
        const response = await fetch(`${botApiUrl}/guilds/${guildId}/stats`, {
            headers: {
                'Authorization': `Bearer ${botApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Return mock data for now if API is not available
            const mockStats: BotStats = {
                guild: {
                    id: guildId,
                    name: 'Sample Server',
                    memberCount: 1247,
                    botJoinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
                },
                commands: {
                    total: 15742,
                    daily: 127,
                    weekly: 893,
                    topCommands: [
                        { name: '/ban', count: 45 },
                        { name: '/kick', count: 32 },
                        { name: '/warn', count: 78 },
                        { name: '/mute', count: 23 },
                        { name: '/info', count: 156 }
                    ]
                },
                moderation: {
                    totalActions: 234,
                    bans: 12,
                    kicks: 8,
                    warnings: 156,
                    mutes: 34,
                    autoModActions: 24
                },
                activity: {
                    messagesProcessed: 45632,
                    activeUsers: 342,
                    newMembers: 23,
                    leftMembers: 7
                }
            };
            
            return res.status(200).json(mockStats);
        }

        const stats = await response.json();
        res.status(200).json(stats);

    } catch (error) {
        console.error('Error fetching bot statistics:', error);
        res.status(500).json({ error: 'Failed to fetch bot statistics' });
    }
}
