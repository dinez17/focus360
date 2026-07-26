import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import useFetch from '@/hooks/useFetch';
import { getTestimonials } from '@/services/testimonialService';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';

const Testimonials = () => {
    const { data: testimonials, loading } = useFetch(getTestimonials, []);

    return (
        <>
            <Helmet>
                <title>Testimonials | Focus 360 Integral Security Solutions</title>
            </Helmet>

            <PageHeader title="Client Testimonials" subtitle="Hear what our clients say about our service" />

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    {loading ? (
                        <Loader />
                    ) : !testimonials || testimonials.length === 0 ? (
                        <p className="text-center text-dark-300">Testimonials coming soon.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    key={t._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm p-6 border border-light-400"
                                >
                                    <div className="flex gap-1 text-warning mb-3">
                                        {Array.from({ length: t.rating }).map((_, idx) => <FaStar key={idx} />)}
                                    </div>
                                    <p className="text-dark-700 mb-4 italic">"{t.message}"</p>
                                    <div className="flex items-center gap-3">
                                        {t.image?.url ? (
                                            <img src={t.image.url} alt={t.clientName} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-600">
                                                {t.clientName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-heading font-semibold text-dark-900 text-sm">{t.clientName}</p>
                                            {t.clientDesignation && (
                                                <p className="text-dark-300 text-xs">{t.clientDesignation}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Testimonials;