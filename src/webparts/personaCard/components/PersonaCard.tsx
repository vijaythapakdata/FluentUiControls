import * as React from 'react';
// import styles from './PersonaCard.module.scss';
import type { IPersonaCardProps } from './IPersonaCardProps';
import { IPersonaCardState } from './IPersonCardState';
import {GraphError,ResponseType} from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
// import {Persona,PersonaSize,Link} from "@fluentui/react/"
import { Persona,PersonaSize,Link } from '@fluentui/react';


export default class PersonaCard extends React.Component<IPersonaCardProps, IPersonaCardState> {
  constructor(props:any){
    super(props);
    this.state={
      name:"",
      email:"",
      phone:"",
      image:""
    }
  }
  public render(): React.ReactElement<IPersonaCardProps> {
   

    return (
     <Persona
     primaryText={this.state.name}
     secondaryText={this.state.email}
     onRenderSecondaryText={this._renderEmail}
     tertiaryText={this.state.phone}
     onRenderTertiaryText={this._renderPhone}
     imageUrl={this.state.image}
     size={PersonaSize.size100}
     />
    );
  }
  //Render The Phone
  private _renderPhone=():JSX.Element=>{
    if(this.state.phone){
      return <Link href={`tel:${this.state.phone}`}>{this.state.phone}</Link>
    }
    else{
      return <div/>
    }
  }
  //render email
  private _renderEmail=():JSX.Element=>{
    if(this.state.email){
      return <Link href={`mailto:${this.state.email}`}>{this.state.email}</Link>
    }
    else{
      return <div/>
    }
  }
  public componentDidMount(): void {
    this.props.graphClient.api('me')
    .get((error:GraphError,user:MicrosoftGraph.User)=>{
      this.setState({
        name:user.displayName,
        email:user.mail,
        phone:user.businessPhones?.[0]
      });
    });
    this.props.graphClient.api('me/photo/$value')
    .responseType(ResponseType.BLOB)
    .get((error:GraphError,photoResponse:Blob)=>{
      const bloburl=window.URL.createObjectURL(photoResponse);
      this.setState({image:bloburl});
    });
  }
}

