import * as React from 'react';
// import styles from './SharePointCrudApi.module.scss';
import { useState } from 'react';
import type { ISharePointCrudApiProps } from './ISharePointCrudApiProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ISharePointApiCrudState } from './ISharePointApiCrudState';
import {SPHttpClient,SPHttpClientResponse} from "@microsoft/sp-http";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
const SharePointCrudApi : React.FC<ISharePointCrudApiProps>=(props:ISharePointCrudApiProps)=>{
  const [fullName,setFullName]=useState('');
  const[age,setAge]=useState('');
  const [allItems,setAllItems]=useState<ISharePointApiCrudState[]>([]);

//Get Item by Id
const getItemById=():void=>{
  const idElement=document.getElementById('itemId') as HTMLInputElement | null;
  if(idElement?.value){
    const id :number= parseInt(idElement?.value||'0');
    if(id>0){
      props.context.spHttpClient.get(`${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Crud')/items(${id})`,
        SPHttpClient.configurations.v1,
      {
        headers:{
          'Accept':'application/json;odata=nometadata',
          'content-type':'application/json;odata=nometadata',
          'odata-version':''
        },
      }
      ) 
      .then((response:SPHttpClientResponse)=>{
        if(response.ok){
          response.json().then((responseJSon)=>{
            setFullName(responseJSon.Title);
            setAge(responseJSon.Age);
          });

          //smaple
        }
        else{
          response.json().then((responseJson)=>{
            console.log(responseJson);
            alert(`Something went wrong`)
          });
        }
      })
      .catch((err)=>{
        console.log(err);
      });
    }
    else{
      alert(`please enter valid id`);
    }
  }
  else{
    console.log(`ID is not found`);
  }
}
//Get ALl items

const getAllItems=():void=>{
  props.context.spHttpClient.get(`${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Crud')/items`,
        SPHttpClient.configurations.v1,
      {
        headers:{
          'Accept':'application/json;odata=nometadata',
          'content-type':'application/json;odata=nometadata',
          'odata-version':''
        },

      })
      .then((response:SPHttpClientResponse)=>{
        if(response.ok){
          response.json().then((responseJSon)=>{
            setAllItems(responseJSon.value);
            console.log(responseJSon);
          });
        }
        else{
          response.json().then((responseJson)=>{
            console.log(responseJson);
            alert(`Error`);
          });
        }

      })
      .catch((err)=>{
        console.log(err);
      });

}

  //create Item
  const createItem=async():Promise<void>=>{
const body:string=JSON.stringify({
  'Title':fullName,
  'Age':age
});
try{
const response:SPHttpClientResponse=await props.context.spHttpClient.post(`${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Crud')/items`,
SPHttpClient.configurations.v1,
{
  headers:{
    'Accept':'application/json;odata=nometadata',
    'content-type':'application/json;odata=nometadata',
    'odata-version':''
  },
  body:body
}

);
if(response.ok){
  const responseJSON=await response.json();
  console.log(responseJSON);
  alert(`Item created successfully with ID : ${responseJSON.ID} `);
}
else{
  const responseJSON=await response.json();
  console.log(responseJSON);
  alert(`Something went wrong please check the console for errror`);
}
}
catch(err){
console.log(err);
alert(`An error occurred`);
}
  }
  //Update item
  const updateItem=():void=>{
    const idElement=document.getElementById('itemId') as HTMLInputElement | null;
    if(idElement){
      const id:number=parseInt(idElement.value);
      const body:string=JSON.stringify({
        'Title':fullName,
        'Age':parseInt(age)
      });
      if(id>0){
        props.context.spHttpClient.post(`${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Crud')/items(${id})`,
          SPHttpClient.configurations.v1,
          {
            
  headers:{
    'Accept':'application/json;odata=nometadata',
    'content-type':'application/json;odata=nometadata',
    'odata-version':'',
    'IF-MATCH':'*',
    'X-HTTP-Method':'MERGE'
  },
  body:body
          }

        )
        .then((response:SPHttpClientResponse)=>{
          if(response.ok){
            alert(`Item with ID : ${id} updated successfully`);
          }
          else{
            response.json().then((responseJSON)=>{
              console.log(responseJSON);
              alert(`something went wrong`);
            });
          }
        })
        .catch((err)=>{
          console.log(err);
        });
      }
      else{
        alert(`Please enter the valid ID`);
      }
    }
    else{
      alert(`Item ID is not found`);
    }
  }
  //Delete item
  const deleteItem=():void=>{
    const idElement=document.getElementById('itemId') as HTMLInputElement | null;
    const id :number= parseInt(idElement?.value||'0');
    if(id>0){
      props.context.spHttpClient.post(`${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Crud')/items(${id})`,
        SPHttpClient.configurations.v1,{
          headers:{
            'Accept':'application/json;odata=nometadata',
            'content-type':'application/json;odata=nometadata',
            'odata-version':'',
            'IF-MATCH':'*',
            'X-HTTP-Method':'DELETE'
          },

        }
      )
      .then((response:SPHttpClientResponse)=>{
        if(response.ok){
          alert(`Item Id :${id} deleted successfully`);
        }
        else{
          alert(`Something went wrong please check the console`);
        }
      });
    }
    else{
      alert(`please enter valid Id`);
    }
  }
  return(
    <>
    <div className='container'>
      <div className='row'>
        <div className='col-md-6'>
          <p>{escape(props.description)}</p>
          <div className='form-group'>
            <label htmlFor='itemId'>Item ID</label>
            <input type='text' className='form-control' id='itemId'></input>
          </div>
          <div className='form-group'>
            <label htmlFor='fullName'>Full Name</label>
            <input type='text' className='form-control'id='fullName' value={fullName}onChange={(e)=>setFullName(e.target.value)}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='age'>Age</label>
            <input type='text' className='form-control' id='age' value={age} onChange={(e)=>setAge(e.target.value)}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='allItems'>All Items</label>
            <div id='allItems'>
              <table className='table-table-bordered'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item)=>(
                    <tr key={(item.ID)}>
                      <td>{item.ID}</td>
                      <td>{item.Title}</td>
                      <td>{item.Age}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='d-flex justify-content-start'>
            <button className='btn btn-primary mx-2' onClick={createItem}>Create</button>
            <button className='btn btn-success mx-2' onClick={getItemById}>Read</button>
            <button className='btn btn-info mx-2' onClick={getAllItems}>Read All</button>
            <button className='btn btn-warning mx-2' onClick={updateItem}>Update</button>
            <button className='btn btn-danger mx-2' onClick={deleteItem}>Delete</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SharePointCrudApi;
