import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session token from cookies
    const { '__SessionLuny': sessionToken } = parseCookies({ req });
    
    // Check if OAuth is configured
    const configured = !!(
      process.env.DISCORD_CLIENT_ID && 
      process.env.DISCORD_CLIENT_SECRET && 
      process.env.DISCORD_REDIRECT_URI
    );
    
    if (!sessionToken) {
      return res.status(200).json({ 
        authenticated: false,
        configured,
        user: null,
        error: 'No session token found' 
      });
    }

    // Verify token with Discord API
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      return res.status(200).json({ 
        authenticated: false,
        configured,
        user: null,
        error: 'Invalid or expired session token' 
      });
    }

    const userData = await userResponse.json();

    // Get user's guilds
    const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    let userGuilds = [];
    if (guildsResponse.ok) {
      userGuilds = await guildsResponse.json();
    }
    // Filter guilds where user has MANAGE_GUILD permission (0x00000020)
    const manageableGuilds = userGuilds.filter(guild => 
      (parseInt(guild.permissions) & 0x00000020) === 0x00000020
    );

    return res.status(200).json({
      authenticated: true,
      configured,
      user: {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        email: userData.email,
        verified: userData.verified,
      },
      guilds: {
        total: userGuilds.length,
        manageable: manageableGuilds.length,
        list: manageableGuilds.map(guild => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          owner: guild.owner,
          permissions: guild.permissions,
        })),
      },
      session: {
        token: sessionToken.substring(0, 10) + '...',
        expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
      }
    });

  } catch (error) {
    console.error('Auth status check error:', error);
    return res.status(500).json({ 
      authenticated: false,
      error: 'Failed to check authentication status',
      details: error.message 
    });
  }
}
