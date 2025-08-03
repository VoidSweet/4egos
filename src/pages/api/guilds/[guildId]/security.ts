import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    // Mock security configuration - in production this would come from your database
    const mockSecurityConfig = {
        antiNuke: {
            enabled: true,
            autoQuarantine: false,
            maxChannelDeletions: 5,
            maxRoleDeletions: 3,
            maxMemberBans: 10,
            timeWindow: 60
        },
        spamProtection: {
            enabled: true,
            messageLimit: 10,
            timeWindow: 30,
            muteOnViolation: true,
            muteDuration: 300
        },
        raidProtection: {
            enabled: true,
            joinLimit: 20,
            timeWindow: 60,
            actionOnRaid: 'lockdown'
        },
        autoMod: {
            enabled: true,
            filterWords: true,
            filterInvites: true,
            filterSpam: true,
            filterCaps: false
        }
    };

    if (req.method === 'GET') {
        res.status(200).json(mockSecurityConfig);
    } else if (req.method === 'POST') {
        // Update security configuration
        const updatedConfig = { ...mockSecurityConfig, ...req.body };
        res.status(200).json(updatedConfig);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
