import { createResultHandler } from "express-zod-api";
import { z } from "zod";

export const redirectingResultHandler = createResultHandler({
  getPositiveResponse: () => z.never(),
  getNegativeResponse: () => z.never(),
  handler: ({ request, response }) => {
    response.redirect(
      "http://localhost:8080/?" + new URLSearchParams({ ...request.user }),
    );
  },
});
