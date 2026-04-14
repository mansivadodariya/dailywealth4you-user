'use client';

import React from 'react';
import styles from './input.module.scss';
import classNames from 'classnames';

export default function Input({
  label,
  placeholder,
  leftIcon,
  rightIcon,
  spacingRemove,
  type = 'text',
  ...props
}) {
  return (
    <div className={styles.input}>
      <label>{label}</label>
      <div
        className={classNames(
          styles.inputWrap,
          rightIcon ? styles.rightspacingAdded : '',
          spacingRemove ? styles.spacingRemove : ''
        )}
      >
        <input type={type} placeholder={placeholder} {...props} />
        {leftIcon && (
          <div className={styles.leftIcon}>
            <img src={leftIcon} alt={leftIcon} />
          </div>
        )}
        {rightIcon && (
          <div className={styles.rightIcon}>
            <img src={rightIcon} alt={rightIcon} />
          </div>
        )}
      </div>
    </div>
  );
}
