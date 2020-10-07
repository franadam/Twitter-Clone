import React from 'react';
import classes from './FormField.module.css';
import PropTypes from 'prop-types';

function formField({ field, id, change, keyUp, focus, blur }) {
  const renderTemplate = () => {
    let formTemplate = null;

    const showError = () => {
      const errorMessage = (
        <div className={classes.error}>
          {field.validation && !field.valid ? field.validationMessage : null}
        </div>
      );
      return errorMessage;
    };

    switch (field.element) {
      case 'input':
        if (field.config.name === 'password' && keyUp && focus && blur) {
          formTemplate = (
            <>
              <input
                className={classes.fInput}
                {...field.config}
                id={id}
                onBlur={(event) => blur(event)}
                onChange={(event) => change({ event, id })}
                onFocus={(event) => focus(event)}
                onKeyUp={(event) => keyUp(event)}
                value={field.value}
              />
              {showError()}
            </>
          );
        } else if (field.config.type === 'file') {
          formTemplate = (
            <>
              <input
                className={classes.fInput}
                {...field.config}
                id={id}
                onChange={(event) => change({ event, id })}
              />
              {showError()}
            </>
          );
        } else {
          formTemplate = (
            <>
              <input
                className={classes.fInput}
                {...field.config}
                id={id}
                onChange={(event) => change({ event, id })}
                value={field.value}
              />
              {showError()}
            </>
          );
        }
        break;

      case 'select':
        formTemplate = (
          <>
            <select
              className={classes.fInput}
              onChange={(event) => change({ event, id })}
              value={field.value}
            >
              <option>Select One</option>
              {field.config.options.map((e) => (
                <option key={e.key} value={e.value}>
                  {e.name ? e.name : e.value}
                </option>
              ))}
            </select>
            {showError()}
          </>
        );
        break;
      default:
        formTemplate = null;
    }

    return formTemplate;
  };

  return <>{renderTemplate()}</>;
}

formField.propTypes = {
  field: PropTypes.object,
  id: PropTypes.string,
  blur: PropTypes.func,
  change: PropTypes.func,
  submit: PropTypes.func,
  focus: PropTypes.func,
  keyUp: PropTypes.func,
};

export default formField;
