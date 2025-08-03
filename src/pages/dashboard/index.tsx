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
                            <h3>{stats.totalServers.toLocaleString()}</h3>
                            <p>Protected Servers</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>👥</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.totalUsers.toLocaleString()}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>🚨</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.securityAlerts}</h3>
                            <p>Security Alerts</p>
                        </div>
                    </div>

                    <div className={dashStyles.statCard}>
                        <div className={dashStyles.statIcon}>💰</div>
                        <div className={dashStyles.statContent}>
                            <h3>{stats.economyTransactions.toLocaleString()}</h3>
                            <p>Economy Transactions</p>
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

                {/* Recent Activity */}
                <div className={dashStyles.activitySection}>
                    <h2>📊 Recent Activity</h2>
                    <div className={dashStyles.activityGrid}>
                        <div className={dashStyles.activityCard}>
                            <h4>🔐 Security Events</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>2 min ago</span>
                                <span>Spam attempt blocked in #general</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>15 min ago</span>
                                <span>User added to whitelist</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>1 hour ago</span>
                                <span>Anti-nuke protection triggered</span>
                            </div>
                        </div>

                        <div className={dashStyles.activityCard}>
                            <h4>💎 Economy Activity</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>5 min ago</span>
                                <span>User completed daily bonus</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>30 min ago</span>
                                <span>Shop item purchased</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>2 hours ago</span>
                                <span>Bank deposit made</span>
                            </div>
                        </div>

                        <div className={dashStyles.activityCard}>
                            <h4>🎯 Moderation Log</h4>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>10 min ago</span>
                                <span>Warning issued for spam</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>45 min ago</span>
                                <span>User timeout expired</span>
                            </div>
                            <div className={dashStyles.activityItem}>
                                <span className={dashStyles.activityTime}>3 hours ago</span>
                                <span>Message deleted by automod</span>
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

    // Mock data - in production, this would come from your API
    const mockStats: IDashboardStats = {
        totalServers: 15420,
        totalUsers: 2847391,
        securityAlerts: 3,
        economyTransactions: 156789,
        uptime: "99.9%"
    };

    const mockUser: IUser = {
        id: "123456789",
        username: "AegisAdmin",
        discriminator: "0001",
        avatar: null,
        verified: true,
        mfa_enabled: true,
        locale: "en-US",
        flags: 0,
        public_flags: 0
    };

    return {
        props: {
            user: mockUser,
            stats: mockStats
        }
    };
};
