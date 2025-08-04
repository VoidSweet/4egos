import React from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import LeftMenu from '../../components/LeftMenu';
import styles from '../../styles/main.module.css';
import dashStyles from '../../styles/DashboardLayout.module.css';
import { IUser } from '../../types';

interface IProps {
    user: IUser;
}

export default function BillingDashboard({ user }: IProps) {
    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - Billing & Premium</title>
                <meta name="description" content="Manage your premium subscription and billing" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>💎 Billing & Premium</h1>
                    <p>Manage your premium subscription and unlock advanced features.</p>
                </div>

                <div className={dashStyles.premiumSection}>
                    <div className={dashStyles.premiumCard}>
                        <h3>🆓 Free Plan</h3>
                        <p>Currently Active</p>
                        <ul>
                            <li>✅ Basic moderation tools</li>
                            <li>✅ Economy system</li>
                            <li>✅ Leveling system</li>
                            <li>❌ Advanced analytics</li>
                            <li>❌ Custom commands</li>
                            <li>❌ Priority support</li>
                        </ul>
                    </div>

                    <div className={`${dashStyles.premiumCard} ${dashStyles.recommended}`}>
                        <div className={dashStyles.badge}>Recommended</div>
                        <h3>⭐ Premium Plan</h3>
                        <p className={dashStyles.price}>$4.99/month</p>
                        <ul>
                            <li>✅ Everything in Free</li>
                            <li>✅ Advanced analytics</li>
                            <li>✅ Custom commands</li>
                            <li>✅ Priority support</li>
                            <li>✅ Advanced automod</li>
                            <li>✅ Custom branding</li>
                        </ul>
                        <button className={dashStyles.upgradeButton}>
                            Upgrade to Premium
                        </button>
                    </div>

                    <div className={dashStyles.premiumCard}>
                        <h3>👑 Enterprise Plan</h3>
                        <p className={dashStyles.price}>Contact Us</p>
                        <ul>
                            <li>✅ Everything in Premium</li>
                            <li>✅ Dedicated support</li>
                            <li>✅ Custom integrations</li>
                            <li>✅ Advanced permissions</li>
                            <li>✅ SLA guarantee</li>
                            <li>✅ Custom development</li>
                        </ul>
                        <button className={dashStyles.contactButton}>
                            Contact Sales
                        </button>
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
