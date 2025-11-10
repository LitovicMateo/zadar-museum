CREATE MATERIALIZED VIEW public.zadar_player_career_high AS
 
 WITH player_games AS (
         SELECT ps.id,
            g.document_id AS game_id,
            g.date AS game_date,
            p.document_id AS player_id,
            t.slug AS team_slug,
                CASE
                    WHEN tlnk.team_id = htlnk.team_id THEN at.name
                    ELSE ht.name
                END AS opponent_team_name,
                CASE
                    WHEN tlnk.team_id = htlnk.team_id THEN at.slug
                    ELSE ht.slug
                END AS opponent_team_slug,
            ps.points,
            ps.rebounds,
            ps.assists,
            ps.steals,
            ps.blocks,
            ps.field_goals_made,
            ps.three_pointers_made,
            ps.free_throws_made,
            ps.efficiency
           FROM player_stats ps
             JOIN player_stats_game_lnk glnk ON ps.id = glnk.player_stat_id
             JOIN player_stats_player_lnk plnk ON ps.id = plnk.player_stat_id
             JOIN player_stats_team_lnk tlnk ON ps.id = tlnk.player_stat_id
             JOIN games g ON g.id = glnk.game_id
             JOIN games_home_team_lnk htlnk ON htlnk.game_id = g.id
             JOIN games_away_team_lnk atlnk ON atlnk.game_id = g.id
             JOIN players p ON plnk.player_id = p.id
             JOIN teams ht ON htlnk.team_id = ht.id
             JOIN teams at ON atlnk.team_id = at.id
             JOIN teams t ON tlnk.team_id = t.id
          WHERE t.slug::text = 'kk-zadar'::text AND ps.status::text <> 'dnp-cd'::text
        ), ranked_points AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.points DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_rebounds AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.rebounds DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_assists AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.assists DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_steals AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.steals DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_blocks AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.blocks DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_fg AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.field_goals_made DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_tp AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.three_pointers_made DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_ft AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.free_throws_made DESC, player_games.game_date) AS rn
           FROM player_games
        ), ranked_eff AS (
         
         SELECT player_games.id,
            player_games.game_id,
            player_games.game_date,
            player_games.player_id,
            player_games.team_slug,
            player_games.opponent_team_name,
            player_games.opponent_team_slug,
            player_games.points,
            player_games.rebounds,
            player_games.assists,
            player_games.steals,
            player_games.blocks,
            player_games.field_goals_made,
            player_games.three_pointers_made,
            player_games.free_throws_made,
            player_games.efficiency,
            row_number() OVER (PARTITION BY player_games.player_id ORDER BY player_games.efficiency DESC, player_games.game_date) AS rn
           FROM player_games
        )
 
 SELECT ranked_points.player_id,
    'points'::text AS category,
    ranked_points.points AS stat_value,
    ranked_points.game_id,
    ranked_points.opponent_team_name,
    ranked_points.opponent_team_slug,
    ranked_points.game_date
   FROM ranked_points
  WHERE ranked_points.rn = 1
UNION ALL
 
 SELECT ranked_rebounds.player_id,
    'rebounds'::text AS category,
    ranked_rebounds.rebounds AS stat_value,
    ranked_rebounds.game_id,
    ranked_rebounds.opponent_team_name,
    ranked_rebounds.opponent_team_slug,
    ranked_rebounds.game_date
   FROM ranked_rebounds
  WHERE ranked_rebounds.rn = 1
UNION ALL
 
 SELECT ranked_assists.player_id,
    'assists'::text AS category,
    ranked_assists.assists AS stat_value,
    ranked_assists.game_id,
    ranked_assists.opponent_team_name,
    ranked_assists.opponent_team_slug,
    ranked_assists.game_date
   FROM ranked_assists
  WHERE ranked_assists.rn = 1
UNION ALL
 
 SELECT ranked_steals.player_id,
    'steals'::text AS category,
    ranked_steals.steals AS stat_value,
    ranked_steals.game_id,
    ranked_steals.opponent_team_name,
    ranked_steals.opponent_team_slug,
    ranked_steals.game_date
   FROM ranked_steals
  WHERE ranked_steals.rn = 1
UNION ALL
 
 SELECT ranked_blocks.player_id,
    'blocks'::text AS category,
    ranked_blocks.blocks AS stat_value,
    ranked_blocks.game_id,
    ranked_blocks.opponent_team_name,
    ranked_blocks.opponent_team_slug,
    ranked_blocks.game_date
   FROM ranked_blocks
  WHERE ranked_blocks.rn = 1
UNION ALL
 
 SELECT ranked_fg.player_id,
    'field_goals_made'::text AS category,
    ranked_fg.field_goals_made AS stat_value,
    ranked_fg.game_id,
    ranked_fg.opponent_team_name,
    ranked_fg.opponent_team_slug,
    ranked_fg.game_date
   FROM ranked_fg
  WHERE ranked_fg.rn = 1
UNION ALL
 
 SELECT ranked_tp.player_id,
    'three_pointers_made'::text AS category,
    ranked_tp.three_pointers_made AS stat_value,
    ranked_tp.game_id,
    ranked_tp.opponent_team_name,
    ranked_tp.opponent_team_slug,
    ranked_tp.game_date
   FROM ranked_tp
  WHERE ranked_tp.rn = 1
UNION ALL
 
 SELECT ranked_ft.player_id,
    'free_throws_made'::text AS category,
    ranked_ft.free_throws_made AS stat_value,
    ranked_ft.game_id,
    ranked_ft.opponent_team_name,
    ranked_ft.opponent_team_slug,
    ranked_ft.game_date
   FROM ranked_ft
  WHERE ranked_ft.rn = 1
UNION ALL
 
 SELECT ranked_eff.player_id,
    'efficiency'::text AS category,
    ranked_eff.efficiency AS stat_value,
    ranked_eff.game_id,
    ranked_eff.opponent_team_name,
    ranked_eff.opponent_team_slug,
    ranked_eff.game_date
   FROM ranked_eff
  WHERE ranked_eff.rn = 1;