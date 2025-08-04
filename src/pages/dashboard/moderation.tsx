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

export default function ModerationDashboard({ user }: IProps) {
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
                <title>4EgosBot Dashboard - Moderation Tools</title>
                <meta name="description" content="Moderation tools and automod management overview" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🛡️ Moderation Tools</h1>
                    <p>Configure automod, logging, and moderation features for your server.</p>
                </div>

                {/* Server Selection */}
                <div className={dashStyles.serverSelection}>
                    <h3>Select a Server to Configure:</h3>
                    
                    {userGuilds.length === 0 ? (
                        <div className={dashStyles.noServers}>
                            <h4>No servers found</h4>
                            <p>You need to have &quot;Manage Server&quot; permission to configure moderation tools.</p>
                            <Link href="/invite" className={dashStyles.inviteButton}>
                                Invite 4EgosBot
                            </Link>
                        </div>
                    ) : (
                        <div className={dashStyles.serverGrid}>
                            {userGuilds.map((guild) => (
                                <Link 
                                    key={guild.id}
                                    href={`/dashboard/guilds/${guild.id}/moderation`}
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
                                        <p>Configure Moderation Settings</p>
                                    </div>
                                    <div className={dashStyles.serverArrow}>→</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
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
        // Fetch real user data from Discord
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
