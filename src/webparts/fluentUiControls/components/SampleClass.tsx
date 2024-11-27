import * as React from 'react'
import { ChoiceGroup, ComboBox, Dropdown ,Label, Slider, TextField, Toggle} from '@fluentui/react'

export default class SampleNewClass extends React.Component<{}>{
    public render():React.ReactElement<{}> {
        return(
            <>
            <p> I am child class or Sample class for testing</p>
            <Label>Department</Label>
            <Dropdown placeholder='--select--'
            options={[{key:'HR',text:'HR'},{key:'IT',text:'IT'}]}
            multiSelect={false}
            
            />
            {/* <button>Save</button>
            <label>HTML Dropdown</label>
            <select>
                <option >IT</option>
                <option >HR</option>
            </select> */}

            <Label>Name</Label>
            <TextField placeholder='Vijay Thapak' type='text' errorMessage="name can not be empty"/>
            <Label> Email</Label>
            <TextField type='email' placeholder='vijaythapak2001@gmail.com'/>
            <Label>Document</Label>
            <TextField type='file'/>
            <Label>Password</Label>
            <TextField type='password' canRevealPassword/>
            <Label>Address</Label>
            <TextField type="textarea" rows={5} multiline={true} iconProps={{iconName:'location'}}required/>
            <Label>Gender</Label>
            <ChoiceGroup
            options={[{key:'Male',text:'Male'},{key:'Female',text:'Female'}]}
            />
            <Label>Searchable</Label>
            <ComboBox
            options={[{key:'Apple',text:'Apple'},{key:'Mango',text:'Mango'}]}
            multiSelect
            allowFreeInput
            allowFreeform
            autoComplete='on'
            />
            <Label>
                Score
            </Label>
            <Slider min={0} max={100}/>
            <Label>Toggle</Label>
            <Toggle offText='Off' onText='On' defaultChecked/>
            </>
        )
    }
        
    
}