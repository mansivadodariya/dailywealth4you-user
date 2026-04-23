'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFaqs } from '@/store/slice/accountSlice';
import styles from './faq.module.scss';
import Loader from '@/components/Loader';

export default function FAQS() {
  const dispatch = useDispatch();
  const { faqs, faqsLoading, faqsError } = useSelector(
    (state) => state.account
  );

  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const displayFaqs = Array.isArray(faqs) ? faqs : [];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Frequently Asked Questions</h2>

      {faqsLoading ? (
        <Loader
          variant="dots"
          size="large"
          color="success"
          text="Loading faqs..."
        />
      ) : faqsError ? (
        <p style={{ color: '#ff4d4d' }}>Error loading FAQs</p>
      ) : displayFaqs.length === 0 ? (
        <p style={{ color: '#fff' }}>No FAQs found.</p>
      ) : (
        <div className={styles.grid}>
          {displayFaqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item?.id || index} className={styles.faqCard}>
                {/* Header */}
                <div
                  className={styles.faqItem}
                  onClick={() => toggleFaq(index)}
                >
                  <span className={styles.faqText}>{item?.question}</span>
                  <span className={styles.faqIcon}>{isOpen ? '−' : '+'}</span>
                </div>

                {/* Answer (always mounted) */}
                <div
                  className={`${styles.faqAnswer} ${isOpen ? styles.open : ''}`}
                >
                  {item?.answer || 'Lorem ipsum dolor sit amet...'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
