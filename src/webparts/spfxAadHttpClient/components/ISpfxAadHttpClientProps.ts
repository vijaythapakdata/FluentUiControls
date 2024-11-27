import { IUserItem } from "../../../AadModel/IUserItem";

export interface ISpfxAadHttpClientProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userItem:IUserItem[];
}
