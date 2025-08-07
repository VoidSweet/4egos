import React, { useState, useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from '../../styles/DashboardLayout.module.css';

interface ConsoleProps {
  user: any;
}

interface LogEntry {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  user?: string;
  action?: string;
}

export default function Console({ user }: ConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Dashboard console initialized',
      action: 'SYSTEM_START'
    },
    {
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
      type: 'success',
      message: 'User joined server: Test Server',
      user: 'User#1234',
      action: 'USER_JOIN'
    },
    {
      timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
      type: 'warning',
      message: 'Rate limit approached for command: /music',
      action: 'RATE_LIMIT'
    },
    {
      timestamp: new Date(Date.now() - 900000).toLocaleTimeString(),
      type: 'info',
      message: 'Moderation action: User banned',
      user: 'Moderator#5678',
      action: 'MODERATION_BAN'
    },
    {
      timestamp: new Date(Date.now() - 1200000).toLocaleTimeString(),
      type: 'error',
      message: 'Failed to connect to voice channel',
      action: 'VOICE_ERROR'
    }
  ]);
  const [filter, setFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate real-time logs
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        type: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)] as LogEntry['type'],
        message: [
          'Command executed successfully',
          'New user registered',
          'Database query completed',
          'Cache updated',
          'Webhook received',
          'Backup completed'
        ][Math.floor(Math.random() * 6)],
        action: 'LIVE_UPDATE'
      };
      
      setLogs(prev => [...prev.slice(-49), newLog]); // Keep last 50 logs
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return '#ff6b6b';
      case 'warning': return '#ffd93d';
      case 'success': return '#6bcf7f';
      case 'info': return '#74c0fc';
      default: return '#ffffff';
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Activity Console</h1>
        
        <div className={styles.section}>
          <div className={styles.consoleControls}>
            <select 
              className={styles.select}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Logs</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              Auto-scroll
            </label>

            <button 
              className={styles.clearButton}
              onClick={() => setLogs([])}
            >
              Clear Console
            </button>
          </div>

          <div className={styles.consoleWindow} ref={consoleRef}>
            <div className={styles.consoleHeader}>
              <span>Activity Monitor - Live Feed</span>
              <span className={styles.consoleStatus}>● LIVE</span>
            </div>
            
            <div className={styles.consoleContent}>
              {filteredLogs.map((log, index) => (
                <div key={index} className={styles.logEntry}>
                  <span className={styles.timestamp}>[{log.timestamp}]</span>
                  <span 
                    className={styles.logType}
                    style={{ color: getLogColor(log.type) }}
                  >
                    {log.type.toUpperCase()}
                  </span>
                  {log.action && (
                    <span className={styles.action}>[{log.action}]</span>
                  )}
                  <span className={styles.message}>{log.message}</span>
                  {log.user && (
                    <span className={styles.user}>by {log.user}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Quick Stats</h2>
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span className={styles.statLabel}>Total Events</span>
              <span className={styles.statValue}>{logs.length}</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.statLabel}>Errors</span>
              <span className={styles.statValue} style={{ color: '#ff6b6b' }}>
                {logs.filter(l => l.type === 'error').length}
              </span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.statLabel}>Warnings</span>
              <span className={styles.statValue} style={{ color: '#ffd93d' }}>
                {logs.filter(l => l.type === 'warning').length}
              </span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.statLabel}>Success</span>
              <span className={styles.statValue} style={{ color: '#6bcf7f' }}>
                {logs.filter(l => l.type === 'success').length}
              </span>
            </div>
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
