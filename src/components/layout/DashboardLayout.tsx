import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface DashboardLayoutProps {
  children: ReactNode;
  guildId?: string;
}

export default function DashboardLayout({ children, guildId }: DashboardLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

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
