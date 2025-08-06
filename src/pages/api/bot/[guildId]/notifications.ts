import type { NextApiRequest, NextApiResponse } from 'next';

interface NotificationData {
  id: string;
  type: 'moderation' | 'security' | 'system' | 'update' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  guildId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: boolean;
  actionUrl?: string;
}

interface NotificationCounts {
  total: number;
  unread: number;
  byType: {
    moderation: number;
    security: number;
    system: number;
    update: number;
    warning: number;
  };
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
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
      // Fetch notifications from bot API
      try {
        const botApiUrl = process.env.BOT_API_URL || 'http://localhost:3001';
        const response = await fetch(`${botApiUrl}/api/guilds/${guildId}/notifications`, {
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
        console.log('Bot API unavailable, using mock notifications');
      }

      // Mock notifications for development
      const mockNotifications: NotificationData[] = [
        {
          id: '1',
          type: 'moderation',
          title: 'Automod Alert',
          message: '3 spam messages detected and removed in the last hour',
          timestamp: Date.now() - 1800000, // 30 minutes ago
          read: false,
          guildId,
          severity: 'medium',
          actionRequired: false
        },
        {
          id: '2',
          type: 'security',
          title: 'Raid Protection Triggered',
          message: 'Multiple users joined rapidly - raid mode activated',
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: false,
          guildId,
          severity: 'high',
          actionRequired: true,
          actionUrl: `/dashboard/guilds/${guildId}/moderation`
        },
        {
          id: '3',
          type: 'system',
          title: 'Database Backup Complete',
          message: 'Daily server data backup completed successfully',
          timestamp: Date.now() - 86400000, // 1 day ago
          read: true,
          guildId,
          severity: 'low'
        },
        {
          id: '4',
          type: 'update',
          title: 'Bot Update Available',
          message: 'New features: Advanced moderation tools and better performance',
          timestamp: Date.now() - 172800000, // 2 days ago
          read: false,
          guildId,
          severity: 'medium',
          actionRequired: false
        },
        {
          id: '5',
          type: 'warning',
          title: 'Approaching Rate Limits',
          message: 'Command usage is approaching rate limits for this server',
          timestamp: Date.now() - 7200000, // 2 hours ago
          read: false,
          guildId,
          severity: 'medium'
        }
      ];

      // Calculate counts
      const counts: NotificationCounts = {
        total: mockNotifications.length,
        unread: mockNotifications.filter(n => !n.read).length,
        byType: {
          moderation: mockNotifications.filter(n => n.type === 'moderation').length,
          security: mockNotifications.filter(n => n.type === 'security').length,
          system: mockNotifications.filter(n => n.type === 'system').length,
          update: mockNotifications.filter(n => n.type === 'update').length,
          warning: mockNotifications.filter(n => n.type === 'warning').length,
        },
        bySeverity: {
          low: mockNotifications.filter(n => n.severity === 'low').length,
          medium: mockNotifications.filter(n => n.severity === 'medium').length,
          high: mockNotifications.filter(n => n.severity === 'high').length,
          critical: mockNotifications.filter(n => n.severity === 'critical').length,
        }
      };

      return res.status(200).json({
        notifications: mockNotifications,
        counts
      });
    }

    if (req.method === 'POST') {
      const { action, notificationIds } = req.body;

      if (action === 'markAsRead' && Array.isArray(notificationIds)) {
        // Mark notifications as read
        try {
          const botApiUrl = process.env.BOT_API_URL || 'http://localhost:3001';
          const response = await fetch(`${botApiUrl}/api/guilds/${guildId}/notifications/read`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.BOT_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationIds }),
          });

          if (response.ok) {
            return res.status(200).json({ success: true, message: 'Notifications marked as read' });
          }
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }

        // Mock success response
        return res.status(200).json({ 
          success: true, 
          message: 'Notifications marked as read (mock response)' 
        });
      }

      return res.status(400).json({ error: 'Invalid action or missing data' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in notifications API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
