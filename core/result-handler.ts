import { ResultHandler } from "express-zod-api";
import { z } from "zod";
import { appUrl } from "./config";

export const redirectingResultHandler = new ResultHandler({
  positive: { statusCode: 302, schema: z.never() },
  negative: { statusCode: 302, schema: z.never() },
  handler: ({ request, response, error }) => {
    const feed = new URLSearchParams(
      error ? { error: error.message } : { ...request.user },
    );
    response.redirect(`${appUrl}/?${feed}`);
  },
});
