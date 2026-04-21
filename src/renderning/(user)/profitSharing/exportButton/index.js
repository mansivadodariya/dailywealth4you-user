import React from 'react';
import styles from './exportButton.module.scss';
import FileIcon from '@/icons/fileIcon';
export default function ExportButton() {
  return (
    <div className={styles.exportbutton}>
      <button>
        Export
        <FileIcon />
      </button>
    </div>
  );
}
