interface Data {
  id: string;
  table: string;
}

export async function findTeamRecord(data: Data) {
  const { id, table } = data;
  const knex = strapi.db.connection;
  const query = await knex.table(table).select("*").where("coach_id", id);

  if (query.length === 0) {
    return null;
  }

  const coach = query[0];

  return {
    coachId: coach.coach_id,
    firstName: coach.first_name,
    lastName: coach.last_name,
    total: coach.total_record,
    headCoach: coach.head_coach_record,
    assistantCoach: coach.assistant_coach_record,
  };
}
