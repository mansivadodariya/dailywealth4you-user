'use client';

import React, { useRef } from 'react';
import styles from './verificationCode.module.scss';
import AuthSlider from '@/components/authSlider';
import AuthButton from '@/components/authButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '@/store/reducers';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

const RightIcon = '/assets/icons/right.svg';

const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, 'OTP must be 6 digits')
    .required('OTP is required'),
});

export default function VerificationCode() {
  const otpLength = 6;
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyOtpLoading, verifyOtpError, sendOtpLoading } = useSelector(
    (state) => state.otp
  );

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!email) return;

      try {
        await dispatch(
          verifyOtp({
            email,
            otp: values.otp,
          })
        ).unwrap();

        toast.success('OTP verified successfully');
        router.push(`/new-password?email=${encodeURIComponent(email)}`);
      } catch {
        // Redux state already carries verifyOtpError for UI.
      }
    },
  });

  const onResend = async () => {
    if (!email || sendOtpLoading) return;
    await dispatch(sendOtp({ email }));
  };

  const handleOtpChange = (index, value) => {
    const onlyDigits = value.replace(/\D/g, '');
    const currentOtp = formik.values.otp
      .padEnd(otpLength, '')
      .slice(0, otpLength)
      .split('');

    if (!onlyDigits) {
      currentOtp[index] = '';
      formik.setFieldValue('otp', currentOtp.join(''));
      return;
    }

    const digits = onlyDigits.split('');
    let nextIndex = index;

    for (let i = 0; i < digits.length && nextIndex < otpLength; i += 1) {
      currentOtp[nextIndex] = digits[i];
      nextIndex += 1;
    }

    formik.setFieldValue('otp', currentOtp.join(''));

    const focusIndex = Math.min(nextIndex, otpLength - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      const currentOtp = formik.values.otp
        .padEnd(otpLength, '')
        .slice(0, otpLength)
        .split('');
      if (currentOtp[index]) {
        currentOtp[index] = '';
        formik.setFieldValue('otp', currentOtp.join(''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedOtp = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, otpLength);

    if (!pastedOtp) return;

    formik.setFieldValue('otp', pastedOtp);
    formik.setFieldTouched('otp', true);

    const focusIndex = Math.min(pastedOtp.length, otpLength) - 1;
    if (focusIndex >= 0) {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
          <div className={styles.title}>
            <h1>Enter verification code</h1>
            <p>Enter your 6 digit code received in your email.</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.otpcode}>
              {Array.from({ length: otpLength }).map((_, index) => (
                <div className={styles.input} key={`otp-${index}`}>
                  <input
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={formik.values.otp[index] || ''}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                    onBlur={() => formik.setFieldTouched('otp', true)}
                  />
                </div>
              ))}
            </div>

            {formik.errors.otp ? (
              <span className="text-red-500">{formik.errors.otp}</span>
            ) : null}
            {/* {!email ? (
              <span className="text-red-500">
                Email missing. Please go back and send OTP again.
              </span>
            ) : null} */}
            {verifyOtpError ? (
              <span className="text-red-500">{verifyOtpError}</span>
            ) : null}

            <AuthButton
              text={verifyOtpLoading ? 'Please wait...' : 'Verify'}
              icon={RightIcon}
              type="submit"
              disabled={verifyOtpLoading || !email}
            />
          </form>
          <div className={styles.bottomText}>
            <p>
              Didn’t receive code? <a onClick={onResend}>Resend</a>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
