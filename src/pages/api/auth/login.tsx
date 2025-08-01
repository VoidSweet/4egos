import generateOAuth2 from "../../../utils/generateOAuth2";
import { setCookie } from 'nookies';
import config from '../../../config';

export default (req, res) => {
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
        prompt: "none"
    });

    res.redirect(url);
}