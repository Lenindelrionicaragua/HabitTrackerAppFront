import { NODE_ENV, API_URL_DEVELOPMENT, API_URL_PRODUCTION } from "@env";

export const baseApiUrl =
  NODE_ENV !== "production" ? API_URL_PRODUCTION : API_URL_DEVELOPMENT;

console.log("NODE_ENV:", NODE_ENV);
console.log("API_URL_DEVELOPMENT:", API_URL_DEVELOPMENT);
console.log("API_URL_PRODUCTION:", API_URL_PRODUCTION);
