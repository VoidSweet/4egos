import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        try {
            // Mock security alerts - in production, fetch from bot API or database
            const securityAlerts = [
                {
                    id: 'alert_001',
                    type: 'Anti-Nuke Detection',
                    message: 'User attempted to delete multiple channels rapidly - automatically quarantined',
                    timestamp: Date.now() - 1800000, // 30 minutes ago
                    severity: 'high',
                    userId: '123456789012345678',
                    username: 'SuspiciousUser1',
                    action: 'quarantine',
                    resolved: true,
                    details: {
                        channelsDeleted: 5,
                        timespan: '15 seconds',
                        autoQuarantined: true
                    }
                },
                {
                    id: 'alert_002',
                    type: 'Heat System Violation',
                    message: 'Multiple users triggered spam detection simultaneously',
                    timestamp: Date.now() - 3600000, // 1 hour ago
                    severity: 'medium',
                    userId: null,
                    username: null,
                    action: 'multiple_timeouts',
                    resolved: true,
                    details: {
                        affectedUsers: 3,
                        heatLevelsTriggered: [105, 112, 98],
                        timeoutsIssued: 3
                    }
                },
                {
                    id: 'alert_003',
                    type: 'Verification Bypass Attempt',
                    message: 'New account attempted to bypass verification system',
                    timestamp: Date.now() - 5400000, // 1.5 hours ago
                    severity: 'medium',
                    userId: '234567890123456789',
                    username: 'NewAccount2025',
                    action: 'manual_review',
                    resolved: false,
                    details: {
                        accountAge: '2 hours',
                        verificationAttempts: 5,
                        suspiciousPatterns: ['fast_typing', 'bot_like_behavior']
                    }
                },
                {
                    id: 'alert_004',
                    type: 'Raid Detection',
                    message: '15 new members joined within 2 minutes - possible raid',
                    timestamp: Date.now() - 7200000, // 2 hours ago
                    severity: 'critical',
                    userId: null,
                    username: null,
                    action: 'panic_mode_considered',
                    resolved: true,
                    details: {
                        newMembers: 15,
                        timespan: '2 minutes',
                        raidScore: 85,
                        actionsAken: ['enhanced_verification', 'member_screening']
                    }
                },
                {
                    id: 'alert_005',
                    type: 'Permission Escalation',
                    message: 'User gained administrator permissions unexpectedly',
                    timestamp: Date.now() - 10800000, // 3 hours ago
                    severity: 'high',
                    userId: '345678901234567890',
                    username: 'ElevatedUser',
                    action: 'logged',
                    resolved: true,
                    details: {
                        permissionsBefore: ['manage_messages'],
                        permissionsAfter: ['administrator'],
                        grantedBy: 'ServerOwner',
                        reason: 'promotion'
                    }
                },
                {
                    id: 'alert_006',
                    type: 'Webhook Abuse',
                    message: 'Suspicious webhook activity detected - multiple rapid messages',
                    timestamp: Date.now() - 14400000, // 4 hours ago
                    severity: 'medium',
                    userId: '456789012345678901',
                    username: 'WebhookCreator',
                    action: 'webhook_disabled',
                    resolved: true,
                    details: {
                        webhookMessages: 45,
                        timespan: '30 seconds',
                        webhookName: 'SuspiciousBot',
                        channelAffected: 'general'
                    }
                }
            ];

            // Sort by timestamp (newest first)
            securityAlerts.sort((a, b) => b.timestamp - a.timestamp);

            res.status(200).json(securityAlerts);
        } catch (error) {
            console.error('Error fetching security alerts:', error);
            res.status(500).json({ error: 'Failed to fetch security alerts' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
