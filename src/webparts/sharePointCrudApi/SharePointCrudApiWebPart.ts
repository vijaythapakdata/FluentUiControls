import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp/presets/all";

import * as strings from 'SharePointCrudApiWebPartStrings';
import SharePointCrudApi from './components/SharePointCrudApi';
import { ISharePointCrudApiProps } from './components/ISharePointCrudApiProps';

export interface ISharePointCrudApiWebPartProps {
  description: string;
}

export default class SharePointCrudApiWebPart extends BaseClientSideWebPart<ISharePointCrudApiWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      sp.setup({
        spfxContext: this.context as any
      });

    })
  }

  public render(): void {
    const element: React.ReactElement<ISharePointCrudApiProps> = React.createElement(
      SharePointCrudApi,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
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
