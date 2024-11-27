import { INasaItem } from "../../../models/INasaImageSearchResponse";

export interface ISpfxhttpclientProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  appolloMissionImage:INasaItem;
}
