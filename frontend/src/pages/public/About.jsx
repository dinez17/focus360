import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaTools, FaHeadset } from 'react-icons/fa';
import useFetch from '@/hooks/useFetch';
import { getCompanyInfo } from '@/services/settingsService';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import SectionHeading from '@/components/common/SectionHeading';
import CTABanner from '@/components/sections/CTABanner';

const whyChooseUs = [
    { icon: FaAward, title: 'Experienced Team', desc: 'Years of hands-on expertise in security and water systems' },
    { icon: FaUsers, title: 'Trusted by Clients', desc: 'Hundreds of satisfied homes and businesses served' },
    { icon: FaTools, title: 'Quality Installation', desc: 'Certified technicians using genuine branded equipment' },
    { icon: FaHeadset, title: 'Reliable Support', desc: 'Prompt AMC and after-sales service you can count on' },
];

const About = () => {
    const { data: company, loading } = useFetch(getCompanyInfo, []);

    return (
        <>
            <Helmet>
                <title>About Us | Focus 360 Integral Security Solutions</title>
                <meta name="description" content="Learn about Focus 360's mission to deliver trusted security and water purification solutions across Coimbatore." />
            </Helmet>

            <PageHeader title="About Us" subtitle="Get to know Focus 360 Integral Security Solutions" />

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    {loading ? (
                        <Loader />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark-900 mb-4">
                                {company?.companyName || 'Focus 360 Integral Security Solutions'}
                            </h2>
                            <p className="text-dark-300 leading-relaxed">
                                {company?.aboutText ||
                                    `Focus 360 Integral Security Solutions provides complete CCTV, security, and RO water
                  purification solutions to homes and businesses across Coimbatore, Dindigul, and Tirupur.
                  With ${company?.yearsOfExperience || '10+'} years of experience, we deliver reliable
                  installation, maintenance, and AMC services backed by genuine equipment and expert support.`}
                            </p>
                        </motion.div>
                    )}

                    {(company?.mission || company?.vision) && (
                        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
                            {company?.mission && (
                                <div className="bg-light-300 rounded-xl p-8">
                                    <h3 className="font-heading text-xl font-semibold text-dark-900 mb-3">Our Mission</h3>
                                    <p className="text-dark-300">{company.mission}</p>
                                </div>
                            )}
                            {company?.vision && (
                                <div className="bg-light-300 rounded-xl p-8">
                                    <h3 className="font-heading text-xl font-semibold text-dark-900 mb-3">Our Vision</h3>
                                    <p className="text-dark-300">{company.vision}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 md:py-24 bg-light-300">
                <div className="container mx-auto px-4 md:px-8">
                    <SectionHeading eyebrow="Why Choose Us" title="What Sets Us Apart" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="bg-white rounded-xl p-6 text-center shadow-sm"
                            >
                                <item.icon className="text-3xl text-primary-500 mx-auto mb-4" />
                                <h3 className="font-heading font-semibold text-dark-900 mb-2">{item.title}</h3>
                                <p className="text-dark-300 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner />
        </>
    );
};

export default About;