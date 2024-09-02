import { NODE_ENV, API_URL_DEVELOPMENT, API_URL_PRODUCTION } from "@env";
import { logInfo } from "../../util/logging";

export const baseApiUrl =
  NODE_ENV === "production" ? API_URL_PRODUCTION : API_URL_DEVELOPMENT;

logInfo(`NODE_ENV: ${NODE_ENV}`);
logInfo(`API_URL_DEVELOPMENT: ${API_URL_DEVELOPMENT}`);
logInfo(`API_URL_PRODUCTION: ${API_URL_PRODUCTION}`);
