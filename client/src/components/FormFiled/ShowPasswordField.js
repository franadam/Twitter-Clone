import React from 'react';

const showPasswordField = ({ showPasswordHandler }) => {
  return (
    <div className="row">
      <div className="col col-25" />
      <div className="col col-75">
        <div className="col col-25" />
        <div className="col col-75">
          <label className="checklabel" htmlFor="checkbox" id="checklabel">
            <input
              className="showpw"
              id="checkbox"
              onClick={showPasswordHandler}
              type="checkbox"
            />{' '}
            Show Password
            <span className="checkmark" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default showPasswordField;
