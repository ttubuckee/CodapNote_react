import React, {useState,useEffect} from "react";
import SettingHeader from './components/SettingHeader';
import NavBar from './components/NavBar';
import ContentList from './components/ContentList';
import "./App.css";

// const siteList = ['백준','프로그래머스','해커랭크'];
const siteList = {
  "백 준":"https://www.acmicpc.net/",
  "프로그래머스":"https://programmers.co.kr/",
  "해커랭크":"https://www.hackerrank.com/"
};
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
      <ContentList id='content-div' currentTab={currentTab} siteList={siteList}/>
    </div>
  );
};

export default App;
