import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        try {
            // Mock economy settings - in production, fetch from bot API or database
            const economySettings = {
                enabled: true,
                currency: {
                    name: 'AegisCoins',
                    symbol: '🪙',
                    emoji: '<:aegiscoin:123456789>',
                    startingBalance: 1000,
                    maxBalance: 1000000,
                    transferEnabled: true
                },
                incomeSource: {
                    dailyBonus: {
                        enabled: true,
                        baseAmount: 100,
                        streakMultiplier: 1.1,
                        maxStreakBonus: 2.0
                    },
                    messageRewards: {
                        enabled: true,
                        baseReward: 5,
                        cooldownSeconds: 60,
                        maxPerDay: 500
                    },
                    voiceRewards: {
                        enabled: true,
                        rewardPerMinute: 2,
                        minimumUsers: 2,
                        maxPerSession: 120
                    },
                    jobSystem: {
                        enabled: true,
                        cooldownHours: 8,
                        jobs: [
                            {
                                name: 'Miner',
                                basePay: 200,
                                variance: 50,
                                requiredLevel: 1,
                                successRate: 0.8
                            },
                            {
                                name: 'Trader',
                                basePay: 350,
                                variance: 100,
                                requiredLevel: 10,
                                successRate: 0.7
                            },
                            {
                                name: 'Banker',
                                basePay: 500,
                                variance: 75,
                                requiredLevel: 25,
                                successRate: 0.9
                            }
                        ]
                    }
                },
                banking: {
                    enabled: true,
                    interestRate: 0.05,
                    minimumDeposit: 100,
                    maximumDeposit: 50000,
                    withdrawalFeePercent: 0.02,
                    loanSystem: {
                        enabled: true,
                        maxLoanAmount: 10000,
                        interestRate: 0.15,
                        maxDurationDays: 30
                    }
                },
                shop: {
                    enabled: true,
                    categories: [
                        {
                            name: 'Roles',
                            items: [
                                {
                                    id: 'vip_role',
                                    name: 'VIP Access',
                                    price: 5000,
                                    currency: 'AegisCoins',
                                    type: 'role',
                                    stock: 'unlimited',
                                    description: 'Get VIP access with special perks!'
                                },
                                {
                                    id: 'color_role',
                                    name: 'Custom Color Role',
                                    price: 2000,
                                    currency: 'AegisCoins',
                                    type: 'custom_role',
                                    stock: 'unlimited',
                                    description: 'Create your own colored role!'
                                }
                            ]
                        },
                        {
                            name: 'Items',
                            items: [
                                {
                                    id: 'lottery_ticket',
                                    name: 'Lottery Ticket',
                                    price: 100,
                                    currency: 'AegisCoins',
                                    type: 'consumable',
                                    stock: 'unlimited',
                                    description: 'Try your luck in the server lottery!'
                                },
                                {
                                    id: 'xp_boost',
                                    name: 'XP Boost (24h)',
                                    price: 250,
                                    currency: 'AegisCoins',
                                    type: 'consumable',
                                    stock: 'unlimited',
                                    description: '2x XP gain for 24 hours!'
                                }
                            ]
                        }
                    ]
                }
            };

            res.status(200).json(economySettings);
        } catch (error) {
            console.error('Error fetching economy settings:', error);
            res.status(500).json({ error: 'Failed to fetch economy settings' });
        }
    } else if (req.method === 'POST') {
        try {
            const settings = req.body;
            
            // Validate settings
            if (!settings || typeof settings.enabled !== 'boolean') {
                return res.status(400).json({ error: 'Invalid settings data' });
            }

            // In production, send to bot API or save to database
            console.log(`Updating economy settings for guild ${guildId}:`, settings);

            // Mock successful response
            res.status(200).json({ 
                success: true, 
                message: 'Economy settings updated successfully',
                settings: settings
            });
        } catch (error) {
            console.error('Error updating economy settings:', error);
            res.status(500).json({ error: 'Failed to update economy settings' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
