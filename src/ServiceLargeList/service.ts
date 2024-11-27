import {ICamlQuery, sp} from "@pnp/sp/presets/all";
import { IListItems } from "../webparts/handlingLargeList/components/IListItems";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export class Service{
    constructor(context:WebPartContext){
        sp.setup({
            spfxContext:context as any
        });
    }
    //Get List Items
    public async getListItems(ListName:string):Promise<IListItems[]>{
        try{
            const items=await sp.web.lists.getByTitle(ListName).items.getAll();
            return items.map((item:any)=>({
                Title:item.Title
            }));
        }
        catch(err){
            console.error("Error while fetching the items");
            throw err;
        }
        
        
    }
    public async getListItemsPaged(ListName:string):Promise<IListItems[]>{
        const allItems:IListItems[]=[];
        let pagedItems:any=null;
        do{
            const camlQuery:ICamlQuery={
                ViewXml:`<View>
                <Query>
                <Where>
                <IsNotNull>
                <FieldRef Name='Title'/>
                </IsNotNull>
                </Where>
                </Query>
                <RowLimit>1000</RowLimit>
                <Paged>TRUE</Paged>
                </View>

                
                `
            }
            pagedItems=await sp.web.lists.
            getByTitle(ListName).getItemsByCAMLQuery(camlQuery,pagedItems?pagedItems['@odata.nextLink']:undefined);
            console.log(`Fetched batch of ${pagedItems.length} items `)
            allItems.push(...pagedItems.map((item:any)=>({
                Title:item.Title
            })));

        }
        while(pagedItems['@odata.nextLink']);
        console.log(`Total items fetched: ${allItems.length}`)
        return allItems;
    }
}