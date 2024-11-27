import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICrudUsingClassProps {
  description: string;
  context:WebPartContext;
  siteurl:string;
}
