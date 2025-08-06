import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        try {
            // Mock leveling statistics - in production, fetch from bot API or database
            const levelingStats = {
                totalUsers: 145 + Math.floor(Math.random() * 20),
                averageLevel: 12.4 + Math.random() * 2,
                highestLevel: {
                    userId: '123456789012345678',
                    username: 'LevelMaster',
                    level: 85 + Math.floor(Math.random() * 15),
                    totalXp: 125000 + Math.floor(Math.random() * 25000)
                },
                dailyXpGained: 15420 + Math.floor(Math.random() * 5000),
                weeklyLeaderboard: [
                    {
                        userId: '123456789012345678',
                        username: 'XPGrinder',
                        level: 45,
                        totalXp: 85000,
                        weeklyXp: 2450,
                        rank: 1
                    },
                    {
                        userId: '234567890123456789',
                        username: 'ChatMaster',
                        level: 38,
                        totalXp: 62000,
                        weeklyXp: 1890,
                        rank: 2
                    },
                    {
                        userId: '345678901234567890',
                        username: 'ActiveUser',
                        level: 42,
                        totalXp: 71000,
                        weeklyXp: 1650,
                        rank: 3
                    },
                    {
                        userId: '456789012345678901',
                        username: 'VoiceChatter',
                        level: 35,
                        totalXp: 54000,
                        weeklyXp: 1320,
                        rank: 4
                    },
                    {
                        userId: '567890123456789012',
                        username: 'RegularMember',
                        level: 29,
                        totalXp: 41000,
                        weeklyXp: 1100,
                        rank: 5
                    }
                ],
                recentLevelUps: [
                    {
                        userId: '123456789012345678',
                        username: 'NewAchiever',
                        newLevel: 25,
                        timestamp: Date.now() - 300000,
                        rewardsEarned: ['Veteran Role', '500 AegisCoins']
                    },
                    {
                        userId: '234567890123456789',
                        username: 'LevelUpper',
                        newLevel: 15,
                        timestamp: Date.now() - 600000,
                        rewardsEarned: ['Regular Member Role']
                    },
                    {
                        userId: '345678901234567890',
                        username: 'Progressor',
                        newLevel: 10,
                        timestamp: Date.now() - 900000,
                        rewardsEarned: ['Member Role', '100 AegisCoins']
                    },
                    {
                        userId: '456789012345678901',
                        username: 'Climber',
                        newLevel: 8,
                        timestamp: Date.now() - 1200000,
                        rewardsEarned: []
                    },
                    {
                        userId: '567890123456789012',
                        username: 'Rising',
                        newLevel: 5,
                        timestamp: Date.now() - 1500000,
                        rewardsEarned: ['Newcomer Role']
                    }
                ],
                levelDistribution: [
                    { levelRange: '1-5', userCount: 45, percentage: 31.0 },
                    { levelRange: '6-10', userCount: 32, percentage: 22.1 },
                    { levelRange: '11-15', userCount: 28, percentage: 19.3 },
                    { levelRange: '16-20', userCount: 18, percentage: 12.4 },
                    { levelRange: '21-30', userCount: 12, percentage: 8.3 },
                    { levelRange: '31-40', userCount: 6, percentage: 4.1 },
                    { levelRange: '41-50', userCount: 3, percentage: 2.1 },
                    { levelRange: '51+', userCount: 1, percentage: 0.7 }
                ],
                xpActivity: {
                    hourlyBreakdown: Array.from({ length: 24 }, (_, i) => ({
                        hour: i,
                        xpGained: Math.floor(Math.random() * 1000) + 200,
                        messagesCount: Math.floor(Math.random() * 150) + 50,
                        voiceMinutes: Math.floor(Math.random() * 120) + 20
                    })),
                    weeklyTotals: {
                        totalXp: 98450,
                        totalMessages: 8420,
                        totalVoiceMinutes: 2150,
                        uniqueActiveUsers: 89
                    }
                },
                roleRewardDistribution: [
                    { roleName: 'Newcomer', userCount: 78, level: 5 },
                    { roleName: 'Regular Member', userCount: 45, level: 10 },
                    { roleName: 'Veteran', userCount: 18, level: 25 },
                    { roleName: 'Elite Member', userCount: 4, level: 50 }
                ],
                competitionData: {
                    currentWeeklyWinner: {
                        userId: '123456789012345678',
                        username: 'WeeklyChamp',
                        weeklyXp: 2450,
                        prize: 1000
                    },
                    lastMonthWinner: {
                        userId: '234567890123456789',
                        username: 'MonthlyKing',
                        monthlyXp: 8920,
                        specialReward: 'Custom Role'
                    },
                    upcomingRewards: [
                        { event: 'Weekly Reset', timeLeft: '2 days', topPrize: '1000 AegisCoins' },
                        { event: 'Monthly Competition', timeLeft: '15 days', topPrize: 'Custom Role + 5000 AegisCoins' }
                    ]
                },
                multiplierEffects: {
                    weekendBonus: {
                        active: new Date().getDay() === 0 || new Date().getDay() === 6,
                        multiplier: 1.5,
                        affectedUsers: 89
                    },
                    eventBonus: {
                        active: false,
                        multiplier: 2.0,
                        affectedUsers: 0
                    },
                    channelBoosts: [
                        { channelName: 'general-chat', multiplier: 1.2, messagesThisWeek: 450 },
                        { channelName: 'events', multiplier: 2.0, messagesThisWeek: 125 }
                    ],
                    roleBoosts: [
                        { roleName: 'VIP', multiplier: 1.5, affectedUsers: 12 },
                        { roleName: 'Booster', multiplier: 1.3, affectedUsers: 8 }
                    ]
                }
            };

            res.status(200).json(levelingStats);
        } catch (error) {
            console.error('Error fetching leveling stats:', error);
            res.status(500).json({ error: 'Failed to fetch leveling statistics' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
