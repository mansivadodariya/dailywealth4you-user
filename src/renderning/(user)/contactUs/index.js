'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './contactUs.module.scss';
import AuthButton from '@/components/authButton';
import { createContactUs } from '@/store/slice/accountSlice';

const RightIcon = '/assets/icons/right.svg';

export default function ContactUs() {
  const dispatch = useDispatch();
  // const { userdetails } = useSelector((state) => state?.signup);
  const { user } = useSelector((state) => state?.login);

  const { loading } = useSelector((state) => state.account);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // const payload = formData; // Commented out formData
    const payload = {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      description: formData.description,
    };
    dispatch(createContactUs(payload));
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      subject: '',
      description: '',
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Describe Your Concern</h2>

        {/* <div className={styles.inputGrid}>
          <div className={styles.inputWrapper}>
            <input
              name="firstName"
              placeholder="First Name"
              className={styles.inputField}
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              name="lastName"
              placeholder="Last Name"
              className={styles.inputField}
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.inputGrid}>
          <div className={styles.inputWrapper}>
            <input
              name="phone"
              placeholder="Phone Number"
              className={styles.inputField}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              name="email"
              placeholder="Email Address"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div> */}

        {/* <div className={styles.inputWrapper}>
          <input
            name="subject"
            placeholder="Subject"
            className={styles.inputField}
            value={formData.subject}
            onChange={handleChange}
          />
        </div> */}

        <div className={styles.textareaWrapper}>
          <textarea
            name="description"
            className={styles.textarea}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.submitBtn} onClick={handleSubmit}>
          <AuthButton
            text={loading ? 'Sending...' : 'Send Message'}
            icon={RightIcon}
          />
        </div>
      </div>
    </div>
  );
}
