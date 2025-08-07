import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check Discord Bot Token
    const botToken = process.env.DISCORD_TOKEN;
    if (!botToken) {
      return res.status(500).json({ 
        error: 'Bot token not configured',
        configured: false 
      });
    }

    // Test Discord API connection
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ 
        error: 'Invalid bot token or Discord API error',
        details: errorData,
        configured: false 
      });
    }

    const botData = await response.json();

    // Get bot's guilds
    const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    });

    let guildsCount = 0;
    if (guildsResponse.ok) {
      const guilds = await guildsResponse.json();
      guildsCount = guilds.length;
    }

    return res.status(200).json({
      configured: true,
      bot: {
        id: botData.id,
        username: botData.username,
        discriminator: botData.discriminator,
        avatar: botData.avatar,
        verified: botData.verified,
        bot: botData.bot,
      },
      guilds: guildsCount,
      permissions: {
        canReadMessages: true, // These would be calculated based on guild permissions
        canSendMessages: true,
        canManageGuild: false,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasClientId: !!process.env.DISCORD_CLIENT_ID,
        hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
        hasRedirectUri: !!process.env.DISCORD_REDIRECT_URI,
      }
    });

  } catch (error) {
    console.error('Bot status check error:', error);
    return res.status(500).json({ 
      error: 'Failed to check bot status',
      details: error.message,
      configured: false 
    });
  }
}
