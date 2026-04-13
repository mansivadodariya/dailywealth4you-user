import React from 'react'
import styles from './login.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
export default function Login() {
    return (
        <div className={styles.flexbox}>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h1>
                            Sign in to your account
                        </h1>
                        <p>
                            Smart portfolio management, simplified.
                        </p>
                    </div>
                    <div className={styles.inputgrid}>
                        <Input label="Email" placeholder="hijuyed@gmail.com" leftIcon={EmailIcon} />
                        <Input label="Password" type="password" placeholder="• • • • • • • • • • " leftIcon={LockIcon} rightIcon={EyeIcon} />
                        <div className={styles.forgotpassword}>
                            <a>
                                Forgot Password ?
                            </a>
                        </div>
                        <AuthButton text="Sign in" icon={RightIcon} />
                    </div>
                    <div className={styles.bottomText}>
                        <p>
                            Don’t have an account?  <a>Sign Up</a>
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
