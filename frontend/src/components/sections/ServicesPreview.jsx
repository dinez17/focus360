import { motion } from 'framer-motion';
import { FaVideo, FaFingerprint, FaTint, FaTools } from 'react-icons/fa';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const iconMap = {
    cctv: FaVideo,
    biometric: FaFingerprint,
    water: FaTint,
    default: FaTools,
};

const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const ServicesPreview = ({ services, loading }) => {
    if (loading) return <Loader />;

    const displayServices = services?.slice(0, 6) || [];

    return (
        <section className="py-16 md:py-24 bg-light-100">
            <div className="container mx-auto px-4 md:px-8">
                <SectionHeading
                    eyebrow="What We Offer"
                    title="Our Services"
                    subtitle="Comprehensive security and water solutions installed and maintained by certified technicians"
                />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {displayServices.length === 0 ? (
                        <p className="text-dark-300 col-span-full text-center">Services coming soon.</p>
                    ) : (
                        displayServices.map((service) => {
                            const Icon = iconMap.default;
                            return (
                                <motion.div
                                    key={service._id}
                                    variants={fadeInUp}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-light-400 p-6"
                                >
                                    {service.image?.url ? (
                                        <img
                                            src={service.image.url}
                                            alt={service.title}
                                            loading="lazy"
                                            className="w-14 h-14 object-cover rounded-lg mb-4"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                                            <Icon className="text-2xl text-primary-500" />
                                        </div>
                                    )}
                                    <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-dark-300 text-sm line-clamp-3">{service.description}</p>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>

                <div className="text-center mt-10">
                    <Button to="/services" variant="secondary">View All Services</Button>
                </div>
            </div>
        </section>
    );
};

export default ServicesPreview;