import { z } from "zod";
import { validate } from "../../../middlewares/validation";

const searchQuerySchema = z.object({ q: z.string().min(2).max(100) });

export default {
  routes: [
    {
      method: "GET",
      path: "/search",
      handler: "search.search",
      config: {
        auth: false,
        middlewares: [validate({ query: searchQuerySchema })],
      },
    },
  ],
};
