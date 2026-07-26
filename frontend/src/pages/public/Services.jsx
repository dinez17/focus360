import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import useFetch from '@/hooks/useFetch';
import { getServices } from '@/services/serviceService';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import CTABanner from '@/components/sections/CTABanner';
import { FaTools } from 'react-icons/fa';

const Services = () => {
    const { data: services, loading } = useFetch(getServices, []);

    return (
        <>
            <Helmet>
                <title>Our Services | Focus 360 Integral Security Solutions</title>
                <meta name="description" content="CCTV installation, biometric systems, RO water purifier installation, AMC and maintenance services in Coimbatore." />
            </Helmet>

            <PageHeader title="Our Services" subtitle="Complete security and water solutions for your home and business" />

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    {loading ? (
                        <Loader />
                    ) : !services || services.length === 0 ? (
                        <p className="text-center text-dark-300">Services will be listed here soon.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, i) => (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-light-400 overflow-hidden"
                                >
                                    <div className="aspect-video bg-light-200 overflow-hidden">
                                        {service.image?.url ? (
                                            <img
                                                src={service.image.url}
                                                alt={service.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaTools className="text-4xl text-primary-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-dark-300 text-sm">{service.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <CTABanner />
        </>
    );
};

export default Services;