import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearError } from '../../store/actions';

import classes from './Modal.module.css';

function Modal(props) {
  // Console.log('Modal props :>> ', props);
  const modal = document.getElementById('myModal'),
    spanHandler = () => {
      modal.style.display = 'none';
      props.clearError();
      if (props.actions) {
        props.actions();
      }
    };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      props.clearError();
      if (props.actions) {
        props.actions();
      }
    }
  };

  return (
    <div className={classes.main} id="myModal">
      <div className={classes.content}>
        <span className={classes.close} onClick={() => spanHandler()}>
          &times;
        </span>
        <div className={classes.children}>{props.children}</div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ error }) => ({
  error: error.users,
});

Modal.propTypes = {
  error: PropTypes.object,
  children: PropTypes.object,
  actions: PropTypes.func,
  clearError: PropTypes.func,
};

export default connect(mapStateToProps, { clearError })(Modal);
