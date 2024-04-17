import { EndpointsFactory } from "express-zod-api";
import { ActionsFactory } from "zod-sockets";
import { socketConfig } from "./config";
import { redirectingResultHandler } from "./result-handler";

export const actionsFactory = new ActionsFactory(socketConfig);

export const authFactory = new EndpointsFactory(redirectingResultHandler);
