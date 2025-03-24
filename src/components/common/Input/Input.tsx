/* This code snippet is defining an interface named `InputProps` in TypeScript. Interfaces in
TypeScript are used to define the structure of an object. In this case, `InputProps` is defining the
expected properties and their types for an input component in a React application. */
import React, { forwardRef, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { InputProps } from './Input.types';
import './Input.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type = 'text',
      value = '',
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
    // Mémoïsation des noms de classes pour éviter de les recalculer à chaque rendu
    const inputClasses = useMemo(() => 
      classNames(
        'input-field',
        {
          error: !!error,
          'with-icon': !!icon,
          'disabled': disabled,
        },
        className
      ),
      [error, icon, disabled, className]
    );

    // Optimisations des gestionnaires d'événements
    const handleFocus = useCallback(() => {
      if (onFocus && !disabled) {
        onFocus();
      }
    }, [onFocus, disabled]);

    const handleBlur = useCallback(() => {
      if (onBlur && !disabled) {
        onBlur();
      }
    }, [onBlur, disabled]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled && onChange) {
          onChange(e);
        }
      },
      [disabled, onChange]
    );

    // Générer un identifiant unique si non fourni
    const inputId = useMemo(() => id || `input-${name}`, [id, name]);

    // Attributs d'accessibilité
    const ariaAttributes = useMemo(() => {
      const attrs: {[key: string]: string} = {};
      
      if (error) {
        attrs['aria-invalid'] = 'true';
        attrs['aria-describedby'] = `${inputId}-error`;
      }
      
      if (required) {
        attrs['aria-required'] = 'true';
      }
      
      return attrs;
    }, [error, required, inputId]);

    return (
      <div className="input-wrapper">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="required-star" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="input-container">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            autoComplete={autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...ariaAttributes}
          />
          {icon && <div className="input-icon" aria-hidden="true">{icon}</div>}
        </div>
        {error && (
          <p 
            className="error-message" 
            id={`${inputId}-error`}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
