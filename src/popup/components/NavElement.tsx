import React from 'react';

type NavElementProps = {
  index: number;
  className: string,
  id: string,
  tabTitle: string,
  onClickTabHandler: (index: number) => void
}
const NavElement = ({index,className,id,tabTitle,onClickTabHandler}: NavElementProps) => {
  return (<div id={id} className={className} onClick={()=>onClickTabHandler(index)}>{tabTitle}</div>);
}
export default NavElement;