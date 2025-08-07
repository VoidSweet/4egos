import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
  children: ReactNode;
  guildId?: string;
}

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
}

export default function DashboardLayout({ children, guildId }: DashboardLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;
  const [user, setUser] = useState<User | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUser();
  }, []);

  const getUserAvatarUrl = () => {
    if (user?.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
    }
    return 'https://cdn.discordapp.com/embed/avatars/0.png';
  };

  const menuItems = [
    {
      section: 'Overview',
      items: [
        { 
          label: 'Dashboard', 
          icon: '🏠', 
          href: `/dashboard/guilds/${guildId}`,
          active: currentPath === `/dashboard/guilds/[guild]` || currentPath === `/dashboard/guilds/${guildId}`
        },
        { 
          label: 'Analytics', 
          icon: '📊', 
          href: `/dashboard/guilds/${guildId}/analytics`,
          active: currentPath.includes('analytics')
        }
      ]
    },
    {
      section: 'Bot Management',
      items: [
        { 
          label: 'Moderation', 
          icon: '🛡️', 
          href: `/dashboard/guilds/${guildId}/moderation`,
          active: currentPath.includes('moderation')
        },
        { 
          label: 'Economy', 
          icon: '💰', 
          href: `/dashboard/guilds/${guildId}/economy`,
          active: currentPath.includes('economy')
        },
        { 
          label: 'Leveling', 
          icon: '⬆️', 
          href: `/dashboard/guilds/${guildId}/leveling`,
          active: currentPath.includes('leveling')
        },
        { 
          label: 'Games', 
          icon: '🎮', 
          href: `/dashboard/guilds/${guildId}/games`,
          active: currentPath.includes('games')
        }
      ]
    },
    {
      section: 'Server Settings',
      items: [
        { 
          label: 'Security', 
          icon: '🔒', 
          href: `/dashboard/guilds/${guildId}/security`,
          active: currentPath.includes('security')
        },
        { 
          label: 'Permissions', 
          icon: '👥', 
          href: `/dashboard/guilds/${guildId}/permissions`,
          active: currentPath.includes('permissions')
        },
        { 
          label: 'Logging', 
          icon: '📝', 
          href: `/dashboard/guilds/${guildId}/modlogs`,
          active: currentPath.includes('modlogs')
        }
      ]
    },
    {
      section: 'Account',
      items: [
        { 
          label: 'Profile', 
          icon: '👤', 
          href: '/dashboard/@me',
          active: currentPath.includes('@me')
        },
        { 
          label: 'Servers', 
          icon: '🌐', 
          href: '/dashboard/guilds',
          active: currentPath === '/dashboard/guilds'
        },
        { 
          label: 'Billing', 
          icon: '💳', 
          href: '/dashboard/billing',
          active: currentPath.includes('billing')
        },
        { 
          label: 'Diagnostics', 
          icon: '🔧', 
          href: '/dashboard/diagnostics',
          active: currentPath.includes('diagnostics')
        }
      ]
    }
  ];

  return (
    <div className="dark-dashboard">
      <div className="dark-dashboard-container">
        {/* Fixed Left Sidebar */}
        <div className="dark-sidebar">
          <div className="dark-sidebar-header">
            <h2 className="dark-sidebar-title">
              🛡️ AegisBot
            </h2>
            <p className="dark-sidebar-subtitle">Dashboard</p>
          </div>

          {/* Mini Profile in Sidebar */}
          {user && (
            <div className="dark-sidebar-profile">
              <div 
                className="dark-sidebar-profile-content"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <Image 
                  src={getUserAvatarUrl()} 
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="dark-sidebar-profile-avatar"
                />
                <div className="dark-sidebar-profile-info">
                  <span className="dark-sidebar-profile-name">
                    {user.username}
                    {user.discriminator !== '0' && `#${user.discriminator}`}
                  </span>
                  <span className="dark-sidebar-profile-status">Online</span>
                </div>
                <div className="dark-sidebar-profile-dropdown-icon">
                  {showUserDropdown ? '▲' : '▼'}
                </div>
              </div>
              
              {showUserDropdown && (
                <div className="dark-sidebar-profile-dropdown">
                  <Link href="/dashboard/@me" className="dark-sidebar-profile-dropdown-item">
                    👤 Profile
                  </Link>
                  <Link href="/dashboard/billing" className="dark-sidebar-profile-dropdown-item">
                    💳 Billing
                  </Link>
                  <Link href="/invite" className="dark-sidebar-profile-dropdown-item">
                    ➕ Invite Bot
                  </Link>
                  <div className="dark-sidebar-profile-dropdown-divider"></div>
                  <Link href="/api/auth/logout" className="dark-sidebar-profile-dropdown-item logout">
                    🚪 Logout
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <nav className="dark-sidebar-nav">
            {menuItems.map((section, index) => (
              <div key={index} className="dark-sidebar-section">
                <h3 className="dark-sidebar-section-title">{section.section}</h3>
                {section.items.map((item, itemIndex) => (
                  <Link key={itemIndex} href={item.href} className={`dark-sidebar-item ${item.active ? 'active' : ''}`}>
                    <span className="dark-sidebar-item-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="dark-main-content">
          {children}
        </div>
      </div>
    </div>
  );
}
