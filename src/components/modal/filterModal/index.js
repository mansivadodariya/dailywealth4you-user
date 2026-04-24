'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchIbProfitSharing } from '@/store/slice/ibUserSlice';
import { toast } from 'react-toastify';
import styles from './filterModal.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

export default function FilterModal({ onClose }) {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minProfit, setMinProfit] = useState('');
  const [maxProfit, setMaxProfit] = useState('');
  const [minCommission, setMinCommission] = useState('');
  const [maxCommission, setMaxCommission] = useState('');

  const handleApply = async () => {
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (minProfit !== '') filters.minProfit = minProfit;
    if (maxProfit !== '') filters.maxProfit = maxProfit;
    if (minCommission !== '') filters.minCommission = minCommission;
    if (maxCommission !== '') filters.maxCommission = maxCommission;

    try {
      await dispatch(fetchIbProfitSharing(filters)).unwrap();
      if (onClose) onClose();
    } catch {
      toast.error('Failed to apply filters.');
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Filters</h2>
        </div>

        <div className={styles.modalBody}>
          {/* Date Range */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Select Date Range</label>
            <div className={styles.row}>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  className={styles.input}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  className={styles.input}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </div>
            </div>
          </div>

          {/* Profit Range */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Select Profit Range</label>
            <div className={styles.row}>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={minProfit}
                  onChange={(e) => setMinProfit(e.target.value)}
                  placeholder="Min"
                />
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={maxProfit}
                  onChange={(e) => setMaxProfit(e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Commission Range */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>
              Select Commission Range
            </label>
            <div className={styles.row}>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={minCommission}
                  onChange={(e) => setMinCommission(e.target.value)}
                  placeholder="Min"
                />
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={maxCommission}
                  onChange={(e) => setMaxCommission(e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.actions}>
            <AuthButton
              text="Apply Filters"
              icon={RightIcon}
              onClick={handleApply}
            />
            <AuthButton
              text="Cancel"
              outline
              icon={CloseIcon}
              onClick={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
