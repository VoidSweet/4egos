import React, { useState, useEffect } from 'react';
import styles from '../styles/ActivityConsole.module.css';

interface ActivityLog {
    id: string;
    type: 'moderation' | 'command' | 'auto_mod' | 'join' | 'leave' | 'config';
    message: string;
    user?: {
        id: string;
        username: string;
        avatar?: string;
    };
    timestamp: string;
    details?: any;
}

interface ActivityConsoleProps {
    guildId: string;
}

const ActivityConsole: React.FC<ActivityConsoleProps> = ({ guildId }) => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    const fetchActivityLogs = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/activity`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Error fetching activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityLogs();
        // Set up polling for real-time updates
        const interval = setInterval(fetchActivityLogs, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, [guildId]); // fetchActivityLogs is stable since guildId is from props

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'moderation': return { icon: 'fa-gavel', color: '#dc2626' };
            case 'command': return { icon: 'fa-terminal', color: '#3b82f6' };
            case 'auto_mod': return { icon: 'fa-shield-alt', color: '#f59e0b' };
            case 'join': return { icon: 'fa-user-plus', color: '#10b981' };
            case 'leave': return { icon: 'fa-user-minus', color: '#6b7280' };
            case 'config': return { icon: 'fa-cog', color: '#8b5cf6' };
            default: return { icon: 'fa-info-circle', color: '#6b7280' };
        }
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const filteredLogs = filter === 'all' 
        ? logs 
        : logs.filter(log => log.type === filter);

    const getUserAvatar = (user: ActivityLog['user']) => {
        if (user?.avatar) {
            return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=32`;
        }
        return '/images/default_avatar.png';
    };

    return (
        <div className={styles.activityConsole}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <i className="fas fa-terminal"></i>
                    <span>Activity Console</span>
                    <div className={styles.liveBadge}>
                        <i className="fas fa-circle"></i>
                        Live
                    </div>
                </div>
                
                <div className={styles.filters}>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="all">All Activity</option>
                        <option value="moderation">Moderation</option>
                        <option value="command">Commands</option>
                        <option value="auto_mod">Auto Mod</option>
                        <option value="join">Joins</option>
                        <option value="leave">Leaves</option>
                        <option value="config">Config</option>
                    </select>
                </div>
            </div>

            <div className={styles.console}>
                {loading ? (
                    <div className={styles.loading}>
                        <i className="fas fa-spinner fa-spin"></i>
                        Loading activity logs...
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className={styles.empty}>
                        <i className="fas fa-inbox"></i>
                        No activity logs found
                    </div>
                ) : (
                    <div className={styles.logs}>
                        {filteredLogs.slice(0, 50).map((log) => {
                            const typeConfig = getTypeIcon(log.type);
                            return (
                                <div key={log.id} className={styles.logEntry}>
                                    <div className={styles.logTime}>
                                        {getTimeAgo(log.timestamp)}
                                    </div>
                                    <div 
                                        className={styles.logIcon}
                                        style={{ color: typeConfig.color }}
                                    >
                                        <i className={`fas ${typeConfig.icon}`}></i>
                                    </div>
                                    <div className={styles.logContent}>
                                        <div className={styles.logMessage}>
                                            {log.message}
                                        </div>
                                        {log.user && (
                                            <div className={styles.logUser}>
                                                <img 
                                                    src={getUserAvatar(log.user)}
                                                    alt={log.user.username}
                                                    className={styles.userAvatar}
                                                />
                                                <span>{log.user.username}</span>
                                            </div>
                                        )}
                                        {log.details && (
                                            <div className={styles.logDetails}>
                                                {Object.entries(log.details).map(([key, value]) => (
                                                    <span key={key} className={styles.detail}>
                                                        <strong>{key}:</strong> {String(value)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityConsole;
