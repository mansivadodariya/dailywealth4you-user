import React from 'react'
import styles from './authButton.module.scss';
export default function AuthButton({ text, icon }) {
    return (
        <div className={styles.authbutton}>
            <button aria-label={text}>
                {text}
                {
                    icon && (
                        <img src={icon} alt={icon} />
                    )
                }
            </button>
        </div>
    )
}
