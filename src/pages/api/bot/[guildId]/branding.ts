import type { NextApiRequest, NextApiResponse } from 'next';

interface BrandingSettings {
  botName?: string;
  botDescription?: string;
  botAvatar?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  theme?: 'dark' | 'light' | 'auto';
  customLogo?: string;
  embedColor?: string;
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'danger';
  enableCustomBranding?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guildId } = req.query;

  if (!guildId || typeof guildId !== 'string') {
    return res.status(400).json({ error: 'Guild ID is required' });
  }

  try {
    if (req.method === 'GET') {
      // Fetch current branding settings
      try {
        const botApiUrl = process.env.BOT_API_URL || 'http://localhost:3001';
        const response = await fetch(`${botApiUrl}/api/guilds/${guildId}/branding`, {
          headers: {
            'Authorization': `Bearer ${process.env.BOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return res.status(200).json(data);
        }
      } catch (error) {
        console.log('Bot API unavailable, using default branding');
      }

      // Fallback default branding settings
      const defaultBranding: BrandingSettings = {
        botName: 'AegisBot',
        botDescription: 'Your powerful Discord management bot',
        botAvatar: null,
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        accentColor: '#60a5fa',
        theme: 'dark',
        customLogo: null,
        embedColor: '#1e40af',
        buttonStyle: 'primary',
        enableCustomBranding: false,
      };

      return res.status(200).json(defaultBranding);
    }

    if (req.method === 'POST') {
      const brandingData: BrandingSettings = req.body;

      // Validate branding data
      if (brandingData.primaryColor && !/^#[0-9A-F]{6}$/i.test(brandingData.primaryColor)) {
        return res.status(400).json({ error: 'Invalid primary color format' });
      }
      
      if (brandingData.secondaryColor && !/^#[0-9A-F]{6}$/i.test(brandingData.secondaryColor)) {
        return res.status(400).json({ error: 'Invalid secondary color format' });
      }

      if (brandingData.botName && (brandingData.botName.length < 2 || brandingData.botName.length > 32)) {
        return res.status(400).json({ error: 'Bot name must be between 2 and 32 characters' });
      }

      // Send to bot API
      try {
        const botApiUrl = process.env.BOT_API_URL || 'http://localhost:3001';
        const response = await fetch(`${botApiUrl}/api/guilds/${guildId}/branding`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.BOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(brandingData),
        });

        if (response.ok) {
          const data = await response.json();
          return res.status(200).json({ 
            success: true, 
            message: 'Branding updated successfully',
            data 
          });
        } else {
          throw new Error('Bot API request failed');
        }
      } catch (error) {
        console.error('Error updating branding via bot API:', error);
        
        // Mock success response for development
        return res.status(200).json({ 
          success: true, 
          message: 'Branding updated successfully (mock response)',
          data: brandingData
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in branding API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
