import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { InputProps } from './Input.types';
import './Input.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type = 'text',
      value,
      onChange,
      placeholder,
      label,
      error,
      icon,
      disabled = false,
      required = false,
      className,
      autoComplete,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const inputClasses = classNames(
      'input-field',
      {
        error: !!error,
      },
      className
    );

    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={id || name} className="input-label">
            {label}
            {required && <span className="required-star">*</span>}
          </label>
        )}
        <div className="input-container">
          <input
            ref={ref}
            id={id || name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            autoComplete={autoComplete}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {icon && <div className="input-icon">{icon}</div>}
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';