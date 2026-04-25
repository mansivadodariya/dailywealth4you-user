'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './useExisting.module.scss';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import {
  updateTradingAccount,
  createTradingAccount,
} from '@/store/slice/accountSlice';
import toast from 'react-hot-toast';
import Mt5Account from '../Mt5Account';
const RightIcon = '/assets/icons/right.svg';
const RightWhiteIcon = '/assets/icons/right-white.svg';

export default function UseExisting({
  isEdit = false,
  account = null,
  onClose,
  brokerId = null,
}) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.account);
  const { user } = useSelector((state) => state?.login);

  const overlayRef = useRef(null);

  const [agreed, setAgreed] = useState(false);
  const [brokerName, setBrokerName] = useState('');
  const [server, setServer] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [sizeOfAccount, setSizeOfAccount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [showMt5Modal, setShowMt5Modal] = useState(false);

  useEffect(() => {
    if (account) {
      setBrokerName(account?.broker?.name || account?.brokerName || '');
      setServer(account?.platform || account?.server || '');
      setLoginId(account?.brokerUserId || account?.accountId || '');
      setPassword(account?.password || '');
      setSizeOfAccount(account?.sizeOfAccount || '');
      setAccountId(account?.accountId || '');
    }
  }, [account]);

  const handleSave = async () => {
    if (isEdit) {
      if (!agreed) {
        toast.error('Please accept Terms & Conditions and Privacy Policy.');
        return;
      }

      const payload = {
        id: account?.id || account?._id || '',
        userId:
          account?.userId || account?.user?.id || account?.user?._id || '',
        accountId: account?.accountId,
        brokerId: account?.broker?.id || account?.brokerId || '',
        brokerName: brokerName || account?.brokerName || '',

        // brokerUserId: loginId,
        // platform: server || account?.platform || '',
        // firstName: account?.firstName || '',
        // lastName: account?.lastName || '',
        // currentDeposit: account?.currentDeposit || 0,
        // totalDeposit: account?.totalDeposit || 0,
        // totalProfit: account?.totalProfit || 0,
        // totalWithdraw: account?.totalWithdraw || 0,
        // status: account?.status || 'active',
        // isFundedAccount: account?.isFundedAccount || false,
      };

      try {
        await dispatch(updateTradingAccount(payload)).unwrap();
        // toast.success('MT5 account updated successfully.');
        if (onClose) onClose();
      } catch (error) {
        toast.error(error?.message || error || 'Failed to update MT5 account.');
      }
    } else {
      // Create new account
      if (!agreed) {
        toast.error('Please accept Terms & Conditions and Privacy Policy.');
        return;
      }

      if (!brokerName || !server || !loginId || !password || !accountId) {
        toast.error('Please fill in all required fields.');
        return;
      }

      const payload = {
        userId: user?.id || '',
        accountId: accountId,
        brokerId: brokerId,
        brokerName: brokerName,
        sizeOfAccount: sizeOfAccount,
        // brokerUserId: loginId,
        // platform: server,
        // firstName: user?.firstName || '',
        // lastName: user?.lastName || '',
        // currentDeposit: 0,
        // totalDeposit: 0,
        // totalProfit: 0,
        // totalWithdraw: 0,
        // status: 'active',
        // isFundedAccount: false,
        server: server,
        mt5LoginId: loginId,
        password: password,
      };

      try {
        await dispatch(createTradingAccount(payload)).unwrap();
        toast.success('MT5 account created successfully.');
        // Reset form
        setBrokerName('');
        setServer('');
        setLoginId('');
        setPassword('');
        setSizeOfAccount('');
        setAccountId('');
        setAgreed(false);
        if (onClose) onClose();
      } catch (error) {
        console.log(error);
        // toast.error(error?.message || 'Failed to create MT5 account.');
      }
    }
  };

  return (
    <>
      <div
        className={styles.useExistingWrapper}
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current && onClose) onClose();
        }}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>{isEdit ? 'Edit MT5 Account' : 'Use existing MT5 account'}</h2>
            <p>
              {isEdit
                ? 'Please provide following details to edit MT5 account'
                : 'Please provide following details to add MT5 account'}
            </p>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.singleCol}>
              <Input
                label="Broker Name"
                leftSpacingRemove
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
              />
              <Input
                label="Account ID"
                leftSpacingRemove
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              />
              <Input
                label="Server"
                leftSpacingRemove
                value={server}
                onChange={(e) => setServer(e.target.value)}
              />
              <Input
                label="MT5 Login ID"
                leftSpacingRemove
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
              <Input
                label="Password"
                leftSpacingRemove
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Size of Account"
                leftSpacingRemove
                value={sizeOfAccount}
                onChange={(e) => setSizeOfAccount(e.target.value)}
              />
            </div>

            <div className={styles.infoBox}>
              <p>
                You will get <strong>{user?.commission} %</strong> of total
                profit <br />
                gained on this account
              </p>
            </div>

            <div className={styles.checkboxdesign}>
              <label>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className={styles.customCheckbox}></span>
                <p>
                  I agree to the CredBlaze <a>Terms & Conditions</a> and{' '}
                  <a>Privacy Policy</a>
                </p>
              </label>
            </div>

            <AuthButton
              text={loading ? 'Please wait...' : 'Save Account'}
              icon={RightIcon}
              onClick={handleSave}
              disabled={loading}
            />

            {!isEdit && (
              <>
                <div className={styles.ortext}>
                  <div className={styles.line}></div>
                  <span>OR</span>
                  <div className={styles.line}></div>
                </div>
                <AuthButton
                  text="Create a new MT5 account"
                  outline
                  RightWhiteIcon={RightIcon}
                  onClick={() => setShowMt5Modal(true)}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {showMt5Modal && (
        <Mt5Account
          onClose={() => {
            setShowMt5Modal(false);
            if (onClose) onClose();
          }}
        />
      )}
    </>
  );
}
