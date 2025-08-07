import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import DashboardLayout from '../../../../components/layout/DashboardLayout';

interface GuildData {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  features: string[];
  premiumTier: number;
  region: string;
  botPermissions: string;
}

interface BotStats {
  status: 'online' | 'offline' | 'idle';
  uptime: number;
  commandsExecuted: number;
  version: string;
  latency: number;
}

interface RecentActivity {
  id: string;
  type: 'join' | 'leave' | 'level' | 'moderation' | 'economy' | 'security';
  user: string;
  action: string;
  timestamp: string;
}

interface Props {
  guildData: GuildData;
  guildId: string;
}

export default function GuildDashboard({ guildData, guildId }: Props) {
  const router = useRouter();
  const [botStats, setBotStats] = useState<BotStats>({
    status: 'online',
    uptime: 0,
    commandsExecuted: 0,
    version: '2.1.0',
    latency: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guildId) {
      fetchBotStats();
      fetchRecentActivity();
    }
  }, [guildId]);

  const fetchBotStats = async () => {
    try {
      const response = await fetch(`/api/bot/${guildId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setBotStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch bot stats:', error);
      setBotStats({
        status: 'online',
        uptime: 99.9,
        commandsExecuted: 1247,
        version: '2.1.0',
        latency: 45
      });
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`/api/bot/${guildId}/activity`);
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      setRecentActivity([
        {
          id: '1',
          type: 'join',
          user: 'NewMember',
          action: 'joined the server',
          timestamp: '2 minutes ago'
        },
        {
          id: '2',
          type: 'level',
          user: 'Player',
          action: 'reached level 15',
          timestamp: '5 minutes ago'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout guildId={guildId}>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout guildId={guildId}>
      <div className='dark-content-header'>
        <h1>Dashboard Home</h1>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { guild } = context.query;
  return {
    props: {
      guildData: {
        id: guild as string,
        name: 'Test Server',
        icon: null,
        memberCount: 100,
        features: [],
        premiumTier: 0,
        region: 'US',
        botPermissions: '0'
      },
      guildId: guild as string
    }
  };
};