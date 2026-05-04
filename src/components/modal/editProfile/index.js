'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '@/store/slice/loginSlice';
import { uploadImage } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import toast from 'react-hot-toast';
import styles from './editProfile.module.scss';
import UploadIcon from '@/icons/uploadIcon';
import AuthButton from '@/components/authButton';
import Input from '@/components/input';

const ProfileImage = '/assets/images/profile.svg';
const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

export default function EditProfile({ onClose }) {
  const dispatch = useDispatch();
  const { user, updateProfileLoading } = useSelector((state) => state.login);

  const overlayRef = useRef(null);

  const cookieUser = getUserFromCookie();
  const currentUser = user || cookieUser;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    // email: '',
    // birthday: '',
    // phone: '',
    // location: '',
    // countryCode: '+91',
    // city: '',
    // state: '',
    // country: '',
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        // email: currentUser.email || '',
        // birthday: currentUser.birthday ? currentUser.birthday.split('T')[0] : '',
        // phone: currentUser.phone || '',
        // location: currentUser.location || '',
        // countryCode: currentUser.countryCode || '+91',
        // city: currentUser.city || '',
        // state: currentUser.state || '',
        // country: currentUser.country || '',
      });
      if (currentUser.profileUrl || currentUser.profileImage) {
        setProfilePreview(currentUser.profileUrl || currentUser.profileImage);
        setProfileUrl(currentUser.profileUrl || currentUser.profileImage || '');
      }
    }
  }, [currentUser?.id]);

  // Close on outside click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      if (onClose) onClose();
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Upload profile image — same pattern as KYC modal
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    setProfilePreview(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await dispatch(uploadImage(formData)).unwrap();

      // Extract URL from response — same helper pattern as KYC
      const data = res?.payload?.data || res?.payload || res;
      const url =
        typeof data === 'string'
          ? data
          : data?.url || data?.imageUrl || data?.profileUrl || '';

      if (url) {
        setProfileUrl(url);
      } else {
        toast.error('Image uploaded but URL not returned.');
      }
    } catch {
      toast.error('Failed to upload image.');
      setProfilePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    const userId = currentUser?.id || currentUser?._id;
    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    const payload = { id: userId, ...form };
    if (profileUrl) payload.profileUrl = profileUrl;

    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      toast.success('Profile updated successfully.');
      if (onClose) onClose();
    } catch (err) {
      toast.error(err || 'Failed to update profile.');
    }
  };

  const displayImage =
    profilePreview ||
    currentUser?.payload?.profileUrl ||
    currentUser?.profileImage ||
    ProfileImage;

  return (
    <div
      className={styles.editProfileWrapper}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Edit Profile</h2>
        </div>
        <div className={styles.modalBody}>
          {/* Profile image upload */}
          <div className={styles.centerProfile}>
            <div className={styles.profile}>
              <img
                src={displayImage}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = ProfileImage;
                }}
              />
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                id="profileImageInput"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label
                htmlFor="profileImageInput"
                className={styles.upload}
                title={imageUploading ? 'Uploading...' : 'Change photo'}
                style={{
                  cursor: imageUploading ? 'wait' : 'pointer',
                  opacity: imageUploading ? 0.6 : 1,
                }}
              >
                <UploadIcon />
              </label>
            </div>
            {imageUploading && (
              <p className={styles.uploadingText}>Uploading image...</p>
            )}
          </div>

          <div className={styles.twocol}>
            <Input
              label="First Name"
              leftSpacingRemove
              value={form.firstName}
              onChange={handleChange('firstName')}
            />
            <Input
              label="Last Name"
              leftSpacingRemove
              value={form.lastName}
              onChange={handleChange('lastName')}
            />
            {/* <Input
              label="Email"
              type="email"
              leftSpacingRemove
              value={form.email}
              onChange={handleChange('email')}
            />
            <Input
              label="Birthday"
              type="date"
              leftSpacingRemove
              value={form.birthday}
              onChange={handleChange('birthday')}
            />
            <Input
              label="Phone"
              leftSpacingRemove
              value={form.phone}
              onChange={handleChange('phone')}
            />
            <Input
              label="Country Code"
              leftSpacingRemove
              value={form.countryCode}
              onChange={handleChange('countryCode')}
            />
            <Input
              label="City"
              leftSpacingRemove
              value={form.city}
              onChange={handleChange('city')}
            />
            <Input
              label="State"
              leftSpacingRemove
              value={form.state}
              onChange={handleChange('state')}
            />
            <Input
              label="Country"
              leftSpacingRemove
              value={form.country}
              onChange={handleChange('country')}
            />
            <Input
              label="Location"
              leftSpacingRemove
              value={form.location}
              onChange={handleChange('location')}
            /> */}
          </div>

          <div className={styles.buttongrid}>
            <AuthButton
              text={
                updateProfileLoading || imageUploading ? 'Saving...' : 'Save'
              }
              icon={RightIcon}
              onClick={handleSave}
              disabled={updateProfileLoading || imageUploading}
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
