import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Button from '@/components/common/Button';
import { FaShieldAlt, FaTint } from 'react-icons/fa';

const HomeHero = ({ banner }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (shouldReduceMotion) return; // respect accessibility preference — no parallax at all

        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            setMousePos({
                x: (e.clientX / innerWidth - 0.5) * 2, // -1 to 1
                y: (e.clientY / innerHeight - 0.5) * 2,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [shouldReduceMotion]);

    const slide = banner?.[0]; // first slide for now — carousel logic can extend this later

    return (
        <section
            ref={heroRef}
            className="relative overflow-hidden bg-gradient-to-br from-light-100 via-primary-50 to-light-200 py-20 md:py-32"
        >
            {/* Parallax background accents */}
            <motion.div
                className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-200/40 blur-2xl"
                style={{ x: mousePos.x * -20, y: mousePos.y * -20 }}
            />
            <motion.div
                className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-primary-300/30 blur-3xl"
                style={{ x: mousePos.x * 20, y: mousePos.y * 20 }}
            />

            <div className="container mx-auto px-4 md:px-8 relative grid md:grid-cols-2 gap-12 items-center">
                {/* Text content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                        <FaShieldAlt /> Trusted Security & Water Solutions
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 leading-tight mb-6">
                        {slide?.title || 'Complete Security & RO Water Solutions'}
                    </h1>
                    <p className="text-dark-300 text-lg mb-8 max-w-lg">
                        {slide?.subtitle ||
                            'CCTV cameras, biometric systems, and RO water purifiers — installed and serviced by experts across Coimbatore, Dindigul, and Tirupur.'}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button to="/contact">Get Free Consultation</Button>
                        <Button to="/products" variant="secondary">View Products</Button>
                    </div>
                </motion.div>

                {/* 3D Tilt visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <Tilt
                        tiltMaxAngleX={10}
                        tiltMaxAngleY={10}
                        glareEnable={true}
                        glareMaxOpacity={0.15}
                        scale={1.02}
                        transitionSpeed={1500}
                        className="rounded-2xl"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center text-center p-4 bg-primary-50 rounded-xl">
                                <FaShieldAlt className="text-4xl text-primary-500 mb-2" />
                                <span className="font-heading font-semibold text-dark-900">CCTV Security</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-primary-50 rounded-xl">
                                <FaTint className="text-4xl text-primary-500 mb-2" />
                                <span className="font-heading font-semibold text-dark-900">RO Purifiers</span>
                            </div>
                        </div>
                    </Tilt>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeHero;