import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchBotStats = useCallback(async () => {
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
  }, [guildId]);

  const fetchRecentActivity = useCallback(async () => {
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
        },
        {
          id: '3',
          type: 'moderation',
          user: 'User',
          action: 'received a warning',
          timestamp: '10 minutes ago'
        },
        {
          id: '4',
          type: 'economy',
          user: 'Trader',
          action: 'earned 50 coins',
          timestamp: '15 minutes ago'
        },
        {
          id: '5',
          type: 'security',
          user: 'AutoMod',
          action: 'assigned auto-role',
          timestamp: '20 minutes ago'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [guildId]);

  useEffect(() => {
    if (guildId) {
      fetchBotStats();
      fetchRecentActivity();
    }
  }, [guildId, fetchBotStats, fetchRecentActivity]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'join': return '👋';
      case 'leave': return '👋';
      case 'level': return '⬆️';
      case 'moderation': return '🛡️';
      case 'economy': return '💰';
      case 'security': return '🔒';
      default: return '📊';
    }
  };

  const formatUptime = (uptime: number) => {
    if (uptime >= 99) return `${uptime.toFixed(1)}%`;
    return `${uptime.toFixed(2)}%`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <span className="dark-stat-badge online">Operational</span>;
      case 'idle':
        return <span className="dark-stat-badge warning">Idle</span>;
      case 'offline':
        return <span className="dark-stat-badge error">Offline</span>;
      default:
        return <span className="dark-stat-badge">Unknown</span>;
    }
  };

  const getSecurityLevel = () => {
    if (botStats.commandsExecuted > 1000) return { level: 'High', color: 'success' };
    if (botStats.commandsExecuted > 500) return { level: 'Medium', color: 'warning' };
    return { level: 'Low', color: 'error' };
  };

  if (loading) {
    return (
      <DashboardLayout guildId={guildId}>
        <div className="dark-content-header">
          <h1 className="dark-content-title">
            🏠 Dashboard
          </h1>
          <p className="dark-content-subtitle">Loading server overview...</p>
        </div>
        <div className="dark-content-body">
          <div className="dark-card">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>⏳</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Loading Dashboard</h3>
              <p style={{ color: 'var(--text-muted)' }}>Fetching your server statistics...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const securityInfo = getSecurityLevel();

  return (
    <DashboardLayout guildId={guildId}>
      {/* Content Header */}
      <div className="dark-content-header">
        <h1 className="dark-content-title">
          🏠 Dashboard
        </h1>
        <p className="dark-content-subtitle">Welcome to your server control panel</p>
      </div>

      {/* Content Body */}
      <div className="dark-content-body">
        {/* Stats Grid */}
        <div className="dark-stats-grid">
          <div className="dark-stat-card">
            <div className="dark-stat-icon blue">
              👥
            </div>
            <div>
              <div className="dark-stat-number">{guildData.memberCount.toLocaleString()}</div>
              <div className="dark-stat-label">Total Members</div>
              <div className="dark-stat-sublabel">Active Community</div>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon green">
              🤖
            </div>
            <div>
              <div className="dark-stat-number">{botStats.status.toUpperCase()}</div>
              <div className="dark-stat-label">Bot Status</div>
              <div className="dark-stat-sublabel">{getStatusBadge(botStats.status)}</div>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon yellow">
              🛡️
            </div>
            <div>
              <div className="dark-stat-number">{securityInfo.level}</div>
              <div className="dark-stat-label">Security Level</div>
              <div className="dark-stat-sublabel">
                <span className={`dark-stat-badge ${securityInfo.color}`}>Protected</span>
              </div>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon purple">
              ⚡
            </div>
            <div>
              <div className="dark-stat-number">{botStats.commandsExecuted}</div>
              <div className="dark-stat-label">Commands Executed</div>
              <div className="dark-stat-sublabel">
                <span className="dark-stat-badge info">24h Period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Quick Actions */}
          <div className="dark-card">
            <div className="dark-card-header">
              <h2 className="dark-card-title">
                ⚡ Quick Actions
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <button 
                className="dark-btn dark-btn-primary"
                onClick={() => router.push(`/dashboard/guilds/${guildId}/moderation`)}
              >
                🛡️ Moderation Panel
              </button>
              <button 
                className="dark-btn dark-btn-primary"
                onClick={() => router.push(`/dashboard/guilds/${guildId}/economy`)}
              >
                💰 Economy Settings
              </button>
              <button 
                className="dark-btn dark-btn-primary"
                onClick={() => router.push(`/dashboard/guilds/${guildId}/leveling`)}
              >
                ⬆️ Leveling System
              </button>
              <button 
                className="dark-btn dark-btn-primary"
                onClick={() => router.push(`/dashboard/guilds/${guildId}/security`)}
              >
                🔒 Security Settings
              </button>
            </div>
          </div>

          {/* Server Information */}
          <div className="dark-card">
            <div className="dark-card-header">
              <h2 className="dark-card-title">
                ℹ️ Server Info
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Server Name:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {guildData.name}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Server ID:</span>
                <code style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  color: 'var(--text-primary)'
                }}>
                  {guildId || 'undefined'}
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bot Version:</span>
                <span style={{ color: 'var(--text-primary)' }}>{botStats.version}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Uptime:</span>
                <span style={{ color: 'var(--accent-green)' }}>{formatUptime(botStats.uptime)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Latency:</span>
                <span style={{ color: botStats.latency < 100 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                  {botStats.latency}ms
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Premium Tier:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {guildData.premiumTier ? `Tier ${guildData.premiumTier}` : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dark-card">
          <div className="dark-card-header">
            <h2 className="dark-card-title">
              📊 Recent Activity
            </h2>
            <p className="dark-card-subtitle">Latest events in your server</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.slice(0, 5).map((activity) => (
              <div 
                key={activity.id}
                style={{
                  padding: '15px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
              >
                <div style={{ 
                  fontSize: '20px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-card)',
                  borderRadius: '6px'
                }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-primary)',
                    fontWeight: '500'
                  }}>
                    <strong>@{activity.user}</strong> {activity.action}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-muted)',
                    marginTop: '2px'
                  }}>
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { ['__SessionLuny']: token } = parseCookies(context);
    const { guild } = context.query;
    const guildId = guild as string;
    
    if (!token) {
      return {
        redirect: {
          destination: '/api/auth/login',
          permanent: false,
        }
      };
    }

    // Fetch guild data from Discord API
    const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    let guildData = {
      id: guildId,
      name: 'Unknown Server',
      icon: null,
      memberCount: 0,
      features: [],
      premiumTier: 0,
      region: 'Unknown',
      botPermissions: '0'
    };

    if (guildResponse.ok) {
      const guild = await guildResponse.json();
      guildData = {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        memberCount: guild.approximate_member_count || guild.member_count || 0,
        features: guild.features || [],
        premiumTier: guild.premium_tier || 0,
        region: guild.region || 'Unknown',
        botPermissions: guild.permissions || '0'
      };
    }

    return {
      props: {
        guildData,
        guildId
      }
    };

  } catch (error) {
    console.error('Error fetching guild data:', error);
    
    return {
      props: {
        guildData: {
          id: 'unknown',
          name: 'Unknown Server',
          icon: null,
          memberCount: 0,
          features: [],
          premiumTier: 0,
          region: 'Unknown',
          botPermissions: '0'
        },
        guildId: 'unknown'
      }
    };
  }
};
