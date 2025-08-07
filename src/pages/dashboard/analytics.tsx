import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from '../../styles/DashboardLayout.module.css';

interface AnalyticsProps {
  user: any;
}

export default function Analytics({ user }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    commands: { total: 1234, growth: '+12%' },
    users: { total: 5678, growth: '+8%' },
    servers: { total: 45, growth: '+3%' },
    messages: { total: 9876, growth: '+15%' }
  });

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Analytics Dashboard</h1>
        
        <div className={styles.section}>
          <h2>Time Range</h2>
          <select 
            className={styles.select}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <div className={styles.section}>
          <h2>Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Commands</h3>
              <span className={styles.statNumber}>{analyticsData.commands.total.toLocaleString()}</span>
              <span className={styles.statGrowth}>{analyticsData.commands.growth}</span>
            </div>
            <div className={styles.statCard}>
              <h3>Active Users</h3>
              <span className={styles.statNumber}>{analyticsData.users.total.toLocaleString()}</span>
              <span className={styles.statGrowth}>{analyticsData.users.growth}</span>
            </div>
            <div className={styles.statCard}>
              <h3>Servers</h3>
              <span className={styles.statNumber}>{analyticsData.servers.total}</span>
              <span className={styles.statGrowth}>{analyticsData.servers.growth}</span>
            </div>
            <div className={styles.statCard}>
              <h3>Messages Processed</h3>
              <span className={styles.statNumber}>{analyticsData.messages.total.toLocaleString()}</span>
              <span className={styles.statGrowth}>{analyticsData.messages.growth}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Command Usage</h2>
          <div className={styles.commandsList}>
            <div className={styles.commandItem}>
              <span className={styles.commandName}>/help</span>
              <span className={styles.commandCount}>456 uses</span>
            </div>
            <div className={styles.commandItem}>
              <span className={styles.commandName}>/moderation ban</span>
              <span className={styles.commandCount}>123 uses</span>
            </div>
            <div className={styles.commandItem}>
              <span className={styles.commandName}>/economy balance</span>
              <span className={styles.commandCount}>789 uses</span>
            </div>
            <div className={styles.commandItem}>
              <span className={styles.commandName}>/music play</span>
              <span className={styles.commandCount}>321 uses</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Server Activity</h2>
          <div className={styles.activityChart}>
            <p>Interactive charts would be displayed here showing:</p>
            <ul>
              <li>Commands per hour/day</li>
              <li>User activity patterns</li>
              <li>Server growth over time</li>
              <li>Feature usage statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      user: null,
    },
  };
};
