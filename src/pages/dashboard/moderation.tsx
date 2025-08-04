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

export default function ModerationDashboard({ user }: IProps) {
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
                <title>AegisBot Dashboard - Moderation</title>
                <meta name="description" content="Advanced moderation tools and automation systems" />
            </Head>

            
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🛡️ Moderation Center</h1>
                    <p>Advanced moderation tools, automated systems, and comprehensive logging.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⚖️</div>
                        <h3>Auto Moderation</h3>
                        <p>Intelligent automated moderation system</p>
                        <div className={dashStyles.featureItems}>
                            <span>Spam detection</span>
                            <span>NSFW filtering</span>
                            <span>Link protection</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>📝</div>
                        <h3>Moderation Logs</h3>
                        <p>Comprehensive audit trail and reporting</p>
                        <div className={dashStyles.featureItems}>
                            <span>Action history</span>
                            <span>Evidence storage</span>
                            <span>Analytics dashboard</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⏰</div>
                        <h3>Timeouts & Bans</h3>
                        <p>Flexible punishment system with appeals</p>
                        <div className={dashStyles.featureItems}>
                            <span>Temporary punishments</span>
                            <span>Progressive discipline</span>
                            <span>Appeal system</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🤖</div>
                        <h3>Moderation Bots</h3>
                        <p>AI-powered moderation assistance</p>
                        <div className={dashStyles.featureItems}>
                            <span>Content analysis</span>
                            <span>Pattern recognition</span>
                            <span>Smart alerts</span>
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
