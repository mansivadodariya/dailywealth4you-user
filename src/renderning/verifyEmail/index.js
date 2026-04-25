'use client';

import React from 'react';
import styles from './verifyEmail.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '@/store/reducers';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const EmailIcon = '/assets/icons/email.svg';
const RightIcon = '/assets/icons/right.svg';
const logo = '/assets/logo/sidebar-logo.svg';

const initialValues = { email: '' };

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function VerifyEmail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { sendOtpLoading } = useSelector((state) => state.otp);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(sendOtp({ email: values.email }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('OTP send in your email');
        router.push(
          `/verification-code?email=${encodeURIComponent(values.email)}`
        );
      }
      resetForm();
    },
  });

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <div className={styles.title}>
            <h1>Verify your email</h1>
            <p>Please enter your email to receive the verification code</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputgrid}>
              <div>
                <Input
                  label="Email"
                  placeholder="hijuyed@gmail.com"
                  leftIcon={EmailIcon}
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="text-red-500">{formik.errors.email}</span>
                )}
              </div>

              {/* {sendOtpError ? (
                <p className="text-red-500">{sendOtpError}</p>
              ) : null} */}

              <AuthButton
                text={
                  sendOtpLoading ? 'Please wait...' : 'Send Verification Code'
                }
                icon={RightIcon}
                type="submit"
                disabled={sendOtpLoading}
              />
            </div>
          </form>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
