import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    // Mock economy configuration
    const mockEconomyConfig = {
        enabled: true,
        primaryCurrency: {
            name: "Aegis Coins",
            symbol: "🪙",
            startingBalance: 100,
            dailyBonus: 50,
            weeklyBonus: 300
        },
        banking: {
            enabled: true,
            interestRate: 2.5,
            maxDeposit: 50000,
            withdrawalFee: 1
        },
        gambling: {
            enabled: true,
            maxBet: 1000,
            minBet: 10,
            houseEdge: 5
        },
        shop: {
            enabled: true,
            roles: [],
            items: []
        },
        work: {
            enabled: true,
            cooldown: 3600,
            minReward: 25,
            maxReward: 100
        }
    };

    if (req.method === 'GET') {
        res.status(200).json(mockEconomyConfig);
    } else if (req.method === 'POST') {
        const updatedConfig = { ...mockEconomyConfig, ...req.body };
        res.status(200).json(updatedConfig);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
