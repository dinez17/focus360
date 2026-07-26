import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import SectionHeading from '@/components/common/SectionHeading';
import Loader from '@/components/common/Loader';

const TestimonialsSlider = ({ testimonials, loading }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!testimonials || testimonials.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials]);

    if (loading) return <Loader />;
    if (!testimonials || testimonials.length === 0) return null;

    const current = testimonials[index];

    return (
        <section className="py-16 md:py-24 bg-light-100">
            <div className="container mx-auto px-4 md:px-8 max-w-3xl">
                <SectionHeading eyebrow="Testimonials" title="What Our Clients Say" />

                <div className="relative bg-white rounded-xl shadow-md p-8 md:p-10 text-center min-h-[220px]">
                    <FaQuoteLeft className="text-primary-200 text-4xl mx-auto mb-4" />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <p className="text-dark-700 text-lg italic mb-6">"{current.message}"</p>
                            <div className="flex justify-center gap-1 mb-3 text-warning">
                                {Array.from({ length: current.rating }).map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>
                            <p className="font-heading font-semibold text-dark-900">{current.clientName}</p>
                            {current.clientDesignation && (
                                <p className="text-dark-300 text-sm">{current.clientDesignation}</p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {testimonials.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to testimonial ${i + 1}`}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === index ? 'bg-primary-500' : 'bg-light-400'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TestimonialsSlider;