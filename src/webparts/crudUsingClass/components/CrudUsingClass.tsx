import * as React from 'react';
 import styles from './CrudUsingClass.module.scss';
import type { ICrudUsingClassProps } from './ICrudUsingClassProps';
import { ICrudUsingClassState } from './ICrudUsingClassState';
import {Web} from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import {PeoplePicker,PrincipalType} from "@pnp/spfx-controls-react/lib/PeoplePicker"
import { DatePicker, IDatePickerStrings, PrimaryButton, TextField } from '@fluentui/react';

//Formating DatePicker
export const DatePickerString:IDatePickerStrings={
  months:["Janauary","February","March","April","May","June","July","August","September","October","November","December"],
  shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  goToToday:"go to today",
  prevMonthAriaLabel:"go to previous month",
  nextMonthAriaLabel:"go to next month",
  prevYearAriaLabel:"go to previous year",
  nextYearAriaLabel:"go to next year",

}
export const FormateDate=(date:any):string=>{
  var date1=new Date(date);
  var year=date1.getFullYear();
  var month=(1+date1.getMonth()).toString();
  month=month.length>1?month:'0'+month;
  var day=date1.getDate().toString();
  day=day.length>1?day:'0'+day;
  return month+'-'+day+'-'+year
}
export default class CrudUsingClass extends React.Component<ICrudUsingClassProps, ICrudUsingClassState> {
  constructor(props:ICrudUsingClassProps){
    super(props);
    this.state={
      Items:[], // Read the Data
      Name:"", //Taking Text Value
      Manager:"", // For People Picker
      ManagerId:0,
      InterviewDate:null, //Date Picker
      ID:0, //SharePoint List Item ID
      HTML:[], // To Take Css
      JobDescription:"" // Multiline  Text
    }
  }
  public async componentDidMount() {
    await this.FetchItems();
  }
  //Read the data
  public async FetchItems(){
let web=Web(this.props.siteurl);
const items:any[]=await web.lists.getByTitle("CrudList").items.select("*","Manager/Title").expand("Manager/ID").getAll();
this.setState({Items:items});
let html=await this.getHtmlTable(items);
this.setState({HTML:html})
  }

  public SearchItems(id:any){
var itemId=id;
var allItems=this.state.Items;
var allItemsLength=allItems.length;
if(allItems.length>0){
  for(var i=0;i<allItemsLength;i++){
    if(itemId==allItems[i].Id){
      this.setState({
        ID:itemId,
        Name:allItems[i].Title,
        Manager:allItems[i].Manager.Title,
        ManagerId:allItems[i].ManagerId,
        JobDescription:allItems[i]. JobDescription,
        InterviewDate:new Date(allItems[i].InterviewDate)
      });
    }
  }
}
  }
  //Html Table
  public async getHtmlTable(items:any){
var htmlDataTable=<table className={styles.table}>

  <thead>
    <tr>
      <th>Name</th>
      <th>Manager</th>
      <th>Job Description</th>
      <th>Interview Date</th>
    </tr>
  </thead>
  <tbody>
    {items && items.map((item:any,i:any)=>{
      return[
        <tr key={i} onClick={()=>this.SearchItems(item.ID)}>
          <td>{item.Title}</td>
          <td>{item.Manager.Title}</td>
          <td>{item.JobDescription}</td>
          <td>{FormateDate(item.InterviewDate)}</td>

        </tr>
      ]
    })}
  </tbody>
</table>
return await htmlDataTable;
  }
  //Create Data
  public async CreateItem(){
    let web=Web(this.props.siteurl);
    await web.lists.getByTitle("CrudList").items.add({
      Title:this.state.Name,
      ManagerId:this.state.ManagerId,
      JobDescription:this.state.JobDescription,
      InterviewDate:new Date(this.state.InterviewDate)
    })
    .then((data)=>{
      console.log("No Error found");
      return data;
    })
    .catch((err)=>{
      console.error("Error found");
      throw err;
    });
    alert("Item is created");
    this.setState({
      Name:"",
      Manager:"",
      JobDescription:"",
      InterviewDate:null
    });
    this.FetchItems();
  }
  //update items
  public async UpdateItem(){
    let web=Web(this.props.siteurl);
    await web.lists.getByTitle("CrudList").items.getById(this.state.ID).update({
      Title:this.state.Name,
      ManagerId:this.state.ManagerId,
      JobDescription:this.state.JobDescription,
      InterviewDate:new Date(this.state.InterviewDate)
    })
    .then((data)=>{
      console.log("No Error found");
      return data;
    })
    .catch((err)=>{
      console.error("Error found");
      throw err;
    });
    alert("item is updated");
    this.setState({
      Name:"",
      Manager:"",
      JobDescription:"",
      InterviewDate:null
    });
    this.FetchItems();
  }
  //delete item
  public async deleteItem(){
    let web=Web(this.props.siteurl);
    await web.lists.getByTitle("CrudList").items.getById(this.state.ID).delete()
    .then((data)=>{
      console.log("No Error found");
      return data;
    })
    .catch((err)=>{
      console.error("Error found");
      throw err;
    });
    alert("item deleted");
    this.setState({
      Name:"",
      Manager:"",
      JobDescription:"",
      InterviewDate:null
    });
    this.FetchItems();
  }
  //Event Handling
  private handleFormEvent=(Fieldvalue:keyof ICrudUsingClassState,value:string|number|boolean|any):void=>{
    this.setState({[Fieldvalue]:value} as unknown as Pick<ICrudUsingClassState,keyof ICrudUsingClassState>);
  }
  public async ResetForm(){
    this.setState({
      Name:"",
      Manager:"",
      JobDescription:"",
      InterviewDate:null
    });
  }
  public render(): React.ReactElement<ICrudUsingClassProps> {
    

    return (
    <>
    <div>
    {this.state.HTML}
    <div className={styles.btngroup}>
      <div><PrimaryButton text="Save" onClick={()=>this.CreateItem()} iconProps={{iconName:'save'}}></PrimaryButton></div>
      <div><PrimaryButton text="Update" onClick={()=>this.UpdateItem()} iconProps={{iconName:'edit'}}></PrimaryButton></div>
      <div><PrimaryButton text="Delete" onClick={()=>this.deleteItem()} iconProps={{iconName:'delete'}}></PrimaryButton></div>
      <div><PrimaryButton text="Reset" onClick={()=>this.ResetForm()} iconProps={{iconName:'reset'}}></PrimaryButton></div>
    </div>
    </div>
    <form>
    <TextField value={this.state.Name}
    onChange={(_,event)=>this.handleFormEvent("Name",event)}
    label=' Name'/>
    <PeoplePicker
    context={this.props.context as any}
    personSelectionLimit={1}
    ensureUser={true}
    principalTypes={[PrincipalType.User]}
    resolveDelay={1000}
    titleText='Manager'
    webAbsoluteUrl={this.props.siteurl}
    onChange={this._getPeoplePicker}
    defaultSelectedUsers={[this.state.Manager?this.state.Manager:""]}
    

    />
     <TextField value={this.state.JobDescription}
    onChange={(_,cmnt)=>this.handleFormEvent("JobDescription",cmnt)}
    label='Job Description'
    rows={5}
    multiline
    />
    <DatePicker
    allowTextInput={false}
    strings={DatePickerString}
    value={this.state.InterviewDate}
    onSelectDate={(e:any)=>{this.setState({InterviewDate:e})}}
    aria-Label="Select Date" label='Interview Date'
    formatDate={FormateDate}
    />
    </form>
    </>
    );
  }
  //Get Peoplepicker
  private _getPeoplePicker=(items:any[]):void=>{
    if(items.length>0){
      this.setState({
        Manager:items[0].text,
        ManagerId:items[0].id
      });
    }
    else{
      this.setState({
        Manager:"",
        ManagerId:0
      });
    }
  }
}
