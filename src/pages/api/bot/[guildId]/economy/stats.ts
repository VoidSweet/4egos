import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        try {
            // Mock economy statistics - in production, fetch from bot API or database
            const economyStats = {
                totalCirculation: 1250000 + Math.floor(Math.random() * 500000),
                averageBalance: 2350 + Math.floor(Math.random() * 500),
                richestUser: {
                    userId: '123456789012345678',
                    username: 'EconomyKing',
                    balance: 45000 + Math.floor(Math.random() * 10000)
                },
                dailyTransactions: 180 + Math.floor(Math.random() * 100),
                weeklyGrowth: `+${12 + Math.floor(Math.random() * 8)}%`,
                bankDeposits: 680000 + Math.floor(Math.random() * 200000),
                totalLoans: 18000 + Math.floor(Math.random() * 15000),
                topUsers: [
                    {
                        userId: '123456789012345678',
                        username: 'EconomyKing',
                        balance: 45000,
                        rank: 1
                    },
                    {
                        userId: '234567890123456789',
                        username: 'CoinCollector',
                        balance: 38500,
                        rank: 2
                    },
                    {
                        userId: '345678901234567890',
                        username: 'WealthBuilder',
                        balance: 32100,
                        rank: 3
                    },
                    {
                        userId: '456789012345678901',
                        username: 'MoneyMaker',
                        balance: 28900,
                        rank: 4
                    },
                    {
                        userId: '567890123456789012',
                        username: 'CashFlow',
                        balance: 25600,
                        rank: 5
                    }
                ],
                dailyActivity: {
                    totalEarned: 15000 + Math.floor(Math.random() * 5000),
                    totalSpent: 8000 + Math.floor(Math.random() * 3000),
                    bankTransactions: 45 + Math.floor(Math.random() * 20),
                    shopPurchases: 12 + Math.floor(Math.random() * 10)
                },
                economicHealth: {
                    inflationRate: 0.02 + Math.random() * 0.03,
                    velocityOfMoney: 1.8 + Math.random() * 0.4,
                    giniCoefficient: 0.35 + Math.random() * 0.15,
                    liquidityRatio: 0.68 + Math.random() * 0.2
                },
                recentTransactions: [
                    {
                        id: 'tx_001',
                        type: 'daily_bonus',
                        amount: 100,
                        userId: '123456789012345678',
                        username: 'ActiveUser',
                        timestamp: Date.now() - 300000,
                        description: 'Daily bonus (3 day streak)'
                    },
                    {
                        id: 'tx_002',
                        type: 'shop_purchase',
                        amount: -2000,
                        userId: '234567890123456789',
                        username: 'Shopper',
                        timestamp: Date.now() - 600000,
                        description: 'Purchased Custom Color Role'
                    },
                    {
                        id: 'tx_003',
                        type: 'job_payment',
                        amount: 275,
                        userId: '345678901234567890',
                        username: 'Worker',
                        timestamp: Date.now() - 900000,
                        description: 'Completed Trader job'
                    },
                    {
                        id: 'tx_004',
                        type: 'bank_deposit',
                        amount: -5000,
                        userId: '456789012345678901',
                        username: 'Saver',
                        timestamp: Date.now() - 1200000,
                        description: 'Bank deposit'
                    },
                    {
                        id: 'tx_005',
                        type: 'transfer',
                        amount: 500,
                        userId: '567890123456789012',
                        username: 'Recipient',
                        timestamp: Date.now() - 1500000,
                        description: 'Received from friend'
                    }
                ],
                monthlyReport: {
                    totalRevenue: 250000,
                    totalExpenses: 180000,
                    netGrowth: 70000,
                    newUsers: 45,
                    activeUsers: 320,
                    topEarningSource: 'Daily Bonus',
                    topSpendingCategory: 'Roles'
                }
            };

            res.status(200).json(economyStats);
        } catch (error) {
            console.error('Error fetching economy stats:', error);
            res.status(500).json({ error: 'Failed to fetch economy statistics' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
