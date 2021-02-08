import React from 'react';
import NavElement from './NavElement';

type NavProps = {
  // list: Array<string>,
  list: {[key:string]: string}
  onClickTabHandler: (index: number) => void
}
const NavBar = ({list, onClickTabHandler}: NavProps) => {
  return (
    <div id="navBar">
      {Object.keys(list).map((tabTitle,index)=>{
        if(index === 0) return <NavElement index={index} id={`nav${index}`} className='nav-element current-tab' tabTitle={tabTitle} onClickTabHandler={onClickTabHandler}/>
        return <NavElement index={index} id={`nav${index}`} className='nav-element' tabTitle={tabTitle} onClickTabHandler={onClickTabHandler}/>
      })}
    </div>
  )
}
export default NavBar;