import { ActionsFactory } from "zod-sockets";
import { socketConfig } from "./config";

export const factory = new ActionsFactory(socketConfig);
