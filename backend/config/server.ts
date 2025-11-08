export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  url: env("PUBLIC_URL", "https://ovdjejekosarkasve.com"), // <-- change to your HTTPS domain
  proxy: true, // <-- important when behind Nginx reverse proxy
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
  admin: {
    url: env("ADMIN_URL", "/admin"),
    serveAdminPanel: true,
  },
});
