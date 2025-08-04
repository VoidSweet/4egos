import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    // Real economy configuration - would fetch from database in production
    const defaultEconomyConfig = {
        enabled: false,
        primaryCurrency: {
            name: "Server Coins",
            symbol: "🪙",
            startingBalance: 100,
            dailyBonus: 50,
            weeklyBonus: 300
        },
        banking: {
            enabled: false,
            interestRate: 2.5,
            maxDeposit: 50000,
            withdrawalFee: 1
        },
        gambling: {
            enabled: false,
            maxBet: 1000,
            minBet: 10,
            houseEdge: 5
        },
        shop: {
            enabled: false,
            roles: [],
            items: []
        },
        work: {
            enabled: false,
            cooldown: 3600,
            minReward: 25,
            maxReward: 100
        }
    };

    if (req.method === 'GET') {
        // In production, fetch from database: SELECT * FROM guild_economy WHERE guild_id = guildId
        res.status(200).json(defaultEconomyConfig);
    } else if (req.method === 'POST') {
        // In production, save to database: UPDATE guild_economy SET ... WHERE guild_id = guildId
        const updatedConfig = { ...defaultEconomyConfig, ...req.body };
        res.status(200).json(updatedConfig);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
