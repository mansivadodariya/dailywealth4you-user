'use client';

import React, { useState } from 'react';
import styles from './input.module.scss';
import classNames from 'classnames';

export default function Input({
  label,
  placeholder,
  leftIcon,
  rightIcon,
  spacingRemove,
  leftSpacingRemove,
  placeholderWhite,
  type = 'text',
  ...props
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && isPasswordVisible ? 'text' : type;

  return (
    <div className={styles.input}>
      {label && <label>{label}</label>}
      <div
        className={classNames(
          styles.inputWrap,
          rightIcon ? styles.rightspacingAdded : '',
          spacingRemove ? styles.spacingRemove : '',
          leftSpacingRemove ? styles.leftSpacingRemove : '',
          placeholderWhite ? styles.placeholderWhite : ''
        )}
      >
        <input type={inputType} placeholder={placeholder} {...props} />
        {leftIcon && (
          <div className={styles.leftIcon}>
            <img src={leftIcon} alt={leftIcon} />
          </div>
        )}
        {rightIcon &&
          (isPasswordField ? (
            <button
              type="button"
              className={styles.rightIconButton}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              onClick={() => setIsPasswordVisible((value) => !value)}
            >
              <img src={rightIcon} alt="" />
            </button>
          ) : (
            <div className={styles.rightIcon}>
              <img src={rightIcon} alt={rightIcon} />
            </div>
          ))}
      </div>
    </div>
  );
}
