import React ,{useEffect,useState} from 'react';
import axios from 'axios';

const CommitList = () => {
  const [list,setList] = useState('');
  const [userName,setUserName] = useState('');

  useEffect(()=>{
    // axios.post('https://api.github.com/graphql')
    chrome.storage.sync.get('CODAPNOTE_USER_ID',(data)=>{
      axios.get(`https://api.github.com/users/${data['CODAPNOTE_USER_ID']}/repos`)
      .then( res => {
        setUserName(JSON.stringify(res.data[0].name));
      });  
    });
  },[]);
  
return (<div>{userName}</div>);
}

export default CommitList;