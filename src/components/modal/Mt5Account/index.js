'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrokers } from '@/store/slice/accountSlice';
import styles from './Mt5Account.module.scss';
import RightLight from '@/icons/rightLight';
import AuthButton from '@/components/authButton';
import UseExisting from '../useExisting';
import { toast } from 'react-toastify';

const DownIcon = '/assets/icons/down.svg';
const RightIcon = '/assets/icons/right.svg';
const RightWhiteIcon = '/assets/icons/right-white.svg';

export default function Mt5Account() {
  const dispatch = useDispatch();
  const { brokers, loading, error } = useSelector((state) => state?.account);
  console.log('Brokers:', brokers);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const dropdownRef = useRef(null);
  const [openExitingAccount, setOpenExitingAccount] = useState(false);
  const [existingBrokerId, setExistingBrokerId] = useState(null);

  useEffect(() => {
    dispatch(fetchBrokers({ page, limit }));
  }, [dispatch, page, limit]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (broker) => {
    setSelectedBroker(broker); // pura object store karo
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleContinue = () => {
    if (!selectedBroker) {
      return alert('Please select a broker');
    }

    if (selectedBroker.redirectURL) {
      window.open(selectedBroker.redirectURL, '_blank');
    } else {
      alert('Redirect URL not available');
    }
  };

  return (
    <>
      <div className={styles.mt5AccountWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Create a new MT5 account</h2>
            <p>Create a new MT5 account or use existing</p>
          </div>
          <div className={styles.modalbody}>
            <div className={styles.realtive} ref={dropdownRef}>
              <div className={styles.inputBox} onClick={toggleDropdown}>
                <input
                  type="text"
                  readOnly
                  value={selectedBroker?.name || ''}
                  placeholder={
                    loading ? 'Loading brokers...' : 'Select a Forex Broker'
                  }
                />
                <div
                  className={`${styles.rightIcon} ${isOpen ? styles.rotated : ''}`}
                >
                  <img src={DownIcon} alt="DownIcon" />
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className={styles.dropdownMenu}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {brokers?.map((broker, index) => (
                      <div
                        key={broker?.id}
                        className={styles.dropdownItem}
                        onClick={() => handleSelect(broker)}
                      >
                        <div className={styles.iconBox}>
                          <img
                            src={broker?.logo}
                            alt={broker?.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/icons/user.svg'; // Fallback to user icon
                            }}
                          />
                        </div>
                        <span className={styles.brokerName}>
                          {broker?.name}
                        </span>
                        <div className={styles.arrowIcon}>
                          <RightLight />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {error && <p className={styles.error}>Error: {error}</p>}
            <div className={styles.buttonSpacing}>
              <AuthButton
                text="Continue"
                icon={RightIcon}
                onClick={handleContinue}
              />
            </div>
            <div className={styles.ortext}>
              <div className={styles.line}></div>
              <span>Or</span>
              <div className={styles.line}></div>
            </div>
            <AuthButton
              outline
              text="Use Existing MT5 Account"
              icon={RightWhiteIcon}
              onClick={() => {
                if (!selectedBroker) {
                  toast.error('Please select a broker first');
                  return;
                }
                setExistingBrokerId(selectedBroker.id);
                setOpenExitingAccount(true);
              }}
            />
          </div>
        </div>
      </div>
      {openExitingAccount && (
        <UseExisting
          brokerId={existingBrokerId}
          onClose={() => setOpenExitingAccount(false)}
        />
      )}
    </>
  );
}
