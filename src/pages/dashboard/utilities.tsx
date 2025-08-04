import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';

import LeftMenu from '../../components/LeftMenu';
import LoadingPage from '../../components/LoadingPage';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IProps {
    user: IUser;
}

export default function UtilitiesDashboard({ user }: IProps) {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <LoadingPage {...{loading}} />;
    }

    return (
        <>
            <Head>
                <title>AegisBot Dashboard - Utilities</title>
                <meta name="description" content="Essential server utilities and management tools" />
            </Head>

            
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🔧 Server Utilities</h1>
                    <p>Essential tools for server management, automation, and member engagement.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🔔</div>
                        <h3>Notification System</h3>
                        <p>Smart notification and announcement management</p>
                        <div className={dashStyles.featureItems}>
                            <span>Auto-announcements</span>
                            <span>Event reminders</span>
                            <span>Welcome messages</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>📋</div>
                        <h3>Channel Management</h3>
                        <p>Advanced channel creation and organization</p>
                        <div className={dashStyles.featureItems}>
                            <span>Auto-channels</span>
                            <span>Category organization</span>
                            <span>Permission sync</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⚙️</div>
                        <h3>Server Tools</h3>
                        <p>Comprehensive server maintenance utilities</p>
                        <div className={dashStyles.featureItems}>
                            <span>Backup system</span>
                            <span>Bulk operations</span>
                            <span>Migration tools</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎯</div>
                        <h3>Custom Commands</h3>
                        <p>Create and manage custom server commands</p>
                        <div className={dashStyles.featureItems}>
                            <span>Command builder</span>
                            <span>Response templates</span>
                            <span>Permission controls</span>
                        </div>
                    </div>
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
    }

    

    return {
        props: {
            user: mockUser
        }
    };
};
