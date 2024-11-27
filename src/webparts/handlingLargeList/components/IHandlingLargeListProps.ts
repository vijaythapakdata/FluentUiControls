import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHandlingLargeListProps {
  description: string;
  ListName:string;
  context:WebPartContext;
}
