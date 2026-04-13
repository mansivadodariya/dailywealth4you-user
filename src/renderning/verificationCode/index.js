import React from 'react'
import styles from './verificationCode.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
export default function VerificationCode() {
    return (
        <div className={styles.flexbox}>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h1>
                            Enter verification code
                        </h1>
                        <p>
                            Enter your 6 digit code received in your email.
                        </p>
                    </div>
                    <div className={styles.otpcode}>
                        {
                            [...Array(5)].map(() => {
                                return (
                                    <div className={styles.input}>
                                        <input type="text" />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <AuthButton text="Verify" icon={RightIcon} />
                    <div className={styles.bottomText}>
                        <p>
                            Didn’t receive code? <a>Resend</a>
                        </p>

                    </div>
                </div>
            </div>
            <div className={styles.items}>
                <AuthSlider />
            </div>
        </div>
    )
}
