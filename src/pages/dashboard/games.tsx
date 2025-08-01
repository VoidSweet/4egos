import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Header from '../../components/Header';
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

            <Header {...{user}} />
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
    const { ['__SessionLuny']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: `/api/auth/login?state=${encodeURIComponent(ctx.req.url)}`,
                permanent: false,
            }
        };
    }

    const mockUser: IUser = {
        id: "123456789",
        username: "AegisAdmin",
        discriminator: "0001",
        avatar: null,
        verified: true,
        mfa_enabled: true,
        locale: "en-US",
        flags: 0,
        public_flags: 0
    };

    return {
        props: {
            user: mockUser
        }
    };
};
