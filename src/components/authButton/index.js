'use client';

import React from 'react';
import styles from './authButton.module.scss';

export default function AuthButton({
  text,
  icon,
  type = 'button',
  onClick,
  disabled,
}) {
  return (
    <div className={styles.authbutton}>
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
