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
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
      props.clearError();
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

const mapStateToProps = ({ user }) => {
  return {
    error: user.error,
  };
};

export default connect(mapStateToProps, { clearError })(Modal);
