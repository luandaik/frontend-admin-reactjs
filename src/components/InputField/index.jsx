import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Controller } from 'react-hook-form';

InputField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

function InputField(props) { 
  const { form, name, label, disabled } = props;
  const { errors, formState } = form;
  const hasError = formState.touched[name] && errors[name];
  return (
    <Controller
      error={!!hasError}
      id="standard-error-helper-text"
      name={name}
      control={form.control}
      as={TextField}
      label={label}
      fullWidth
      disabled={disabled}
      helperText={errors[name]?.message}
      variant="outlined"
      
    />
  );
}

export default InputField;
