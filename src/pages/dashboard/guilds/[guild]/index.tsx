import { GetServerSideProps } from 'next';

export default function GuildIndexRedirect() {
    return null; // This page will redirect before rendering
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { guild } = ctx.query;
    
    return {
        redirect: {
            destination: `/dashboard/guilds/${guild}/home`,
            permanent: true,
        }
    };
};

export default class DashboardGuild extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            guild: null,
            loading: true,
        } as IState;
    }

    render() {
        const { user, guild, loading } = this.state as IState;
        const { token, hostApi, guildId } = this.props as IProps;

        return (
            <>
                <LoadingPage {...{loading}} />
                
                <LeftMenu {...{user, guild}}/>

                <div className={`${styles['content']}`}>
                    <div className={styles['small-card']}>
                        <h3>Punishments</h3>
                        <br />
                        <Line
                            {...{
                                data: dataPunishments,
                                options,
                            }}
                        />
                    </div>
                    <div className={styles['small-card']}>
                        <h3>Punishments Types</h3>
                        <br />
                        <Line
                            {...{
                                data: dataPunishmentsTypes,
                                options,
                            }}
                        />
                    </div>
                </div>

                <Script
                    src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js'
                    onLoad={() => {
                        console.log(guildId);

                        const api = socket(hostApi, {
                            query: {
                                token,
                                guildId,
                            },
                        })

                        api.on('ready', ({ data }) => {
                            this.setState({
                                user: data.user,
                                guild: data.guild,
                                loading: false,
                            })
                        });

                        api.on('error', ({ data }) => {
                            console.log(data);

                            if(!data?.message || `${data.message}`.toLowerCase().includes('token')) {
                                return window.location.href = '/api/auth/login?dt=true';
                            };

                            if(`${data.message}`.toLowerCase() == 'invalid guild') {
                                return window.location.href = `/invite?guildId=${guildId}`;
                            };
                            
                            if(`${data.message}`.toLowerCase() == 'missing access') {
                                return window.location.href = `/dashboard/guilds?err=${encodeURIComponent(data.message)}&guildId=${guildId}`;
                            };
                        });
                    }}
                ></Script>
            </>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async(ctx) => {
    const { ['__SessionLuny']: token } = parseCookies(ctx); 

    if(!token) return { 
        redirect: {
            destination: `/api/auth/login?state=${encodeURIComponent(ctx.resolvedUrl || '/dashboard/guilds/[guild]')}`,
            permanent: false,
        } 
    };

    return {
        props: {
            token,
            hostApi: process.env.HOST_API,
            guildId: ctx.query.guild,
        },
    };
}

function Last7Days() {
    const currentDate = new Date('03/02/2022 00:00');
    const now = Date.now()

    const dates = [currentDate, ...Array(6).fill(0).map((_, i) => new Date(now - ((i + 1) * 1000 * 60 * 60 * 24)))]

    return dates.map(formatDate)
}

function formatDate(date){
    let dd = date.getDate();
    let mm = date.getMonth()+1;
    let yyyy = date.getFullYear();
    if(dd < 10) { dd = '0' + dd }
    if(mm < 10) { mm = '0' + mm }
    date = dd + '/' + mm  + '/' + yyyy;
    return date
}
