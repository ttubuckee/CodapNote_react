import React ,{useEffect,useState} from 'react';
import axios from 'axios';
import {GITHUB_USER_KEY, GITHUB_PERSONAL_KEY,addGitHubButton} from '../../generalData';

const CommitList = () => {
  const [list,setList] = useState('');
  const [commitCount,setCommitCount] = useState(0);
  const [userName,setUserName] = useState('');

  useEffect(()=>{
    chrome.storage.sync.get([GITHUB_USER_KEY!,GITHUB_PERSONAL_KEY],(data)=>{
      axios.get(`https://api.github.com/search/commits?q=author:${data[GITHUB_USER_KEY]}+committer-date:${new Date().toJSON().slice(0,10)}`,{
        // https://stackoverflow.com/questions/46855484/checking-if-a-user-made-a-commit-to-github-using-api-on-a-given-day/46855913 참고
        headers: {
          Accept: 'application/vnd.github.cloak-preview',
          Authorization: `token ${data[GITHUB_PERSONAL_KEY]}`
        }
      }).then( res => {
        setCommitCount(parseInt(res.data.total_count));
        setUserName(data[GITHUB_USER_KEY]);
      })
      addGitHubButton();
      // axios.get(`https://api.github.com/users/${data[GITHUB_USER_KEY!]}/repos`)
      // .then( res => {
      //   setUserName(JSON.stringify(res.data[0].name));
      // });
    });
  },[]);
  
return (<div>{
    commitCount
? <span>금일 커밋 수는 {commitCount} 입니다.</span>
: <span>아직 커밋 내역이 없습니다.</span>
  }
  </div>);
}

export default CommitList;