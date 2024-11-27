import * as React from 'react';
// import styles from './SimpleForm.module.scss';
import type { ISimpleFormProps } from './ISimpleFormProps';
import { ISimpleFormState } from './ISimpleFormState';
import {Web} from "@pnp/sp/presets/all";
import { Checkbox, ChoiceGroup, Dropdown, IDropdownOption, PrimaryButton, TextField, Toggle } from '@fluentui/react';
import { Dialog } from '@microsoft/sp-dialog';
import {PeoplePicker,PrincipalType} from "@pnp/spfx-controls-react/lib/PeoplePicker"
export default class SimpleForm extends React.Component<ISimpleFormProps,ISimpleFormState> {
  constructor(props:ISimpleFormProps){
    super(props);
    this.state={
      Name:'',
      Age:0,
      Gender:'',
      Department:'',
      Permission:false,
      ConsentForm:false,
      Comments:"",
      Manager:"",
      ManagerId:0,
      City:"",
      Hobby:"",
      Course:[]
    }
  }
  //Create Task
  public async CreateData() {
    //to give dynamic site url
    let web = Web(this.props.siteurl);
    await web.lists.getByTitle("Deeplinking List").items.add({
      Title: this.state.Name,
      Age: this.state.Age,
      Department:this.state.Department,
      Gender:this.state.Gender,
      Permission:this.state.Permission,
      ConsentForm:this.state.ConsentForm,
      Comments:this.state.Comments,
      ManagerId:this.state.ManagerId,
      CityId:this.state.City,
      Hobby:this.state.Hobby,
       Course:{results:this.state.Course}
    })
      .then((data) => {
        console.log("No Error found");
        return data
      })
      .catch((e) => {
        console.error("Error found",e);
        throw e;
      });
//If your api is working fine
Dialog.alert("Employee Name with "+this.state.Name+ " has been created successfully");
      this.setState({
        Name:"",
        Age:0,
        Gender:'',
        Department:'',
        Permission:false,
        ConsentForm:false,
        Comments:"",
        Manager:"",
        City:""
      });
  }
  //Form event
  private handleFormEvent=(Fieldvalue:keyof ISimpleFormState,value:string|number|boolean|any):void=>{
    this.setState({[Fieldvalue]:value} as unknown as Pick<ISimpleFormState,keyof ISimpleFormState>);
  }
  //Get People Picker
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
      })
    }

  }
  //Multi select
  private onCourseChange=(event:React.FormEvent<HTMLInputElement>,option:IDropdownOption):void=>{
    const selectedkey=option.selected?[...this.state.Course,option.key as string]: this.state.Course.filter((key:any)=>key!==option.key);
    this.setState({Course:selectedkey});
  }
  public render(): React.ReactElement<ISimpleFormProps> {
   

    return (
     <>
     <form>

    <hr/>
    <p>My First form in spfx</p>
    <TextField value={this.state.Name}
    onChange={(_,event)=>this.handleFormEvent("Name",event)}
    label='Employee Name'/>
    <TextField value={this.state.Age as any}
     onChange={(_,event)=>this.handleFormEvent("Age",event)}
     label='Age'
    />
    <ChoiceGroup
    label='Select gender'
    options={[{key:'Male',text:'Male'},{key:'Female',text:'Female'}]}
    // selectedKey={(_,options)=>this.handleFormEvent("Gender",options?.key as string ||"")}
    selectedKey={this.state.Gender}
    onChange={(_,gender)=>this.handleFormEvent("Gender",gender?.key as string ||"")}
    />
    <Dropdown options={[{key:'IT',text:'IT'},{key:'HR',text:'HR'}]}
    placeholder='--select--'
    label='Department'
    selectedKey={this.state.Department}
    onChange={(_,options)=>this.handleFormEvent("Department",options?.key as string||"")}
    />
    <Toggle label='Permission'
    checked={this.state.Permission}
    onChange={(_,checked)=>this.handleFormEvent("Permission",!!checked)}
    />
    <Checkbox
    checked={this.state.ConsentForm}
    label="Click Yes"
    onChange={(_,checked)=>this.handleFormEvent("ConsentForm",!!checked)}
    />
    <TextField value={this.state.Comments}
    onChange={(_,cmnt)=>this.handleFormEvent("Comments",cmnt)}
    rows={5}
    multiline
    />
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
    <Dropdown
    placeholder='--select--'
    options={this.props.CityOptions}
    selectedKey={this.state.City}
    onChange={(_,option)=>this.handleFormEvent("City",option?.key as string||"")}
    label='City'
    />
    <Dropdown placeholder='--select'
    options={this.props.SingleSelectedOption}
    selectedKey={this.state.Hobby}
    onChange={(_,option)=>this.handleFormEvent("Hobby",option?.key as string||"")}
    label='Hobby'/>
    <Dropdown placeholder='--select--'
    options={this.props.MultiSelectedOption}
    defaultSelectedKeys={this.state.Course}
    multiSelect
    onChange={this.onCourseChange}
    label='Course'/>

    <br/>
    <PrimaryButton text='Save' onClick={()=>this.CreateData()} iconProps={{iconName:'save'}}/>
   
     </form>
     </>
    );
  }
}
