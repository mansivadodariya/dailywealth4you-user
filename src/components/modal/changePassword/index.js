'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '@/store/slice/loginSlice';
import { toast } from 'react-toastify';
import styles from './changePassword.module.scss';
import AuthButton from '@/components/authButton';
import Input from '@/components/input';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';
const LockIcon = '/assets/icons/lock.svg';
const EyeIcon = '/assets/icons/eye.svg';

export default function ChangePassword({ onClose }) {
  const dispatch = useDispatch();
  const { resetPasswordLoading, resetPasswordError } = useSelector(
    (state) => state.login
  );

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      await dispatch(resetPassword({ oldPassword, newPassword })).unwrap();
      toast.success('Password changed successfully.');
      if (onClose) onClose();
    } catch (err) {
      toast.error(err || 'Failed to change password.');
    }
  };

  return (
    <div className={styles.changePasswordWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Change Password</h2>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.twocol}>
            <Input
              label="Current Password"
              type="password"
              leftIcon={LockIcon}
              rightIcon={EyeIcon}
              // leftSpacingRemove
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              label="New Password"
              type="password"
              leftIcon={LockIcon}
              rightIcon={EyeIcon}
              // leftSpacingRemove
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              leftIcon={LockIcon}
              rightIcon={EyeIcon}
              // leftSpacingRemove
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {resetPasswordError && (
            <p className={styles.errorText}>{resetPasswordError}</p>
          )}

          <div className={styles.buttongrid}>
            <AuthButton
              text={resetPasswordLoading ? 'Saving...' : 'Save'}
              icon={RightIcon}
              onClick={handleSave}
              disabled={resetPasswordLoading}
            />
            <AuthButton
              text="Cancel"
              outline
              icon={CloseIcon}
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
