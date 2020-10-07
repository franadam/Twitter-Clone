import React from 'react';
import classes from './FormField.module.css';
import { showPassword } from '../../utils/validateForm';

function showPasswordField() {
  return (
    <div className={classes.show_password}>
      <label
        className={classes.show_password_label}
        htmlFor=" "
        id="checklabel"
      >
        <input id="checkbox" onClick={showPassword} type="checkbox" /> <span />
        Show Password
      </label>
    </div>
  );
}

export default showPasswordField;
