'use client';

import React, { useState, useEffect } from 'react';
import styles from './signup.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '@/store/reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/service/api';
import { VERIFY_REFERRAL_CODE } from '@/service/url';

const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
const logo = '/assets/logo/sidebar-logo.svg';
const EmailIcon = '/assets/icons/email.svg';

const initialFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  // birthday: '',
  // phone: '',
  // location: '',
  // countryCode: '+91',
  // city: '',
  // state: '',
  // country: '',
  password: '',
  confirmPassword: '',
  referredBy: '',
};

// ✅ Yup Validation Schema
const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('Please enter your first name!'),
  lastName: Yup.string().required('Please enter your last name!'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter your email address!'),
  // referredBy: Yup.string().required('Please enter your Referral code '),
  // birthday: Yup.string().required('Birthday is required'),
  // phone: Yup.string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .required('Phone is required'),
  // location: Yup.string().required('Location is required'),
  // countryCode: Yup.string().required('Country code is required'),
  // city: Yup.string().required('City is required'),
  // state: Yup.string().required('State is required'),
  // country: Yup.string().required('Country is required'),
  password: Yup.string()
    .required('Please enter your password!')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please enter your confirm password!'),
});

function extractReferrerName(response) {
  const root =
    response?.payload?.data ??
    response?.payload ??
    response?.data ??
    response;
  const data =
    (typeof root === 'object' && root !== null && !Array.isArray(root)
      ? root?.data ?? root?.user ?? root?.referrer ?? root
      : null) ?? root;
  if (typeof data === 'string') return data.trim() || null;
  if (!data || typeof data !== 'object') return null;
  const direct =
    data.name ??
    data.fullName ??
    data.referrerName ??
    data.displayName ??
    data.username;
  if (direct) return String(direct).trim();
  const fn = data.firstName ?? data.first_name;
  const ln = data.lastName ?? data.last_name;
  const combined = [fn, ln].filter(Boolean).join(' ').trim();
  return combined || null;
}

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { isLoading, error } = useSelector((state) => state.signup);

  // Extract referral code from URL: /signup/[referralCode]
  const referralCode = params?.referralCode?.[0] || '';

  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');
  const [referralVerifyLoading, setReferralVerifyLoading] = useState(false);
  const [referrerName, setReferrerName] = useState(null);
  const [referralVerifyError, setReferralVerifyError] = useState(null);

  const formik = useFormik({
    initialValues: {
      ...initialFormValues,
      referredBy: referralCode,
    },
    enableReinitialize: true, // Re-init if referralCode changes
    validationSchema: SignupSchema,
    onSubmit: async (values, { resetForm }) => {
      setLocalError('');

      if (!agreed) {
        setLocalError('Please accept Terms & Conditions and Privacy Policy.');
        return;
      }

      const result = await dispatch(signupUser(values));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Signup Successfully');
        router.push('/');
        resetForm();
      }
    },
  });

  useEffect(() => {
    const code = formik.values.referredBy?.trim() ?? '';
    if (!code) {
      setReferrerName(null);
      setReferralVerifyError(null);
      setReferralVerifyLoading(false);
      return;
    }

    let cancelled = false;
    const handle = setTimeout(async () => {
      setReferralVerifyLoading(true);
      setReferralVerifyError(null);
      try {
        const res = await api.get(
          `${VERIFY_REFERRAL_CODE}?referralCode=${encodeURIComponent(code)}`
        );
        if (cancelled) return;
        const name = extractReferrerName(res);
        setReferrerName(name);
      } catch (err) {
        if (cancelled) return;
        setReferrerName(null);
        setReferralVerifyError(
          typeof err === 'string' ? err : 'Invalid referral code.'
        );
      } finally {
        if (!cancelled) setReferralVerifyLoading(false);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [formik.values.referredBy]);

  const message = localError || error;

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <div className={styles.title}>
            <h1>Create an account</h1>
            <p>Smart portfolio management, simplified.</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className={styles.twocol}>
              <div className={styles.inputgrid}>
                <Input
                  label="First Name"
                  name="firstName"
                  spacingRemove
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <span className={styles.error}>
                    {formik.errors.firstName}
                  </span>
                )}
              </div>

              <div className={styles.inputgrid}>
                <Input
                  label="Last Name"
                  name="lastName"
                  spacingRemove
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <span className={styles.error}>{formik.errors.lastName}</span>
                )}
              </div>
            </div>

            <div className={styles.inputgrid}>
              {[{ label: 'Email Address', name: 'email', type: 'email' }].map(
                (field) => (
                  <div key={field.name}>
                    <Input
                      label={field.label}
                      leftIcon={EmailIcon}
                      name={field.name}
                      type={field.type || 'text'}
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched[field.name] &&
                      formik.errors[field.name] && (
                        <span className={styles.error}>
                          {formik.errors[field.name]}
                        </span>
                      )}
                  </div>
                )
              )}

              <div>
                <Input
                  label="Password"
                  type="password"
                  leftIcon={LockIcon}
                  rightIcon={EyeIcon}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <span className={styles.error}>{formik.errors.password}</span>
                )}
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  leftIcon={LockIcon}
                  rightIcon={EyeIcon}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <span className={styles.error}>
                      {formik.errors.confirmPassword}
                    </span>
                  )}
              </div>
              <div className={styles.referralField}>
                <Input
                  label="Referral code"
                  type="text"
                  spacingRemove
                  name="referredBy"
                  value={formik.values.referredBy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className={styles.referralHint} aria-live="polite">
                  {referralVerifyLoading && (
                    <div className={styles.referralBannerMuted}>
                      <span className={styles.referralSpinner} aria-hidden />
                      <span className={styles.referralMutedText}>
                        Verifying code…
                      </span>
                    </div>
                  )}
                  {!referralVerifyLoading &&
                    referrerName &&
                    !referralVerifyError && (
                      <div className={styles.referralBannerSuccess} role="status">
                        <span className={styles.referralCheckIcon} aria-hidden>
                          ✓
                        </span>
                        <div className={styles.referralBannerBody}>
                          <span className={styles.referralBannerLabel}>
                            Referrer User
                          </span>
                          <span className={styles.referralBannerName}>
                            {referrerName}
                          </span>
                        </div>
                      </div>
                    )}
                  {!referralVerifyLoading && referralVerifyError && (
                    <div className={styles.referralBannerError} role="alert">
                      <span className={styles.referralErrorIcon} aria-hidden>
                        !
                      </span>
                      <span className={styles.referralErrorText}>
                        {referralVerifyError}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.checkboxdesign}>
                <label>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className={styles.customCheckbox}></span>
                  <p>
                    I agree to the CredBlaze <a>Terms & Conditions</a> and{' '}
                    <a>Privacy Policy</a>
                  </p>
                </label>
              </div>

              {message && <span className={styles.error}>{message}</span>}

              <AuthButton
                text={isLoading ? 'Please wait...' : 'Continue'}
                icon={RightIcon}
                type="submit"
                // disabled={isLoading}
              />
            </div>
          </form>

          <div className={styles.bottomText}>
            <p>
              Already have an account? <Link href="/">Sign In</Link>
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
