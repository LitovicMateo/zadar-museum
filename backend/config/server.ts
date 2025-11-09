export default ({ env }) => {
  // Read host/port and env
  const host = env("HOST", "0.0.0.0");
  const port = env.int("PORT", 1337);
  const nodeEnv = env("NODE_ENV", process.env.NODE_ENV || "development");
  const isProduction = nodeEnv === "production";

  // In production we expect PUBLIC_URL to be set. In development, avoid defaulting to the
  // production domain so logs and redirects point to local dev URL (or are left undefined).
  const publicUrlFromEnv = env("PUBLIC_URL", undefined);
  const url = isProduction ? publicUrlFromEnv : publicUrlFromEnv || undefined;

  return {
    host,
    port,
    app: {
      keys: env.array("APP_KEYS"),
    },
    // Only set url from env (production). In dev we prefer leaving it undefined or
    // explicitly setting PUBLIC_URL when needed.
    url,
    // Make proxy configurable; don't assume true in development.
    proxy: env.bool("PROXY", false),
    webhooks: {
      populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
    },
    admin: {
      url: env("ADMIN_URL", "/admin"),
      serveAdminPanel: true,
    },
  };
};
