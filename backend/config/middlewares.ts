export default ({ env }) => {
  const allowedOrigins = env(
    "CORS_ORIGINS",
    "http://localhost:5174,http://localhost:5173,http://localhost:1337,http://backend:1337,https://ovdjejekosarkasve.com",
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return [
    "strapi::logger",
    "strapi::errors",
    "strapi::security",
    {
      name: "strapi::cors",
      config: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
        headers: "*",
        credentials: env("CORS_CREDENTIALS", "true") === "true",
        keepHeadersOnError: true,
        exposedHeaders: ["Content-Range", "Content-Length", "Content-Type"],
      },
    },
    "strapi::poweredBy",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];
};
