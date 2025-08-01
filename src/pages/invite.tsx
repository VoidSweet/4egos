import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Invite.module.css';

export default function Invite() {
    const botInviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1398326650558742528'}&permissions=8&scope=bot%20applications.commands`;

    const handleInviteBot = () => {
        window.open(botInviteUrl, '_blank', 'width=500,height=700,scrollbars=yes,resizable=yes');
    };

    return (
        <>
            <Head>
                <title>Invite AegisBot - Discord Bot Dashboard</title>
                <meta name="description" content="Invite AegisBot to your Discord server and unlock powerful moderation, economy, and management features." />
                <meta property="og:title" content="Invite AegisBot to Your Server" />
                <meta property="og:description" content="Advanced Discord bot with moderation, economy, leveling, and more!" />
            </Head>
            
            <div className={styles.inviteContainer}>
                <div className={styles.inviteHeader}>
                    <div className={styles.botAvatar}>
                        🛡️
                    </div>
                    <h1>Invite AegisBot</h1>
                    <p>Add powerful moderation and management tools to your Discord server</p>
                </div>

                <div className={styles.featuresGrid}>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🔨</div>
                        <h3>Advanced Moderation</h3>
                        <p>Auto-moderation, warnings, kicks, bans, and detailed logging</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>💰</div>
                        <h3>Economy System</h3>
                        <p>Virtual currency, shops, gambling, and reward systems</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>📊</div>
                        <h3>Leveling & XP</h3>
                        <p>Member engagement tracking with customizable rewards</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>⚙️</div>
                        <h3>Easy Configuration</h3>
                        <p>Web dashboard for easy setup and management</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🎮</div>
                        <h3>Fun Commands</h3>
                        <p>Games, memes, and entertainment for your community</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>📈</div>
                        <h3>Analytics</h3>
                        <p>Server insights and member activity tracking</p>
                    </div>
                </div>

                <div className={styles.inviteActions}>
                    <button 
                        onClick={handleInviteBot}
                        className={styles.inviteButton}
                    >
                        <i className="fab fa-discord"></i>
                        Invite to Server
                    </button>
                    
                    <div className={styles.secondaryActions}>
                        <Link href="/commands" className={styles.secondaryButton}>
                            View Commands
                        </Link>
                        <Link href="/support" className={styles.secondaryButton}>
                            Get Support
                        </Link>
                    </div>
                </div>

                <div className={styles.permissions}>
                    <h3>Required Permissions</h3>
                    <div className={styles.permissionsList}>
                        <span className={styles.permission}>✅ Administrator (Recommended)</span>
                        <span className={styles.permission}>✅ Manage Messages</span>
                        <span className={styles.permission}>✅ Manage Roles</span>
                        <span className={styles.permission}>✅ Kick/Ban Members</span>
                        <span className={styles.permission}>✅ View Channels</span>
                        <span className={styles.permission}>✅ Send Messages</span>
                    </div>
                    <p className={styles.permissionsNote}>
                        AegisBot needs these permissions to function properly. You can adjust them later in your server settings.
                    </p>
                </div>

                <div className={styles.afterInvite}>
                    <h3>After Inviting</h3>
                    <ol className={styles.steps}>
                        <li>Join our <a href={process.env.LUNA_SUPPORT || '#'} target="_blank" rel="noopener noreferrer">support server</a> for help</li>
                        <li>Use <code>/setup</code> to configure the bot for your server</li>
                        <li>Visit the <Link href="/dashboard">dashboard</Link> to customize settings</li>
                        <li>Check out <Link href="/commands">available commands</Link></li>
                    </ol>
                </div>
            </div>
        </>
    );
}
