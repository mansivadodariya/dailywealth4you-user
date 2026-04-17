import React from 'react'
import styles from './useExisting.module.scss';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
const RightIcon = '/assets/icons/right.svg';
const RightWhiteIcon = '/assets/icons/right-white.svg';
export default function UseExisting() {
    return (
        <div className={styles.useExistingWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Use existing MT5 account
                    </h2>
                    <p>
                        Please provide following details to add MT5 account
                    </p>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.singleCol}>
                        <Input label='Broker Name' leftSpacingRemove />
                        <Input label='Server' leftSpacingRemove />
                        <Input label='MT5 Login ID' leftSpacingRemove />
                        <Input label='Password' leftSpacingRemove />
                    </div>
                    <AuthButton text="Save Account" icon={RightIcon} />
                    <div className={styles.ortext}>
                        <div className={styles.line}></div>
                        <span>OR</span>
                        <div className={styles.line}></div>
                    </div>
                    <AuthButton text="Create a new MT5 account" outline RightWhiteIcon={RightIcon} />

                </div>


            </div>
        </div>
    )
}
