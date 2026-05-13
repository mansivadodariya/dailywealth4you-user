'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AuthButton from '@/components/authButton';
import styles from './CloseWalletRequestModal.module.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const NETWORK_OPTIONS = ['TRC20', 'ERC20', 'BEP20'];

/**
 * Shared modal: wallet address + network, submit close request (pool or account).
 */
export default function CloseWalletRequestModal({
  open,
  onClose,
  title,
  description,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit Request',
  submittingLabel = 'Submitting...',
}) {
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [networkOpen, setNetworkOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      walletAddress: '',
      network: '',
    },
  
    validationSchema: Yup.object({
      walletAddress: Yup.string()
        .trim()
        .required('Wallet address is required')
        .min(10, 'Please enter a valid crypto wallet address'),
  
      network: Yup.string().required('Please select a network'),
    }),
  
    onSubmit: async (values) => {
      try {
        await onSubmit({
          address: values.walletAddress.trim(),
          network: values.network,
        });
      } catch {
        // handled outside
      }
    },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
      setNetworkOpen(false);
    }
  }, [open]);;

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) onClose();
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };


  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <form className={styles.form} onSubmit={formik.handleSubmit}>
        <div className={styles.fieldGroup}>
  <label className={styles.fieldLabel}>
    Crypto Wallet Address
  </label>

  <input
    name="walletAddress"
    className={`${styles.walletInput} ${
      formik.touched.walletAddress &&
      formik.errors.walletAddress
        ? styles.inputError
        : ''
    }`}
    type="text"
    placeholder="Enter wallet address"
    value={formik.values.walletAddress}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    autoComplete="off"
    spellCheck={false}
  />

  {formik.touched.walletAddress &&
    formik.errors.walletAddress && (
      <span className={styles.errorText}>
        {formik.errors.walletAddress}
      </span>
    )}
</div>

<div className={styles.fieldGroup}>
  <label className={styles.fieldLabel}>Network</label>

  <div className={styles.networkWrapper}>
    <button
      type="button"
      className={`${styles.networkSelector} ${
        formik.touched.network && formik.errors.network
          ? styles.inputError
          : ''
      }`}
      onClick={() => setNetworkOpen((prev) => !prev)}
    >
      <span
        className={
          formik.values.network
            ? styles.networkValue
            : `${styles.networkValue} ${styles.networkPlaceholder}`
        }
      >
        {formik.values.network || 'Select Network'}
      </span>

      <span
        className={
          networkOpen
            ? `${styles.networkChevron} ${styles.open}`
            : styles.networkChevron
        }
      >
        v
      </span>
    </button>

    {networkOpen && (
      <div className={styles.networkDropdown}>
        {NETWORK_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={
              formik.values.network === option
                ? `${styles.networkOption} ${styles.selected}`
                : styles.networkOption
            }
            onClick={() => {
              formik.setFieldValue('network', option);
              setNetworkOpen(false);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    )}

    {formik.touched.network &&
      formik.errors.network && (
        <span className={styles.errorText}>
          {formik.errors.network}
        </span>
      )}
  </div>
</div>

          <div className={styles.actions}>
            <AuthButton
              outline
              text="Cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
            />
            <AuthButton
              danger
              text={isSubmitting ? submittingLabel : submitLabel}
              type="submit"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
