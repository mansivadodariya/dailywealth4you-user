        'use client';

        import React, { useState } from "react";
        import { useDispatch, useSelector } from "react-redux";
        import styles from "./KycModal.module.scss";
        import AuthButton from "@/components/authButton";
        import { uploadUserDocument, uploadImage } from "@/store/slice/accountSlice";
        import { getUserFromCookie } from "@/service/cookies";
        import KycSubmitted from "../KycSubmitted";
        import KycFinalModal from "../KycFinalModal";
        import { toast } from "react-toastify";

        const RightIcon = '/assets/icons/right.svg';

        export default function KycModal() {
        const dispatch = useDispatch();
        const { loading } = useSelector((state) => state.account);
        const user = getUserFromCookie();

        const [idProofFile, setIdProofFile] = useState(null);
        const [addressProofFile, setAddressProofFile] = useState(null);
        const [idProofString, setIdProofString] = useState('');
        const [addressProofString, setAddressProofString] = useState('');
        const [idProofPreview, setIdProofPreview] = useState(null);
        const [addressProofPreview, setAddressProofPreview] = useState(null);
        const [uploadedUrls, setUploadedUrls] = useState({ idProof: '', addressProof: '' });
        const [isIdProofUploading, setIsIdProofUploading] = useState(false);
        const [isAddressProofUploading, setIsAddressProofUploading] = useState(false);
        const [errors, setErrors] = useState({ idProof: '', addressProof: '' });
        const [showSubmittedModal, setShowSubmittedModal] = useState(false);
        const [showFinalModal, setShowFinalModal] = useState(false);

        const getUrlFromRes = (res) => {
            const data = res?.payload?.data || res?.payload?.payload || res?.payload;
            if (typeof data === 'string') return data;
            if (data?.url) return data.url;
            if (data?.imageUrl) return data.imageUrl;
            return '';
        };

        const handleIdProofUpload = async (e) => {
            const file = e.target.files[0];
            if (file) {
            setIdProofFile(file);
            setIdProofString(file.name);
            setIdProofPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, idProof: '' }));

            setIsIdProofUploading(true);
            try {
                const formData = new FormData();
                formData.append('image', file);
                const res = await dispatch(uploadImage(formData));
                if (res.meta.requestStatus === 'fulfilled') {
                    setUploadedUrls((prev) => ({ ...prev, idProof: getUrlFromRes(res) }));
                } else {
                    toast.error('Failed to upload ID proof.');
                }
            } catch (error) {
                toast.error('ID proof upload failed');
            } finally {
                setIsIdProofUploading(false);
            }
            }
        };

        const handleAddressProofUpload = async (e) => {
            const file = e.target.files[0];
            if (file) {
            setAddressProofFile(file);
            setAddressProofString(file.name);
            setAddressProofPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, addressProof: '' }));

            setIsAddressProofUploading(true);
            try {
                const formData = new FormData();
                formData.append('image', file);
                const res = await dispatch(uploadImage(formData));
                if (res.meta.requestStatus === 'fulfilled') {
                    setUploadedUrls((prev) => ({ ...prev, addressProof: getUrlFromRes(res) }));
                } else {
                    toast.error('Failed to upload address proof.');
                }
            } catch (error) {
                toast.error('Address proof upload failed');
            } finally {
                setIsAddressProofUploading(false);
            }
            }
        };

        const handleSubmit = async () => {
            const newErrors = {
            idProof: uploadedUrls.idProof ? '' : (isIdProofUploading ? 'Uploading still in progress' : 'Please upload the ID proof'),
            addressProof: uploadedUrls.addressProof ? '' : (isAddressProofUploading ? 'Uploading still in progress' : 'Please upload the address proof'),
            };

            setErrors(newErrors);

            if (!uploadedUrls.idProof || !uploadedUrls.addressProof) {
            return;
            }

            const payload = {
                userId: user?.id || user?._id || '',
                proofUrl: uploadedUrls.idProof,
                documentUrl: uploadedUrls.addressProof,
            };

            try {
                const result = await dispatch(uploadUserDocument(payload));
                if (result.meta.requestStatus === 'fulfilled') {
                    toast.success('KYC documents submitted successfully.');
                    setShowSubmittedModal(true);
                } else {
                    toast.error(result?.payload?.message || result?.payload || 'Failed to submit KYC documents.');
                }
            } catch (error) {
                toast.error('KYC submission failed');
                console.error('Submission failed', error);
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
                    <div className={`${styles.uploadBox} `}>
                        <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleIdProofUpload}
                        style={{ display: 'none' }}
                        id="idProof"
                        />
                        <label htmlFor="idProof" className={styles.uploadLabel}>
                        {idProofPreview ? (
                            <img src={idProofPreview} alt="ID Preview" className={styles.previewImage} />
                        ) : (
                            <>
                                <div className={styles.icon}>
                                    <img src="/icons/upload.svg" alt="upload" />
                                </div>
                                <div className={styles.text}>
                                    {idProofFile ? idProofFile.name : "PNG or JPG. Upto 3 MB"}
                                </div>
                            </>
                        )}
                        </label>
                    </div>
                    {errors.idProof && <span className={styles.errorText}>{errors.idProof}</span>}
                    </div>

                    {/* Upload Address Proof */}
                    <div className={styles.uploadSection}>
                    <label>Upload Address Proof</label>
                    <div className={`${styles.uploadBox} `}>
                        <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleAddressProofUpload}
                        style={{ display: 'none' }}
                        id="addressProof"
                        />
                        <label htmlFor="addressProof" className={styles.uploadLabel}>
                        {addressProofPreview ? (
                            <img src={addressProofPreview} alt="Address Preview" className={styles.previewImage} />
                        ) : (
                            <>
                                <div className={styles.icon}>
                                    <img src="/icons/UploadIcon.svg" alt="upload" />
                                </div>
                                <div className={styles.text}>
                                    {addressProofFile ? addressProofFile.name : "PNG or JPG. Upto 3 MB"}
                                </div>
                            </>
                        )}
                        </label>
                    </div>
                    {errors.addressProof && <span className={styles.errorText}>{errors.addressProof}</span>}
                    </div>

                    {/* Buttons */}
                    <div className={styles.actions}>
                    <AuthButton
                        text={isIdProofUploading || isAddressProofUploading || loading ? "Uploading..." : "Submit"}
                        icon={RightIcon}
                        onClick={handleSubmit}
                        disabled={isIdProofUploading || isAddressProofUploading || loading}
                    />
                    <AuthButton
                        outline
                        text="Cancel ✕"
                    />
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
