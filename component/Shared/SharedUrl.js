import {
  NODE_ENV,
  API_URL_DEVELOPMENT,
  API_URL_PRODUCTION,
  EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  WEB_CLIENT_ID
} from "@env";

import { logInfo } from "../../util/logging";

export const baseApiUrl =
  NODE_ENV === "production" ? API_URL_PRODUCTION : API_URL_DEVELOPMENT;

export const expoClientId = EXPO_CLIENT_ID;
export const iosClientId = IOS_CLIENT_ID;
export const androidClientId = ANDROID_CLIENT_ID;
export const webClientId = WEB_CLIENT_ID;

logInfo(`NODE_ENV: ${NODE_ENV}`);
logInfo(`API_URL_DEVELOPMENT: ${API_URL_DEVELOPMENT}`);
logInfo(`API_URL_PRODUCTION: ${API_URL_PRODUCTION}`);

// logInfo(`EXPO_CLIENT_ID: ${EXPO_CLIENT_ID}`);
// logInfo(`IOS_CLIENT_ID: ${IOS_CLIENT_ID}`);
// logInfo(`ANDROID_CLIENT_ID: ${ANDROID_CLIENT_ID}`);
// logInfo(`WEB_CLIENT_ID: ${WEB_CLIENT_ID}`);
