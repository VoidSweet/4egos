import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import '../../../../styles/dark-theme.css';

interface GuildStats {
  memberCount: number;
  botStatus: string;
  securityLevel: string;
  activeCommands: number;
  recentActivity: string[];
}

export default function GuildDashboard() {
  const router = useRouter();
  const { guild } = router.query;
  const guildId = guild as string;

  const [stats, setStats] = useState<GuildStats>({
    memberCount: 0,
    botStatus: 'Online',
    securityLevel: 'High',
    activeCommands: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guildId) {
      fetchGuildStats();
    }
  }, [guildId]);

  const fetchGuildStats = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with real API when available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setStats({
        memberCount: 1250,
        botStatus: 'Online',
        securityLevel: 'High',
        activeCommands: 47,
        recentActivity: [
          'User joined: @NewMember',
          'Level up: @Player reached level 15',
          'Moderation: Warning issued to @User',
          'Economy: 50 coins earned by @Trader',
          'Security: Auto-role assigned'
        ]
      });
    } catch (error) {
      console.error('Failed to fetch guild stats:', error);
    } finally {
      setLoading(false);
    }
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
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Loading Dashboard</h3>
              <p style={{ color: 'var(--text-muted)' }}>Fetching your server statistics...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <div className="dark-stat-content">
              <h3>{stats.memberCount.toLocaleString()}</h3>
              <p>Total Members</p>
              <span className="dark-stat-badge info">Active Community</span>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon green">
              🟢
            </div>
            <div className="dark-stat-content">
              <h3>{stats.botStatus}</h3>
              <p>Bot Status</p>
              <span className="dark-stat-badge online">Operational</span>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon yellow">
              🛡️
            </div>
            <div className="dark-stat-content">
              <h3>{stats.securityLevel}</h3>
              <p>Security Level</p>
              <span className="dark-stat-badge secure">Protected</span>
            </div>
          </div>

          <div className="dark-stat-card">
            <div className="dark-stat-icon purple">
              ⚡
            </div>
            <div className="dark-stat-content">
              <h3>{stats.activeCommands}</h3>
              <p>Active Commands</p>
              <span className="dark-stat-badge info">Available</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
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
                <span style={{ color: 'var(--text-muted)' }}>Server ID:</span>
                <code style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  color: 'var(--text-primary)'
                }}>
                  {guildId}
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bot Version:</span>
                <span style={{ color: 'var(--text-primary)' }}>v2.1.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Uptime:</span>
                <span style={{ color: 'var(--accent-green)' }}>99.9%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Region:</span>
                <span style={{ color: 'var(--text-primary)' }}>US East</span>
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
            {stats.recentActivity.map((activity, index) => (
              <div 
                key={index}
                style={{
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-primary)',
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}
              >
                {activity}
              </div>
            ))}
          </div>
        </div>

        {/* Bot Management Actions */}
        <div className="dark-card" style={{ marginTop: '20px' }}>
          <div className="dark-card-header">
            <h2 className="dark-card-title">
              🤖 Bot Management
            </h2>
            <p className="dark-card-subtitle">Control your bot settings and features</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ 
              padding: '15px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '8px',
              border: '1px solid var(--border-primary)'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>🔧 System Status</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>
                All systems operational
              </p>
              <span className="dark-stat-badge online">Healthy</span>
            </div>
            
            <div style={{ 
              padding: '15px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '8px',
              border: '1px solid var(--border-primary)'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>📈 Performance</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>
                Response time: 45ms
              </p>
              <span className="dark-stat-badge info">Excellent</span>
            </div>
            
            <div style={{ 
              padding: '15px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '8px',
              border: '1px solid var(--border-primary)'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>🔄 Last Update</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>
                2 hours ago
              </p>
              <span className="dark-stat-badge info">Recent</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

