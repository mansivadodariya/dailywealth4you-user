'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFaqs } from '@/store/slice/accountSlice';
import styles from './faq.module.scss';

export default function FAQS() {
  const dispatch = useDispatch();
  const { faqs, faqsLoading, faqsError } = useSelector(
    (state) => state.account
  );

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const displayFaqs = Array.isArray(faqs) ? faqs : [];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Frequently Asked Questions</h2>

      {faqsLoading ? (
        <p style={{ color: '#fff' }}>Loading FAQs...</p>
      ) : faqsError ? (
        <p style={{ color: '#ff4d4d' }}>Error loading FAQs</p>
      ) : displayFaqs.length === 0 ? (
        <p style={{ color: '#fff' }}>No FAQs found.</p>
      ) : (
        <div className={styles.grid}>
          {displayFaqs.map((item, index) => (
            <div key={item?.id || index} className={styles.faqItem}>
              <span className={styles.faqText}>{item?.question}</span>
              <span className={styles.faqIcon}>+</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
