import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from '../../styles/main.module.css';
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
    const [guilds, setGuilds] = useState<IGuild[]>(initialGuilds || []);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        return 'https://cdn.discordapp.com/embed/avatars/0.png';
    };

    const handleServerClick = (guildId: string) => {
        router.push(`/dashboard/guilds/${guildId}`);
    };

    return (
        <DashboardLayout>
            <Head>
                <title>Server Selection - AegisBot Dashboard</title>
                <meta name="description" content="Select a Discord server to manage with AegisBot" />
            </Head>

            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeader}>
                    <h1>🛡️ Server Management</h1>
                    <p>Select a server to configure AegisBot settings and view analytics</p>
                </div>

                <div className={styles.contentWrapper}>
                    {/* Search and Filter Controls */}
                    <div className={styles.controlsSection}>
                        <div className={styles.searchContainer}>
                            <div className={styles.searchInputGroup}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search servers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.viewControls}>
                            <button 
                                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <i className="fas fa-th-large"></i>
                                Grid
                            </button>
                            <button 
                                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <i className="fas fa-list"></i>
                                List
                            </button>
                        </div>
                    </div>

                    {/* Server Statistics */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <i className="fas fa-server" style={{ color: '#3b82f6' }}></i>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>{adminGuilds.length}</div>
                                <div className={styles.statLabel}>Total Servers</div>
                            </div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <i className="fas fa-robot" style={{ color: '#10b981' }}></i>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>{adminGuilds.filter(g => g.botPresent).length}</div>
                                <div className={styles.statLabel}>Bot Active</div>
                            </div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <i className="fas fa-users" style={{ color: '#f59e0b' }}></i>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>
                                    {adminGuilds.reduce((total, guild) => total + (guild.memberCount || 0), 0).toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>Total Members</div>
                            </div>
                        </div>
                        
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <i className="fas fa-crown" style={{ color: '#8b5cf6' }}></i>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>{adminGuilds.filter(g => g.owner).length}</div>
                                <div className={styles.statLabel}>Owned</div>
                            </div>
                        </div>
                    </div>

                    {/* Server Grid/List */}
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}>
                                <i className="fas fa-spinner fa-spin"></i>
                            </div>
                            <p>Loading your servers...</p>
                        </div>
                    ) : filteredGuilds.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <i className="fas fa-server"></i>
                            </div>
                            <h3>No servers found</h3>
                            <p>You don&apos;t have any servers with admin permissions or AegisBot isn&apos;t in your servers yet.</p>
                            <Link href="/invite" className={styles.inviteButton}>
                                <i className="fas fa-plus"></i>
                                Invite AegisBot
                            </Link>
                        </div>
                    ) : (
                        <div className={`${styles.serverGrid} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
                            {filteredGuilds.map(guild => (
                                <div 
                                    key={guild.id} 
                                    className={`${styles.serverCard} ${guild.botPresent ? styles.clickable : styles.disabled}`} 
                                    onClick={() => guild.botPresent && handleServerClick(guild.id)}
                                >
                                    <div className={styles.serverCardContent}>
                                        <div className={styles.serverIcon}>
                                            <img
                                                src={getIconUrl(guild)}
                                                alt={guild.name}
                                                className={styles.serverImage}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                                                }}
                                            />
                                            {guild.botPresent && (
                                                <div className={styles.botBadge}>
                                                    <i className="fas fa-robot"></i>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className={styles.serverInfo}>
                                            <h3 className={styles.serverName}>{guild.name}</h3>
                                            <div className={styles.serverMeta}>
                                                <span className={styles.serverRole}>
                                                    <i className={guild.owner ? "fas fa-crown" : "fas fa-shield-alt"}></i>
                                                    {guild.owner ? 'Owner' : 'Administrator'}
                                                </span>
                                                {guild.memberCount && guild.memberCount > 0 && (
                                                    <span className={styles.memberCount}>
                                                        <i className="fas fa-users"></i>
                                                        {guild.memberCount.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className={styles.serverStatus}>
                                                {guild.botPresent ? (
                                                    <span className={styles.statusActive}>
                                                        <i className="fas fa-circle"></i>
                                                        Bot Active
                                                    </span>
                                                ) : (
                                                    <span className={styles.statusInactive}>
                                                        <i className="fas fa-circle"></i>
                                                        Bot Not Added
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className={styles.serverActions}>
                                            {guild.botPresent ? (
                                                <button className={styles.manageButton}>
                                                    <i className="fas fa-cog"></i>
                                                    Manage
                                                </button>
                                            ) : (
                                                <button 
                                                    className={styles.inviteButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://discord.com/api/oauth2/authorize?client_id=1398326650558742528&scope=bot&permissions=8&guild_id=${guild.id}`, '_blank');
                                                    }}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                    Add Bot
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {guild.botPresent && (
                                        <div className={styles.serverCardOverlay}>
                                            <i className="fas fa-arrow-right"></i>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { ['__SessionLuny']: token } = parseCookies(context);
        
        if (!token) {
            return {
                redirect: {
                    destination: '/api/auth/login',
                    permanent: false,
                }
            };
        }

        // Fetch user data from Discord
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch user's guilds
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!guildsResponse.ok) {
            throw new Error('Failed to fetch user guilds');
        }

        const userGuilds = await guildsResponse.json();

        // Filter guilds where user has admin permissions
        const adminGuilds = userGuilds.filter(guild => 
            guild.owner || 
            (parseInt(guild.permissions) & 0x8) === 0x8 || // ADMINISTRATOR
            (parseInt(guild.permissions) & 0x20) === 0x20   // MANAGE_SERVER
        );

        // Get bot data for guild presence checking
        const guildsWithBotData = await Promise.all(
            adminGuilds.map(async (guild) => {
                try {
                    // Check if bot is in this guild via bot API
                    const botToken = process.env.DISCORD_TOKEN;
                    if (!botToken) {
                        return { ...guild, botPresent: false, memberCount: 0 };
                    }

                    const botGuildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
                        headers: {
                            'Authorization': `Bot ${botToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    let botPresent = false;
                    let memberCount = 0;

                    if (botGuildsResponse.ok) {
                        const botGuilds = await botGuildsResponse.json();
                        const botGuild = botGuilds.find(bg => bg.id === guild.id);
                        if (botGuild) {
                            botPresent = true;
                            // Try to get member count from guild info
                            try {
                                const guildInfoResponse = await fetch(`https://discord.com/api/v10/guilds/${guild.id}`, {
                                    headers: {
                                        'Authorization': `Bot ${botToken}`,
                                        'Content-Type': 'application/json',
                                    },
                                });
                                if (guildInfoResponse.ok) {
                                    const guildInfo = await guildInfoResponse.json();
                                    memberCount = guildInfo.approximate_member_count || guildInfo.member_count || 0;
                                }
                            } catch (error) {
                                console.error(`Error fetching guild info for ${guild.id}:`, error);
                            }
                        }
                    }

                    return {
                        ...guild,
                        botPresent,
                        memberCount,
                        features: [],
                        joinedAt: ''
                    };
                } catch (error) {
                    console.error(`Error checking bot presence for guild ${guild.id}:`, error);
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
