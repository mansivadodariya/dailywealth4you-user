import React from 'react'
import styles from './signup.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';
export default function Signup() {
    return (
        <div className={styles.flexbox}>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h1>
                            Create an account
                        </h1>
                        <p>
                            Smart portfolio management, simplified.
                        </p>
                    </div>
                    <div className={styles.twocol}>
                        <Input spacingRemove label="First Name" />
                        <Input label="Last Name" spacingRemove />
                    </div>
                    <div className={styles.inputgrid}>
                        <Input label="Email Address" placeholder="hijuyed@gmail.com" spacingRemove />
                        <Input label="Password" type="password" placeholder="• • • • • • • • • • " leftIcon={LockIcon} rightIcon={EyeIcon} />
                        <Input label="Confirm Password" type="password" placeholder="• • • • • • • • • • " leftIcon={LockIcon} rightIcon={EyeIcon} />
                        <Input label="Referral Code" spacingRemove />
                        <div className={styles.checkboxdesign}>
                            <label>
                                <input type="checkbox" />
                                <span className={styles.customCheckbox}></span>
                                <p>I agree to the CredBlaze <a>Terms & Conditions</a> and <a>Privacy Policy</a></p>
                            </label>
                        </div>
                        <AuthButton text="Continue" icon={RightIcon} />
                    </div>
                    <div className={styles.bottomText}>
                        <p>
                            Already have an account?  <a>Sign In</a>
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
