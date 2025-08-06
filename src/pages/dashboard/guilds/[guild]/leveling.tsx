import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../../../styles/GuildDashboard.module.css';
import { IUser } from '../../../../types';

interface IGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    memberCount?: number;
    botPresent?: boolean;
}

interface LevelingSettings {
    enabled: boolean;
    xpSettings: {
        perMessage: {
            minimum: number;
            maximum: number;
            cooldownSeconds: number;
        };
        voiceChat: {
            enabled: boolean;
            xpPerMinute: number;
            minimumUsers: number;
            maxPerSession: number;
        };
        bonusMultipliers: {
            weekendBonus: number;
            eventBonus: number;
            nitroBoostBonus: number;
        };
    };
    levelCalculation: {
        formula: string;
        baseXp: number;
        multiplier: number;
        maxLevel: number;
    };
    roleRewards: {
        enabled: boolean;
        rewards: Array<{
            level: number;
            roleId: string;
            roleName: string;
            announcement: boolean;
            removePrevious: boolean;
            bonusRewards?: {
                currency?: number;
                shopDiscount?: number;
            };
            specialPerks?: string[];
        }>;
    };
    leaderboards: {
        enabled: boolean;
        types: {
            levelLeaderboard: {
                displayCount: number;
                updateFrequency: string;
                showAvatars: boolean;
                excludeBots: boolean;
            };
            weeklyXp: {
                enabled: boolean;
                resetDay: string;
                rewards: Array<{
                    position: number;
                    reward: number;
                }>;
            };
            monthlyCompetition: {
                enabled: boolean;
                specialRewards: boolean;
            };
        };
    };
    customization: {
        levelUpMessage: {
            enabled: boolean;
            channel: string;
            message: string;
            useEmbed: boolean;
        };
        xpBoosts: {
            enabled: boolean;
            boostChannels: Array<{
                channelId: string;
                channelName: string;
                multiplier: number;
            }>;
            boostRoles: Array<{
                roleId: string;
                roleName: string;
                multiplier: number;
            }>;
        };
        blacklistedChannels: string[];
        blacklistedRoles: string[];
    };
}

interface LevelingStats {
    totalUsers: number;
    averageLevel: number;
    highestLevel: {
        userId: string;
        username: string;
        level: number;
        totalXp: number;
    };
    dailyXpGained: number;
    weeklyLeaderboard: Array<{
        userId: string;
        username: string;
        level: number;
        totalXp: number;
        weeklyXp: number;
        rank: number;
    }>;
    recentLevelUps: Array<{
        userId: string;
        username: string;
        newLevel: number;
        timestamp: number;
        rewardsEarned: string[];
    }>;
    levelDistribution: Array<{
        levelRange: string;
        userCount: number;
        percentage: number;
    }>;
}

interface IProps {
    user: IUser;
    guild: IGuild;
}

export default function LevelingPage({ user, guild }: IProps) {
    const router = useRouter();
    const { guild: guildId } = router.query;
    
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [settings, setSettings] = useState<LevelingSettings>({
        enabled: true,
        xpSettings: {
            perMessage: {
                minimum: 15,
                maximum: 25,
                cooldownSeconds: 60
            },
            voiceChat: {
                enabled: true,
                xpPerMinute: 5,
                minimumUsers: 2,
                maxPerSession: 300
            },
            bonusMultipliers: {
                weekendBonus: 1.5,
                eventBonus: 2.0,
                nitroBoostBonus: 1.2
            }
        },
        levelCalculation: {
            formula: 'quadratic',
            baseXp: 100,
            multiplier: 1.5,
            maxLevel: 100
        },
        roleRewards: {
            enabled: true,
            rewards: [
                {
                    level: 5,
                    roleId: '',
                    roleName: 'Newcomer',
                    announcement: true,
                    removePrevious: false
                },
                {
                    level: 10,
                    roleId: '',
                    roleName: 'Regular Member',
                    announcement: true,
                    removePrevious: true,
                    bonusRewards: {
                        currency: 500,
                        shopDiscount: 0.1
                    }
                },
                {
                    level: 25,
                    roleId: '',
                    roleName: 'Veteran',
                    announcement: true,
                    removePrevious: true,
                    specialPerks: ['custom_status', 'priority_support']
                }
            ]
        },
        leaderboards: {
            enabled: true,
            types: {
                levelLeaderboard: {
                    displayCount: 10,
                    updateFrequency: 'hourly',
                    showAvatars: true,
                    excludeBots: true
                },
                weeklyXp: {
                    enabled: true,
                    resetDay: 'monday',
                    rewards: [
                        { position: 1, reward: 1000 },
                        { position: 2, reward: 750 },
                        { position: 3, reward: 500 }
                    ]
                },
                monthlyCompetition: {
                    enabled: true,
                    specialRewards: true
                }
            }
        },
        customization: {
            levelUpMessage: {
                enabled: true,
                channel: '',
                message: 'Congratulations {user}, you reached level {level}!',
                useEmbed: true
            },
            xpBoosts: {
                enabled: true,
                boostChannels: [],
                boostRoles: []
            },
            blacklistedChannels: [],
            blacklistedRoles: []
        }
    });
    
    const [stats, setStats] = useState<LevelingStats>({
        totalUsers: 150,
        averageLevel: 12.4,
        highestLevel: {
            userId: '123456789',
            username: 'LevelMaster',
            level: 85,
            totalXp: 125000
        },
        dailyXpGained: 15420,
        weeklyLeaderboard: [],
        recentLevelUps: [],
        levelDistribution: []
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [channels, setChannels] = useState<Array<{id: string; name: string; type: number}>>([]);
    const [roles, setRoles] = useState<Array<{id: string; name: string; color: number}>>([]);

    useEffect(() => {
        if (guildId) {
            fetchLevelingSettings();
            fetchLevelingStats();
            fetchChannels();
            fetchRoles();
        }
    }, [guildId]);

    const fetchLevelingSettings = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/leveling/settings`);
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching leveling settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLevelingStats = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/leveling/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching leveling stats:', error);
        }
    };

    const fetchChannels = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/channels`);
            if (response.ok) {
                const data = await response.json();
                setChannels(data.filter((ch: any) => ch.type === 0)); // Text channels only
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch(`/api/bot/${guildId}/roles`);
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/bot/${guildId}/leveling/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                alert('Leveling settings saved successfully!');
                fetchLevelingStats(); // Refresh stats
            } else {
                alert('Failed to save leveling settings');
            }
        } catch (error) {
            console.error('Error saving leveling settings:', error);
            alert('Failed to save leveling settings');
        } finally {
            setSaving(false);
        }
    };

    const resetLevels = async () => {
        if (confirm('This will reset ALL user levels and XP. Are you sure?')) {
            try {
                const response = await fetch(`/api/bot/${guildId}/leveling/reset`, {
                    method: 'POST'
                });
                if (response.ok) {
                    alert('Levels reset successfully!');
                    fetchLevelingStats();
                }
            } catch (error) {
                console.error('Error resetting levels:', error);
            }
        }
    };

    const addRoleReward = () => {
        const newReward = {
            level: 1,
            roleId: '',
            roleName: 'New Role',
            announcement: true,
            removePrevious: false
        };
        const newSettings = { ...settings };
        newSettings.roleRewards.rewards.push(newReward);
        setSettings(newSettings);
    };

    const removeRoleReward = (index: number) => {
        const newSettings = { ...settings };
        newSettings.roleRewards.rewards.splice(index, 1);
        setSettings(newSettings);
    };

    const updateSetting = (path: string[], value: any) => {
        const newSettings = JSON.parse(JSON.stringify(settings));
        let current = newSettings;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        setSettings(newSettings);
    };

    const getGuildIconUrl = () => {
        if (guild.icon) {
            return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
        }
        return '/images/default_server_icon.svg';
    };

    const getUserAvatarUrl = () => {
        if (user.avatar) {
            return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
        }
        return '/images/default_avatar.svg';
    };

    const calculateXpForLevel = (level: number) => {
        const { baseXp, multiplier } = settings.levelCalculation;
        if (settings.levelCalculation.formula === 'linear') {
            return Math.floor(baseXp * level);
        } else if (settings.levelCalculation.formula === 'quadratic') {
            return Math.floor(baseXp * Math.pow(level * multiplier, 2));
        } else {
            return Math.floor(baseXp * Math.pow(multiplier, level));
        }
    };

    return (
        <>
            <Head>
                <title>Leveling System - {guild.name} - Aegis</title>
                <meta name="description" content={`Leveling management for ${guild.name}`} />
            </Head>

            <div className={styles.guildDashboard}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Link href="/" className={styles.brand}>
                            🛡️ <span>Aegis</span>
                        </Link>
                        
                        <div className={styles.guildSelector}>
                            <img 
                                src={getGuildIconUrl()} 
                                alt={guild.name}
                                className={styles.guildIcon}
                            />
                            <span className={styles.guildName}>{guild.name}</span>
                            <Link href="/dashboard" className={styles.changeGuild}>
                                <i className="fas fa-exchange-alt"></i>
                            </Link>
                        </div>
                    </div>

                    <div className={styles.headerRight}>
                        <div className={styles.userInfo}>
                            <img 
                                src={getUserAvatarUrl()} 
                                alt={user.username}
                                className={styles.userAvatar}
                            />
                            <span className={styles.username}>
                                {user.username}
                                {user.discriminator !== '0' && `#${user.discriminator}`}
                            </span>
                            <button 
                                className={styles.userDropdownBtn}
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                            >
                                <i className="fas fa-chevron-down"></i>
                            </button>
                            
                            {showUserDropdown && (
                                <div className={styles.userDropdown}>
                                    <Link href="/dashboard/@me" className={styles.dropdownItem}>
                                        <i className="fas fa-user"></i>
                                        Profile
                                    </Link>
                                    <Link href="/dashboard/billing" className={styles.dropdownItem}>
                                        <i className="fas fa-credit-card"></i>
                                        Billing
                                    </Link>
                                    <Link href="/dashboard" className={styles.dropdownItem}>
                                        <i className="fas fa-server"></i>
                                        Server Selection
                                    </Link>
                                    <hr className={styles.dropdownDivider} />
                                    <a href="/api/auth/logout" className={styles.dropdownItem}>
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Layout */}
                <div className={styles.layout}>
                    {/* Sidebar */}
                    <nav className={styles.sidebar}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.sidebarSection}>
                                <h4>Server Management</h4>
                                <div className={styles.sidebarLinks}>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/home`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-home"></i>
                                        <span>Overview</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/settings`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-cog"></i>
                                        <span>General Settings</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/economy`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-coins"></i>
                                        <span>Economy</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/leveling`}
                                        className={`${styles.sidebarLink} ${styles.active}`}
                                    >
                                        <i className="fas fa-chart-line"></i>
                                        <span>Leveling</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/security`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-shield-alt"></i>
                                        <span>Security</span>
                                    </Link>
                                    <Link 
                                        href={`/dashboard/guilds/${guild.id}/moderation`}
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-gavel"></i>
                                        <span>Moderation</span>
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.sidebarSection}>
                                <h4>Bot Management</h4>
                                <div className={styles.sidebarLinks}>
                                    <a 
                                        href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1398326650558742528'}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`}
                                        className={styles.sidebarLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fas fa-plus"></i>
                                        <span>Invite Bot</span>
                                    </a>
                                    <Link 
                                        href="/support"
                                        className={styles.sidebarLink}
                                    >
                                        <i className="fas fa-life-ring"></i>
                                        <span>Support</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className={styles.main}>
                        <div className={styles.pageHeader}>
                            <h1>
                                <i className="fas fa-chart-line"></i>
                                Leveling System
                            </h1>
                            <p>Manage XP, levels, and role rewards</p>
                            <div className={styles.headerActions}>
                                <button
                                    className={`${styles.button} ${styles.buttonDanger}`}
                                    onClick={resetLevels}
                                >
                                    Reset All Levels
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className={styles.tabNavigation}>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'xp' ? styles.active : ''}`}
                                onClick={() => setActiveTab('xp')}
                            >
                                XP Settings
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'rewards' ? styles.active : ''}`}
                                onClick={() => setActiveTab('rewards')}
                            >
                                Role Rewards
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'leaderboard' ? styles.active : ''}`}
                                onClick={() => setActiveTab('leaderboard')}
                            >
                                Leaderboards
                            </button>
                            <button 
                                className={`${styles.tabButton} ${activeTab === 'customization' ? styles.active : ''}`}
                                onClick={() => setActiveTab('customization')}
                            >
                                Customization
                            </button>
                        </div>

                        {loading ? (
                            <div className={styles.loading}>
                                <i className="fas fa-spinner fa-spin"></i>
                                Loading leveling data...
                            </div>
                        ) : (
                            <div className={styles.tabContent}>
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div className={styles.overviewTab}>
                                        <div className={styles.statsGrid}>
                                            <div className={styles.statCard}>
                                                <h3>Total Users</h3>
                                                <div className={styles.statValue}>
                                                    {stats.totalUsers}
                                                </div>
                                                <div className={styles.statSubtext}>
                                                    Active leveling users
                                                </div>
                                            </div>
                                            
                                            <div className={styles.statCard}>
                                                <h3>Average Level</h3>
                                                <div className={styles.statValue}>
                                                    {stats.averageLevel}
                                                </div>
                                                <div className={styles.statSubtext}>
                                                    Server average
                                                </div>
                                            </div>
                                            
                                            <div className={styles.statCard}>
                                                <h3>Daily XP Gained</h3>
                                                <div className={styles.statValue}>
                                                    {stats.dailyXpGained.toLocaleString()}
                                                </div>
                                                <div className={styles.statSubtext}>
                                                    XP earned today
                                                </div>
                                            </div>
                                            
                                            <div className={styles.statCard}>
                                                <h3>Highest Level</h3>
                                                <div className={styles.statValue}>
                                                    Level {stats.highestLevel.level}
                                                </div>
                                                <div className={styles.statSubtext}>
                                                    {stats.highestLevel.username}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.levelingOverview}>
                                            <div className={styles.topUsers}>
                                                <h3>🏆 Top Users This Week</h3>
                                                <div className={styles.leaderboardPreview}>
                                                    {stats.weeklyLeaderboard.slice(0, 5).map((user, index) => (
                                                        <div key={user.userId} className={styles.leaderboardItem}>
                                                            <span className={styles.rank}>#{index + 1}</span>
                                                            <span className={styles.username}>{user.username}</span>
                                                            <span className={styles.level}>Level {user.level}</span>
                                                            <span className={styles.weeklyXp}>+{user.weeklyXp} XP</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.recentActivity}>
                                                <h3>🎉 Recent Level Ups</h3>
                                                <div className={styles.activityList}>
                                                    {stats.recentLevelUps.slice(0, 5).map((levelUp, index) => (
                                                        <div key={index} className={styles.activityItem}>
                                                            <div className={styles.activityInfo}>
                                                                <strong>{levelUp.username}</strong>
                                                                <span>reached level {levelUp.newLevel}</span>
                                                                <small>{new Date(levelUp.timestamp).toLocaleString()}</small>
                                                            </div>
                                                            {levelUp.rewardsEarned.length > 0 && (
                                                                <div className={styles.rewards}>
                                                                    {levelUp.rewardsEarned.map((reward, i) => (
                                                                        <span key={i} className={styles.reward}>{reward}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.levelCalculator}>
                                            <h3>🧮 Level Calculator Preview</h3>
                                            <div className={styles.calculatorGrid}>
                                                {[1, 5, 10, 15, 20, 25].map(level => (
                                                    <div key={level} className={styles.calculatorItem}>
                                                        <strong>Level {level}</strong>
                                                        <span>{calculateXpForLevel(level).toLocaleString()} XP</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* XP Settings Tab */}
                                {activeTab === 'xp' && (
                                    <div className={styles.settingsForm}>
                                        <div className={styles.settingsSection}>
                                            <h3>⚙️ XP Configuration</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.enabled}
                                                        onChange={(e) => updateSetting(['enabled'], e.target.checked)}
                                                    />
                                                    Enable Leveling System
                                                </label>
                                                <span className={styles.helpText}>
                                                    Enable or disable XP gain and leveling
                                                </span>
                                            </div>

                                            <h4>💬 Message XP</h4>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="minXp">Minimum XP per Message</label>
                                                    <input
                                                        type="number"
                                                        id="minXp"
                                                        value={settings.xpSettings.perMessage.minimum}
                                                        onChange={(e) => updateSetting(['xpSettings', 'perMessage', 'minimum'], parseInt(e.target.value))}
                                                        min="1" max="100"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="maxXp">Maximum XP per Message</label>
                                                    <input
                                                        type="number"
                                                        id="maxXp"
                                                        value={settings.xpSettings.perMessage.maximum}
                                                        onChange={(e) => updateSetting(['xpSettings', 'perMessage', 'maximum'], parseInt(e.target.value))}
                                                        min="1" max="100"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="cooldown">Cooldown (seconds)</label>
                                                    <input
                                                        type="number"
                                                        id="cooldown"
                                                        value={settings.xpSettings.perMessage.cooldownSeconds}
                                                        onChange={(e) => updateSetting(['xpSettings', 'perMessage', 'cooldownSeconds'], parseInt(e.target.value))}
                                                        min="10" max="3600"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>
                                            </div>

                                            <h4>🎤 Voice Chat XP</h4>
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.xpSettings.voiceChat.enabled}
                                                        onChange={(e) => updateSetting(['xpSettings', 'voiceChat', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Voice Chat XP
                                                </label>
                                            </div>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="voiceXp">XP per Minute</label>
                                                    <input
                                                        type="number"
                                                        id="voiceXp"
                                                        value={settings.xpSettings.voiceChat.xpPerMinute}
                                                        onChange={(e) => updateSetting(['xpSettings', 'voiceChat', 'xpPerMinute'], parseInt(e.target.value))}
                                                        min="1" max="50"
                                                        disabled={!settings.xpSettings.voiceChat.enabled}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="minUsers">Minimum Users Required</label>
                                                    <input
                                                        type="number"
                                                        id="minUsers"
                                                        value={settings.xpSettings.voiceChat.minimumUsers}
                                                        onChange={(e) => updateSetting(['xpSettings', 'voiceChat', 'minimumUsers'], parseInt(e.target.value))}
                                                        min="1" max="10"
                                                        disabled={!settings.xpSettings.voiceChat.enabled}
                                                    />
                                                </div>
                                            </div>

                                            <h4>🚀 Bonus Multipliers</h4>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="weekendBonus">Weekend Bonus</label>
                                                    <input
                                                        type="number"
                                                        id="weekendBonus"
                                                        value={settings.xpSettings.bonusMultipliers.weekendBonus}
                                                        onChange={(e) => updateSetting(['xpSettings', 'bonusMultipliers', 'weekendBonus'], parseFloat(e.target.value))}
                                                        min="1.0" max="5.0" step="0.1"
                                                        disabled={!settings.enabled}
                                                    />
                                                    <span className={styles.helpText}>Saturday & Sunday</span>
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="eventBonus">Event Bonus</label>
                                                    <input
                                                        type="number"
                                                        id="eventBonus"
                                                        value={settings.xpSettings.bonusMultipliers.eventBonus}
                                                        onChange={(e) => updateSetting(['xpSettings', 'bonusMultipliers', 'eventBonus'], parseFloat(e.target.value))}
                                                        min="1.0" max="10.0" step="0.1"
                                                        disabled={!settings.enabled}
                                                    />
                                                    <span className={styles.helpText}>Special events</span>
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="nitroBonus">Nitro Boost Bonus</label>
                                                    <input
                                                        type="number"
                                                        id="nitroBonus"
                                                        value={settings.xpSettings.bonusMultipliers.nitroBoostBonus}
                                                        onChange={(e) => updateSetting(['xpSettings', 'bonusMultipliers', 'nitroBoostBonus'], parseFloat(e.target.value))}
                                                        min="1.0" max="3.0" step="0.1"
                                                        disabled={!settings.enabled}
                                                    />
                                                    <span className={styles.helpText}>Server boosters</span>
                                                </div>
                                            </div>

                                            <h4>📊 Level Calculation</h4>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="formula">Formula</label>
                                                    <select
                                                        id="formula"
                                                        value={settings.levelCalculation.formula}
                                                        onChange={(e) => updateSetting(['levelCalculation', 'formula'], e.target.value)}
                                                        disabled={!settings.enabled}
                                                    >
                                                        <option value="linear">Linear</option>
                                                        <option value="quadratic">Quadratic</option>
                                                        <option value="exponential">Exponential</option>
                                                    </select>
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="baseXp">Base XP</label>
                                                    <input
                                                        type="number"
                                                        id="baseXp"
                                                        value={settings.levelCalculation.baseXp}
                                                        onChange={(e) => updateSetting(['levelCalculation', 'baseXp'], parseInt(e.target.value))}
                                                        min="50" max="1000"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="multiplier">Multiplier</label>
                                                    <input
                                                        type="number"
                                                        id="multiplier"
                                                        value={settings.levelCalculation.multiplier}
                                                        onChange={(e) => updateSetting(['levelCalculation', 'multiplier'], parseFloat(e.target.value))}
                                                        min="1.0" max="5.0" step="0.1"
                                                        disabled={!settings.enabled}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Role Rewards Tab */}
                                {activeTab === 'rewards' && (
                                    <div className={styles.settingsForm}>
                                        <div className={styles.settingsSection}>
                                            <h3>🎭 Role Rewards</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.roleRewards.enabled}
                                                        onChange={(e) => updateSetting(['roleRewards', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Role Rewards
                                                </label>
                                                <span className={styles.helpText}>
                                                    Automatically give roles when users reach certain levels
                                                </span>
                                            </div>

                                            <div className={styles.roleRewardsList}>
                                                <div className={styles.rewardsHeader}>
                                                    <h4>Role Rewards</h4>
                                                    <button 
                                                        className={styles.addButton}
                                                        onClick={addRoleReward}
                                                        disabled={!settings.roleRewards.enabled}
                                                    >
                                                        Add Reward
                                                    </button>
                                                </div>
                                                
                                                {settings.roleRewards.rewards.map((reward, index) => (
                                                    <div key={index} className={styles.roleRewardItem}>
                                                        <div className={styles.rewardControls}>
                                                            <div className={styles.formGroup}>
                                                                <label>Level</label>
                                                                <input
                                                                    type="number"
                                                                    value={reward.level}
                                                                    onChange={(e) => {
                                                                        const newRewards = [...settings.roleRewards.rewards];
                                                                        newRewards[index].level = parseInt(e.target.value);
                                                                        updateSetting(['roleRewards', 'rewards'], newRewards);
                                                                    }}
                                                                    min="1" max="100"
                                                                />
                                                            </div>
                                                            <div className={styles.formGroup}>
                                                                <label>Role</label>
                                                                <select
                                                                    value={reward.roleId}
                                                                    onChange={(e) => {
                                                                        const newRewards = [...settings.roleRewards.rewards];
                                                                        newRewards[index].roleId = e.target.value;
                                                                        const selectedRole = roles.find(r => r.id === e.target.value);
                                                                        if (selectedRole) {
                                                                            newRewards[index].roleName = selectedRole.name;
                                                                        }
                                                                        updateSetting(['roleRewards', 'rewards'], newRewards);
                                                                    }}
                                                                >
                                                                    <option value="">Select a role</option>
                                                                    {roles.map(role => (
                                                                        <option key={role.id} value={role.id}>
                                                                            {role.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className={styles.formGroup}>
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={reward.announcement}
                                                                        onChange={(e) => {
                                                                            const newRewards = [...settings.roleRewards.rewards];
                                                                            newRewards[index].announcement = e.target.checked;
                                                                            updateSetting(['roleRewards', 'rewards'], newRewards);
                                                                        }}
                                                                    />
                                                                    Announce
                                                                </label>
                                                            </div>
                                                            <button 
                                                                className={styles.removeButton}
                                                                onClick={() => removeRoleReward(index)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Leaderboard Tab */}
                                {activeTab === 'leaderboard' && (
                                    <div className={styles.settingsForm}>
                                        <div className={styles.settingsSection}>
                                            <h3>🏆 Leaderboards</h3>
                                            
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.leaderboards.enabled}
                                                        onChange={(e) => updateSetting(['leaderboards', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Leaderboards
                                                </label>
                                                <span className={styles.helpText}>
                                                    Show ranking of top users by level and XP
                                                </span>
                                            </div>

                                            <h4>📊 Level Leaderboard</h4>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="displayCount">Display Count</label>
                                                    <input
                                                        type="number"
                                                        id="displayCount"
                                                        value={settings.leaderboards.types.levelLeaderboard.displayCount}
                                                        onChange={(e) => updateSetting(['leaderboards', 'types', 'levelLeaderboard', 'displayCount'], parseInt(e.target.value))}
                                                        min="5" max="50"
                                                        disabled={!settings.leaderboards.enabled}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.leaderboards.types.levelLeaderboard.showAvatars}
                                                            onChange={(e) => updateSetting(['leaderboards', 'types', 'levelLeaderboard', 'showAvatars'], e.target.checked)}
                                                            disabled={!settings.leaderboards.enabled}
                                                        />
                                                        Show Avatars
                                                    </label>
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.leaderboards.types.levelLeaderboard.excludeBots}
                                                            onChange={(e) => updateSetting(['leaderboards', 'types', 'levelLeaderboard', 'excludeBots'], e.target.checked)}
                                                            disabled={!settings.leaderboards.enabled}
                                                        />
                                                        Exclude Bots
                                                    </label>
                                                </div>
                                            </div>

                                            <h4>📅 Weekly Competition</h4>
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.leaderboards.types.weeklyXp.enabled}
                                                        onChange={(e) => updateSetting(['leaderboards', 'types', 'weeklyXp', 'enabled'], e.target.checked)}
                                                        disabled={!settings.leaderboards.enabled}
                                                    />
                                                    Enable Weekly XP Competition
                                                </label>
                                                <span className={styles.helpText}>
                                                    Reset weekly and give rewards to top performers
                                                </span>
                                            </div>
                                            
                                            <div className={styles.weeklyRewards}>
                                                <h5>Weekly Rewards</h5>
                                                {settings.leaderboards.types.weeklyXp.rewards.map((reward, index) => (
                                                    <div key={index} className={styles.rewardRow}>
                                                        <span>Position #{reward.position}:</span>
                                                        <input
                                                            type="number"
                                                            value={reward.reward}
                                                            onChange={(e) => {
                                                                const newRewards = [...settings.leaderboards.types.weeklyXp.rewards];
                                                                newRewards[index].reward = parseInt(e.target.value);
                                                                updateSetting(['leaderboards', 'types', 'weeklyXp', 'rewards'], newRewards);
                                                            }}
                                                            min="0"
                                                            disabled={!settings.leaderboards.types.weeklyXp.enabled}
                                                        />
                                                        <span>currency</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Customization Tab */}
                                {activeTab === 'customization' && (
                                    <div className={styles.settingsForm}>
                                        <div className={styles.settingsSection}>
                                            <h3>🎨 Customization</h3>
                                            
                                            <h4>🎉 Level Up Messages</h4>
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.customization.levelUpMessage.enabled}
                                                        onChange={(e) => updateSetting(['customization', 'levelUpMessage', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable Level Up Messages
                                                </label>
                                            </div>
                                            
                                            <div className={styles.formGroup}>
                                                <label htmlFor="levelUpChannel">Announcement Channel</label>
                                                <select
                                                    id="levelUpChannel"
                                                    value={settings.customization.levelUpMessage.channel}
                                                    onChange={(e) => updateSetting(['customization', 'levelUpMessage', 'channel'], e.target.value)}
                                                    disabled={!settings.customization.levelUpMessage.enabled}
                                                >
                                                    <option value="">Same channel as message</option>
                                                    {channels.map(channel => (
                                                        <option key={channel.id} value={channel.id}>
                                                            #{channel.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="levelUpMessage">Level Up Message</label>
                                                <textarea
                                                    id="levelUpMessage"
                                                    value={settings.customization.levelUpMessage.message}
                                                    onChange={(e) => updateSetting(['customization', 'levelUpMessage', 'message'], e.target.value)}
                                                    placeholder="Congratulations {user}, you reached level {level}!"
                                                    disabled={!settings.customization.levelUpMessage.enabled}
                                                    rows={3}
                                                />
                                                <span className={styles.helpText}>
                                                    Use {`{user}`} for user mention and {`{level}`} for the new level
                                                </span>
                                            </div>

                                            <h4>⚡ XP Boosts</h4>
                                            <div className={styles.formGroup}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.customization.xpBoosts.enabled}
                                                        onChange={(e) => updateSetting(['customization', 'xpBoosts', 'enabled'], e.target.checked)}
                                                        disabled={!settings.enabled}
                                                    />
                                                    Enable XP Boosts
                                                </label>
                                                <span className={styles.helpText}>
                                                    Give certain channels and roles XP multipliers
                                                </span>
                                            </div>

                                            <div className={styles.boostManagement}>
                                                <div className={styles.boostSection}>
                                                    <h5>Channel Boosts</h5>
                                                    <button className={styles.addBoostButton}>Add Channel Boost</button>
                                                </div>
                                                <div className={styles.boostSection}>
                                                    <h5>Role Boosts</h5>
                                                    <button className={styles.addBoostButton}>Add Role Boost</button>
                                                </div>
                                            </div>

                                            <h4>🚫 Blacklists</h4>
                                            <div className={styles.blacklistSection}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="blacklistedChannels">Blacklisted Channels</label>
                                                    <span className={styles.helpText}>
                                                        Channels where users won't gain XP
                                                    </span>
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="blacklistedRoles">Blacklisted Roles</label>
                                                    <span className={styles.helpText}>
                                                        Roles that won't gain XP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = parseCookies(context);
    
    if (!cookies.token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        // Fetch user data
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user');
        }
        
        const user = await userResponse.json();
        
        // Get guild data from query
        const guildId = context.query.guild as string;
        
        // Mock guild data for now - in real implementation, fetch from Discord API
        const guild = {
            id: guildId,
            name: 'Sample Server',
            icon: null,
            owner: true,
            permissions: '8',
            memberCount: 150,
            botPresent: true
        };

        return {
            props: {
                user,
                guild,
            },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
};
