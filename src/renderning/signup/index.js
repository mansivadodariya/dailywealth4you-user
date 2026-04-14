'use client';

import React, { useState } from 'react';
import styles from './signup.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '@/store/reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';

const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';

const initialFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  birthday: '',
  phone: '',
  location: '',
  countryCode: '+91',
  city: '',
  state: '',
  country: '',
  password: '',
  confirmPassword: '',
};

// ✅ Yup Validation Schema
const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  birthday: Yup.string().required('Birthday is required'),
  phone: Yup.string().required('Phone is required'),
  location: Yup.string().required('Location is required'),
  countryCode: Yup.string().required('Country code is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  password: Yup.string()

    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Signup() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.signup);

  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');


  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setLocalError('');

      if (!agreed) {
        setLocalError('Please accept Terms & Conditions and Privacy Policy.');
        return;
      }
    
        const result = await dispatch(signupUser(values));
      if(result.meta.requestStatus === 'fulfilled'){
        toast.success("user created successfully");
        router.push("/login");
      }
    },
  });

  const message = localError || error;

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
          <div className={styles.title}>
            <h1>Create an account</h1>
            <p>Smart portfolio management, simplified.</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className={styles.twocol}>
              <div>
                <Input
                  label="First Name"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className={styles.error}>{formik.errors.firstName}</p>
                )}
              </div>

              <div>
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className={styles.error}>{formik.errors.lastName}</p>
                )}
              </div>
            </div>

            <div className={styles.inputgrid}>
              {[
                { label: 'Email Address', name: 'email', type: 'email' },
                { label: 'Birthday', name: 'birthday', type: 'date' },
                { label: 'Phone', name: 'phone' },
                { label: 'Location', name: 'location' },
                { label: 'Country Code', name: 'countryCode' },
                { label: 'City', name: 'city' },
                { label: 'State', name: 'state' },
                { label: 'Country', name: 'country' },
              ].map((field) => (
                <div key={field.name}>
                  <Input
                    label={field.label}
                    name={field.name}
                    type={field.type || 'text'}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <p className={styles.error}>{formik.errors[field.name]}</p>
                  )}
                </div>
              ))}

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
                  <p className={styles.error}>{formik.errors.password}</p>
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
                    <p className={styles.error}>
                      {formik.errors.confirmPassword}
                    </p>
                  )}
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

              {message && <p className={styles.error}>{message}</p>}

              <AuthButton
                text={isLoading ? 'Please wait...' : 'Continue'}
                icon={RightIcon}
                type="submit"
                disabled={isLoading}
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
