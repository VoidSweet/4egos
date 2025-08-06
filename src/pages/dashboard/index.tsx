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
}

interface IProps {
    user: IUser;
    guilds: IGuild[];
}

export default function ServerSelection({ user, guilds }: IProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);

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
        return '/images/default_server_icon.png';
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
                            {filteredGuilds.map(guild => (
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
                                    </div>
                                    <div className={styles.serverInfo}>
                                        <h3 className={styles.serverName}>{guild.name}</h3>
                                        <p className={styles.serverRole}>
                                            {guild.owner ? 'Owner' : 'Administrator'}
                                        </p>
                                    </div>
                                    <div className={styles.serverAction}>
                                        <i className="fas fa-arrow-right"></i>
                                    </div>
                                </Link>
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

        // Fetch user guilds
        const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!guildsResponse.ok) {
            throw new Error('Failed to fetch guilds data');
        }

        const guildsData = await guildsResponse.json();

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
                guilds: guildsData
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
