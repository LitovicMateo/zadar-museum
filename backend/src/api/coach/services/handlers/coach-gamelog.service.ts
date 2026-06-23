import { getMainTeamSlug } from "../../../../lib/mainTeam";

export async function coachGamelogService(
  coachId: string,
  database: "main" | "opponent"
) {
  const TABLE = "schedule";

  const knex = strapi.db.connection;
  const table = knex(TABLE);
  const mainSlug = await getMainTeamSlug();
  const isMainDb = database === "main";

}
