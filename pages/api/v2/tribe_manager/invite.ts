import { NextApiRequest, NextApiResponse } from 'next';
import { env, off } from 'process';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from "@/lib/auth/session";
import playerdata from '../playerdata';
import w_player_data from '../../ark/w_player_data';

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: env.MYSQL_HOST,
        port: env.MYSQL_PORT,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
        supportBigNumbers: true,
        bigNumberStrings: true,
    }
});

async function handler(req: NextApiRequest, res: NextApiResponse) {

    let user = req.session.user;
    let { steamid } = req.query;
    if (!user) {
        return res
            .status(200)
            .json({ message: "User is not logged in!", success: false });
    }

    const player_data = await knex.table('player_data')
    .select('player_data.steamid AS SteamID')
    .select('player_data.playername AS PlayerName')
    .select('wtribes_playerdata.TribeID')
    .leftJoin('wtribes_playerdata', 'player_data.steamid', 'wtribes_playerdata.SteamID')
    .where('player_data.steamid', user.userId.toString())
    .first()

    const tribe_data = await knex.table('wtribes_tribedata')
    .select('TribeID')
    .select('OwnerSteamID')
    .select('TribeName')
    .where('wtribes_tribedata.TribeID', player_data.TribeID)
    .first()

    if(!tribe_data) {
        return  res.status(200).json({
            api_version: 2,
            success: false,
            message: 'You have not joined a tribe!'
        })
    }

    const current_user = await knex.table('wtribes_playerdata')
    .innerJoin('player_data', 'wtribes_playerdata.SteamID', 'player_data.steamid')
    .select('wtribes_playerdata.SteamID')
    .select('player_data.playername')
    .select('wtribes_playerdata.isOwnerInTribe AS IsOwnerInTribe')
    .select('wtribes_playerdata.isAdminInTribe AS IsAdminInTribe')
    .where('TribeID', tribe_data?.TribeID)
    .first()

    if(current_user.IsOwnerInTribe === 0 && current_user.IsAdminInTribe === 0) {
        return  res.status(200).json({
            api_version: 2,
            success: false,
            message: 'You are not an admin or owner inside the tribe!'
        })
    }

    const invited_player = await knex.table('player_data')
    .select('player_data.steamid AS SteamID')
    .select('player_data.playername AS PlayerName')
    .select('wtribes_playerdata.TribeID AS TribeID')
    .innerJoin('wtribes_playerdata', 'player_data.steamid', 'wtribes_playerdata.SteamID')
    .where('player_data.steamid', steamid)
    .first()

    //Wait 5 seconds
    await new Promise(r => setTimeout(r, 5000));

    if(invited_player?.TribeID) {
        return res.status(200).json({
            api_version: 2,
            success: false,
            message: 'Player is already in a tribe!'
        })
    }

    const active_invite = await knex.table('active_invites')
    .select('tribeid_requester')
    .select('steamid_requested')
    .where('tribeid_requester', tribe_data.TribeID)
    .where('steamid_requested', invited_player.SteamID)
    .first()

    if(active_invite) {
        return res.status(200).json({
            api_version: 2,
            success: false,
            message: 'Player already has an active invite!'
        })
    }

    
    await knex.table("active_invites").insert({
        tribeid_requester: tribe_data.TribeID,
        steamid_requested: invited_player.SteamID,
    });


    res.status(200).json({
        api_version: 2,
        success: true,
        invited_player: invited_player
    });
}

export default withIronSessionApiRoute(handler, sessionOptions);