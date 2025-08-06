import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        try {
            // Mock quarantined users - in production, fetch from bot API or database
            const quarantinedUsers = [
                {
                    userId: '123456789012345678',
                    username: 'SuspiciousUser1',
                    discriminator: '1234',
                    quarantinedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    reason: 'Anti-nuke detection: Mass channel deletion',
                    quarantinedBy: 'system',
                    severity: 'high',
                    autoRelease: true,
                    releaseAt: new Date(Date.now() + 23 * 3600000).toISOString(), // 23 hours from now
                    evidence: [
                        'Deleted 5 channels in 15 seconds',
                        'Modified 3 roles rapidly',
                        'Created suspicious webhook'
                    ]
                },
                {
                    userId: '234567890123456789',
                    username: 'SpamBot2',
                    discriminator: '5678',
                    quarantinedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    reason: 'Heat system violation: Message spam',
                    quarantinedBy: 'system',
                    severity: 'medium',
                    autoRelease: true,
                    releaseAt: new Date(Date.now() + 22 * 3600000).toISOString(),
                    evidence: [
                        'Heat level reached 120/100',
                        'Sent 25 messages in 30 seconds',
                        'Used excessive mentions'
                    ]
                },
                {
                    userId: '345678901234567890',
                    username: 'BadActor3',
                    discriminator: '9012',
                    quarantinedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                    reason: 'Manual quarantine: Suspected raid coordination',
                    quarantinedBy: 'TrustedAdmin',
                    severity: 'critical',
                    autoRelease: false,
                    releaseAt: null,
                    evidence: [
                        'Coordinating with known raiders',
                        'Sharing invite links to raid servers',
                        'Account created recently'
                    ]
                }
            ];

            res.status(200).json(quarantinedUsers);
        } catch (error) {
            console.error('Error fetching quarantined users:', error);
            res.status(500).json({ error: 'Failed to fetch quarantined users' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
