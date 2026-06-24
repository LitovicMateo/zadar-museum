import type { Core } from "@strapi/types";

type FactoryArgs = { strapi: Core.Strapi };

const getTableName = (uid: string, strapi: Core.Strapi) =>
  strapi.db.metadata.get(uid as any).tableName;

export default ({ strapi }: FactoryArgs) => ({
  async search(term: string) {
    const knex = strapi.db.connection;
    const pattern = `%${term}%`;

    const playerTable = getTableName("api::player.player", strapi);
    const teamTable = getTableName("api::team.team", strapi);
    const coachTable = getTableName("api::coach.coach", strapi);
    const venueTable = getTableName("api::venue.venue", strapi);
    const refTable = getTableName("api::referee.referee", strapi);
    const compTable = getTableName("api::competition.competition", strapi);

    const [players, teams, coaches, venues, referees, competitions] =
      await Promise.all([
        knex(playerTable)
          .whereRaw(
            "unaccent(first_name || ' ' || last_name) ILIKE unaccent(?)",
            [pattern]
          )
          .whereNotNull("published_at")
          .select("document_id as documentId", "first_name", "last_name")
          .limit(5),

        knex(teamTable)
          .whereRaw("unaccent(name) ILIKE unaccent(?)", [pattern])
          .whereNotNull("published_at")
          .select("document_id as documentId", "name", "slug")
          .limit(5),

        knex(coachTable)
          .whereRaw(
            "unaccent(first_name || ' ' || last_name) ILIKE unaccent(?)",
            [pattern]
          )
          .whereNotNull("published_at")
          .select("document_id as documentId", "first_name", "last_name")
          .limit(5),

        knex(venueTable)
          .whereRaw("unaccent(name) ILIKE unaccent(?)", [pattern])
          .whereNotNull("published_at")
          .select("document_id as documentId", "name", "slug")
          .limit(5),

        knex(refTable)
          .whereRaw(
            "unaccent(first_name || ' ' || last_name) ILIKE unaccent(?)",
            [pattern]
          )
          .whereNotNull("published_at")
          .select("document_id as documentId", "first_name", "last_name")
          .limit(5),

        knex(compTable)
          .whereRaw("unaccent(name) ILIKE unaccent(?)", [pattern])
          .whereNotNull("published_at")
          .select("document_id as documentId", "name", "slug")
          .limit(5),
      ]);

    return { players, teams, coaches, venues, referees, competitions };
  },
});
