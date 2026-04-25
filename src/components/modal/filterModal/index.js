'use client';

import React, { useState } from 'react';
import styles from './filterModal.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

/**
 * Generic filter modal.
 *
 * Props:
 *   onClose()           — called when Cancel is clicked or after Apply
 *   onApply(filters)    — called with the filter object on Apply
 *                         If NOT provided, falls back to dispatching fetchIbProfitSharing
 *   fields              — array of field configs to show (default: date + profit + commission)
 *                         Each: { key, label, type: 'date' | 'number', placeholder? }
 */
const DEFAULT_FIELDS = [
  {
    group: 'Select Date Range',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
    ],
  },
  {
    group: 'Select Profit Range',
    fields: [
      { key: 'minProfit', label: 'Min', type: 'number', placeholder: 'Min' },
      { key: 'maxProfit', label: 'Max', type: 'number', placeholder: 'Max' },
    ],
  },
  {
    group: 'Select Commission Range',
    fields: [
      {
        key: 'minCommission',
        label: 'Min',
        type: 'number',
        placeholder: 'Min',
      },
      {
        key: 'maxCommission',
        label: 'Max',
        type: 'number',
        placeholder: 'Max',
      },
    ],
  },
];

export default function FilterModal({ onClose, onApply, fieldGroups }) {
  const groups = fieldGroups || DEFAULT_FIELDS;

  // Build initial state from all field keys
  const initialValues = {};
  groups.forEach((g) =>
    g.fields.forEach((f) => {
      initialValues[f.key] = '';
    })
  );
  const [values, setValues] = useState(initialValues);

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = () => {
    // Build filters — only include non-empty values
    const filters = {};
    Object.entries(values).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) filters[k] = v;
    });

    if (onApply) {
      // Caller handles the dispatch
      onApply(filters);
    }
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Filters</h2>
        </div>

        <div className={styles.modalBody}>
          {groups.map((group) => (
            <div key={group.group} className={styles.section}>
              <label className={styles.sectionLabel}>{group.group}</label>
              <div className={styles.row}>
                {group.fields.map((field) => (
                  <div key={field.key} className={styles.inputWrapper}>
                    <input
                      type={field.type}
                      className={styles.input}
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder || field.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

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
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
