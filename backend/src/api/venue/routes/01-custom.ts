export default {
  routes: [
    {
      method: "GET",
      path: "/venue/gamelog/:venueSlug/:season",
      handler: "venue.getVenueGamelog",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/venue/team-record/:venueSlug",
      handler: "venue.getVenueTeamRecord",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/team-records",
      handler: "venue.getVenuesTeamRecord",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/seasons/:venueSlug",
      handler: "venue.getVenueSeasons",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/competitions/:season/:venueSlug",
      handler: "venue.getVenueSeasonCompetitions",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/stats/:season/total/:venueSlug",
      handler: "venue.getVenueSeasonStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/stats/league/:venueSlug",
      handler: "venue.getVenueLeagueStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/stats/:season/league/:venueSlug",
      handler: "venue.getVenueSeasonLeagueStats",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/records/players/:venueSlug",
      handler: "venue.getVenuePlayerRecords",
      config: {
        auth: false,
      },
    },

    {
      method: "GET",
      path: "/venue/records/teams/:venueSlug",
      handler: "venue.getVenueTeamRecords",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/venue/:venueSlug",
      handler: "venue.getVenueDetails",
      config: {
        auth: false,
      },
    },
  ],
};
