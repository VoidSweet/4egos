import React, { useState, useEffect, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../../../styles/GuildDashboard.module.css';
import { IUser } from '../../../../types';

interface IGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    memberCount?: number;
    botPresent?: boolean;
}

interface BrandingSettings {
  botName: string;
  botDescription: string;
  botAvatar: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'dark' | 'light' | 'auto';
  customLogo: string | null;
  embedColor: string;
  buttonStyle: 'primary' | 'secondary' | 'success' | 'danger';
  enableCustomBranding: boolean;
}

interface IProps {
    user: IUser;
    guild: IGuild;
}

export default function BrandingPage({ user, guild }: IProps) {
  const router = useRouter();
  const { guild: guildId } = router.query;
  
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [branding, setBranding] = useState<BrandingSettings>({
    botName: 'AegisBot',
    botDescription: 'Your powerful Discord management bot',
    botAvatar: null,
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    theme: 'dark',
    customLogo: null,
    embedColor: '#1e40af',
    buttonStyle: 'primary',
    enableCustomBranding: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const fetchBrandingSettings = useCallback(async () => {
    try {
      const response = await fetch(`/api/bot/${guildId}/branding`);
      if (response.ok) {
        const data = await response.json();
        setBranding(data);
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
    }
  }, [guildId]);

  useEffect(() => {
    if (guildId) {
      fetchBrandingSettings();
    }
  }, [guildId, fetchBrandingSettings]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bot/${guildId}/branding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branding),
      });

      if (response.ok) {
        alert('Branding settings saved successfully!');
      } else {
        alert('Error saving branding settings');
      }
    } catch (error) {
      console.error('Error saving branding:', error);
      alert('Error saving branding settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BrandingSettings, value: any) => {
    setBranding(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file: File, type: 'avatar' | 'logo') => {
    if (type === 'avatar') setUploadingAvatar(true);
    if (type === 'logo') setUploadingLogo(true);

    try {
      // Mock file upload - in real implementation, upload to CDN/cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (type === 'avatar') {
          handleInputChange('botAvatar', dataUrl);
        } else {
          handleInputChange('customLogo', dataUrl);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      if (type === 'avatar') setUploadingAvatar(false);
      if (type === 'logo') setUploadingLogo(false);
    }
  };

  const applyPreviewStyles = () => {
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--luny-colors-band-100', branding.primaryColor);
      root.style.setProperty('--luny-colors-band-60', branding.secondaryColor);
      root.style.setProperty('--luny-colors-band-20', branding.accentColor);
    }
  };

  useEffect(() => {
    applyPreviewStyles();
  }, [branding, previewMode]);

  const getGuildIconUrl = () => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
    }
    return '/images/default_server_icon.svg';
  };

  const getUserAvatarUrl = () => {
    if (user.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
    }
    return '/images/default_avatar.svg';
  };

  return (
    <>
      <Head>
        <title>Custom Branding - {guild.name} - Aegis</title>
        <meta name="description" content={`Custom branding settings for ${guild.name}`} />
      </Head>

      <div className={styles.guildDashboard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.brand}>
              🛡️ <span>Aegis</span>
            </Link>
            
            <div className={styles.guildSelector}>
              <img 
                src={getGuildIconUrl()} 
                alt={guild.name}
                className={styles.guildIcon}
              />
              <span className={styles.guildName}>{guild.name}</span>
              <Link href="/dashboard" className={styles.changeGuild}>
                <i className="fas fa-exchange-alt"></i>
              </Link>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <img 
                src={getUserAvatarUrl()} 
                alt={user.username}
                className={styles.userAvatar}
              />
              <span className={styles.username}>
                {user.username}
                {user.discriminator !== '0' && `#${user.discriminator}`}
              </span>
              <button 
                className={styles.userDropdownBtn}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <i className="fas fa-chevron-down"></i>
              </button>
              
              {showUserDropdown && (
                <div className={styles.userDropdown}>
                  <Link href="/dashboard/@me" className={styles.dropdownItem}>
                    <i className="fas fa-user"></i>
                    Profile
                  </Link>
                  <Link href="/dashboard/billing" className={styles.dropdownItem}>
                    <i className="fas fa-credit-card"></i>
                    Billing
                  </Link>
                  <Link href="/dashboard" className={styles.dropdownItem}>
                    <i className="fas fa-server"></i>
                    Server Selection
                  </Link>
                  <hr className={styles.dropdownDivider} />
                  <a href="/api/auth/logout" className={styles.dropdownItem}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className={styles.layout}>
          {/* Sidebar */}
          <nav className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarSection}>
                <h4>Server Management</h4>
                <div className={styles.sidebarLinks}>
                  <Link 
                    href={`/dashboard/guilds/${guild.id}/home`}
                    className={styles.sidebarLink}
                  >
                    <i className="fas fa-home"></i>
                    <span>Overview</span>
                  </Link>
                  <Link 
                    href={`/dashboard/guilds/${guild.id}/settings`}
                    className={styles.sidebarLink}
                  >
                    <i className="fas fa-cog"></i>
                    <span>General Settings</span>
                  </Link>
                  <Link 
                    href={`/dashboard/guilds/${guild.id}/branding`}
                    className={`${styles.sidebarLink} ${styles.active}`}
                  >
                    <i className="fas fa-palette"></i>
                    <span>Custom Branding</span>
                  </Link>
                  <Link 
                    href={`/dashboard/guilds/${guild.id}/moderation`}
                    className={styles.sidebarLink}
                  >
                    <i className="fas fa-gavel"></i>
                    <span>Moderation</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className={styles.main}>
          <div className={styles.pageHeader}>
            <h1>
              <i className="fas fa-palette"></i>
              Custom Branding
            </h1>
            <p>Customize your bot's appearance and branding across the server</p>
            <div className={styles.headerActions}>
              <button
                className={`${styles.button} ${previewMode ? styles.buttonSecondary : styles.buttonPrimary}`}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Exit Preview' : 'Preview Changes'}
              </button>
              <button
                className={styles.button}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          <div className={styles.settingsForm}>
            {/* Basic Information */}
            <div className={styles.settingsSection}>
              <h3>Bot Information</h3>
              
              <div className={styles.formGroup}>
                <label>Enable Custom Branding</label>
                <div className={styles.toggleWrapper}>
                  <input
                    type="checkbox"
                    checked={branding.enableCustomBranding}
                    onChange={(e) => handleInputChange('enableCustomBranding', e.target.checked)}
                    className={styles.toggle}
                  />
                  <span>Allow custom branding for this server</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="botName">Bot Display Name</label>
                <input
                  id="botName"
                  type="text"
                  value={branding.botName}
                  onChange={(e) => handleInputChange('botName', e.target.value)}
                  className={styles.input}
                  placeholder="AegisBot"
                  disabled={!branding.enableCustomBranding}
                />
                <span className={styles.helpText}>This name will appear in embeds and messages (2-32 characters)</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="botDescription">Bot Description</label>
                <textarea
                  id="botDescription"
                  value={branding.botDescription}
                  onChange={(e) => handleInputChange('botDescription', e.target.value)}
                  className={styles.textarea}
                  placeholder="Your powerful Discord management bot"
                  rows={3}
                  disabled={!branding.enableCustomBranding}
                />
                <span className={styles.helpText}>Description shown in bot info and help commands</span>
              </div>
            </div>

            {/* Visual Customization */}
            <div className={styles.settingsSection}>
              <h3>Visual Elements</h3>
              
              <div className={styles.formGroup}>
                <label>Bot Avatar</label>
                <div className={styles.fileUpload}>
                  {branding.botAvatar && (
                    <div className={styles.previewImage}>
                      <img src={branding.botAvatar} alt="Bot Avatar" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'avatar');
                    }}
                    className={styles.fileInput}
                    disabled={!branding.enableCustomBranding || uploadingAvatar}
                  />
                  <div className={styles.fileUploadText}>
                    {uploadingAvatar ? 'Uploading...' : 'Choose avatar image'}
                  </div>
                </div>
                <span className={styles.helpText}>Custom avatar for bot in this server (512x512px recommended)</span>
              </div>

              <div className={styles.formGroup}>
                <label>Custom Logo</label>
                <div className={styles.fileUpload}>
                  {branding.customLogo && (
                    <div className={styles.previewImage}>
                      <img src={branding.customLogo} alt="Custom Logo" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'logo');
                    }}
                    className={styles.fileInput}
                    disabled={!branding.enableCustomBranding || uploadingLogo}
                  />
                  <div className={styles.fileUploadText}>
                    {uploadingLogo ? 'Uploading...' : 'Choose logo image'}
                  </div>
                </div>
                <span className={styles.helpText}>Logo shown in dashboard and embeds</span>
              </div>
            </div>

            {/* Color Scheme */}
            <div className={styles.settingsSection}>
              <h3>Color Scheme</h3>
              
              <div className={styles.colorGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="primaryColor">Primary Color</label>
                  <div className={styles.colorInputWrapper}>
                    <input
                      id="primaryColor"
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className={styles.colorInput}
                      disabled={!branding.enableCustomBranding}
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      placeholder="#1e40af"
                      disabled={!branding.enableCustomBranding}
                    />
                  </div>
                  <span className={styles.helpText}>Main brand color used throughout the interface</span>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="secondaryColor">Secondary Color</label>
                  <div className={styles.colorInputWrapper}>
                    <input
                      id="secondaryColor"
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className={styles.colorInput}
                      disabled={!branding.enableCustomBranding}
                    />
                    <input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      placeholder="#3b82f6"
                      disabled={!branding.enableCustomBranding}
                    />
                  </div>
                  <span className={styles.helpText}>Secondary brand color for highlights</span>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="accentColor">Accent Color</label>
                  <div className={styles.colorInputWrapper}>
                    <input
                      id="accentColor"
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className={styles.colorInput}
                      disabled={!branding.enableCustomBranding}
                    />
                    <input
                      type="text"
                      value={branding.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      placeholder="#60a5fa"
                      disabled={!branding.enableCustomBranding}
                    />
                  </div>
                  <span className={styles.helpText}>Accent color for interactive elements</span>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="embedColor">Embed Color</label>
                  <div className={styles.colorInputWrapper}>
                    <input
                      id="embedColor"
                      type="color"
                      value={branding.embedColor}
                      onChange={(e) => handleInputChange('embedColor', e.target.value)}
                      className={styles.colorInput}
                      disabled={!branding.enableCustomBranding}
                    />
                    <input
                      type="text"
                      value={branding.embedColor}
                      onChange={(e) => handleInputChange('embedColor', e.target.value)}
                      placeholder="#1e40af"
                      disabled={!branding.enableCustomBranding}
                    />
                  </div>
                  <span className={styles.helpText}>Color for Discord embeds and rich messages</span>
                </div>
              </div>
            </div>

            {/* Style Options */}
            <div className={styles.settingsSection}>
              <h3>Style Options</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="theme">Theme Preference</label>
                <select
                  id="theme"
                  value={branding.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  disabled={!branding.enableCustomBranding}
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                  <option value="auto">Auto (Follow System)</option>
                </select>
                <span className={styles.helpText}>Default theme for dashboard and bot interfaces</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="buttonStyle">Button Style</label>
                <select
                  id="buttonStyle"
                  value={branding.buttonStyle}
                  onChange={(e) => handleInputChange('buttonStyle', e.target.value)}
                  disabled={!branding.enableCustomBranding}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="success">Success</option>
                  <option value="danger">Danger</option>
                </select>
                <span className={styles.helpText}>Default style for bot interaction buttons</span>
              </div>
            </div>

            {/* Preview Section */}
            {previewMode && (
              <div className={styles.settingsSection}>
                <h3>Preview</h3>
                <div className={styles.previewCard} style={{
                  borderColor: branding.primaryColor,
                  background: `linear-gradient(135deg, ${branding.primaryColor}10, ${branding.secondaryColor}10)`
                }}>
                  <div className={styles.previewHeader}>
                    {branding.customLogo && (
                      <img src={branding.customLogo} alt="Logo" className={styles.previewLogo} />
                    )}
                    {branding.botAvatar && (
                      <img src={branding.botAvatar} alt="Avatar" className={styles.previewAvatar} />
                    )}
                    <div>
                      <h4 style={{ color: branding.primaryColor }}>{branding.botName}</h4>
                      <p>{branding.botDescription}</p>
                    </div>
                  </div>
                  <div className={styles.previewContent}>
                    <button style={{ 
                      backgroundColor: branding.primaryColor,
                      borderColor: branding.primaryColor 
                    }}>
                      Primary Button
                    </button>
                    <button style={{ 
                      backgroundColor: branding.secondaryColor,
                      borderColor: branding.secondaryColor 
                    }}>
                      Secondary Button
                    </button>
                    <div className={styles.previewEmbed} style={{ borderLeftColor: branding.embedColor }}>
                      <strong>Sample Embed</strong>
                      <p>This is how embeds will look with your custom colors</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  
  if (!cookies.token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    // Fetch user data
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${cookies.token}`
      }
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const user = await userResponse.json();
    
    // Get guild data from query
    const guildId = context.query.guild as string;
    
    // Mock guild data for now - in real implementation, fetch from Discord API
    const guild = {
      id: guildId,
      name: 'Sample Server',
      icon: null,
      owner: true,
      permissions: '8',
      memberCount: 150,
      botPresent: true
    };

    return {
      props: {
        user,
        guild,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
