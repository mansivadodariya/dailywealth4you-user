'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './KycModal.module.scss';
import AuthButton from '@/components/authButton';
import { uploadUserDocument, uploadImage } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import KycSubmitted from '../KycSubmitted';
// import KycFinalModal from '../KycFinalModal';
import toast from 'react-hot-toast';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';
const UploadPlaceholderIcon = '/assets/icons/upload-image.svg';

// Helper: extract URL from uploadImage response
const getUrlFromRes = (res) => {
  const data = res?.payload?.data || res?.payload?.payload || res?.payload;
  if (typeof data === 'string') return data;
  if (data?.url) return data.url;
  if (data?.imageUrl) return data.imageUrl;
  if (data?.profileUrl) return data.profileUrl;
  return '';
};

// Single upload box component
function UploadBox({ id, label, preview, isUploading, error, onChange }) {
  return (
    <div className={styles.uploadBoxWrapper}>
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={onChange}
        style={{ display: 'none' }}
        id={id}
      />
      <label htmlFor={id} className={styles.uploadBox}>
        {preview ? (
          <img src={preview} alt={label} className={styles.previewImage} />
        ) : (
          <>
            <div className={styles.uploadIcon}>
              <img
                src={UploadPlaceholderIcon}
                alt="upload"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className={styles.uploadLabel}>{label}</span>
            <span className={styles.uploadHint}>PNG or JPG. Upto 3 MB</span>
          </>
        )}
        {isUploading && (
          <div className={styles.uploadingOverlay}>Uploading...</div>
        )}
      </label>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export default function KycModal() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.account);
  const user = getUserFromCookie();

  const [previews, setPreviews] = useState({
    idFront: null,
    idBack: null,
    addressFront: null,
    addressBack: null,
  });
  const [uploadedUrls, setUploadedUrls] = useState({
    idFront: '',
    idBack: '',
    addressFront: '',
    addressBack: '',
  });
  const [isUploading, setIsUploading] = useState({
    idFront: false,
    idBack: false,
    addressFront: false,
    addressBack: false,
  });
  const [errors, setErrors] = useState({
    idFront: '',
    idBack: '',
    addressFront: '',
    addressBack: '',
  });
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Immediate local preview
    setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    setErrors((prev) => ({ ...prev, [type]: '' }));
    setIsUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await dispatch(uploadImage(formData)).unwrap();
      const url = getUrlFromRes({ payload: res });
      if (url) {
        setUploadedUrls((prev) => ({ ...prev, [type]: url }));
      } else {
        toast.error('Upload succeeded but URL not returned.');
      }
    } catch {
      toast.error('Upload failed. Please try again.');
      setPreviews((prev) => ({ ...prev, [type]: null }));
    } finally {
      setIsUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async () => {
    // Validate all 4 boxes
    const newErrors = {
      idFront: uploadedUrls.idFront
        ? ''
        : isUploading.idFront
          ? 'Still uploading…'
          : 'Please upload front side Id Proof.',
      idBack: uploadedUrls.idBack
        ? ''
        : isUploading.idBack
          ? 'Still uploading…'
          : 'Please upload back side Id Proof.',
      addressFront: uploadedUrls.addressFront
        ? ''
        : isUploading.addressFront
          ? 'Still uploading…'
          : 'Please upload front side address Proof.',
      addressBack: uploadedUrls.addressBack
        ? ''
        : isUploading.addressBack
          ? 'Still uploading…'
          : 'Please upload Back side address Proof.',
    };
    setErrors(newErrors);

    const anyMissing = Object.values(newErrors).some((e) => e !== '');
    if (anyMissing) return;

    const payload = {
      userId: user?.id,
      idProofFrontUrl: uploadedUrls.idFront,
      idProofBackUrl: uploadedUrls.idBack,
      addressFrontUrl: uploadedUrls.addressFront,
      addressBackUrl: uploadedUrls.addressBack,
    };

    try {
      await dispatch(uploadUserDocument(payload)).unwrap();
      toast.success('KYC documents submitted successfully.');
      setShowSubmittedModal(true);
    } catch (err) {
      toast.error(err?.message || err || 'Failed to submit KYC documents.');
    }
  };

  const anyUploading = Object.values(isUploading).some(Boolean);

  return (
    <>
      <div className={styles.kycWrapper}>
        <div className={styles.modal}>
          {/* Header */}
          <div className={styles.modalHeader}>
            <h2>KYC</h2>
            <p>Please complete KYC in order to gain access to this platform</p>
          </div>

          {/* Body */}
          <div className={styles.modalBody}>
            {/* ID Proof — 2 boxes */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Upload ID Proof</p>
              <div className={styles.boxRow}>
                <UploadBox
                  id="idFront"
                  label="Front"
                  preview={previews.idFront}
                  isUploading={isUploading.idFront}
                  error={errors.idFront}
                  onChange={(e) => handleUpload(e, 'idFront')}
                />
                <UploadBox
                  id="idBack"
                  label="Back"
                  preview={previews.idBack}
                  isUploading={isUploading.idBack}
                  error={errors.idBack}
                  onChange={(e) => handleUpload(e, 'idBack')}
                />
              </div>
            </div>

            {/* Address Proof — 2 boxes */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Upload Address Proof</p>
              <div className={styles.boxRow}>
                <UploadBox
                  id="addressFront"
                  label="Front"
                  preview={previews.addressFront}
                  isUploading={isUploading.addressFront}
                  error={errors.addressFront}
                  onChange={(e) => handleUpload(e, 'addressFront')}
                />
                <UploadBox
                  id="addressBack"
                  label="Back"
                  preview={previews.addressBack}
                  isUploading={isUploading.addressBack}
                  error={errors.addressBack}
                  onChange={(e) => handleUpload(e, 'addressBack')}
                />
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <AuthButton
                text={anyUploading || loading ? 'Uploading...' : 'Submit'}
                icon={RightIcon}
                onClick={handleSubmit}
                disabled={anyUploading || loading}
              />
              <AuthButton outline text="Cancel" icon={CloseIcon} />
            </div>
          </div>
        </div>
      </div>

      {showSubmittedModal && <KycSubmitted />}
      {/* <KycFinalModal /> */}
    </>
  );
}
