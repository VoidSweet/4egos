import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        try {
            // Mock security settings - in production, fetch from bot API or database
            const securitySettings = {
                antiNuke: {
                    enabled: true,
                    autoQuarantine: true,
                    panicMode: false,
                    detectionLimits: {
                        channelDeletes: {
                            limit: 3,
                            timeframeSeconds: 30,
                            action: 'quarantine'
                        },
                        roleDeletes: {
                            limit: 3,
                            timeframeSeconds: 30,
                            action: 'quarantine'
                        },
                        massBans: {
                            limit: 5,
                            timeframeSeconds: 30,
                            action: 'panic_mode'
                        },
                        massKicks: {
                            limit: 10,
                            timeframeSeconds: 60,
                            action: 'quarantine'
                        },
                        webhookSpam: {
                            limit: 3,
                            timeframeSeconds: 30,
                            action: 'quarantine'
                        }
                    },
                    quarantineSettings: {
                        roleName: '🔒 Quarantined',
                        autoReleaseHours: 24,
                        notifyAdmins: true,
                        logChannel: '123456789012345678'
                    }
                },
                heatSystem: {
                    enabled: true,
                    globalSettings: {
                        baseHeatThreshold: 100,
                        decayRate: 0.1,
                        decayIntervalMinutes: 5,
                        resetAfterHours: 24
                    },
                    heatSources: {
                        messageSpam: {
                            enabled: true,
                            heatPerMessage: 10,
                            cooldownSeconds: 3,
                            burstMultiplier: 2.0
                        },
                        mentionSpam: {
                            enabled: true,
                            heatPerMention: 15,
                            maxMentionsBeforePenalty: 3
                        },
                        emojiSpam: {
                            enabled: true,
                            heatPerEmoji: 5,
                            maxEmojisBeforePenalty: 10
                        },
                        capsSpam: {
                            enabled: true,
                            heatPerCapsMessage: 8,
                            capsThresholdPercent: 70
                        }
                    },
                    punishmentThresholds: {
                        warning: {
                            heatLevel: 50,
                            action: 'warn',
                            duration: null
                        },
                        mute: {
                            heatLevel: 75,
                            action: 'timeout',
                            durationMinutes: 10
                        },
                        temporaryBan: {
                            heatLevel: 100,
                            action: 'ban',
                            durationHours: 24
                        }
                    }
                },
                verification: {
                    enabled: false,
                    verificationMode: 'captcha',
                    settings: {
                        captcha: {
                            enabled: true,
                            difficulty: 'medium',
                            timeoutMinutes: 10,
                            maxAttempts: 3
                        },
                        accountAgeCheck: {
                            enabled: true,
                            minimumAgeHours: 24,
                            actionIfTooNew: 'manual_review'
                        },
                        activityMonitoring: {
                            enabled: true,
                            checkAvatar: true,
                            checkUsernamePatterns: true,
                            suspiciousPatterns: [
                                'discord\\.gg\\/[a-zA-Z0-9]+',
                                'nitro',
                                'free'
                            ]
                        }
                    },
                    channelsAndRoles: {
                        verificationChannel: '234567890123456789',
                        welcomeChannel: '345678901234567890',
                        verifiedRole: '456789012345678901',
                        unverifiedRole: '567890123456789012'
                    },
                    messages: {
                        welcomeDm: 'Welcome to {server_name}! Please complete verification in {verification_channel}.',
                        verificationInstructions: 'Please solve the CAPTCHA below to gain access to the server.',
                        verificationSuccess: '✅ Verification complete! Welcome to {server_name}!',
                        verificationFailed: '❌ Verification failed. Please try again.'
                    }
                },
                whitelist: {
                    trustedUsers: [
                        {
                            userId: '123456789012345678',
                            username: 'TrustedAdmin',
                            addedBy: 'ServerOwner',
                            addedDate: '2025-08-01T10:00:00Z',
                            reason: 'Head Administrator'
                        },
                        {
                            userId: '234567890123456789',
                            username: 'ModeratorLeader',
                            addedBy: 'TrustedAdmin',
                            addedDate: '2025-08-05T15:30:00Z',
                            reason: 'Senior Moderator'
                        }
                    ],
                    trustedRoles: [
                        {
                            roleId: '345678901234567890',
                            roleName: 'Senior Staff',
                            addedBy: 'ServerOwner',
                            addedDate: '2025-08-01T10:00:00Z'
                        },
                        {
                            roleId: '456789012345678901',
                            roleName: 'Moderators',
                            addedBy: 'TrustedAdmin',
                            addedDate: '2025-08-02T14:20:00Z'
                        }
                    ],
                    autoBypassPermissions: [
                        'administrator',
                        'manage_guild',
                        'manage_roles'
                    ]
                },
                monitoring: {
                    enabled: true,
                    logChannel: '567890123456789012',
                    alertLevel: 'medium',
                    features: {
                        rateLimitMonitoring: true,
                        permissionChangeTracking: true,
                        botActivityMonitoring: true,
                        memberJoinTracking: true,
                        inviteLinkMonitoring: true
                    },
                    notifications: {
                        discordWebhook: 'https://discord.com/api/webhooks/...',
                        emailAlerts: false,
                        pushNotifications: true
                    }
                }
            };

            res.status(200).json(securitySettings);
        } catch (error) {
            console.error('Error fetching security settings:', error);
            res.status(500).json({ error: 'Failed to fetch security settings' });
        }
    } else if (req.method === 'POST') {
        try {
            const settings = req.body;
            
            // Validate settings
            if (!settings || typeof settings.antiNuke !== 'object') {
                return res.status(400).json({ error: 'Invalid security settings data' });
            }

            // Validate detection limits
            if (settings.antiNuke.enabled) {
                const limits = settings.antiNuke.detectionLimits;
                
                if (limits.channelDeletes.limit < 1 || limits.channelDeletes.limit > 20) {
                    return res.status(400).json({ error: 'Channel delete limit must be between 1 and 20' });
                }
                
                if (limits.massBans.limit < 1 || limits.massBans.limit > 50) {
                    return res.status(400).json({ error: 'Mass ban limit must be between 1 and 50' });
                }
            }

            // Validate heat system settings
            if (settings.heatSystem.enabled) {
                if (settings.heatSystem.globalSettings.baseHeatThreshold < 50) {
                    return res.status(400).json({ error: 'Heat threshold must be at least 50' });
                }
            }

            // In production, send to bot API or save to database
            console.log(`Updating security settings for guild ${guildId}:`, settings);

            // Mock successful response
            res.status(200).json({ 
                success: true, 
                message: 'Security settings updated successfully',
                settings: settings,
                applied: {
                    antiNuke: settings.antiNuke.enabled,
                    heatSystem: settings.heatSystem.enabled,
                    verification: settings.verification.enabled,
                    whitelistUpdated: true
                }
            });
        } catch (error) {
            console.error('Error updating security settings:', error);
            res.status(500).json({ error: 'Failed to update security settings' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
