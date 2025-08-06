import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

interface GuildSettings {
    prefix: string;
    autoRole: string | null;
    welcomeChannel: string | null;
    logsChannel: string | null;
    muteRole: string | null;
    language: string;
    timezone: string;
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

        const botApiUrl = process.env.DASHBOARD_API_URL;
        const botApiKey = process.env.DASHBOARD_API_KEY;

        if (req.method === 'GET') {
            // Fetch guild settings from bot API
            const response = await fetch(`${botApiUrl}/guilds/${guildId}/settings`, {
                headers: {
                    'Authorization': `Bearer ${botApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Return default settings if API is not available
                const defaultSettings: GuildSettings = {
                    prefix: '!',
                    autoRole: null,
                    welcomeChannel: null,
                    logsChannel: null,
                    muteRole: null,
                    language: 'en',
                    timezone: 'UTC'
                };
                
                return res.status(200).json(defaultSettings);
            }

            const settings = await response.json();
            res.status(200).json(settings);

        } else if (req.method === 'POST') {
            // Update guild settings
            const settings: GuildSettings = req.body;

            const response = await fetch(`${botApiUrl}/guilds/${guildId}/settings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${botApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                return res.status(500).json({ error: 'Failed to update settings' });
            }

            const updatedSettings = await response.json();
            res.status(200).json(updatedSettings);

        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }

    } catch (error) {
        console.error('Error handling guild settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
