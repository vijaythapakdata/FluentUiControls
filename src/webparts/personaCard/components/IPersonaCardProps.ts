import {MSGraphClientV3} from '@microsoft/sp-http';
export interface IPersonaCardProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  graphClient:MSGraphClientV3;
}
