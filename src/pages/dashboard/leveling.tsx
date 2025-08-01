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

export default function LevelingDashboard({ user }: IProps) {
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
                <title>AegisBot Dashboard - Leveling & XP</title>
                <meta name="description" content="Engaging progression system with rewards and competitions" />
            </Head>

            <Header {...{user}} />
            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>📈 Leveling & XP System</h1>
                    <p>Engaging progression system with role rewards, leaderboards, and competitions.</p>
                </div>

                <div className={dashStyles.featureGrid}>
                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>⭐</div>
                        <h3>XP Configuration</h3>
                        <p>Customize experience point rates and sources</p>
                        <div className={dashStyles.featureItems}>
                            <span>Message XP</span>
                            <span>Voice XP</span>
                            <span>Bonus multipliers</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎖️</div>
                        <h3>Role Rewards</h3>
                        <p>Automatic role assignment based on user levels</p>
                        <div className={dashStyles.featureItems}>
                            <span>Level milestones</span>
                            <span>Custom rewards</span>
                            <span>Special perks</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🏅</div>
                        <h3>Leaderboards</h3>
                        <p>Competitive ranking systems and achievements</p>
                        <div className={dashStyles.featureItems}>
                            <span>Global rankings</span>
                            <span>Weekly competitions</span>
                            <span>Achievement system</span>
                        </div>
                    </div>

                    <div className={dashStyles.featureCard}>
                        <div className={dashStyles.featureIcon}>🎁</div>
                        <h3>Level Rewards</h3>
                        <p>Special rewards and bonuses for reaching milestones</p>
                        <div className={dashStyles.featureItems}>
                            <span>Currency bonuses</span>
                            <span>Shop discounts</span>
                            <span>Exclusive access</span>
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
