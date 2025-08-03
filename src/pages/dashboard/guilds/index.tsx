import React from 'react';
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies';

import LeftMenu from '../../../components/LeftMenu';
import LoadingPage from '../../../components/LoadingPage';
import GuildCard from '../../../components/GuildCard';

import styles from '../../../styles/main.module.css';

import { createState } from '../../../utils/states';

import { IUser, IGuildData } from '../../../types';
import { Permissions } from '../../../Constants';

interface IState {
    user: IUser | null;
    guilds: IGuildData[];
    loading: boolean;
    error?: string;
};

interface IProps {
    theme: string;
    token: string;
};

export default class DashboardGuilds extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            guilds: [],
            loading: true,
        } as IState;
    }

    async componentDidMount(): Promise<void> {
        const { token } = this.props as IProps;

        try {
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );

            // Fetch user data with timeout
            const userResponse = await Promise.race([
                fetch('https://discord.com/api/v10/users/@me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                timeoutPromise
            ]) as Response;

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();

            // Fetch user guilds with timeout
            const guildsResponse = await Promise.race([
                fetch('https://discord.com/api/v10/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                timeoutPromise
            ]) as Response;

            if (!guildsResponse.ok) {
                throw new Error('Failed to fetch guilds data');
            }

            const guildsData = await guildsResponse.json();

            // Convert Discord guild data to our format
            const formattedGuilds = guildsData.map(guild => ({
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                owner: guild.owner,
                permissions: parseInt(guild.permissions),
                features: guild.features || []
            }));

            this.setState({
                user: {
                    id: userData.id,
                    username: userData.username,
                    discriminator: userData.discriminator,
                    avatar: userData.avatar,
                    verified: userData.verified,
                    public_flags: userData.public_flags,
                    flags: userData.flags,
                    locale: userData.locale,
                    mfa_enabled: userData.mfa_enabled
                },
                guilds: formattedGuilds,
                loading: false,
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            this.setState({
                loading: false,
                user: null,
                guilds: [],
                error: error instanceof Error ? error.message : 'Failed to load guilds'
            });
            // Redirect to login if token is invalid
            setTimeout(() => {
                window.location.href = '/api/auth/login?dt=true';
            }, 2000);
        }
    }

    render() {
        const { user, guilds, loading, error } = this.state as IState;

        if (error) {
            return (
                <>
                    <LeftMenu {...{user}}/>
                    <div className={`${styles['content']}`}>
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: '#fff',
                            borderRadius: '15px',
                            boxShadow: '0 5px 25px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Loading Error</h2>
                            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '12px 24px',
                                    background: '#6366f1',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <LoadingPage {...{loading}} />
                <LeftMenu {...{user}}/>

                <div className={`${styles['content']}`}>
                    {guilds
                        .filter(guild => guild.owner || (guild.permissions & Permissions.ADMINISTRATOR) == Permissions.ADMINISTRATOR)
                        .map((guild, index) => ( <GuildCard {...{guild}} key={guild.id}/> ))
                    }
                </div>
            </>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async(ctx) => {
    const { ['__SessionLuny']: token } = parseCookies(ctx); 

    if(!token) return { 
        redirect: {
            destination: `/api/auth/login?state=${createState({ url: ctx.resolvedUrl || '/dashboard/guilds' })}`,
            permanent: false,
        } 
    };

    return {
        props: {
            token,
        },
    };
}