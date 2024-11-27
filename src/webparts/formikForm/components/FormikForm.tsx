import * as React from 'react';
import styles from './FormikForm.module.scss';
import type { IFormikFormProps } from './IFormikFormProps';

// import { FormikFormProps } from 'formik';
import { Service } from '../../../ServiceFormik/service';
import * as yup from 'yup';
import { Formik, FormikProps } from 'formik';
import {Dialog} from '@microsoft/sp-dialog';
import {sp} from "@pnp/sp/presets/all"
import { DatePicker, Dropdown, Label, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { PeoplePicker,PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';

const stackTokens={childrenGap:30};
const FormikForm:React.FC<IFormikFormProps>=(props)=>{
  const [spService]=React.useState(()=>new Service(props.siteurl))
  React.useEffect(()=>{
    sp.setup({
      spfxContext:props.context as any

    });
  },[props.context]);
  //Form Validation
  const validate=yup.object().shape({
    name:yup.string().required("Task name can not be empty"),
    details:yup.string().min(15,"Minimum 15 words are required").required("Task details are required"),
    startDate:yup.date().required("Start date is required"),
    endDate:yup.date().required("End date is required"),
    projectName:yup.string().required("Project name is required")
  });
  //Create Item
  const createRecord=async(record:any)=>{
    try{
      const item=await spService.createTask("MyTask",{
        Title:record.name,
        TaskDetails:record.details,
        StartDate:new Date(record.startDate),
        EndDate:new Date(record.endDate),
        ProjectName:record.projectName
      });
      console.log("Item successfully saved",item);
      Dialog.alert("Item has been successfully saved");
      return item;
    }
    catch(err){
      console.error("Error while creating the item",err);
      throw err;
    }
  }
  return(
    <Formik
    initialValues={{
      name:"",
      details:"",
      projectName:"",
      startDate:null,
      endDate:null
    }}
    validationSchema={validate}
    onSubmit={(values,helpers)=>{
      createRecord(values).then(()=>{
        helpers.resetForm();
      })
    }}
    
    >
{(formik:FormikProps<any>)=>(
  <div className=''>
    <Stack tokens={stackTokens}>
      <Label className={styles.lblform} > Current User</Label>
      <PeoplePicker
      context={props.context as any}
      ensureUser={true}
      personSelectionLimit={1}
      defaultSelectedUsers={[props.context.pageContext.user.displayName as any]}
      principalTypes={[PrincipalType.User]}
      webAbsoluteUrl={props.siteurl}
      disabled={true}
      
      
      />
      <Label  className={styles.lblform} >Task Name</Label>
      <TextField {...formik.getFieldProps('name')} errorMessage={formik.errors.name as any}/>
      <Label  className={styles.lblform} >Project Name</Label>
      <Dropdown options={[{key:'Python',text:'Python'},{key:'Java',text:'Java'},{key:'Machine Learning',text:'Machine Learning'}]}
      {...formik.getFieldProps('projectName')}
      onChange={(_,option)=>formik.setFieldValue('projectName',option?.key.toString())}
      />
      <Label  className={styles.lblform} >Start Date</Label>
      <DatePicker id="startDate"
      value={formik.values.startDate}
      textField={{errorMessage:formik.errors.startDate as string}}
      onSelectDate={(date)=>formik.setFieldValue('startDate',date)}
      />

        <Label  className={styles.lblform} >End Date</Label>
      <DatePicker id="endDate"
      value={formik.values.endDate}
      textField={{errorMessage:formik.errors.endDate as string}}
      onSelectDate={(date)=>formik.setFieldValue('endDate',date)}
      />
        <Label  className={styles.lblform} >Project Details</Label>
        <TextField {...formik.getFieldProps('details')} errorMessage={formik.errors.details as any}
        multiline
        rows={5}/>
    </Stack>
    <br></br>
    <PrimaryButton  className={styles.btnsForm} 
     type='submit'
     text='Save'
     iconProps={{iconName:'Save'}}
     onClick={formik.handleSubmit as any}/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <PrimaryButton
    className={styles.btnsForm} 
     text='Cancle'
     iconProps={{iconName:'cancel'}}
     onClick={formik.handleReset as any}/>
  </div>
)}

    </Formik>
  )

}
export default FormikForm
