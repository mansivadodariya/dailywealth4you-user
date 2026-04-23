'use client';

import React from 'react';
import styles from './Loader.module.scss';

export default function Loader({
  variant = 'spinner',
  size = 'medium',
  color = 'primary',
  text = '',
  fullScreen = false,
  className = '',
}) {
  const loaderClasses = [
    styles.loader,
    styles[variant],
    styles[size],
    styles[color],
    fullScreen && styles.fullScreen,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (variant === 'spinner') {
    return (
      <div className={loaderClasses}>
        <div className={styles.spinner}>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
        </div>
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={loaderClasses}>
        <div className={styles.dots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={loaderClasses}>
        <div className={styles.pulse}>
          <div className={styles.pulseCircle}></div>
        </div>
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={loaderClasses}>
        <div className={styles.bars}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    );
  }

  // Default fallback
  return (
    <div className={loaderClasses}>
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle}></div>
        <div className={styles.spinnerCircle}></div>
        <div className={styles.spinnerCircle}></div>
        <div className={styles.spinnerCircle}></div>
      </div>
      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  );
}
