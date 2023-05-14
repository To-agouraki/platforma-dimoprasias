import "./SideDrawer.css";
import ReactDOM from "react-dom";
import React from "react";
import { CSSTransition } from "react-transition-group";
const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>{/*onclick pernimeni onlcik pou to props */}
    </CSSTransition>
  );
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
