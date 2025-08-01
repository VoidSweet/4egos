# 🛡️ AegisBot Dashboard

A comprehensive Discord server management dashboard built with Next.js and TypeScript.

## ✨ Features

- 🔐 **Discord OAuth Authentication** - Secure login with Discord
- 🛡️ **Advanced Security** - Anti-nuke protection and verification systems
- 💰 **Economy System** - Currency management and transactions
- 🎮 **Games & Entertainment** - Interactive gaming features
- 📈 **Leveling System** - XP progression with role rewards
- ⚖️ **Moderation Tools** - Automated moderation and logging
- 🔧 **Server Utilities** - Custom commands and automation
- 📊 **Analytics Dashboard** - Real-time statistics and insights
- 💎 **Premium Features** - Enhanced capabilities for premium users

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Discord Bot Application

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VoidSweet/4egos.git
cd 4egos
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Discord application credentials:
```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://yourdomain.com/api/auth/callback
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

### Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Next.js pages and API routes
├── styles/           # CSS modules and global styles
├── utils/            # Utility functions
├── config/           # Configuration files
└── types.ts          # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## 🔧 Configuration

### Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Add OAuth2 redirect URI: `https://yourdomain.com/api/auth/callback`
4. Copy Client ID and Client Secret to your `.env` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_CLIENT_ID` | Discord application client ID | ✅ |
| `DISCORD_CLIENT_SECRET` | Discord application client secret | ✅ |
| `DISCORD_REDIRECT_URI` | OAuth2 redirect URI | ✅ |
| `NEXTAUTH_URL` | Your application URL | ✅ |
| `NEXTAUTH_SECRET` | Secret for session encryption | ✅ |
| `BOT_TOKEN` | Discord bot token | ⚠️ |
| `DATABASE_URL` | Database connection string | ⚠️ |

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint && npm run type-check`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- Join our [Discord Server](https://discord.gg/your-server)
- Create an [Issue](https://github.com/VoidSweet/4egos/issues)
- Check the [Documentation](https://docs.yourdomain.com)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Discord.js](https://discord.js.org/) - Discord API library
- [Vercel](https://vercel.com/) - Deployment platform
