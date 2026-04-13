import React from 'react'
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
import styles from './newPassword.module.scss';
export default function NewPassword() {
    return (
        <div className={styles.flexbox}>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h1>
                            Create a new password
                        </h1>
                        <p>
                            Choose a strong password
                        </p>
                    </div>
                    <div className={styles.inputgrid}>
                        <Input label="New Password" placeholder="• • • • • • • • • • " leftIcon={LockIcon} rightIcon={EyeIcon} />
                        <Input label="Confirm Password" type="password" placeholder="• • • • • • • • • • " leftIcon={LockIcon} rightIcon={EyeIcon} />
                    </div>
                    <AuthButton text="Verify" icon={RightIcon} />
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
    )
}
