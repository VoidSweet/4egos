import React from 'react';
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies';

import LeftMenu from '../../../components/LeftMenu';
import LoadingPage from '../../../components/LoadingPage';
import Header from '../../../components/Header';
import GuildCard from '../../../components/GuildCard';

import styles from '../../../styles/main.module.css';

import { createState } from '../../../utils/states';

import { IUser, IGuildData } from '../../../types';
import { Permissions } from '../../../Constants';

interface IState {
    user: IUser | null;
    guilds: IGuildData[];
    loading: boolean;
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
            // Fetch user data
            const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await userResponse.json();

            // Fetch user guilds
            const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

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
                    premium_type: userData.premium_type
                },
                guilds: formattedGuilds,
                loading: false,
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            // Redirect to login if token is invalid
            window.location.href = '/api/auth/login?dt=true';
        }
    }

    render() {
        const { user, guilds, loading } = this.state as IState;

        return (
            <>
                <LoadingPage {...{loading}} />
                <Header {...{user}}/>
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