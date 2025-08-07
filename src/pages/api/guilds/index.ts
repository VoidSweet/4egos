import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ['__SessionLuny']: token } = parseCookies({ req });
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get user's guilds from Discord
    const userGuildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userGuildsResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch user guilds' });
    }

    const userGuilds = await userGuildsResponse.json();

    // Get bot's guilds
    const botToken = process.env.DISCORD_TOKEN;
    if (!botToken) {
      return res.status(500).json({ error: 'Bot token not configured' });
    }

    const botGuildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    });

    let botGuilds = [];
    if (botGuildsResponse.ok) {
      botGuilds = await botGuildsResponse.json();
    }

    const botGuildIds = new Set(botGuilds.map(guild => guild.id));

    // Filter user guilds where they have admin permissions and check bot presence
    const adminGuilds = userGuilds
      .filter(guild => 
        guild.owner || 
        (parseInt(guild.permissions) & 0x8) === 0x8 || // ADMINISTRATOR
        (parseInt(guild.permissions) & 0x20) === 0x20   // MANAGE_SERVER
      )
      .map(guild => ({
        ...guild,
        botPresent: botGuildIds.has(guild.id)
      }));

    return res.status(200).json({ guilds: adminGuilds });

  } catch (error) {
    console.error('Guilds fetch error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch guilds',
      details: error.message 
    });
  }
}
