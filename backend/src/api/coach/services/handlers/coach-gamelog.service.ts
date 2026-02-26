export async function coachGamelogService(
  coachId: string,
  database: "zadar" | "opponent"
) {
  const TABLE = "schedule";

  const knex = strapi.db.connection;
  const table = knex(TABLE);
  const zadarSlug = "kk-zadar";
  const isZadarDb = database === "zadar";    
  
}
