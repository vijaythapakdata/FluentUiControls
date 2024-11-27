import * as React from 'react';
import styles from './SpfxAadHttpClient.module.scss';
import type { ISpfxAadHttpClientProps } from './ISpfxAadHttpClientProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class SpfxAadHttpClient extends React.Component<ISpfxAadHttpClientProps, {}> {
  public render(): React.ReactElement<ISpfxAadHttpClientProps> {
   
    const {
      userItem,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    return (
      <section className={`${styles.spfxAadHttpClient} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
      <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
      <h2>Well done, {escape(userDisplayName)}!</h2>
      <div>{environmentMessage}</div>
      </div>
      <div >
      <div><strong>Mail:</strong></div>
      <ul>
                  {userItem && userItem.map((user) =>
      <li key={user.id}>
      <strong>ID:</strong> {user.id}<br />
      <strong>Email:</strong> {user.mail}<br />
      <strong>DisplayName:</strong> {user.displayName}
      </li>
                    )
                  }
      </ul>
      </div>
      </section>
    );
  }
}
