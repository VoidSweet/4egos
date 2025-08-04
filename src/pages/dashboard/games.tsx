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

export default function GamesDashboard({ user }: IProps) {
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
                <title>AegisBot Dashboard - Games & Entertainment</title>
                <meta name="description" content="Interactive games and entertainment features" />
            </Head>

            
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🎮 Games & Entertainment</h1>
                    <p>Interactive games with economy integration, tournaments, and special events.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🧠</div>
                        <h3>Trivia Games</h3>
                        <p>Challenge your knowledge with various categories and difficulty levels</p>
                        <div className={dashStyles.featureItems}>
                            <span>Multiple categories</span>
                            <span>Difficulty levels</span>
                            <span>Rewards system</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎰</div>
                        <h3>Casino Games</h3>
                        <p>Test your luck with blackjack, poker, slots, and roulette</p>
                        <div className={dashStyles.featureItems}>
                            <span>Blackjack</span>
                            <span>Poker</span>
                            <span>Slot machines</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🏆</div>
                        <h3>Tournaments</h3>
                        <p>Compete in daily, weekly, and seasonal tournaments</p>
                        <div className={dashStyles.featureItems}>
                            <span>Daily challenges</span>
                            <span>Weekly tournaments</span>
                            <span>Special events</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎯</div>
                        <h3>Mini Games</h3>
                        <p>Quick games for instant entertainment and rewards</p>
                        <div className={dashStyles.featureItems}>
                            <span>Word games</span>
                            <span>Number puzzles</span>
                            <span>Memory challenges</span>
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
