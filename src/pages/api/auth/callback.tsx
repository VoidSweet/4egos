import { NextApiRequest, NextApiResponse} from 'next'
import nookies from 'nookies';
import { getState, deleteState } from '../../../utils/states'
import config from '../../../config';

export default async function APIAuthCallback(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string;

    if(!code) {
        if(req.query.error) {
            const error = req.query.error as string;
            // const errorDescription = req.query.error_description as string;
            if(error === 'access_denied') return res.redirect('/');
        }
        return res.send('No code');
    }

    console.log(config.discord.redirectUri)

    const data = new FormData();
    data.append("client_id", config.discord.clientId)
    data.append("client_secret", config.discord.clientSecret)
    data.append("grant_type", "authorization_code")
    data.append("redirect_uri", config.discord.redirectUri)
    data.append("scopes", "identify guilds")
    data.append("code", code)

    const token: any = await fetch("https://discordapp.com/api/oauth2/token", {
      method: 'POST',
      body: data
    }).then(x => x.json())

    if(!token.access_token) return res.send('No access token');

    nookies.set({ res }, '__SessionLuny', token.access_token, {
        maxAge: 5 * 60 * 60, // 5 hours
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        path: '/',
    });
    
    const guildId = req.query.guild_id as string;
    const state = req.query.state as string;

    if(guildId) {
        return res.redirect(`/dashboard/guilds/${guildId}`);
    } else if(state) {
        res.redirect(state)
    } else res.redirect('/dashboard/@me');
}