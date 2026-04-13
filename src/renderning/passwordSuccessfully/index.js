import React from 'react'
import styles from './passwordSuccessfully.module.scss';
import AuthSlider from '@/components/authSlider';
import AuthButton from '@/components/authButton';
const RightIcon = '/assets/icons/right.svg';
const LockScreenIcon = '/assets/icons/lock-screen.svg';
const Logo = '/assets/logo/logo.svg';
export default function PasswordSuccessfully() {
    return (
        <div className={styles.flexbox}>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <img src={LockScreenIcon} alt="LockScreenIcon" />
                        <h1>
                            Your password has been changed successfully
                        </h1>

                    </div>

                    <AuthButton text="Verify" icon={RightIcon} />

                </div>
            </div>
            <div className={styles.items}>
                <AuthSlider />
            </div>
        </div>
    )
}
