import {
  API_URL_DEVELOPMENT,
  API_URL_PRODUCTION,
  EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  WEB_CLIENT_ID
} from "@env";
import { logInfo } from "../../util/logging";

export const baseApiUrl = API_URL_DEVELOPMENT;

export const expoClientId = EXPO_CLIENT_ID;
export const iosClientId = IOS_CLIENT_ID;
export const androidClientId = ANDROID_CLIENT_ID;
export const webClientId = WEB_CLIENT_ID;

logInfo(`Server url: ${baseApiUrl}`);
