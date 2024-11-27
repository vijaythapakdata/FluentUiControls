import * as React from 'react';
// import styles from './FluentUiControls.module.scss';
import type { IFluentUiControlsProps } from './IFluentUiControlsProps';
import { PrimaryButton } from '@fluentui/react';
import SampleNewClass from './SampleClass';
export default class FluentUiControls extends React.Component<IFluentUiControlsProps, {}> {
  public render(): React.ReactElement<IFluentUiControlsProps> {
   

    return (
     <>
     <p>Hi , I am doing spfx</p>
     <PrimaryButton text='Save' iconProps={{iconName:'save'}}/>
     <SampleNewClass/>
     </>
    );
  }
}
