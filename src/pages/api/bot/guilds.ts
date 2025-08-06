import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

interface BotGuildData {
    id: string;
    name: string;
    memberCount: number;
    botPresent: boolean;
    features: string[];
    commands: number;
    modLogs: number;
    autoMod: boolean;
    joinedAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { token } = parseCookies({ req });
        
        if (!token) {
            return res.status(401).json({ error: 'No authentication token' });
        }

        // First get user's guilds from Discord
        const discordResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!discordResponse.ok) {
            throw new Error('Failed to fetch guilds from Discord');
        }

        const discordGuilds = await discordResponse.json();

        // Get bot data for each guild
        const botApiUrl = process.env.DASHBOARD_API_URL;
        const botApiKey = process.env.DASHBOARD_API_KEY;
        
        const guildsWithBotData = await Promise.all(
            discordGuilds.map(async (guild: any) => {
                try {
                    // Check if bot is in this guild and get data
                    const botDataResponse = await fetch(`${botApiUrl}/guilds/${guild.id}`, {
                        headers: {
                            'Authorization': `Bearer ${botApiKey}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    let botData: Partial<BotGuildData> = {
                        botPresent: false,
                        memberCount: 0,
                        features: [],
                        commands: 0,
                        modLogs: 0,
                        autoMod: false,
                        joinedAt: ''
                    };

                    if (botDataResponse.ok) {
                        const data = await botDataResponse.json();
                        botData = {
                            botPresent: true,
                            memberCount: data.memberCount || 0,
                            features: data.features || [],
                            commands: data.commandsCount || 0,
                            modLogs: data.modLogsCount || 0,
                            autoMod: data.autoModEnabled || false,
                            joinedAt: data.joinedAt || new Date().toISOString()
                        };
                    }

                    return {
                        ...guild,
                        ...botData
                    };
                } catch (error) {
                    console.error(`Error fetching bot data for guild ${guild.id}:`, error);
                    return {
                        ...guild,
                        botPresent: false,
                        memberCount: 0,
                        features: [],
                        commands: 0,
                        modLogs: 0,
                        autoMod: false,
                        joinedAt: ''
                    };
                }
            })
        );

        res.status(200).json(guildsWithBotData);

    } catch (error) {
        console.error('Error fetching guilds with bot data:', error);
        res.status(500).json({ error: 'Failed to fetch guild data' });
    }
}
