import { API_URL_DEVELOPMENT, API_URL_PRODUCTION } from "@env";

const environment = process.env.NODE_ENV || "development";
export const baseApiUrl =
  environment === "development" ? API_URL_DEVELOPMENT : API_URL_PRODUCTION;
