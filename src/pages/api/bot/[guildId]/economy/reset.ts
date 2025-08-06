import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'POST') {
        try {
            // Mock economy reset - in production, this would reset all user balances in the database
            console.log(`Resetting economy for guild ${guildId}`);
            
            // In a real implementation, this would:
            // 1. Reset all user balances to starting amount
            // 2. Clear all transactions
            // 3. Reset banking data
            // 4. Clear shop purchase history
            // 5. Log the reset action
            
            const resetData = {
                success: true,
                message: 'Economy has been reset successfully',
                timestamp: new Date().toISOString(),
                details: {
                    usersAffected: 150,
                    balancesReset: 150,
                    transactionsCleared: 2450,
                    bankAccountsReset: 85,
                    shopHistoryCleared: true
                }
            };

            res.status(200).json(resetData);
        } catch (error) {
            console.error('Error resetting economy:', error);
            res.status(500).json({ error: 'Failed to reset economy' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
