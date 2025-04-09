import {
  API_URL_PRODUCTION,
  API_URL_DEVELOPMENT,
  EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  WEB_CLIENT_ID
} from "@env";
import { logInfo } from "../../util/logging";

const env = process.env.NODE_ENV;

export const baseApiUrl =
  env === "development" ? API_URL_DEVELOPMENT : API_URL_PRODUCTION;

export const expoClientId = EXPO_CLIENT_ID;
export const iosClientId = IOS_CLIENT_ID;
export const androidClientId = ANDROID_CLIENT_ID;
export const webClientId = WEB_CLIENT_ID;

logInfo(`Environment: ${env}`);
logInfo(`Server URL: ${baseApiUrl}`);
