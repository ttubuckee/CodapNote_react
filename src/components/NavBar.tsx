import React from 'react';
import NavElement from './NavElement';

type NavProps = {
  list: Array<string>,
  onClickTabHandler: (index: number) => void
}
const NavBar = ({list, onClickTabHandler}: NavProps) => {
  return (
    <div id="navBar">
      <NavElement index={0} id={`nav${0}`} className='nav-element current-tab' tabTitle={list[0]} onClickTabHandler={onClickTabHandler}/>
      <NavElement index={1} id={`nav${1}`} className='nav-element' tabTitle={list[1]} onClickTabHandler={onClickTabHandler}/>
      <NavElement index={2} id={`nav${2}`} className='nav-element' tabTitle={list[2]} onClickTabHandler={onClickTabHandler}/>
      {/* {list.map((tabTitle,index)=>{
        return <NavElement index={index} id={`nav${index}`} className='nav-element' tabTitle={tabTitle} onClickTabHandler={onClickTabHandler}/>
      })} */}
    </div>
  )
}
export default NavBar;