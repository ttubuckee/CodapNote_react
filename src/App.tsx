import React, {useState} from "react";
// import logo from "./logo.svg";
import SettingHeader from './components/SettingHeader';
import NavBar from './components/NavBar';
import "./App.css";

const siteList = ['백준','프로그래머스','해커랭크'];
const App = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const onClickTabHandler = (index: number) => {
    document.getElementById(`nav${currentTab}`)?.classList.remove('current-tab');
    document.getElementById(`nav${index}`)?.classList.add('current-tab');
    setCurrentTab(index);
  }
  return (
    <div className="App">
      <SettingHeader text={'setting'}/>
      <NavBar list={siteList} onClickTabHandler={onClickTabHandler}/>
    </div>
  );
  // return (
  //   <div className="App">
  //     <div className="btn-wrapper">
  //       <button className="select-all-btn action-btns">모두 선택</button>
  //       <button className="delete-btn action-btns">삭제</button>
  //     </div>
  //     <ul id="ul-question-list">
  //     </ul>
  //   </div>
  // );
};

export default App;
