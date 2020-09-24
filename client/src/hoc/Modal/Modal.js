import React from 'react';
import classes from './Modal.module.css';

const Modal = (props) => {
  console.log('Modal props :>> ', props);
  const modal = document.getElementById('myModal');

  const spanHandler = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  return (
    <div id="myModal" className={classes.main}>
      <div className={classes.content}>
        <span className={classes.close} onClick={() => spanHandler()}>
          &times;
        </span>
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default Modal;
