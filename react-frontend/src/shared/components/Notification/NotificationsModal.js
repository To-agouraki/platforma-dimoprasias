import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "../UIElements/Backdrop";
import { CSSTransition } from "react-transition-group";

import "../UIElements/Modal.css";

const ModalOverlay = (props) => {
  //blueprint modal vasika ftiagmeno gia na pintonis pramat
  const content = (
    <div className={`modal ${props.children}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          <div
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {props.children}
          </div>
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const NotificationsModal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default NotificationsModal;
