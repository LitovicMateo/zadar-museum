export default ({ env }) => [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: env(
        "CORS_ORIGINS",
        "http://localhost:5174,http://localhost:5173,https://ovdjejekosarka.sve,https://ovdjejekosarkasve.com"
      )
        .split(",")
        .map((s) => s.trim()),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
      headers: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
      keepHeadersOnError: true,
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
