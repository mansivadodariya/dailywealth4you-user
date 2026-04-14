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

const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});
export default function Login() {

  const dispatch = useDispatch();

 
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.login);

  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
     
      const result = await dispatch(loginUser(values));
     
      if (result.meta.requestStatus === 'fulfilled') {

        router.push('/dashboard');
        
      }
    },
  });

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
        
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
                  <p className={styles.error}>{formik.errors.email}</p>
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
                  <p className={styles.error}>{formik.errors.password}</p>
                )}
              </div>
              <div className={styles.forgotpassword}>
                <a>Forgot Password ?</a>
              </div>
              {error ? <p className={styles.error}>{error}</p> : null}
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
/*******  6aff1c11-486a-41ff-8777-d4e94f2365c7  *******/
