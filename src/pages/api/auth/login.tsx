import generateOAuth2 from "../../../utils/generateOAuth2";
import { setCookie, parseCookies } from 'nookies';
import config from '../../../config';

export default (req, res) => {
    // Check if user is already authenticated
    const { ['__SessionLuny']: existingToken } = parseCookies({ req });
    
    if (existingToken) {
        // User is already authenticated, redirect to dashboard or state
        const redirectTo = req.query.state || '/dashboard';
        return res.redirect(redirectTo);
    }

    if(req.query.dt == "true") {
        setCookie({ res }, '__SessionLuny', '', {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            path: '/',
        });
    };

    const url = generateOAuth2({
        clientId: config.discord.clientId,
        redirect_uri: config.discord.redirectUri,
        scopes: ["identify", "guilds"],
        state: req.query.state || null,
        prompt: "none" // This prevents Discord from showing login if already logged in
    });

    res.redirect(url);
}