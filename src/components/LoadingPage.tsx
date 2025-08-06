import React from 'react';
import styles from '../styles/LoadingPage.module.css';

interface IProps {
    loading: boolean;
}

export default function LoadingPage({ loading }: IProps) {
    if (!loading) return null;

    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        </div>
    );
}