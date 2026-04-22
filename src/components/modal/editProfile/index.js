import React from 'react'
import styles from './editProfile.module.scss';
import UploadIcon from '@/icons/uploadIcon';
import AuthButton from '@/components/authButton';
import Input from '@/components/input';
const ProfileImage = '/assets/images/profile.svg';
const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';
export default function EditProfile() {
    return (
        <div className={styles.editProfileWrapper}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>
                        Edit Profile
                    </h2>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.centerProfile}>
                        <div className={styles.profile}>
                            <img src={ProfileImage} alt='ProfileImage' />
                            <div className={styles.upload}>
                                <UploadIcon />
                            </div>
                        </div>
                    </div>
                    <div className={styles.twocol}>
                        <Input label="First Name" leftSpacingRemove />
                        <Input label="Last Name" leftSpacingRemove />
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
