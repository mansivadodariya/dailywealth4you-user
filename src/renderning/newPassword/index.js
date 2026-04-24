'use client';

import React from 'react';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '@/store/reducers';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import styles from './newPassword.module.scss';

const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
const logo = '/assets/logo/logo.svg';

const validationSchema = Yup.object({
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function NewPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { forgotPasswordLoading, forgotPasswordError } = useSelector(
    (state) => state.otp
  );

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!email) return;

      const result = await dispatch(
        forgotPassword({
          email,
          password: values.password,
        })
      );

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Password change Successfully');
        router.push('/password-successfully');
      }
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
            <h1>Create a new password</h1>
            <p>Choose a strong password</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputgrid}>
              <div>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="• • • • • • • • • • "
                  leftIcon={LockIcon}
                  rightIcon={EyeIcon}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                  <span className="text-red-500">{formik.errors.password}</span>
                ) : null}
              </div>
              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="• • • • • • • • • • "
                  leftIcon={LockIcon}
                  rightIcon={EyeIcon}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <span className="text-red-500">
                    {formik.errors.confirmPassword}
                  </span>
                ) : null}
              </div>
            </div>
            {/* {!email ? (
              <span className="text-red-500">
                Email missing. Please restart forgot-password flow.
              </span>
            ) : null} */}
            {forgotPasswordError ? <span>{forgotPasswordError}</span> : null}

            <AuthButton
              text={forgotPasswordLoading ? 'Please wait...' : 'Verify'}
              icon={RightIcon}
              type="submit"
              disabled={forgotPasswordLoading || !email}
            />
          </form>
          <div className={styles.bottomText}>
            <p>
              Need Help? <a>Contact us</a>
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
