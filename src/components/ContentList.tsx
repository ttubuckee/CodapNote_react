import React, {useState,useEffect, Component} from 'react';

type ContentListProps = {
  id: string;
  currentTab: number;
}
type DataObject = {
  title: string;
  url: string;
  idx: number;
}
function ContentList({id, currentTab}: ContentListProps) {
  const [list,setList] = useState([{}]);
  const base_urls = [
    "https://www.acmicpc.net/",
    "https://programmers.co.kr/",
    "https://www.hackerrank.com/"
  ];
  useEffect(()=>{
    updateList();
  },[currentTab]);
  const updateList = () => { // chrome storage 조회
    chrome.storage.sync.get(null, function(data) {
      switch (currentTab) {
        case 0: addRow(base_urls[0],data); break;
        case 1: addRow(base_urls[1],data); break;
        case 2: addRow(base_urls[2],data); break;
      }
    });
  }
  const addRow = (compareUrl: string, data: any) => {
    let idx = -1;
    const tmp = [];
    for(let key in data) { // list 업데이트
      if(data[key].includes(compareUrl)) {
        tmp.push({
          title: key,
          url: data[key],
          idx: ++idx
        });
      }
    }
    setList(tmp);
  }
  
  return (
    <div id={id}>
      <ul id='unsolved-list'>
        {list.map(e=>{
          const { title, url, idx } = e as DataObject;
          return (
          <li className="li-question" value={idx}>
            <input type="checkBox" className="check-item"></input>
            <a href={url} target="_blank">{title}</a>
          </li>
          );
        })}
      </ul>
      <button onClick={()=>{chrome.storage.sync.clear(()=>alert('제거됨'))}}>제거</button>
    </div>
  );
}
export default ContentList;