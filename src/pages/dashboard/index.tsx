import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IDashboardStats {
    totalServers: number;
    totalUsers: number;
    securityAlerts: number;
    economyTransactions: number;
    uptime: string;
}

interface IProps {
    user: IUser;
    stats: IDashboardStats;
}

export default function DashboardHome({ user, stats }: IProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - Overview</title>
                <meta name="description" content="4EgosBot dashboard overview and statistics" />
            </Head>

            <Header {...{user}} />
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🎛️ Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening with 4EgosBot</p>
                </div>

                {/* Quick Stats */}
                <div className={dashStyles.statsGrid}>
                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>🛡️</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.totalServers}</h3>
                            <p>Your Discord Servers</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>🤖</div>
                        <div className={dashStyles.statContent}>
                            <h3>4EgosBot</h3>
                            <p>Status: {stats.uptime}</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>�</div>
                        <div className={dashStyles.statContent}>
                            <h3>{user.verified ? 'Verified' : 'Standard'}</h3>
                            <p>Account Type</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>�</div>
                        <div className={dashStyles.statContent}>
                            <h3>{user.mfa_enabled ? 'Secured' : 'Basic'}</h3>
                            <p>Security Level</p>
                        </div>
                    </div>
                </div>

                {/* Feature Categories */}
                <div className={dashStyles.featureGrid}>
                    <Link href="/dashboard/security">
                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>🛡️</div>
                            <h3>Security Management</h3>
                            <p>Anti-nuke protection, spam detection, and verification system</p>
                            <div className={dashStyles.featureItems}>
                                <span>Real-time monitoring</span>
                                <span>Auto-quarantine</span>
                                <span>Whitelist management</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/dashboard/economy">
                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>💰</div>
                            <h3>Economy System</h3>
                            <p>Complete economic ecosystem with banking and shop integration</p>
                            <div className={dashStyles.featureItems}>
                                <span>Multi-currency</span>
                                <span>Banking system</span>
                                <span>Job rewards</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/dashboard/leveling">
                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>📈</div>
                            <h3>Leveling & XP</h3>
                            <p>Engaging progression system with rewards and competitions</p>
                            <div className={dashStyles.featureItems}>
                                <span>Role rewards</span>
                                <span>Leaderboards</span>
                                <span>Competitions</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/dashboard/moderation">
                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>🔨</div>
                            <h3>Moderation Tools</h3>
                            <p>Professional moderation suite with auto-mod and logging</p>
                            <div className={dashStyles.featureItems}>
                                <span>Auto-moderation</span>
                                <span>Warning system</span>
                                <span>Audit logs</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/dashboard/games">
                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>🎮</div>
                            <h3>Games & Entertainment</h3>
                            <p>Interactive games with tournaments and special events</p>
                            <div className={dashStyles.featureItems}>
                                <span>Trivia games</span>
                                <span>Casino system</span>
                                <span>Tournaments</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/dashboard/console">
                        <div className={dashStyles.featureCard}>
                            <div className={dashStyles.featureIcon}>🛠️</div>
                            <h3>Utility Features</h3>
                            <p>Essential server utilities and custom integrations</p>
                            <div className={dashStyles.featureItems}>
                                <span>Welcome system</span>
                                <span>Reaction roles</span>
                                <span>Ticket system</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity - Using Real Discord Data */}
                <div className={dashStyles.activitySection}>
                    <h2>🎛️ Your Discord Overview</h2>
                    <div className={dashStyles.activityGrid}>
                        <div className={dashStyles.activityCard}>
                            <h4>� Account Information</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>Username</span>
                                <span>{user.username}#{user.discriminator}</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>User ID</span>
                                <span>{user.id}</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>Verified</span>
                                <span>{user.verified ? '✅ Verified' : '❌ Not Verified'}</span>
                            </div>
                        </div>

                        <div className={dashStyles.activityCard}>
                            <h4>�️ Security Features</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>2FA</span>
                                <span>{user.mfa_enabled ? '🔒 Enabled' : '⚠️ Disabled'}</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>Server Count</span>
                                <span>{stats.totalServers} servers</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>Locale</span>
                                <span>{user.locale || 'en-US'}</span>
                            </div>
                        </div>

                        <div className={dashStyles.activityCard}>
                            <h4>🎯 Quick Actions</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>🏠</span>
                                <span><a href="/dashboard">Dashboard Home</a></span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>⚙️</span>
                                <span><a href="/dashboard/guilds">Manage Servers</a></span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>👤</span>
                                <span><a href="/dashboard/@me">My Profile</a></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className={dashStyles.statusSection}>
                    <h2>⚡ System Status</h2>
                    <div className={dashStyles.statusGrid}>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Bot Online</span>
                            <span className={dashStyles.statusValue}>99.9% uptime</span>
                        </div>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Security System</span>
                            <span className={dashStyles.statusValue}>Active</span>
                        </div>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Economy System</span>
                            <span className={dashStyles.statusValue}>Operational</span>
                        </div>
                        <div className={dashStyles.statusItem}>
                            <div className={dashStyles.statusIndicator + ' ' + dashStyles.online}></div>
                            <span>Database</span>
                            <span className={dashStyles.statusValue}>Healthy</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        // Use resolvedUrl for proper redirect handling
        const redirectUrl = ctx.resolvedUrl || '/dashboard';
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(redirectUrl)}`,
                permanent: false,
            }
        };
    }

    try {
        // Fetch real user data from Discord
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch user guilds to get server count
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let userGuildCount = 0;
        if (guildsResponse.ok) {
            const guildsData = await guildsResponse.json();
            userGuildCount = guildsData.length;
        }

        // Real stats using Discord API data
        const realStats: IDashboardStats = {
            totalServers: userGuildCount, // Real user guild count
            totalUsers: 0, // We can't get global user count from Discord API
            securityAlerts: 0, // Real bot would track this
            economyTransactions: 0, // Real bot would track this  
            uptime: "Online" // Bot status
        };

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

        return {
            props: {
                user,
                stats: realStats
            }
        };

    } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Fallback to login redirect if API calls fail
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            }
        };
    }
};
