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

export default function BillingDashboard({ user }: IProps) {
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
                <title>AegisBot Dashboard - Premium Features</title>
                <meta name="description" content="Unlock advanced features and premium benefits" />
            </Head>

            
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>💎 Premium Features</h1>
                    <p>Unlock the full potential of AegisBot with premium features and enhanced capabilities.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⚡</div>
                        <h3>Enhanced Security</h3>
                        <p>Advanced protection and monitoring</p>
                        <div className={dashStyles.featureItems}>
                            <span>Real-time threat detection</span>
                            <span>Advanced anti-nuke</span>
                            <span>Custom security rules</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎮</div>
                        <h3>Premium Games</h3>
                        <p>Exclusive games and features</p>
                        <div className={dashStyles.featureItems}>
                            <span>Custom minigames</span>
                            <span>Enhanced rewards</span>
                            <span>Special events</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>📊</div>
                        <h3>Advanced Analytics</h3>
                        <p>Detailed insights and reporting</p>
                        <div className={dashStyles.featureItems}>
                            <span>Member analytics</span>
                            <span>Activity reports</span>
                            <span>Growth tracking</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎨</div>
                        <h3>Customization</h3>
                        <p>Personalize your server experience</p>
                        <div className={dashStyles.featureItems}>
                            <span>Custom branding</span>
                            <span>Personalized themes</span>
                            <span>White-label options</span>
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
