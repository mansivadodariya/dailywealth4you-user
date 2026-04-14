import React from 'react';
import styles from './verifyEmail.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
export default function VerifyEmail() {
  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
          <div className={styles.title}>
            <h1>Verify your email</h1>
            <p>Please enter your email to receive the verification code</p>
          </div>
          <div className={styles.inputgrid}>
            <Input
              label="Email"
              placeholder="hijuyed@gmail.com"
              leftIcon={EmailIcon}
            />
          </div>
          <AuthButton text="Send Verification Code" icon={RightIcon} />
        </div>
      </div>
      <div className={styles.items}>
        <AuthSlider />
      </div>
    </div>
  );
}
