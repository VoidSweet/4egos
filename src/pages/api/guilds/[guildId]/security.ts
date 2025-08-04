import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    // Real security configuration - would fetch from database in production
    const defaultSecurityConfig = {
        antiNuke: {
            enabled: false,
            autoQuarantine: false,
            maxChannelDeletions: 5,
            maxRoleDeletions: 3,
            maxMemberBans: 10,
            timeWindow: 60
        },
        spamProtection: {
            enabled: false,
            messageLimit: 10,
            timeWindow: 30,
            muteOnViolation: true,
            muteDuration: 300
        },
        raidProtection: {
            enabled: false,
            joinLimit: 20,
            timeWindow: 60,
            actionOnRaid: 'lockdown'
        },
        autoMod: {
            enabled: false,
            filterWords: false,
            filterInvites: false,
            filterSpam: false,
            filterCaps: false
        }
    };

    if (req.method === 'GET') {
        // In production, fetch from database: SELECT * FROM guild_security WHERE guild_id = guildId
        res.status(200).json(defaultSecurityConfig);
    } else if (req.method === 'POST') {
        // In production, save to database: UPDATE guild_security SET ... WHERE guild_id = guildId
        const updatedConfig = { ...defaultSecurityConfig, ...req.body };
        res.status(200).json(updatedConfig);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
