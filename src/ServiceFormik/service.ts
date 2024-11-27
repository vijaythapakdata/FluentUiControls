import {Web} from "@pnp/sp/presets/all";
export class Service{
    private web;
    constructor(url:string){
        this.web=Web(url);
    }

    public async createTask(ListName:string,body:any){
        try{
        let createItems=await this.web.lists.getByTitle(ListName).items.add(body);
        return(createItems);
        }
        catch(err){
            console.error("error while creating the task");
        }
        finally{
            console.log("I am free");
        }
    }
}