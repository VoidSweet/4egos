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

export default function ServersDashboard({ user }: IProps) {
    const [loading, setLoading] = useState(true);
    const [userGuilds, setUserGuilds] = useState<any[]>([]);

    useEffect(() => {
        // Fetch user's guilds
        const fetchGuilds = async () => {
            try {
                const response = await fetch('/api/discord/guilds');
                if (response.ok) {
                    const guilds = await response.json();
                    setUserGuilds(guilds);
                }
            } catch (error) {
                console.error('Failed to fetch guilds:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuilds();
    }, []);

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    const manageableGuilds = userGuilds.filter((g: any) => g.permissions_new & 0x20);
    const botGuilds = userGuilds.filter((g: any) => g.bot_joined);
    const invitableGuilds = userGuilds.filter((g: any) => !g.bot_joined && g.permissions_new & 0x20);

    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - Server Management</title>
                <meta name="description" content="Manage all your Discord servers with 4EgosBot" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🗄️ Server Management</h1>
                    <p>Overview and management of all your Discord servers.</p>
                </div>

                {/* Statistics */}
                <div className={dashStyles.statsGrid}>
                    <div className={dashStyles.statCard}>
                        <h4>Total Servers</h4>
                        <span className={dashStyles.statNumber}>{userGuilds.length}</span>
                    </div>
                    <div className={dashStyles.statCard}>
                        <h4>With 4EgosBot</h4>
                        <span className={dashStyles.statNumber}>{botGuilds.length}</span>
                    </div>
                    <div className={dashStyles.statCard}>
                        <h4>Manageable</h4>
                        <span className={dashStyles.statNumber}>{manageableGuilds.length}</span>
                    </div>
                    <div className={dashStyles.statCard}>
                        <h4>Available to Join</h4>
                        <span className={dashStyles.statNumber}>{invitableGuilds.length}</span>
                    </div>
                </div>

                {/* Bot Active Servers */}
                {botGuilds.length > 0 && (
                    <div className={dashStyles.serverCategory}>
                        <h3>🤖 Servers with 4EgosBot</h3>
                        <div className={dashStyles.serverGrid}>
                            {botGuilds.map((guild) => (
                                <Link 
                                    key={guild.id}
                                    href={`/dashboard/guilds/${guild.id}`}
                                    className={dashStyles.serverCard}
                                >
                                    <div className={dashStyles.serverIcon}>
                                        {guild.icon ? (
                                            <Image 
                                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
                                                alt={guild.name}
                                                width={48}
                                                height={48}
                                            />
                                        ) : (
                                            <div className={dashStyles.defaultIcon}>
                                                {guild.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className={dashStyles.serverInfo}>
                                        <h4>{guild.name}</h4>
                                        <p>Click to manage settings</p>
                                        <div className={dashStyles.serverBadges}>
                                            <span className={dashStyles.activeBadge}>✅ Active</span>
                                            {guild.owner && <span className={dashStyles.ownerBadge}>👑 Owner</span>}
                                        </div>
                                    </div>
                                    <div className={dashStyles.serverArrow}>→</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Invite Bot to Servers */}
                {invitableGuilds.length > 0 && (
                    <div className={dashStyles.serverCategory}>
                        <h3>➕ Add 4EgosBot to Your Servers</h3>
                        <div className={dashStyles.serverGrid}>
                            {invitableGuilds.map((guild) => (
                                <div 
                                    key={guild.id}
                                    className={`${dashStyles.serverCard} ${dashStyles.inviteCard}`}
                                >
                                    <div className={dashStyles.serverIcon}>
                                        {guild.icon ? (
                                            <Image 
                                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
                                                alt={guild.name}
                                                width={48}
                                                height={48}
                                            />
                                        ) : (
                                            <div className={dashStyles.defaultIcon}>
                                                {guild.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className={dashStyles.serverInfo}>
                                        <h4>{guild.name}</h4>
                                        <p>Bot not added yet</p>
                                        <div className={dashStyles.serverBadges}>
                                            {guild.owner && <span className={dashStyles.ownerBadge}>👑 Owner</span>}
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/invite?guild_id=${guild.id}`}
                                        className={dashStyles.inviteButton}
                                    >
                                        Invite Bot
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Servers */}
                {userGuilds.length === 0 && (
                    <div className={dashStyles.noServers}>
                        <h4>No servers found</h4>
                        <p>You don&apos;t seem to be in any Discord servers yet.</p>
                        <Link href="https://discord.com" className={dashStyles.discordButton}>
                            Join Discord
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { token } = parseCookies(ctx);
    
    if (!token) {
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            },
        };
    }

    try {
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        const userData = await userResponse.json();
        
        return {
            props: {
                user: {
                    id: userData.id,
                    username: userData.username,
                    discriminator: userData.discriminator,
                    avatar: userData.avatar,
                    verified: userData.verified,
                    public_flags: userData.public_flags
                }
            }
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            redirect: {
                destination: '/api/auth/login',
                permanent: false,
            },
        };
    }
};
