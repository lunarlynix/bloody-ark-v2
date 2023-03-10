import { Prisma, PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient()

type Data = {
  pagination: any,
  ranking_data: any
}

type CurrentPage = string;
type Search = any;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  //const search = req.query.search ? req.query.search : ""


  const current_page: number = (Number(req.query.page) ? Number(req.query.page) : 0);
  const pages = await prisma.advancedachievements_tribedata.count({});
  var next_page = null;
  var prev_page = null;

  let search = req.query.search ? "%" + req.query.search + "%" : "%%";
  const ranking_data =  await prisma.$queryRaw(Prisma.sql`
  SELECT 
  arkeuna.advancedachievements_playerdata.TribeID, 
  arkeuna.advancedachievements_tribedata.TribeName,
  arkeuna.advancedachievements_tribedata.DamageScore,
  Count(SteamID) as Members, 
  Sum(PlayerKills) as Kills,
  Sum(DeathByPlayer) as Deaths,
  Sum(DinoKills) as DinoKills,
  Sum(PlayTime) as PlayTime
  FROM arkeuna.advancedachievements_playerdata
  INNER JOIN arkeuna.advancedachievements_tribedata
  ON arkeuna.advancedachievements_playerdata.TribeID = arkeuna.advancedachievements_tribedata.TribeID
  WHERE arkeuna.advancedachievements_tribedata.TribeName LIKE ${search}
  GROUP BY arkeuna.advancedachievements_playerdata.TribeID
  ORDER BY arkeuna.advancedachievements_tribedata.DamageScore DESC
  LIMIT ${current_page * 20},20`)


  const safe_ranking_data = JSON.parse(JSON.stringify(ranking_data, (key, value) =>
  typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ));

  if(current_page < 69) {
    next_page = `https://mesa-ark.com/api/ark/tribe_rankings?page=${current_page}&search=${search}`;
  }

  if(current_page > 0) {
    prev_page = `https://mesa-ark.com/api/ark/tribe_rankings?page=${current_page}&search=${search}`;
  }

  /* Return All Required Data */
  res.status(200).send({
    pagination: {
      total_pages: Math.round(pages / 20) - 1,
      current_page: parseInt(current_page as any),
      next: next_page,
      prev: prev_page
    },
    ranking_data: safe_ranking_data
  });
}
