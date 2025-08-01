import { createGlobalStyle } from 'styled-components';
import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';

import '../styles/styles.css';
import Theme from '../utils/theme';

export default function MyApp({ Component, pageProps }) {
    const [mode, setMode] = useState<'dark'|'light'>('dark');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedMode = localStorage.getItem('mode') as 'dark' | 'light' | null;
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

    const GlobalStyles = createGlobalStyle`
        :root {${Theme({ mode }).toString()}}
    `

    return (
        <> 
            <Head>
                <title>AegisBot Dashboard</title>
                <meta name="description" content="Comprehensive Discord bot management dashboard" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="alternate icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.15.4/css/all.css" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet" />
            </Head>
            {isClient && <GlobalStyles id="globalstyles" />}
            <div className={"background-gradient"} />
            <Component {...pageProps} />
        </>
    )
}