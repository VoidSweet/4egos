import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../../styles/ServerSelection.module.css';
import { IUser } from '../../types';

interface IGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    permissions_new: string;
    botPresent?: boolean;
    memberCount?: number;
    features?: string[];
    joinedAt?: string;
}

interface IProps {
    user: IUser;
    guilds: IGuild[];
}

export default function ServerSelection({ user, guilds: initialGuilds }: IProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [guilds, setGuilds] = useState<IGuild[]>(initialGuilds || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch updated guild data with bot presence
        const fetchGuildsWithBotStatus = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/guilds');
                if (response.ok) {
                    const data = await response.json();
                    setGuilds(data.guilds);
                }
            } catch (error) {
                console.error('Failed to fetch guild data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuildsWithBotStatus();
    }, []);

    // Filter guilds where user has admin permissions or is owner
    const adminGuilds = guilds.filter(guild => 
        guild.owner || 
        (parseInt(guild.permissions) & 0x8) === 0x8 || // ADMINISTRATOR
        (parseInt(guild.permissions) & 0x20) === 0x20   // MANAGE_SERVER
    );

    const filteredGuilds = adminGuilds.filter(guild =>
        guild.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIconUrl = (guild: IGuild) => {
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

    return (
        <>
            <Head>
                <title>Select Server - Aegis Dashboard</title>
                <meta name="description" content="Select a Discord server to manage with Aegis" />
            </Head>

            <div className={styles.serverSelection}>
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <div className={styles.brandIcon}>🛡️</div>
                        <h1>Aegis</h1>
                    </div>
                    
                    <div className={styles.userInfo}>
                        <span>Logged in as</span>
                        <div className={styles.userCard}>
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
                                className={styles.dropdown}
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

                <div className={styles.content}>
                    <div className={styles.serverList}>
                        <div className={styles.serverListHeader}>
                            <h2>Select a Server</h2>
                            <div className={styles.searchBox}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search servers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.servers}>
                            {loading && (
                                <div className={styles.loadingState}>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <p>Loading server data...</p>
                                </div>
                            )}
                            
                            {!loading && filteredGuilds.map(guild => (
                                guild.botPresent ? (
                                    <Link 
                                        key={guild.id} 
                                        href={`/dashboard/guilds/${guild.id}`}
                                        className={styles.serverCard}
                                    >
                                        <div className={styles.serverIcon}>
                                            <img
                                                src={getIconUrl(guild)}
                                                alt={guild.name}
                                                className={styles.serverImage}
                                            />
                                            <div className={styles.botBadge}>
                                                <i className="fas fa-robot"></i>
                                            </div>
                                        </div>
                                        <div className={styles.serverInfo}>
                                            <h3 className={styles.serverName}>{guild.name}</h3>
                                            <p className={styles.serverRole}>
                                                {guild.owner ? 'Owner' : 'Administrator'}
                                            </p>
                                            <div className={styles.serverStatus}>
                                                <span className={styles.statusOnline}>
                                                    <i className="fas fa-circle"></i>
                                                    Bot Active
                                                </span>
                                                {guild.memberCount && (
                                                    <span className={styles.memberCount}>
                                                        {guild.memberCount.toLocaleString()} members
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.serverAction}>
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                    </Link>
                                ) : (
                                    <div key={guild.id} className={styles.serverCardDisabled}>
                                        <div className={styles.serverIcon}>
                                            <img
                                                src={getIconUrl(guild)}
                                                alt={guild.name}
                                                className={styles.serverImage}
                                            />
                                        </div>
                                        <div className={styles.serverInfo}>
                                            <h3 className={styles.serverName}>{guild.name}</h3>
                                            <p className={styles.serverRole}>
                                                {guild.owner ? 'Owner' : 'Administrator'}
                                            </p>
                                            <div className={styles.serverStatus}>
                                                <span className={styles.statusOffline}>
                                                    <i className="fas fa-circle"></i>
                                                    Bot Not Added
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.serverAction}>
                                            <span className={styles.disabledText}>Invite Bot First</span>
                                        </div>
                                    </div>
                                )
                            ))}

                            {filteredGuilds.length === 0 && (
                                <div className={styles.noServers}>
                                    <div className={styles.noServersIcon}>
                                        <i className="fas fa-server"></i>
                                    </div>
                                    <h3>No servers found</h3>
                                    <p>
                                        {searchTerm 
                                            ? 'No servers match your search criteria.'
                                            : 'You don\'t have administrator permissions on any servers where Aegis is installed.'
                                        }
                                    </p>
                                    <Link href="/invite" className={styles.inviteBtn}>
                                        <i className="fab fa-discord"></i>
                                        Invite Aegis to Server
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.footerContent}>
                        <p>&copy; 2021-2025 Aegis • <Link href="/terms">Terms</Link> • <Link href="/privacy">Privacy</Link> • <Link href="/legal">Legal Notice</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: '/api/auth/login?state=' + encodeURIComponent('/dashboard'),
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

        // Fetch guilds with bot data from our API
        const botApiUrl = process.env.DASHBOARD_API_URL;
        const botApiKey = process.env.DASHBOARD_API_KEY;
        
        // Get Discord guilds first
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!guildsResponse.ok) {
            throw new Error('Failed to fetch guilds data');
        }

        const discordGuilds = await guildsResponse.json();

        // Enhance guilds with bot data
        const guildsWithBotData = await Promise.all(
            discordGuilds.map(async (guild: IGuild) => {
                try {
                    // Check if bot is in this guild
                    const botDataResponse = await fetch(`${botApiUrl}/guilds/${guild.id}`, {
                        headers: {
                            'Authorization': `Bearer ${botApiKey}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (botDataResponse.ok) {
                        const botData = await botDataResponse.json();
                        return {
                            ...guild,
                            botPresent: true,
                            memberCount: botData.memberCount || 0,
                            features: botData.features || [],
                            joinedAt: botData.joinedAt || new Date().toISOString()
                        };
                    } else {
                        return {
                            ...guild,
                            botPresent: false,
                            memberCount: 0,
                            features: [],
                            joinedAt: ''
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching bot data for guild ${guild.id}:`, error);
                    return {
                        ...guild,
                        botPresent: false,
                        memberCount: 0,
                        features: [],
                        joinedAt: ''
                    };
                }
            })
        );

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
                guilds: guildsWithBotData
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
