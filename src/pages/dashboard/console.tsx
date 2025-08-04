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

export default function ConsoleDashboard({ user }: IProps) {
    return (
        <>
            <Head>
                <title>4EgosBot Dashboard - Developer Console</title>
                <meta name="description" content="Advanced developer tools and API access" />
            </Head>

            <LeftMenu {...{user}} />

            <div className={styles.content}>
                <div className={dashStyles.dashboardHeader}>
                    <h1>🔧 Developer Console</h1>
                    <p>Advanced tools for developers and power users.</p>
                </div>

                <div className={dashStyles.consoleSection}>
                    <div className={dashStyles.consoleCard}>
                        <h3>🔑 API Access</h3>
                        <p>Generate API keys for custom integrations</p>
                        <div className={dashStyles.apiKeySection}>
                            <input 
                                type="text" 
                                value="•••••••••••••••••••••••••••••••••••••••••"
                                readOnly
                                className={dashStyles.apiKeyInput}
                            />
                            <button className={dashStyles.generateButton}>
                                Generate New Key
                            </button>
                        </div>
                        <p className={dashStyles.note}>
                            ⚠️ Premium feature - Upgrade to access API
                        </p>
                    </div>

                    <div className={dashStyles.consoleCard}>
                        <h3>📊 Analytics API</h3>
                        <p>Access detailed server analytics via API</p>
                        <ul className={dashStyles.apiEndpoints}>
                            <li>GET /api/v1/guilds/{'{guildId}'}/stats</li>
                            <li>GET /api/v1/guilds/{'{guildId}'}/members</li>
                            <li>GET /api/v1/guilds/{'{guildId}'}/activity</li>
                        </ul>
                        <button className={dashStyles.docsButton}>
                            View Documentation
                        </button>
                    </div>

                    <div className={dashStyles.consoleCard}>
                        <h3>🔍 Debug Tools</h3>
                        <p>Debug and troubleshoot bot issues</p>
                        <div className={dashStyles.debugActions}>
                            <button className={dashStyles.debugButton}>
                                View Bot Logs
                            </button>
                            <button className={dashStyles.debugButton}>
                                Test Connection
                            </button>
                            <button className={dashStyles.debugButton}>
                                Clear Cache
                            </button>
                        </div>
                    </div>

                    <div className={dashStyles.consoleCard}>
                        <h3>⚡ Webhooks</h3>
                        <p>Set up webhooks for real-time events</p>
                        <div className={dashStyles.webhookConfig}>
                            <input 
                                type="url" 
                                placeholder="https://your-server.com/webhook"
                                className={dashStyles.webhookInput}
                            />
                            <button className={dashStyles.addButton}>
                                Add Webhook
                            </button>
                        </div>
                        <p className={dashStyles.note}>
                            ⚠️ Premium feature - Upgrade to use webhooks
                        </p>
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
