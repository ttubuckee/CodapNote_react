import React, {useState, useEffect} from 'react';

type SettingHeaderProps = {
  text:string
}
const CODAPNOTE_USER_ID = 'CODAPNOTE_USER_ID';
const SettingHeader = ({text}: SettingHeaderProps) => {
  const [userName,setUserName] = useState('');
  useEffect(()=>{
    chrome.storage.sync.get(CODAPNOTE_USER_ID,(data)=>{
      setUserName(data[CODAPNOTE_USER_ID]);
    });
  },[]);
  const showPopUp = () => { // github 사용자 등록
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, {"message":"showPopUp"},function(response){
        // console.log(response.ok);
        chrome.storage.sync.get(CODAPNOTE_USER_ID,(data)=>{
          setUserName(data[CODAPNOTE_USER_ID]);
        });
      });
    });
  }
  return (
  <div id="setting"><span onClick={showPopUp}>GitHub </span> {userName}</div>
  )
};
export default SettingHeader;