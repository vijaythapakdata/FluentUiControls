import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SpfxAadHttpClientWebPartStrings';
import SpfxAadHttpClient from './components/SpfxAadHttpClient';
import { ISpfxAadHttpClientProps } from './components/ISpfxAadHttpClientProps';
import {AadHttpClient,HttpClientResponse} from "@microsoft/sp-http";
import { IUserItem } from '../../AadModel/IUserItem';
export interface ISpfxAadHttpClientWebPartProps {
  description: string;
}

export default class SpfxAadHttpClientWebPart extends BaseClientSideWebPart<ISpfxAadHttpClientWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public async render(): Promise<void> {
    if(!this.renderedOnce){
      const results:IUserItem[]=await this._getUsers();
    
    const element: React.ReactElement<ISpfxAadHttpClientProps> = React.createElement(
      SpfxAadHttpClient,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        userItem:results
      }
    );

    ReactDom.render(element, this.domElement);
  }
  this.renderCompleted();
  }
  protected renderCompleted() {
    super.renderCompleted();
  }
  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }


private async _getUsers():Promise<IUserItem[]>{
  const aadClient:AadHttpClient=await this.context.aadHttpClientFactory.getClient(`https://graph.microsoft.com`);
  const endpoint:string=`https://graph.microsoft.com/v1.0/users?$top=5&$select=id,displayName,mail`;
  const response:HttpClientResponse=await aadClient.get(endpoint,AadHttpClient.configurations.v1);
  if(!response.ok){
    const responseText=await response.text();
    throw new Error(responseText);
  }
  const responseJson=await response.json();
  return responseJson.value as IUserItem[];
}
  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
