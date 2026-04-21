'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './KycModal.module.scss';
import AuthButton from '@/components/authButton';
import { uploadUserDocument, uploadImage } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import KycSubmitted from '../KycSubmitted';
import KycFinalModal from '../KycFinalModal';
import { toast } from 'react-toastify';

const RightIcon = '/assets/icons/right.svg';

export default function KycModal() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.account);
  const user = getUserFromCookie();

  const [idProofFile, setIdProofFile] = useState(null);
  const [addressProofFile, setAddressProofFile] = useState(null);
  const [idProofString, setIdProofString] = useState('');
  const [addressProofString, setAddressProofString] = useState('');
  const [idProofUrl, setIdProofUrl] = useState('');
  const [addressProofUrl, setAddressProofUrl] = useState('');
  const [errors, setErrors] = useState({ idProof: '', addressProof: '' });
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);

  const handleIdProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdProofFile(file);
      setIdProofString(file.name);
      setErrors((prev) => ({ ...prev, idProof: '' }));
    }
  };

  const handleAddressProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddressProofFile(file);
      setAddressProofString(file.name);
      setErrors((prev) => ({ ...prev, addressProof: '' }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      idProof: idProofFile ? '' : 'Please select the ID proof',
      addressProof: addressProofFile ? '' : 'Please select the address proof',
    };

    setErrors(newErrors);

    if (!idProofFile || !addressProofFile) {
      return;
    }

    try {
      // Upload ID proof image
      toast.info('Uploading ID proof...');
      const idProofResult = await dispatch(uploadImage(idProofFile));
      if (idProofResult.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to upload ID proof');
      }
      const idProofUrl =
        idProofResult.payload?.data?.url || idProofResult.payload?.url;
      setIdProofUrl(idProofUrl);

      // Upload address proof image
      toast.info('Uploading address proof...');
      const addressProofResult = await dispatch(uploadImage(addressProofFile));
      if (addressProofResult.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to upload address proof');
      }
      const addressProofUrl =
        addressProofResult.payload?.data?.url ||
        addressProofResult.payload?.url;
      setAddressProofUrl(addressProofUrl);

      // Submit KYC document with uploaded image URLs
      const payload = {
        userId: user?.id || user?._id || '',
        documentUrl: idProofUrl,
        proofUrl: addressProofUrl,
      };

      const result = await dispatch(uploadUserDocument(payload));
      if (
        result.meta.requestStatus === 'fulfilled' &&
        result?.payload?.status === 'success'
      ) {
        toast.success('Documents uploaded successfully.');
        setShowSubmittedModal(true);
      } else {
        toast.error(
          result?.payload?.message || 'Failed to submit KYC documents'
        );
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong during upload';

      toast.error(errorMessage);
      console.error('KYC upload failed', error);
    }
  };

  const handleProceed = () => {
    setShowSubmittedModal(false);
    setShowFinalModal(true);
  };

  const handleFinalClose = () => {
    setShowFinalModal(false);
  };

  return (
    <>
      <div className={styles.mt5AccountWrapper}>
        <div className={styles.modal}>
          {/* Header */}
          <div className={styles.modalHeader}>
            <h2>KYC</h2>
            <p>
              Please complete KYC in order to gain <br />
              access to this platform
            </p>
          </div>

          {/* Body */}
          <div className={styles.modalBody}>
            {/* Upload ID Proof */}
            <div className={styles.uploadSection}>
              <label>Upload ID Proof</label>
              <div
                className={`${styles.uploadBox} ${idProofUrl ? styles.uploaded : ''}`}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleIdProofUpload}
                  style={{ display: 'none' }}
                  id="idProof"
                />
                <label htmlFor="idProof" className={styles.uploadLabel}>
                  {idProofUrl ? (
                    <div className={styles.imagePreview}>
                      <img
                        src={idProofUrl}
                        alt="ID Proof"
                        className={styles.previewImage}
                      />
                      <div className={styles.overlay}>
                        <img
                          src="/icons/upload.svg"
                          alt="upload"
                          className={styles.uploadIcon}
                        />
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.icon}>
                        <img src="/icons/upload.svg" alt="upload" />
                      </div>
                      <div className={styles.text}>
                        {idProofFile
                          ? idProofFile.name
                          : 'PNG or JPG. Upto 3 MB'}
                      </div>
                    </>
                  )}
                </label>
              </div>
              {errors.idProof && (
                <span className={styles.errorText}>{errors.idProof}</span>
              )}
            </div>

            {/* Upload Address Proof */}
            <div className={styles.uploadSection}>
              <label>Upload Address Proof</label>
              <div
                className={`${styles.uploadBox} ${addressProofUrl ? styles.uploaded : ''}`}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleAddressProofUpload}
                  style={{ display: 'none' }}
                  id="addressProof"
                />
                <label htmlFor="addressProof" className={styles.uploadLabel}>
                  {addressProofUrl ? (
                    <div className={styles.imagePreview}>
                      <img
                        src={addressProofUrl}
                        alt="Address Proof"
                        className={styles.previewImage}
                      />
                      <div className={styles.overlay}>
                        <img
                          src="/icons/upload.svg"
                          alt="upload"
                          className={styles.uploadIcon}
                        />
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.icon}>
                        <img src="/icons/upload.svg" alt="upload" />
                      </div>
                      <div className={styles.text}>
                        {addressProofFile
                          ? addressProofFile.name
                          : 'PNG or JPG. Upto 3 MB'}
                      </div>
                    </>
                  )}
                </label>
              </div>
              {errors.addressProof && (
                <span className={styles.errorText}>{errors.addressProof}</span>
              )}
            </div>

            {/* Buttons */}
            <div className={styles.actions}>
              <AuthButton
                text={loading ? 'Uploading...' : 'Submit'}
                icon={RightIcon}
                onClick={handleSubmit}
                disabled={loading}
              />
              <AuthButton outline text="Cancel ✕" />
            </div>
          </div>
        </div>
      </div>

      {showSubmittedModal && (
        <KycSubmitted
          onProceed={handleProceed}
          onCancel={() => setShowSubmittedModal(false)}
        />
      )}
      {showFinalModal && <KycFinalModal onClose={handleFinalClose} />}
    </>
  );
}
