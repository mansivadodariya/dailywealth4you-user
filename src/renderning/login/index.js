'use client';

import React from 'react';
import styles from './login.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/reducers';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
const logo = '/assets/logo/sidebar-logo.svg';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter a valid email'),
  password: Yup.string().required('Please enter a valid passord'),
});
export default function Login() {
  const dispatch = useDispatch();

  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.login);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(loginUser(values));

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Login Successfully');
        router.push('/dashboard');
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
            <h1>Sign in to your account</h1>
            <p>Smart portfolio management, simplified.</p>
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
                  <span className={styles.error}>{formik.errors.email}</span>
                )}
              </div>
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="• • • • • • • • • • "
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
              <div className={styles.forgotpassword}>
                <Link href="/verify-email">Forgot Password ?</Link>
              </div>
              {/* {error ? <p className={styles.error}>{error}</p> : null} */}
              <AuthButton
                text={isLoading ? 'Please wait...' : 'Sign in'}
                icon={RightIcon}
                type="submit"
                disabled={isLoading}
              />
            </div>
          </form>
          <div className={styles.bottomText}>
            <p>
              Don’t have an account? <Link href="/signup">Sign Up</Link>
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
