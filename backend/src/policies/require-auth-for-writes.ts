/**
 * Custom Strapi policy to require authentication for write operations
 * This protects POST, PUT, DELETE routes while keeping GET routes public
 */

export default (policyContext, config, { strapi }) => {
  const { request } = policyContext;
  const method = request.method.toUpperCase();

  // Allow GET requests without authentication (reading data is public)
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  // For POST, PUT, PATCH, DELETE - require authentication
  if (!policyContext.state.user) {
    return false; // Reject if no authenticated user
  }

  return true; // Allow if authenticated
};
