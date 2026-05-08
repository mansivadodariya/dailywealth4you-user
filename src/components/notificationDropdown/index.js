'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAllRead, updateNotification } from '@/store/slice/loginSlice';
import styles from './notificationDropdown.module.scss';
import moment from 'moment';

const BellFillIcon = '/assets/icons/notification.svg';

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch();
  const { notifications, notificationsLoading, unreadCount } = useSelector(
    (state) => state.login
  );

  const handleMarkAllRead = () => {
    dispatch(updateNotification()); // call API
    dispatch(markAllRead()); // update local state immediately
  };

  return (
    <div className={styles.dropdown}>
      {/* Header */}
      <div className={styles.dropdownHeader}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>Notifications</h3>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} Unread</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllBtn} onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className={styles.list}>
        {notificationsLoading && (
          <div className={styles.emptyState}>Loading...</div>
        )}

        {!notificationsLoading && notifications.length === 0 && (
          <div className={styles.emptyState}>No notifications yet.</div>
        )}

        {!notificationsLoading &&
          notifications.map((notif, i) => (
            <div
              key={notif?.id}
              className={`${styles.item} ${!notif?.isRead ? styles.unread : ''}`}
            >
              {/* Icon */}
              <div>
                <img
                  src={BellFillIcon}
                  alt="notification"
                  // className={styles.notifIcon}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <p className={styles.message}>{notif?.title}</p>
                <span className={styles.time}>
                  {notif?.createdAt ? moment(notif.createdAt).fromNow() : ''}
                </span>
              </div>

              {/* Unread dot */}
              {!notif?.isRead && <span className={styles.dot} />}
            </div>
          ))}
      </div>
    </div>
  );
}
