import React from 'react'
import styles from './withdrawModal.module.scss';
import AuthButton from '@/components/authButton';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';
export default function WithdrawModal() {
    return (
        <div className={styles.depositModalWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Withdraw
                    </h2>
                    <p>
                        Submit a withdraw request
                    </p>
                </div>
                <div className={styles.modalbody}>
                    <div className={styles.counter}>
                        <input type="text" placeholder='$0' />
                    </div>
                    <p>
                        Enter Deposit Amount
                    </p>
                    <div className={styles.inputAlignment}>
                        <Input label='Enter Crypto Wallet Address' leftSpacingRemove />
                    </div>
                    <Dropdown label='Select Network' />
                    <div className={styles.buttonTop}>
                        <AuthButton text="Submit Withdraw Request" icon={RightIcon} />
                    </div>

                    <AuthButton text="Cancel" outline icon={CloseIcon} />

                </div>
            </div>
        </div>
    )
}
