import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="btn-wrapper">
        <button className="select-all-btn action-btns">모두 선택</button>
        <button className="delete-btn action-btns">삭제</button>
      </div>
      <ul id="ul-question-list">
      </ul>
    </div>
  );
};

export default App;
