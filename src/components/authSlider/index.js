'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './authSlider.module.scss';

const slides = [
    { src: '/assets/images/slider1.png', alt: 'Slider 1' },
    { src: '/assets/images/slider2.png', alt: 'Slider 2' },
    { src: '/assets/images/slider3.png', alt: 'Slider 3' },
];

const AUTOPLAY_INTERVAL = 5000;

export default function AuthSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className={styles.authslider}>
            <AnimatePresence>
                <motion.img
                    key={currentIndex}
                    src={slides[currentIndex].src}
                    alt={slides[currentIndex].alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    draggable={false}
                />
            </AnimatePresence>
        </div>
    );
}
