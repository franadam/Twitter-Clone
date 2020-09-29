import React from 'react';
import { connect } from 'react-redux';
import { clearError } from '../../store/actions';

import classes from './Modal.module.css';

const Modal = (props) => {
  console.log('Modal props :>> ', props);
  const modal = document.getElementById('myModal');

  const spanHandler = () => {
    modal.style.display = 'none';
    props.clearError();
    if (props.actions) props.actions();
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      props.clearError();
      if (props.actions) props.actions();
    }
  };

  return (
    <div id="myModal" className={classes.main}>
      <div className={classes.content}>
        <span className={classes.close} onClick={() => spanHandler()}>
          &times;
        </span>
        <div className={classes.children}>{props.children}</div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return {
    error: user.error,
  };
};

export default connect(mapStateToProps, { clearError })(Modal);
