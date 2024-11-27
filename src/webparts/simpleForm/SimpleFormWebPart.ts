import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'SimpleFormWebPartStrings';
import SimpleForm from './components/SimpleForm';
import { ISimpleFormProps } from './components/ISimpleFormProps';
import {sp} from "@pnp/sp/presets/all";
export interface ISimpleFormWebPartProps {
  description: string;
  CityOptions:any;
}

export default class SimpleFormWebPart extends BaseClientSideWebPart<ISimpleFormWebPartProps> {

protected onInit(): Promise<void> {
  return super.onInit().then(()=>{
    sp.setup({
      spfxContext:this.context as any
    });
    this.getLookupField();
  })
}

  public async render(): Promise<void> {
    const element: React.ReactElement<ISimpleFormProps> = React.createElement(
      SimpleForm,
      {
        description: this.properties.description,
        siteurl:this.context.pageContext.web.absoluteUrl,
        context:this.context,
        CityOptions:this.properties.CityOptions,
        SingleSelectedOption:await this.getChoiceFields(this.context.pageContext.web.absoluteUrl,"Hobby"),
        MultiSelectedOption:await this.getChoiceFields(this.context.pageContext.web.absoluteUrl,"Course")
        
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
  //Get Lookup Field
  private async getLookupField():Promise<void>{
    try{
      const response=await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('NewList')/items?$select=Title,ID`,

        {
          method:'GET',
          headers:{
            'Accept':'application/json;odata=nometadata'
          }
        }
      );
      if(!response.ok){
        throw new Error(`Error found while fetching the lookup field : ${response.status}-${response.text}`);
      }
const data=await response.json();
const CityOptions=data.value.map((city:{ID:string,Title:string})=>({
  key:city.ID,
  text:city.Title
}));
this.properties.CityOptions=CityOptions
    }
    catch(err){
console.log("error ");
throw err;

    }
    finally{
      console.log("I will always run");
    }
  }
  //Get Choice Fields
  private async getChoiceFields(siteurl:string,Fieldvalue:string):Promise<any>{
    try{
      // const encodedFieldValue=encodeURIComponent(Fieldvalue);
      const response=await fetch(`${siteurl}/_api/web/lists/getbytitle('Deeplinking List')/fields?$filter=EntityPropertyName eq '${Fieldvalue}'`,
        {
          method:'GET',
          headers:{
               'Accept':'application/json;odata=nometadata'

          }
        }
      );
      if(!response.ok){
        throw new Error(`Error found while fetching the lookup field : ${response.status}-${response.text}`);
      }
      const data=await response.json();
      const choices=data.value[0].Choices||[];
      return choices.map((choice:any)=>({
        key:choice,
        text:choice
      }))
    }
    catch(err){
      console.log("Errr");
      throw err;
     
    }

  }
}
