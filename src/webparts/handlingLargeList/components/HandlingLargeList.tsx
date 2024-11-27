import * as React from "react";
import { useEffect,useState } from "react";
import { IListItems } from "./IListItems";
import { Service } from "../../../ServiceLargeList/service";
import { IHandlingLargeListProps } from "./IHandlingLargeListProps";
// import { IHandlingLargeListState } from "./IHandlingLargeListState";
import { DetailsList } from "@fluentui/react";

const HandlingLargeList:React.FC<IHandlingLargeListProps>=(props)=>{
  const [ListResult,setListResult]=useState<IListItems[]>([]);
  const _service=new Service(props.context);
  useEffect(()=>{
    const fetchdata=async()=>{
      try{
        const result=await _service.getListItemsPaged(props.ListName);
        setListResult(result)
      }
      catch(err){
        console.error("Errror",err);
        throw err;
      }
    };
    fetchdata();
  },[props.ListName,_service]);
return(
  <>
  <DetailsList items={ListResult}/>
  </>
)
}
export default HandlingLargeList