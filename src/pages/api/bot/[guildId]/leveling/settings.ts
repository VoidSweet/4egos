import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        try {
            // Mock leveling settings - in production, fetch from bot API or database
            const levelingSettings = {
                enabled: true,
                xpSettings: {
                    perMessage: {
                        minimum: 15,
                        maximum: 25,
                        cooldownSeconds: 60
                    },
                    voiceChat: {
                        enabled: true,
                        xpPerMinute: 5,
                        minimumUsers: 2,
                        maxPerSession: 300
                    },
                    bonusMultipliers: {
                        weekendBonus: 1.5,
                        eventBonus: 2.0,
                        nitroBoostBonus: 1.2
                    }
                },
                levelCalculation: {
                    formula: 'quadratic',
                    baseXp: 100,
                    multiplier: 1.5,
                    maxLevel: 100
                },
                roleRewards: {
                    enabled: true,
                    rewards: [
                        {
                            level: 5,
                            roleId: '123456789012345678',
                            roleName: 'Newcomer',
                            announcement: true,
                            removePrevious: false
                        },
                        {
                            level: 10,
                            roleId: '234567890123456789',
                            roleName: 'Regular Member',
                            announcement: true,
                            removePrevious: true,
                            bonusRewards: {
                                currency: 500,
                                shopDiscount: 0.1
                            }
                        },
                        {
                            level: 25,
                            roleId: '345678901234567890',
                            roleName: 'Veteran',
                            announcement: true,
                            removePrevious: true,
                            specialPerks: ['custom_status', 'priority_support']
                        },
                        {
                            level: 50,
                            roleId: '456789012345678901',
                            roleName: 'Elite Member',
                            announcement: true,
                            removePrevious: true,
                            bonusRewards: {
                                currency: 2000,
                                shopDiscount: 0.25
                            },
                            specialPerks: ['custom_role_color', 'voice_priority']
                        }
                    ]
                },
                leaderboards: {
                    enabled: true,
                    types: {
                        levelLeaderboard: {
                            displayCount: 10,
                            updateFrequency: 'hourly',
                            showAvatars: true,
                            excludeBots: true
                        },
                        weeklyXp: {
                            enabled: true,
                            resetDay: 'monday',
                            rewards: [
                                { position: 1, reward: 1000 },
                                { position: 2, reward: 750 },
                                { position: 3, reward: 500 },
                                { position: 4, reward: 250 },
                                { position: 5, reward: 100 }
                            ]
                        },
                        monthlyCompetition: {
                            enabled: true,
                            specialRewards: true
                        }
                    }
                },
                customization: {
                    levelUpMessage: {
                        enabled: true,
                        channel: '',
                        message: '🎉 Congratulations {user}, you reached level {level}! 🎉',
                        useEmbed: true
                    },
                    xpBoosts: {
                        enabled: true,
                        boostChannels: [
                            {
                                channelId: '567890123456789012',
                                channelName: 'general-chat',
                                multiplier: 1.2
                            },
                            {
                                channelId: '678901234567890123',
                                channelName: 'events',
                                multiplier: 2.0
                            }
                        ],
                        boostRoles: [
                            {
                                roleId: '789012345678901234',
                                roleName: 'VIP',
                                multiplier: 1.5
                            },
                            {
                                roleId: '890123456789012345',
                                roleName: 'Booster',
                                multiplier: 1.3
                            }
                        ]
                    },
                    blacklistedChannels: [
                        '901234567890123456' // bot-commands channel
                    ],
                    blacklistedRoles: [
                        '012345678901234567' // muted role
                    ]
                }
            };

            res.status(200).json(levelingSettings);
        } catch (error) {
            console.error('Error fetching leveling settings:', error);
            res.status(500).json({ error: 'Failed to fetch leveling settings' });
        }
    } else if (req.method === 'POST') {
        try {
            const settings = req.body;
            
            // Validate settings
            if (!settings || typeof settings.enabled !== 'boolean') {
                return res.status(400).json({ error: 'Invalid settings data' });
            }

            // Validate XP settings
            if (settings.enabled) {
                if (settings.xpSettings.perMessage.minimum > settings.xpSettings.perMessage.maximum) {
                    return res.status(400).json({ error: 'Minimum XP cannot be greater than maximum XP' });
                }
                
                if (settings.levelCalculation.baseXp < 50) {
                    return res.status(400).json({ error: 'Base XP must be at least 50' });
                }
            }

            // In production, send to bot API or save to database
            console.log(`Updating leveling settings for guild ${guildId}:`, settings);

            // Mock successful response
            res.status(200).json({ 
                success: true, 
                message: 'Leveling settings updated successfully',
                settings: settings
            });
        } catch (error) {
            console.error('Error updating leveling settings:', error);
            res.status(500).json({ error: 'Failed to update leveling settings' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
