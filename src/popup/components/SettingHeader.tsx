import React, {useState} from 'react';

type SettingHeaderProps = {
  text:string
}
const SettingHeader = ({text}: SettingHeaderProps) => {
  return (
    <div id="setting">{text}</div>
  )
};
export default SettingHeader;