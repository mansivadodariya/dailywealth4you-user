import React from 'react'
import styles from './changePassword.module.scss';
import AuthButton from '@/components/authButton';
import Input from '@/components/input';
const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';
const LockIcon = '/assets/icons/lock.svg';
const EyeIcon = '/assets/icons/eye.svg';
export default function ChangePassword() {
    return (
        <div className={styles.changePasswordWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Change Password
                    </h2>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.twocol}>
                        <Input label="Current Password" leftIcon={LockIcon} rightIcon={EyeIcon} />
                        <Input label="New Password" leftIcon={LockIcon} rightIcon={EyeIcon} />
                        <Input label="Confirm Password" leftIcon={LockIcon} rightIcon={EyeIcon} />
                    </div>
                    <div className={styles.buttongrid}>
                        <AuthButton text="Save" icon={RightIcon} />
                        <AuthButton text="Cancel" outline icon={CloseIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}
