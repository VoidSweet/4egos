import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../../../styles/GuildDashboard.module.css';
import ActivityConsole from '../../../../components/ActivityConsole';
import NotificationBadge from '../../../../components/NotificationBadge';
import { IUser } from '../../../../types';

interface IGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    memberCount?: number;
    botPresent?: boolean;
    features?: string[];
}

interface BotStats {
    commands: {
        total: number;
        daily: number;
        weekly: number;
    };
    moderation: {
        totalActions: number;
        bans: number;
        kicks: number;
        warnings: number;
        autoModActions: number;
    };
    activity: {
        messagesProcessed: number;
        activeUsers: number;
        newMembers: number;
        leftMembers: number;
    };
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

interface IProps {
    user: IUser;
    guild: IGuild;
}

export default function GuildDashboard({ user, guild }: IProps) {
    const router = useRouter();
    const { guild: guildId } = router.query;
    
    const [activeModule, setActiveModule] = useState('home');
    const [botStats, setBotStats] = useState<BotStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [notificationCounts, setNotificationCounts] = useState<NotificationCounts | null>(null);

    useEffect(() => {
        if (guildId && typeof guildId === 'string') {
            fetchBotStats(guildId);
            fetchNotifications(guildId);
        }
    }, [guildId]);

    const fetchBotStats = async (guildId: string) => {
        try {
            const response = await fetch(`/api/bot/${guildId}/stats`);
            if (response.ok) {
                const stats = await response.json();
                setBotStats(stats);
            }
        } catch (error) {
            console.error('Error fetching bot stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchNotifications = async (guildId: string) => {
        try {
            const response = await fetch(`/api/bot/${guildId}/notifications`);
            if (response.ok) {
                const data = await response.json();
                setNotificationCounts(data.counts);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
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
        return '/images/default_avatar.png';
    };

    const dashboardModules: Array<{
        id: string;
        name: string;
        icon: string;
        badge: number;
        severity: 'low' | 'medium' | 'high' | 'critical';
        items: Array<{ name: string; href: string; icon: string; }>;
    }> = [
        {
            id: 'general',
            name: 'General Settings',
            icon: 'fas fa-cog',
            badge: notificationCounts?.byType.system || 0,
            severity: 'low',
            items: [
                { name: 'Overview', href: `/dashboard/guilds/${guildId}`, icon: 'fas fa-home' },
                { name: 'General Settings', href: `/dashboard/guilds/${guildId}/settings`, icon: 'fas fa-cog' },
                { name: 'Custom Branding', href: `/dashboard/guilds/${guildId}/branding`, icon: 'fas fa-palette' },
                { name: 'Commands', href: `/dashboard/guilds/${guildId}/commands`, icon: 'fas fa-terminal' },
            ]
        },
        {
            id: 'moderation',
            name: 'Auto Moderation',
            icon: 'fas fa-shield-alt',
            badge: notificationCounts?.byType.moderation || 0,
            severity: 'medium',
            items: [
                { name: 'Moderation', href: `/dashboard/guilds/${guildId}/moderation`, icon: 'fas fa-gavel' },
                { name: 'Mod Logs', href: `/dashboard/guilds/${guildId}/modlogs`, icon: 'fas fa-clipboard-list' },
                { name: 'Permissions', href: `/dashboard/guilds/${guildId}/permissions`, icon: 'fas fa-key' },
                { name: 'Join Roles', href: `/dashboard/guilds/${guildId}/join-roles`, icon: 'fas fa-user-plus' },
                { name: 'Reaction Roles', href: `/dashboard/guilds/${guildId}/reaction-roles`, icon: 'fas fa-smile' },
                { name: 'Welcome Messages', href: `/dashboard/guilds/${guildId}/welcome`, icon: 'fas fa-hand-wave' },
            ]
        },
        {
            id: 'security',
            name: 'Security & Safety',
            icon: 'fas fa-lock',
            badge: notificationCounts?.byType.security || 0,
            severity: notificationCounts?.bySeverity.critical ? 'critical' : notificationCounts?.bySeverity.high ? 'high' : 'medium',
            items: [
                { name: 'Security', href: `/dashboard/guilds/${guildId}/security`, icon: 'fas fa-shield-alt' },
                { name: 'Anti-Raid', href: `/dashboard/guilds/${guildId}/anti-raid`, icon: 'fas fa-users-slash' },
                { name: 'Auto-Moderation', href: `/dashboard/guilds/${guildId}/automod`, icon: 'fas fa-robot' },
                { name: 'Backup & Recovery', href: `/dashboard/guilds/${guildId}/backup`, icon: 'fas fa-download' },
            ]
        }
    ];

    return (
        <>
            <Head>
                <title>Welcome {user.username}, find commonly used dashboard pages below. - Aegis</title>
                <meta name="description" content={`Manage ${guild.name} with Aegis dashboard`} />
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

                <div className={styles.layout}>
                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        <nav className={styles.navigation}>
                            <Link href={`/dashboard/guilds/${guildId}`} className={styles.homeLink}>
                                <i className="fas fa-home"></i>
                                <span>Home</span>
                            </Link>

                            <button className={styles.refreshBtn}>
                                <i className="fas fa-sync-alt"></i>
                            </button>

                            <div className={styles.modulesList}>
                                <div className={styles.moduleLabel}>MODULES</div>
                                
                                {dashboardModules.map(module => (
                                    <div key={module.id} className={styles.module}>
                                        <div className={styles.moduleHeader}>
                                            <div className={styles.moduleIconWrapper}>
                                                <i className={module.icon}></i>
                                                {module.badge > 0 && (
                                                    <NotificationBadge 
                                                        count={module.badge} 
                                                        severity={module.severity}
                                                        size="small"
                                                    />
                                                )}
                                            </div>
                                            <span>{module.name}</span>
                                        </div>
                                        
                                        <div className={styles.moduleItems}>
                                            {module.items.map(item => (
                                                <Link 
                                                    key={item.name}
                                                    href={item.href}
                                                    className={styles.moduleItem}
                                                >
                                                    <i className={item.icon}></i>
                                                    <span>{item.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className={styles.main}>
                        <div className={styles.welcome}>
                            <div className={styles.welcomeContent}>
                                <h1>Welcome <span className={styles.highlight}>{user.username}</span>,</h1>
                                <p>manage your server with Aegis dashboard.</p>
                            </div>
                            
                            {/* Server Stats */}
                            {botStats && (
                                <div className={styles.serverStats}>
                                    <div className={styles.stat}>
                                        <div className={styles.statValue}>{guild.memberCount?.toLocaleString() || '0'}</div>
                                        <div className={styles.statLabel}>Members</div>
                                    </div>
                                    <div className={styles.stat}>
                                        <div className={styles.statValue}>{botStats.commands.total.toLocaleString()}</div>
                                        <div className={styles.statLabel}>Commands</div>
                                    </div>
                                    <div className={styles.stat}>
                                        <div className={styles.statValue}>{botStats.moderation.totalActions}</div>
                                        <div className={styles.statLabel}>Mod Actions</div>
                                    </div>
                                    <div className={styles.stat}>
                                        <div className={styles.statValue}>{botStats.activity.activeUsers}</div>
                                        <div className={styles.statLabel}>Active Users</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Activity Console */}
                        {typeof guildId === 'string' && (
                            <ActivityConsole guildId={guildId} />
                        )}

                        {/* Dashboard Cards */}
                        <div className={styles.dashboardGrid}>
                            <div className={styles.dashboardCard}>
                                <div className={styles.cardIcon}>
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Custom messages</h3>
                                    <p>Create fully customized messages called templates and pack them with your very own embeds, buttons and select menus.</p>
                                    <Link href={`/dashboard/guilds/${guildId}/messages`} className={styles.cardButton}>
                                        Create template
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.dashboardCard}>
                                <div className={styles.cardIcon}>
                                    <i className="fas fa-clipboard-list"></i>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Moderation cases</h3>
                                    <p>View and edit all moderation cases using the dashboard.</p>
                                    <Link href={`/dashboard/guilds/${guildId}/moderation`} className={styles.cardButton}>
                                        View cases
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.dashboardCard}>
                                <div className={styles.cardIcon}>
                                    <i className="fas fa-hand-wave"></i>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Role greetings</h3>
                                    <p>Welcome users to their new role by using Aegis's role assignment messages</p>
                                    <Link href={`/dashboard/guilds/${guildId}/welcome`} className={styles.cardButton}>
                                        Show role messages
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.dashboardCard}>
                                <div className={styles.cardIcon}>
                                    <i className="fas fa-robot"></i>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>AI Moderation</h3>
                                    <p>Use artificial intelligence to assist you in moderating your server.</p>
                                    <Link href={`/dashboard/guilds/${guildId}/ai-moderation`} className={styles.cardButton}>
                                        Configure AI
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.dashboardCard}>
                                <div className={styles.cardIcon}>
                                    <i className="fas fa-terminal"></i>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>Prefixes</h3>
                                    <p>Update how you execute Aegis's commands.</p>
                                    <Link href={`/dashboard/guilds/${guildId}/prefixes`} className={styles.cardButton}>
                                        Add prefix
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.dashboardCard}>
                                <div className={styles.cardIcon}>
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3>User reports</h3>
                                    <p>Allow users to report others and fully customize how to handle them.</p>
                                    <Link href={`/dashboard/guilds/${guildId}/reports`} className={styles.cardButton}>
                                        Configure reports
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div className={styles.warningMessage}>
                            <p>You are not in Aegis's server.</p>
                            <p>It is highly recommended to <strong>join Aegis's Support Server</strong> for <strong>major updates</strong>, <strong>status information</strong> and more.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['__SessionLuny']: token } = parseCookies(ctx);
    const { guild: guildId } = ctx.query;

    if (!token) {
        return {
            redirect: {
                destination: '/api/auth/login?state=' + encodeURIComponent(`/dashboard/guilds/${guildId}`),
                permanent: false,
            }
        };
    }

    try {
        // Fetch user data
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch user guilds to find the specific guild
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!guildsResponse.ok) {
            throw new Error('Failed to fetch guilds data');
        }

        const guildsData = await guildsResponse.json();
        const guild = guildsData.find((g: any) => g.id === guildId);

        if (!guild) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            };
        }

        // Check if user has admin permissions
        const hasAdminPermissions = guild.owner || 
            (parseInt(guild.permissions) & 0x8) === 0x8 || // ADMINISTRATOR
            (parseInt(guild.permissions) & 0x20) === 0x20;   // MANAGE_SERVER

        if (!hasAdminPermissions) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            };
        }

        const user: IUser = {
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            verified: userData.verified,
            mfa_enabled: userData.mfa_enabled,
            locale: userData.locale,
            flags: userData.flags,
            public_flags: userData.public_flags
        };

        // Enhance guild with bot data
        let enhancedGuild = {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            owner: guild.owner,
            permissions: guild.permissions,
            memberCount: 0,
            botPresent: false,
            features: []
        };

        try {
            // Check if bot is in this guild and get data
            const botApiUrl = process.env.DASHBOARD_API_URL;
            const botApiKey = process.env.DASHBOARD_API_KEY;
            
            const botDataResponse = await fetch(`${botApiUrl}/guilds/${guild.id}`, {
                headers: {
                    'Authorization': `Bearer ${botApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (botDataResponse.ok) {
                const botData = await botDataResponse.json();
                enhancedGuild = {
                    ...enhancedGuild,
                    memberCount: botData.memberCount || 0,
                    botPresent: true,
                    features: botData.features || []
                };
            }
        } catch (error) {
            console.error('Error fetching bot data:', error);
        }

        return {
            props: {
                user,
                guild: enhancedGuild
            }
        };

    } catch (error) {
        console.error('Error fetching data:', error);
        
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            }
        };
    }
};
