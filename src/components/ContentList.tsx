import React, {useState,useEffect, Component} from 'react';

type ContentListProps = {
  id: string;
  currentTab: number;
  siteList: {[key: string]: string}
}
type DataObject = {
  title: string;
  url: string;
  idx: number;
}
function ContentList({id, currentTab, siteList}: ContentListProps) {

  const [list,setList] = useState([{}]);
  const [count,setCount] = useState(0);
  const [isAllSelected,setIsAllSelected] = useState(false);

  useEffect(()=>{
    updateList();
    setCount(0);
    setIsAllSelected(false);
    (document.getElementById("select-all-btn") as HTMLButtonElement).innerHTML = "모두 선택";
    console.log('호출됨');
  },[currentTab]);
  const updateList = () => { // chrome storage 조회
    const urls = Object.keys(siteList);
    chrome.storage.sync.get(null, function(data) {
      switch (currentTab) {
        case 0: addRow(siteList[urls[0]],data); break;
        case 1: addRow(siteList[urls[1]],data); break;
        case 2: addRow(siteList[urls[2]],data); break;
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
  const countNumber = (idx: number) => {
    const element = document.getElementById('unsolved-list')!.children[idx].firstChild as HTMLInputElement;
    if(element.checked) {
      setCount(count+1);
    } else {
      setCount(count-1);
    }
  }
  const selectAll = () => { 
    const btn = document.getElementById("select-all-btn") as HTMLButtonElement;
    const check_item = document.querySelectorAll('.check-item');

    if (isAllSelected) {
      btn.innerHTML = "모두 선택";
      check_item.forEach(e => (e as HTMLInputElement).checked = false);
      setCount(0);
      setIsAllSelected(false);
    } else {
      btn.innerHTML = "모두 해제";
      check_item.forEach(e => (e as HTMLInputElement).checked = true);
      setCount(document.getElementById('unsolved-list')!.children.length);
      setIsAllSelected(true);
      
    }
  }
//   function deleteCheckedList() {
//     const result = confirm("선택 목록을 삭제하시겠습니까?");

//     if (result) {
//         const ul = document.getElementById("ul-question-list");
//         const li_list = ul.children;
//         const delete_list = [];
//         const ul_delete_list = [];

//         for (let i = 0; i < li_list.length; i++) { // remove 되면서 index가 하나씩 떨어졌고, 그래서 length가 3인 상황에서도 2개밖에 못 지웠던 것이다.
//             if (li_list[i].firstChild.checked) {
//                 delete_list.push(li_list[i].lastChild.textContent.split('] ')[1]);
//                 ul_delete_list.push(i);
//             }
//         }
//         deleteLi(ul_delete_list);
//         chrome.storage.sync.remove(delete_list, function () {
//             alert('삭제되었습니다.');
//         });
//     } else {
//         alert("취소 되었습니다.");
//     }
// }
  const deleteCheckedList = () => { // children이 HTMLCollection을 반환해서 forEach 사용 불가. HTMLCollection은 유사 객체 배열임을 이용해서 각 Element 순회

    const result = confirm("선택 목록을 삭제하시겠습니까?");

    if (result) {
      const ul = document.getElementById("unsolved-list") as HTMLElement;
      const li_list = ul.children;
      const delete_list: string[] = [];
      const ul_delete_list = [];

      for (let i = 0; i < li_list.length; i++) { // remove 되면서 index가 하나씩 떨어졌고, 그래서 length가 3인 상황에서도 2개밖에 못 지웠던 것이다.
        if ((li_list[i].firstChild! as HTMLInputElement).checked) {
          delete_list.push(li_list[i].lastChild!.textContent!);
          ul_delete_list.push(`${i}`);
        }
      }
      
      deleteLi(ul_delete_list);
      chrome.storage.sync.remove(delete_list, function () {
        alert('삭제되었습니다.');
      });
    } else {
      alert("취소 되었습니다.");
    }
  }
  const deleteLi = (arr: string[]) => { // 여기서 오류 발생!
    const ul = document.getElementById("unsolved-list") as HTMLUListElement;
    const li = document.getElementsByClassName("li-question");

    for (let i = 0; i < arr.length; ++i) {
      // console.log(li[i].getAttribute('value'));
      if (arr.includes(li[i].getAttribute("value")!)) { // 하나씩 밀린다.
        ul.removeChild(li[i]);
      }
    }
    setCount(0);
    setIsAllSelected(false); // 이렇게 되면 오류날 것 같은데?
    location.reload();
  }
  return (
    <div id={id}>
      <ul id='unsolved-list'>
        {list.map(e=>{
          const { title, url, idx } = e as DataObject;
          return (
          <li className="li-question" value={idx}>
            <input type="checkBox" className="check-item" onClick={()=>countNumber(idx)}></input>
            <a href={url} target="_blank">{title}</a>
          </li>
          );
        })}
      </ul>
      {count != 0 && <span id="count-span">{count}개 선택됨</span>}
      <div className="btn-wrapper">
        <button id="select-all-btn" className="content-btn" onClick={selectAll}>모두선택</button>
        <button id="delete-btn" className="content-btn" onClick={deleteCheckedList}>삭제</button>
      </div>
    </div>
  );
}
export default ContentList;

// useState를 3개나 걸어놔서 rendering이 매 호출마다 3번씩 되는줄 알았는데 한번만 호출된다?!