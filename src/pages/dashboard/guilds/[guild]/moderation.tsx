import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/DashboardLayout.module.css';

interface ModerationProps {
  guildId: string;
}

export default function Moderation({ guildId }: ModerationProps) {
  const [moderationChannel, setModerationChannel] = useState('');
  const [punishmentChannel, setPunishmentChannel] = useState('');
  const [mandatoryReason, setMandatoryReason] = useState(false);
  const [autoModeration, setAutoModeration] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Moderation Settings</h1>
        
        <div className={styles.section}>
          <h2>Moderation Logs Channel</h2>
          <select 
            className={styles.select}
            value={moderationChannel}
            onChange={(e) => setModerationChannel(e.target.value)}
          >
            <option value="">Select Channel</option>
            <option value="general">general</option>
            <option value="mod-logs">mod-logs</option>
          </select>
          <p className={styles.description}>
            Channel where moderation logs will be sent.
            <br />
            <code style={{color: "var(--success-color)"}}>+ Shows author, user, reason, id and link to punishment log</code>
          </p>
        </div>

        <div className={styles.section}>
          <h2>Punishment Channel</h2>
          <select 
            className={styles.select}
            value={punishmentChannel}
            onChange={(e) => setPunishmentChannel(e.target.value)}
          >
            <option value="">Select Channel</option>
            <option value="general">general</option>
            <option value="punishments">punishments</option>
          </select>
          <p className={styles.description}>
            Channel where punishment messages will be sent.
            <br />
            <code style={{color: "var(--success-color)"}}>+ Customization possible (BETA)</code>
          </p>
        </div>

        <div className={styles.section}>
          <h2>Moderation Options</h2>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={mandatoryReason}
              onChange={(e) => setMandatoryReason(e.target.checked)}
            />
            <strong>Require reason for punishments</strong>
          </label>
          <p className={styles.description}>
            Make it mandatory to provide a reason when applying punishments.
            This only applies to users without the "Punish without reason" permission.
          </p>
        </div>

        <div className={styles.section}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={autoModeration}
              onChange={(e) => setAutoModeration(e.target.checked)}
            />
            <strong>Enable Auto-Moderation</strong>
          </label>
          <p className={styles.description}>
            Automatically moderate messages based on configured rules.
          </p>
        </div>

        <button className={styles.saveButton}>
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { guild } = context.params!;
  
  return {
    props: {
      guildId: guild as string,
    },
  };
};
                            /><label style={{marginLeft: '1%', fontSize: '18px'}}><strong>Eventos de banimento não feitos através da Lunar</strong></label></p>
                            <p>Registrar no canal de modlogs e punições quando um banimento for aplicado e não tenha sido feito pela Lunar.<br />Para mostrar o motivo e o autor, você precisa dar ao bot permissão de <code>Ver registro de autoria</code>.</p>
                        </CheckRadio>
                    </div>
                </div>

                <Script
                    src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js'
                    onLoad={() => {
                        const buttonSave = $('#save-button');
                        const sendingClass = styles['sending'];

                        const api = socket(hostApi, {
                            query: {
                                token,
                                guildId,
                            },
                        });

                        api.on('ready', ({ data }) => {
                            console.log(data)
                            this.setState({
                                user: data.user,
                                guild: data.guild,
                                loading: false,
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

                        api.on('updateGuildSettings', ({ data }) => {
                            this.setState({
                                guild: Object.assign((this.state as IState).guild as IGuildSuper, data),
                            });

                            setTimeout(() => {
                                buttonSave.removeClass(sendingClass);
                            }, 1000);
                        })

                        buttonSave.click(async function() {
                            if(!buttonSave.hasClass(sendingClass)) {
                                buttonSave.addClass(sendingClass);
                                
                                const json = saveJSON();

                                console.log(json)

                                api.emit('updateGuildSettings', {
                                    data: {
                                        updateType: 'moderation',
                                        settingsData: { ...json } 
                                    }
                                });
                            };
                        });

                        function saveJSON() {
                            const json = { configs: 0 }

                            $('[data-send-on-save]').map(function() {
                                const a = $(this);
                                const id = a.attr('id');
                                const type = a.attr('data-type');
                                const value = a.attr('data-value');
                                
                                if(type == 'select') {
                                    json[`${id}`.replace('w-select-', '')] = value == "none" ?  null : value;
                                };
                                
                                if(type == 'bitfield') {
                                    if(a.is(':checked')) {
                                        json.configs |= parseInt(value);
                                    }
                                };
                            });

                            return json;
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
            guildId: ctx.query.guild || null,
        },
    };
}