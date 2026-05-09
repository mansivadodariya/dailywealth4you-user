'use client';

import React from 'react';
import styles from './authButton.module.scss';
import classNames from 'classnames';

export default function AuthButton({
  text,
  icon,
  type = 'button',
  onClick,
  outline,
  disabled,
  danger,
}) {
  return (
    <div
      className={classNames(
        styles.authbutton,
        outline ? styles.outlineButton : '',
        danger && styles.dangerButton
      )}
    >
      <button
        aria-label={text}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
        {icon && <img src={icon} alt={icon} />}
      </button>
    </div>
  );
}
