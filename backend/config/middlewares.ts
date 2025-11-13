export default ({ env }) => [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      // read allowed origins from env and respond with the incoming origin when allowed.
      // This avoids returning '*' when credentials are enabled which browsers reject.
      origin: ((ctx) => {
        const allowed = env(
          "CORS_ORIGINS",
          "http://localhost:5174,http://localhost:5173,https://ovdjejekosarkasve.com,https://ovdjejekosarkasve.com"
        )
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const credentialsEnabled = env("CORS_CREDENTIALS", "true") === "true";

        return (requestCtx) => {
          const requestOrigin = requestCtx.get("Origin");
          if (!requestOrigin) return false;

          if (allowed.includes("*")) {
            // if credentials are allowed we must echo request origin back (can't use '*')
            return credentialsEnabled ? requestOrigin : "*";
          }

          if (allowed.includes(requestOrigin)) return requestOrigin;

          return false;
        };
      })(),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
      // include commonly used headers and allow extension via env if needed
      headers: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "X-CSRF-Token",
      ],
      keepHeadersOnError: true,
      credentials: env("CORS_CREDENTIALS", "true") === "true",
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
