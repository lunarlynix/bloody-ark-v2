import { Prisma, PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';

/* New Beta Feature */
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : env.MYSQL_HOST,
    port : env.MYSQL_PORT,
    user : env.MYSQL_USER,
    password : env.MYSQL_PASSWORD,
    database : env.MYSQL_DATABASE
  }
});


const prisma = new PrismaClient()

type Data = {
  pagination: any,
  ranking_data: any
}

type CurrentPage = string;
type Search = any;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  //const search = req.query.search ? req.query.search : ""
  const filter = req.query.filter ? req.query.filter : ""

  let search = req.query.search ? "%" + req.query.search + "%" : "%%";
  

  let safeFilter = "DamageScore"
  switch(filter) {
    case "Time Played":
      safeFilter = "PlayTime"
      break;
    case "Kills":
      safeFilter = "Kills"
      break;
    case "Deaths":
      safeFilter = "Deaths"
      break;
    case "Tame Kills":
      safeFilter = "DinoKills"
      break;
  }

  const current_page = Number(req.query?.page ? req.query?.page : 0);

  const ranking_data = await knex.table('advancedachievements_playerdata')
  .select('advancedachievements_playerdata.TribeID', 'advancedachievements_tribedata.TribeName', 'advancedachievements_tribedata.DamageScore')
  .innerJoin('advancedachievements_tribedata', 'advancedachievements_playerdata.TribeID', 'advancedachievements_tribedata.TribeID')
  .sum('PlayerKills as Kills')
  .sum('DeathByPlayer as Deaths')
  .sum('DinoKills as DinoKills')
  .sum('PlayTime as PlayTime')
  .whereLike('advancedachievements_tribedata.TribeName', `%${search}%`)
  .groupBy('advancedachievements_playerdata.TribeID')
  .orderBy(safeFilter, 'desc')
  .limit(20)
  .offset(20 * current_page)

  const safe_ranking_data = JSON.parse(JSON.stringify(ranking_data, (key, value) =>
  typeof value === 'bigint'
      ? value.toString()
      : value // return everything else unchanged
  ));

  const pages = await prisma.advancedachievements_tribedata.count({});

  res.status(200).json({
    pagination: {
      total_pages: Math.round(pages / 20),
      current_page: current_page,
    },
    ranking_data: safe_ranking_data
  });
}
