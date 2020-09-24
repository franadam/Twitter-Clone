import React from 'react';
import classes from './FormField.module.css';

const formField = ({ field, id, change, keyUp, focus, blur }) => {
  const renderTemplate = () => {
    let formTemplate = null;
    //console.log(' FORMFIELD field :>> ', field);

    const showError = () => {
      let errorMessage = (
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
                value={field.value}
                id={id}
                onChange={(event) => change({ event, id })}
                onKeyUp={(event) => keyUp(event)}
                onFocus={(event) => focus(event)}
                onBlur={(event) => blur(event)}
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
                value={field.value}
                id={id}
                onChange={(event) => change({ event, id })}
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
              value={field.value}
              onChange={(event) => change({ event, id })}
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
};

export default formField;
