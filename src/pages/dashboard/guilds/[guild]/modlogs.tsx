import React from 'react';
import Script from 'next/script';
import { GetServerSideProps } from 'next'
import socket from 'socket.io-client';
import { parseCookies } from 'nookies';

import LeftMenu from '../../../../components/LeftMenu';
import LoadingPage from '../../../../components/LoadingPage';
import Header from '../../../../components/Header';

import styles from '../../../../styles/main.module.css';
import guildStyles from '../../../../styles/guild.module.css';
import paginationStyles from '../../../../styles/pagination.module.css';

import { createState } from '../../../../utils/states';
import decode from '../../../../utils/decode';
import encode from '../../../../utils/encode';

import { IUser, IGuildSuper, ILog } from '../../../../types';
import { defaultAvatar } from '../../../../Constants';

interface IState {
    user: IUser | null;
    guild: IGuildSuper;
    loading: boolean;
    chunk: number;
    chunks: number;
    limit: number;
    id: string|null;
    logs: ILog[];
    filters: IFilters;
    log?: ILog|null;
};

interface IProps {
    theme: string;
    token: string;
    hostApi: string;
    guildId: string;
};

interface IGetLogsData {
    chunk?: number;
    limit?: number;
    filters?: string;
    id?: string;
}

interface IFilters { 
    userId: string; 
    authorId: string, 
    type: number | string
}

const punishments = {
    '1': {
        name: 'Ban',
        color: '#ed4245'
    }, 
    '2': {
        name: 'Kick',
        color: '#ea8935'
    }, 
    '3': {
        name: 'Mute',
        color: '#4b8cd2'
    }, 
    '4': {
        name: 'Adv',
        color: '#eaac35'
    }
}

export default class DashboardMe extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            guild: null,
            loading: true,
            chunk: 0,
            chunks: 0,
            limit: 10,
            id: null,
            logs: [],
            filters: {
                type: null,
                authorId: null,
                userId: null,
            },
            log: null
        } as IState;
    }

    render() {
        const { user, guild, loading, logs, id: logId, chunk, chunks } = this.state as IState;
        const { token, hostApi, guildId } = this.props as IProps;

        return (
            <>
                {loading && ( <LoadingPage {...{loading}} /> )}
                <Header {...{user}}/>
                <LeftMenu {...{user, guild}}/>
                {(() => {
                    if(logId) {
                        const log = logs.find(log => log.id === (this.state as IState).id) || null;

                        if(log) {
                            const punishment = punishments[log.type];
                            const DateNow = Date.now();

                            return (
                                <>
                                    <Script>{`
                                        const { scrollY: scrollY_${DateNow} } = window;

                                        const html_${DateNow} = document.querySelector('html');
                                        const body_${DateNow} = document.querySelector('body');
                                    
                                        html_${DateNow}.style = \`width: calc(100% - 12px); position: fixed; top: -\${scrollY_${DateNow}}px; overflow: hidden;\`;
                                        body_${DateNow}.style = 'overflow: hidden;'
                                    `}</Script>

                                    <div className={guildStyles['modal-wrapper']} onClick={(e) => {
                                        const modalLog = document.getElementById('modal-log');
                                        const _html = document.querySelector('html') as any;
                                        const _body = document.querySelector('body') as any;
                                        const scrollTop = _html.style.top;
                                        
                                        console.log(Number(_html.style.top.replace(/-(\d*)px/, '$1')) || 0,)
                                        
                                        if(!modalLog?.contains(e.target as Node)){
                                            e.currentTarget.classList.add(guildStyles['hiding']);
                                            
                                            setTimeout(() => {
                                                this.setState({
                                                    id: null
                                                });
                                                _body.style = '';
                                                _html.style = '';
                                                window.scrollTo({
                                                    top: Number(scrollTop.replace(/-(\d*)px/, '$1')) || 0,
                                                });
                                            }, 450);
                                        };
                                    }}>
                                        <div className={guildStyles['modal-log']} id={'modal-log'}>
                                            <div className={guildStyles['user']}>
                                                <img
                                                    src={log?.user?.avatar ? `https://cdn.discordapp.com/avatars/${log?.user?.id}/${log?.user?.avatar}.png` : defaultAvatar}
                                                    alt={'avatar-' + log?.user?.username}
                                                />
                                                <h3>{log?.user?.username}<span>#{log?.user?.discriminator}</span><span className={guildStyles['punishment']} style={{backgroundColor: punishment.color}}>{punishment.name}</span></h3>
                                            </div>
                                            <br />
                                            <div className={guildStyles['line']} />
                                            <br />
                                            <div className={guildStyles['grid']}>
                                                <div className={guildStyles['item']}>
                                                    <h4>Data:</h4>
                                                    <p>{new Date(log.date).toLocaleString()}</p>
                                                </div>
                                                <div className={guildStyles['item']}>
                                                    <h4>Autor:</h4>
                                                    <p>{log?.author?.username}#{log?.author?.discriminator}</p>
                                                </div>
                                            </div>
                                            <br />
                                            <h4>Motivo:</h4>
                                            <p>{log?.reason}</p>
                                            <br />
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    }
                })()}
                <div className={`${styles['content']}`}>
                    <div className={guildStyles['scr']} id='logs-content-wrapper'>
                        <table className={guildStyles['cards-log']}>
                            <thead>
                                <tr>
                                    <th>Usuário</th>
                                    <th>Autor</th>
                                    <th>Ação</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody id='logs-content'>
                                {logs.map((log, i) => {
                                    const punishment = punishments[log.type];

                                    return (
                                        <tr key={log.id} id={log.id} data-log onClick={(e) => {
                                            this.setState({
                                                id: log.id
                                            })
                                        }}>
                                            <td className={guildStyles['user']}>
                                                <img src={log.user.avatar ? `https://cdn.discordapp.com/avatars/${log.user?.id}/${log.user?.avatar}.png` : defaultAvatar} alt={''} />
                                                <p>
                                                    {log.user?.username}#{log.user?.discriminator}
                                                    <br /><br />
                                                    <span>{log.user?.id}</span>
                                                </p>
                                            </td>

                                            <td>
                                                {log.author?.username}
                                            </td>
                                            <td className={guildStyles['punishment']}>
                                                <span 
                                                    style={{backgroundColor: punishment.color}}
                                                >
                                                    {punishment.name}
                                                </span>
                                            </td>

                                            <td>
                                                {new Date(log.date).toLocaleString()}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {logs?.length && (
                        <div className={paginationStyles['pagination-bar']}>
                            <div 
                                className={`${paginationStyles['dot']} ${chunk == 0 ? paginationStyles['selected'] : ''}`}
                                onClick={() => {
                                    if(chunk != 0) {
                                        // @ts-ignore
                                        window.toChunk(0);
                                    }
                                }}
                            >
                                <i className="far fa-angle-left"></i>
                            </div>
                            {Array(chunks)
                                .fill(0)
                                .map((_, i) => i)
                                .slice(
                                    chunk <= 3 
                                        ? 0 
                                        : (
                                            chunk >= chunks - 4
                                            ? chunks - 7 
                                            : chunk - 4
                                        )
                                )
                                .slice(0, 7)
                                .map((i) => (
                                    <div 
                                        className={`${paginationStyles['dot']} ${i == chunk ? paginationStyles['selected'] : ''}`} 
                                        key={i}
                                        onClick={() => {
                                            if(i != chunk) {
                                                // @ts-ignore
                                                window.toChunk(i);
                                            };
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                ))
                            }
                            <div 
                                className={`${paginationStyles['dot']} ${chunks - 1 == chunk ? paginationStyles['selected'] : ''}`}
                                onClick={() => {
                                        if(chunks - 1 != chunk) {
                                            // @ts-ignore
                                            window.toChunk(chunks - 1);
                                        }
                                    }}
                            >
                                <i className="far fa-angle-right"></i>
                            </div>
                        </div>
                    )}
                </div>

                <Script
                    src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js'
                    onLoad={() => {
                        console.log(guildId);
                        const { setState } = this;
                        const _f = Object.fromEntries([...(new URLSearchParams(location.search).entries() || [])  as [string, string][]]);
                        const __f = decode(_f.filters || '') as IFilters;

                        this.setState({
                            id: _f.id || null,
                            chunk: (Number(_f.page) || Number(_f.chunk) || 1) - 1,
                            filters: {
                                type: __f.type || _f.type || null,
                                authorId: __f.authorId || _f.authorId || null,
                                userId: __f.userId || _f.userId || null,
                            }
                        })

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

                            const state = this.state as IState;

                            api.emit('getGuildLogs' , {
                                guildId,
                                data: {
                                    chunk: state.chunk,
                                    limit: state.limit,
                                    id: state.id,
                                    filters: encode(state.filters as { [key: string]: any }),
                                } as IGetLogsData,
                            })
                        });

                        api.on('getGuildLogs', ({ data }) => {
                            this.setState({
                                ...data,
                            });
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

                        // @ts-ignore
                        window.toChunk = (chunk) => {
                            console.log(chunk);
                            this.setState({
                                chunk,
                                logs: []
                            });

                            const state = this.state as IState;
                            console.log(state)

                            api.emit('getGuildLogs' , {
                                guildId,
                                data: {
                                    chunk,
                                    limit: state.limit,
                                    id: state.id,
                                    filters: encode(state.filters as { [key: string]: any }),
                                } as IGetLogsData,
                            })
                        }
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