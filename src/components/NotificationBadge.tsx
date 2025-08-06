import React from 'react';
import styles from '../styles/NotificationBadge.module.css';

interface NotificationBadgeProps {
  count: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
  className?: string;
}

export default function NotificationBadge({ 
  count, 
  severity = 'medium', 
  size = 'medium',
  showZero = false,
  className = ''
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const badgeClasses = [
    styles.badge,
    styles[`badge--${severity}`],
    styles[`badge--${size}`],
    className
  ].filter(Boolean).join(' ');

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <span className={badgeClasses} title={`${count} notification${count !== 1 ? 's' : ''}`}>
      {displayCount}
    </span>
  );
}
