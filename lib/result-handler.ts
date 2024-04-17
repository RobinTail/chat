import { createResultHandler } from "express-zod-api";
import { z } from "zod";
import { appUrl } from "./config";

export const redirectingResultHandler = createResultHandler({
  getPositiveResponse: () => z.never(),
  getNegativeResponse: () => z.never(),
  handler: ({ request, response }) => {
    const feed = new URLSearchParams({ ...request.user });
    response.redirect(`${appUrl}/?${feed}`);
  },
});
