import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IProps {
    user: IUser;
}

export default function SecurityDashboard({ user }: IProps) {
    const [loading, setLoading] = useState(false);
    const [userGuilds, setUserGuilds] = useState<any[]>([]);

    useEffect(() => {
        // Fetch user's guilds for server selection
        const fetchGuilds = async () => {
            try {
                const response = await fetch('/api/discord/guilds');
                if (response.ok) {
                    const guilds = await response.json();
                    setUserGuilds(guilds.filter((g: any) => g.permissions_new & 0x20)); // MANAGE_GUILD permission
                }
            } catch (error) {
                console.error('Failed to fetch guilds:', error);
            }
        };
        fetchGuilds();
    }, []);

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - Security Overview</title>
                <meta name="description" content="Security management overview" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🛡️ Security Management</h1>
                    <p>Select a server to manage its security settings</p>
                </div>

                {/* Security Overview */}
                <div className={dashStyles.compactOverview}>
                    <div className={dashStyles.overviewCard}>
                        <h4>🔒 Security Features Overview</h4>
                        <div className={dashStyles.overviewGrid}>
                            <div><strong>Anti-Nuke:</strong> Protection against malicious activities</div>
                            <div><strong>Heat System:</strong> Advanced spam detection and prevention</div>
                            <div><strong>Verification:</strong> User verification and account age checks</div>
                            <div><strong>Whitelisting:</strong> Trusted user management</div>
                        </div>
                    </div>
                </div>

                {/* Server Selection */}
                <div className={dashStyles.compactOverview}>
                    <div className={dashStyles.overviewCard}>
                        <h4>⚙️ Select Server to Manage</h4>
                        <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                            Security settings are configured per server. Choose a server below to manage its specific security configuration.
                        </p>
                        
                        {userGuilds.length > 0 ? (
                            <div className={dashStyles.compactFeatureGrid}>
                                {userGuilds.map((guild) => (
                                    <Link key={guild.id} href={`/dashboard/guilds/${guild.id}`}>
                                        <div className={dashStyles.compactFeatureCard} style={{ height: '130px' }}>
                                            {guild.icon ? (
                                                <Image 
                                                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                                    alt={guild.name}
                                                    width={40}
                                                    height={40}
                                                    style={{ borderRadius: '8px', marginBottom: '0.5rem' }}
                                                />
                                            ) : (
                                                <div className={dashStyles.compactFeatureIcon}>🏠</div>
                                            )}
                                            <h4>{guild.name}</h4>
                                            <p>Configure Security</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                <p>No servers found. Make sure you have the &quot;Manage Server&quot; permission.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Information */}
                <div className={dashStyles.compactStatus}>
                    <h4>📋 Security Management Guidelines</h4>
                    <div style={{ 
                        background: 'white', 
                        padding: '1.5rem', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#4b5563', lineHeight: '1.6' }}>
                            <li><strong>Server-Specific Settings:</strong> Each server has its own security configuration</li>
                            <li><strong>Permission Required:</strong> You need &quot;Manage Server&quot; permission to configure security</li>
                            <li><strong>Real-Time Protection:</strong> Settings take effect immediately after saving</li>
                            <li><strong>Multiple Servers:</strong> Configure different settings for each of your servers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        const redirectUrl = ctx.resolvedUrl || '/dashboard/security';
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
                user
            }
        };

    } catch (error) {
        console.error('Error fetching user data:', error);
        
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            }
        };
    }
};
