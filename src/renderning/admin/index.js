'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { adminLoginUser } from '@/store/reducers';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import styles from './admin.module.scss';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
const EmailIcon = '/assets/icons/email.svg';

const Admin = () => {
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const dispatch = useDispatch();

  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.login);

  const formik = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(adminLoginUser(values));

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Admin login successfully');
        router.push('/admindashboard');
      }
      resetForm();
    },
  });
  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
          <div className={styles.title}>
            <h1>Sign in</h1>
            <p>Empower Your Projects, Simplify Your Success!</p>
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
                {/* <Link href="/verify-email">Forgot Password ?</Link> */}
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
          {/* <div className={styles.bottomText}>
                        <p>
                            Don’t have an account?  <a>Sign in</a>
                        </p>

                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default Admin;
