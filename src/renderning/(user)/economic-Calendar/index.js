import React from 'react';
import styles from './economicCalendar.module.scss';

export default function EconomicCalendar() {
  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.calendarCard}>
        <iframe
          src="https://s.tradingview.com/embed-widget/events/?locale=en#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22width%22%3A%22100%25%22%2C%22height%22%3A500%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%2C%22countryFilter%22%3A%22us%2Cca%22%7D"
          width="100%"
          height="500"
          frameBorder="0"
          allowtransparency="true"
          scrolling="no"
          title="Economic Calendar"
        ></iframe>
      </div>
    </div>
  );
}
