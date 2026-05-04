'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './useExisting.module.scss';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import {
  updateTradingAccount,
  createTradingAccount,
  fetchBrokers,
} from '@/store/slice/accountSlice';
import toast from 'react-hot-toast';
import Mt5Account from '../Mt5Account';

const RightIcon = '/assets/icons/right.svg';
const DownIcon = '/assets/icons/down.svg';

// ─── Validation schemas ───────────────────────────────────────────────────────
const createSchema = Yup.object({
  brokerId: Yup.string().required('Please select a broker'),
  server: Yup.string().required('Server is required'),
  loginId: Yup.string().required('MT5 Login ID is required'),
  password: Yup.string()
    .required('Password is required'),
    // .min(4, 'Password must be at least 4 characters'),
  sizeOfAccount: Yup.number()
    .typeError('Size of account must be a number')
    // .positive('Must be a positive number')
    .required('Size of account is required'),
  agreed: Yup.boolean().oneOf(
    [true],
    'You must accept the Terms & Conditions'
  ),
});

const editSchema = Yup.object({
  brokerId: Yup.string().required('Please select a broker'),
  server: Yup.string().required('Server is required'),
  loginId: Yup.string().required('MT5 Login ID is required'),
  sizeOfAccount: Yup.number()
    .typeError('Size of account must be a number')
    // .positive('Must be a positive number')
    .required('Size of account is required'),
});

export default function UseExisting({
  isEdit = false,
  account = null,
  onClose,
  brokerId = null,
  selectedBroker = null, // full broker object passed from Mt5Account
}) {
  const dispatch = useDispatch();
  const { loading, brokers } = useSelector((state) => state?.account);
  const { user } = useSelector((state) => state?.login);

  const overlayRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMt5Modal, setShowMt5Modal] = useState(false);

  // Fetch brokers list on mount
  useEffect(() => {
    dispatch(fetchBrokers({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Resolve initial brokerId — prefer the passed selectedBroker, then brokerId prop, then account broker
  const initialBrokerId =
    selectedBroker?.id ||
    brokerId ||
    account?.broker?.id ||
    account?.brokerId ||
    '';

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      brokerId: initialBrokerId,
      server: account?.platform || account?.server || '',
      loginId: account?.brokerUserId || account?.mt5LoginId || account?.accountId || '',
      password: '',
      sizeOfAccount: account?.sizeOfAccount || '',
      agreed: false,
    },
    validationSchema: isEdit ? editSchema : createSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isEdit) {
        const payload = {
          id: account?.id || account?._id || '',
          userId: account?.userId || account?.user?.id || '',
          brokerId: values.brokerId,
          brokerName: getSelectedBrokerName(values.brokerId),
          sizeOfAccount: values.sizeOfAccount,
          mt5LoginId: values.loginId,
          ...(values.server ? { platform: values.server } : {}),
          ...(values.password ? { password: values.password } : {}),
          server: values.server,
        };
        try {
          await dispatch(updateTradingAccount(payload)).unwrap();
          if (onClose) onClose();
        } catch (error) {
          toast.error(error?.message || error || 'Failed to update MT5 account.');
        }
      } else {
        const payload = {

          userId: user?.id || '',
          brokerId: values.brokerId,
          brokerName: getSelectedBrokerName(values.brokerId),
          sizeOfAccount: values.sizeOfAccount,
          server: values.server,
          mt5LoginId: values.loginId,
          password: values.password,
        };
        try {
          await dispatch(createTradingAccount(payload)).unwrap();
          toast.success('MT5 account created successfully.');
          resetForm();
          if (onClose) onClose();
        } catch (error) {
          toast.error(error?.message || error || 'Failed to create MT5 account.');
        }
      }
    },
  });

  const getSelectedBrokerName = (id) => {
    const broker = brokers?.find((b) => b?.id === id);
    return broker?.name || '';
  };

  const getSelectedBroker = (id) => brokers?.find((b) => b?.id === id);

  const activeBroker = getSelectedBroker(formik.values.brokerId);

  return (
    <>
      <div
        className={styles.useExistingWrapper}
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current && onClose) onClose();
        }}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>{isEdit ? 'Edit MT5 Account' : 'Use existing MT5 account'}</h2>
            <p>
              {isEdit
                ? 'Please provide following details to edit MT5 account'
                : 'Please provide following details to add MT5 account'}
            </p>
          </div>

          <form className={styles.modalBody} onSubmit={formik.handleSubmit}>
            <div className={styles.singleCol}>

              {/* ── Broker Dropdown ─────────────────────────────────────── */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Broker Name</label>
                <div className={styles.dropdownWrapper} ref={dropdownRef}>
                  <div
                    className={`${styles.dropdownTrigger} ${
                      formik.touched.brokerId && formik.errors.brokerId
                        ? styles.inputError
                        : ''
                    }`}
                    onClick={() => setIsDropdownOpen((p) => !p)}
                  >
                    {activeBroker ? (
                      <div className={styles.selectedBroker}>
                        <img
                          src={activeBroker.logo}
                          alt={activeBroker.name}
                          className={styles.brokerLogo}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/icons/user.svg';
                          }}
                        />
                        <span>{activeBroker.name}</span>
                      </div>
                    ) : (
                      <span className={styles.placeholder}>Select a broker</span>
                    )}
                    <img
                      src={DownIcon}
                      alt="down"
                      className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`}
                    />
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className={styles.dropdownMenu}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {brokers?.map((broker) => (
                          <div
                            key={broker?.id}
                            className={`${styles.dropdownItem} ${
                              formik.values.brokerId === broker?.id
                                ? styles.dropdownItemActive
                                : ''
                            }`}
                            onClick={() => {
                              formik.setFieldValue('brokerId', broker?.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <img
                              src={broker?.logo}
                              alt={broker?.name}
                              className={styles.brokerLogo}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/icons/user.svg';
                              }}
                            />
                            <span>{broker?.name}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {formik.touched.brokerId && formik.errors.brokerId && (
                  <span className={styles.error}>{formik.errors.brokerId}</span>
                )}
              </div>

              {/* ── Server ──────────────────────────────────────────────── */}
              <div className={styles.fieldGroup}>
                <Input
                  label="Server"
                  leftSpacingRemove
                  name="server"
                  value={formik.values.server}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Exness-Real"
                />
                {formik.touched.server && formik.errors.server && (
                  <span className={styles.error}>{formik.errors.server}</span>
                )}
              </div>

              {/* ── MT5 Login ID ─────────────────────────────────────────── */}
              <div className={styles.fieldGroup}>
                <Input
                  label="MT5 Login ID"
                  leftSpacingRemove
                  name="loginId"
                  value={formik.values.loginId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your MT5 login ID"
                />
                {formik.touched.loginId && formik.errors.loginId && (
                  <span className={styles.error}>{formik.errors.loginId}</span>
                )}
              </div>

              {/* ── Password ─────────────────────────────────────────────── */}
              <div className={styles.fieldGroup}>
                <Input
                  label="Password"
                  leftSpacingRemove
                  type="password"
                  name="password"
                  placeholder={isEdit ? 'Leave blank to keep current' : 'Enter MT5 password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <span className={styles.error}>{formik.errors.password}</span>
                )}
              </div>

              {/* ── Size of Account ──────────────────────────────────────── */}
              <div className={styles.fieldGroup}>
                <Input
                  label="Size of Account"
                  leftSpacingRemove
                  name="sizeOfAccount"
                  value={formik.values.sizeOfAccount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 10000"
                />
                {formik.touched.sizeOfAccount && formik.errors.sizeOfAccount && (
                  <span className={styles.error}>{formik.errors.sizeOfAccount}</span>
                )}
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>
                You will get <strong>{user?.commission} %</strong> of total
                profit <br />
                gained on this account
              </p>
            </div>

            {/* ── Terms checkbox (create only) ─────────────────────────── */}
            {!isEdit && (
              <div className={styles.checkboxGroup}>
                <div className={styles.checkboxdesign}>
                  <label>
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formik.values.agreed}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <span className={styles.customCheckbox}></span>
                    <p>
                      I agree to the CredBlaze <a>Terms & Conditions</a> and{' '}
                      <a>Privacy Policy</a>
                    </p>
                  </label>
                </div>
                {formik.touched.agreed && formik.errors.agreed && (
                  <span className={styles.error}>{formik.errors.agreed}</span>
                )}
              </div>
            )}

            <AuthButton
              text={
                loading
                  ? 'Please wait...'
                  : isEdit
                    ? 'Update Account'
                    : 'Save Account'
              }
              icon={RightIcon}
              type="submit"
              disabled={loading}
            />

            {!isEdit && (
              <>
                <div className={styles.ortext}>
                  <div className={styles.line}></div>
                  <span>OR</span>
                  <div className={styles.line}></div>
                </div>
                <AuthButton
                  text="Create a new MT5 account"
                  outline
                  icon={RightIcon}
                  onClick={() => setShowMt5Modal(true)}
                />
              </>
            )}
          </form>
        </div>
      </div>

      {showMt5Modal && (
        <Mt5Account
          onClose={() => {
            setShowMt5Modal(false);
            if (onClose) onClose();
          }}
        />
      )}
    </>
  );
}
