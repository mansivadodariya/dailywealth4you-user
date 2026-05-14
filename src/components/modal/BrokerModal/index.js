'use client';

import React from 'react';
import styles from './brokerModal.module.scss';
import AuthButton from '@/components/authButton';

export default function BrokerModal({ broker, onClose }) {
  if (!broker) return null;

  const handleViewBroker = () => {
    if (broker?.redirectURL) {
      window.open(broker.redirectURL, '_blank');
    }
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Broker Details</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.divider} />

        {/* Body */}
        <div className={styles.body}>

          {/* Image */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Image</label>
            <div className={styles.imageBanner}>
              {broker?.logo ? (
                <img
                  src={broker.logo}
                  alt={broker?.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector(
                      `.${styles.imageFallback}`
                    );
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={styles.imageFallback}
                style={{ display: broker?.logo ? 'none' : 'flex' }}
              >
                <span>{broker?.name || 'Broker'}</span>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Name</label>
            <div className={styles.valueBox}>
              {broker?.name || '—'}
            </div>
          </div>

          {/* Description */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <div className={`${styles.valueBox} ${styles.descBox}`}>
              {broker?.description || 'No description available for this broker.'}
            </div>
          </div>

          {/* Redirect URL */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Redirect URL</label>
            <div className={styles.valueBox}>
              {broker?.redirectURL ? (
                <a
                  href={broker.redirectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.urlLink}
                >
                  {broker.redirectURL}
                </a>
              ) : (
                <span className={styles.placeholder}>No URL available</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.btnGroup}>
            <AuthButton text="View Broker  →" className={styles.viewBtn} onClick={handleViewBroker} />

            <AuthButton  outline text="Cancel ✕" className={styles.cancelBtn} onClick={onClose} />

          </div>

        </div>
      </div>
    </div>
  );
}