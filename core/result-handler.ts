import { createResultHandler } from "express-zod-api";
import { z } from "zod";
import { appUrl } from "./config";

export const redirectingResultHandler = createResultHandler({
  getPositiveResponse: () => z.never(),
  getNegativeResponse: () => z.never(),
  handler: ({ request, response, error }) => {
    const feed = new URLSearchParams(
      error ? { error: error.message } : { ...request.user },
    );
    response.redirect(`${appUrl}/?${feed}`);
  },
});
