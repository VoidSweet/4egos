import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import styles from '../../../../styles/guild.module.css';

interface IUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

interface ILog {
  id: string;
  type: number;
  user: IUser;
  author: IUser;
  reason: string;
  date: string;
}

interface IFilters {
  userId: string | null;
  authorId: string | null;
  type: number | string | null;
}

interface IProps {
  guildId: string;
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
    name: 'Warning',
    color: '#eaac35'
  }
};

const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';

export default function GuildModlogs({ guildId }: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ILog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ILog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<IFilters>({
    userId: null,
    authorId: null,
    type: null,
  });

  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: logsPerPage.toString(),
          ...(filters.userId && { userId: filters.userId }),
          ...(filters.authorId && { authorId: filters.authorId }),
          ...(filters.type && { type: filters.type.toString() }),
        });

        const response = await fetch(`/api/guilds/${guildId}/modlogs?${params}`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
          setTotalPages(Math.ceil(data.total / logsPerPage));
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch moderation logs:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (guildId) {
      fetchLogs();
    }
  }, [guildId, currentPage, filters, router]);

  const handleFilterChange = (key: keyof IFilters, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <DashboardLayout guildId={guildId}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading moderation logs...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout guildId={guildId}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Moderation Logs</h1>
          <p>View and filter server moderation actions</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="user-filter">Filter by User ID:</label>
            <input
              id="user-filter"
              type="text"
              placeholder="Enter user ID..."
              value={filters.userId || ''}
              onChange={(e) => handleFilterChange('userId', e.target.value || null)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="author-filter">Filter by Moderator ID:</label>
            <input
              id="author-filter"
              type="text"
              placeholder="Enter moderator ID..."
              value={filters.authorId || ''}
              onChange={(e) => handleFilterChange('authorId', e.target.value || null)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="type-filter">Filter by Action:</label>
            <select
              id="type-filter"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || null)}
              className={styles.filterSelect}
            >
              <option value="">All Actions</option>
              <option value="1">Ban</option>
              <option value="2">Kick</option>
              <option value="3">Mute</option>
              <option value="4">Warning</option>
            </select>
          </div>
        </div>

        <div className={styles.logsTable}>
          {logs.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Moderator</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const punishment = punishments[log.type.toString()];
                  return (
                    <tr key={log.id}>
                      <td className={styles.userCell}>
                        <div className={styles.userInfo}>
                          <Image
                            src={log.user.avatar 
                              ? `https://cdn.discordapp.com/avatars/${log.user.id}/${log.user.avatar}.png`
                              : defaultAvatar
                            }
                            alt={`${log.user.username} avatar`}
                            width={32}
                            height={32}
                            className={styles.avatar}
                          />
                          <div>
                            <div className={styles.username}>
                              {log.user.username}#{log.user.discriminator}
                            </div>
                            <div className={styles.userId}>{log.user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{log.author.username}#{log.author.discriminator}</td>
                      <td>
                        <span 
                          className={styles.punishmentBadge}
                          style={{ backgroundColor: punishment?.color || '#666' }}
                        >
                          {punishment?.name || 'Unknown'}
                        </span>
                      </td>
                      <td>{formatDate(log.date)}</td>
                      <td>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className={styles.viewButton}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <h3>No moderation logs found</h3>
              <p>No moderation actions match your current filters.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}

        {selectedLog && (
          <div className={styles.modal} onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedLog(null);
            }
          }}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>Moderation Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.logDetail}>
                  <h4>User:</h4>
                  <div className={styles.userInfo}>
                    <Image
                      src={selectedLog.user.avatar 
                        ? `https://cdn.discordapp.com/avatars/${selectedLog.user.id}/${selectedLog.user.avatar}.png`
                        : defaultAvatar
                      }
                      alt={`${selectedLog.user.username} avatar`}
                      width={48}
                      height={48}
                      className={styles.avatar}
                    />
                    <div>
                      <div>{selectedLog.user.username}#{selectedLog.user.discriminator}</div>
                      <div className={styles.userId}>{selectedLog.user.id}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.logDetail}>
                  <h4>Moderator:</h4>
                  <p>{selectedLog.author.username}#{selectedLog.author.discriminator}</p>
                </div>

                <div className={styles.logDetail}>
                  <h4>Action:</h4>
                  <span 
                    className={styles.punishmentBadge}
                    style={{ backgroundColor: punishments[selectedLog.type.toString()]?.color || '#666' }}
                  >
                    {punishments[selectedLog.type.toString()]?.name || 'Unknown'}
                  </span>
                </div>

                <div className={styles.logDetail}>
                  <h4>Date:</h4>
                  <p>{formatDate(selectedLog.date)}</p>
                </div>

                <div className={styles.logDetail}>
                  <h4>Reason:</h4>
                  <p>{selectedLog.reason || 'No reason provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { guild } = context.params || {};
  
  return {
    props: {
      guildId: guild as string,
    },
  };
};