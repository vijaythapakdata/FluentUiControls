import * as React from 'react';
// import styles from './Spfxhttpclient.module.scss';
import type { ISpfxhttpclientProps } from './ISpfxhttpclientProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Spfxhttpclient extends React.Component<ISpfxhttpclientProps, {}> {
  public render(): React.ReactElement<ISpfxhttpclientProps> {
  

    return (
    <section>
      <div>
        <img src={this.props.appolloMissionImage.links[0].href}/>
        <div ><strong>Title:</strong>{escape(this.props.appolloMissionImage.data[0].title)}</div>
        <div><strong>Keywords:</strong>
        <ul>
          {this.props.appolloMissionImage&& this.props.appolloMissionImage.data[0].keywords.map((keyword:string)=>
          <li key={keyword}>{escape(keyword)}</li>)}
        </ul>
        </div>
      </div>
    </section>
    );
  }
}
