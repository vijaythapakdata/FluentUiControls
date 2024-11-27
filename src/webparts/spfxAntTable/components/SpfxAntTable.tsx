import * as React from 'react';
// import styles from './SpfxAntTable.module.scss';
import type { ISpfxAntTableProps } from './ISpfxAntTableProps';
import 'antd/dist/antd.css';
import {sp} from  "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import {Table} from 'antd';
import {Input} from 'antd'
// import { Input } from 'antd';
export interface ITableDesignState{
  items:any[];
  searchText:string;
}
export default class SpfxAntTable extends React.Component<ISpfxAntTableProps, ITableDesignState> {
  constructor(props:any){
    super(props);
    this.state={
      items:[],
      searchText:""
    }
  }

  //Fetch data
  public async componentDidMount(): Promise<void> {
    
    try{
      const data =await sp.web.lists.getByTitle("MyTableList").items.get();
      const tableItems=data.map((item)=>{
        return{
          key:item.Id,
          Title:item.Title,
          Price:item.Price,
          ProductName:item.ProductName

        }
      });
      this.setState({
        items:tableItems
      });
      
    }
    catch(err:any){
      console.error('Error while fetching the data',err);
      throw err;
    }
  }
  //Search function
  public handleSearh=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const searchText=event.target.value.toLocaleLowerCase();
    this.setState({searchText});
  }
  public render(): React.ReactElement<ISpfxAntTableProps> {
    const{items,searchText}=this.state;
    const columns=[
      {
        title:'Title',
        dataIndex:'Title',
        key:'Title',
        sorter:(a:any,b:any)=>a.Title.localeCompare(b.Title)
      },
      {
        title:'Price',
        dataIndex:'Price',
        key:'Price'
      },
      {
        title:'ProductName',
        dataIndex:'ProductName',
        key:'ProductName'
      }
    ]

    return (
      <>
      {/* <input
      placeholder='search here ....'
      value={searchText}
      // onChange={this.handleSearh}
      onChange={this.handleSearh}
      /> */}
      <Input placeholder='search here..'
      value={searchText}
      onChange={this.handleSearh}
style={{marginBottom:'16px',width:'200px'}}
      />
      <Table
      dataSource=
      {items.filter((item)=>item.Title.toLowerCase().includes(searchText)
        ||item.ProductName.toLowerCase().includes(searchText))}
        columns={columns}
        pagination={{pageSize:3}}
      />
      </>
    );
  }
}
