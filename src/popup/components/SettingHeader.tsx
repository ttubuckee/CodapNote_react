import React, {useState, useEffect} from 'react';
import {GITHUB_USER_KEY, GITHUB_PERSONAL_KEY} from '../../generalData';
type SettingHeaderProps = {
  text:string
}
const CODAPNOTE_USER_ID = 'CODAPNOTE_USER_ID';
const SettingHeader = ({text}: SettingHeaderProps) => {
  const [userName,setUserName] = useState('');
  useEffect(()=>{
    chrome.storage.sync.get(GITHUB_USER_KEY,(data)=>{
      setUserName(data[GITHUB_USER_KEY]);
    });
  },[]);
  const showPopUp = () => { // github 사용자 등록
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, {"message":"showPopUp"},function(response){
        // console.log(response.ok);
        chrome.storage.sync.get(GITHUB_USER_KEY,(data)=>{
          setUserName(data[GITHUB_USER_KEY]);
        });
      });
    });
  }
  return (
  <div id="setting">
    <div id="setting-wrapper" onClick={showPopUp}>
      <span>GitHub</span> {userName}
    </div>
  </div>
  )
};
export default SettingHeader;