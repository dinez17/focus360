import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import useFetch from '@/hooks/useFetch';
import { getContactInfo } from '@/services/settingsService';
import { submitContactForm } from '@/services/leadService';
import PageHeader from '@/components/common/PageHeader';

const Contact = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const { data: contactInfo } = useFetch(getContactInfo, []);

    const onSubmit = async (formData) => {
        try {
            await submitContactForm(formData);
            toast.success('Thank you! We will get back to you soon.');
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <>
            <Helmet>
                <title>Contact Us | Focus 360 Integral Security Solutions</title>
                <meta name="description" content="Get in touch with Focus 360 for CCTV installation, security systems, and RO water purifier enquiries in Coimbatore." />
            </Helmet>

            <PageHeader title="Contact Us" subtitle="We'd love to hear from you — reach out for a free consultation" />

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-light-400 p-8 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full border border-light-400 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none"
                                    placeholder="Your name"
                                />
                                {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full border border-light-400 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none"
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
                                <input
                                    {...register('phone')}
                                    className="w-full border border-light-400 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none"
                                    placeholder="Your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    {...register('message', { required: 'Message is required' })}
                                    className="w-full border border-light-400 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none"
                                    placeholder="Tell us what you need..."
                                />
                                {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-60"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info + Map */}
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                        <div className="bg-light-300 rounded-xl p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-primary-500 mt-1 flex-shrink-0" />
                                <p className="text-dark-700">
                                    {contactInfo?.address || '4/39, Meenakshi Nagar, Kavundampalayam, Coimbatore - 641030'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-primary-500" />
                                <div>
                                    {(contactInfo?.phone?.length ? contactInfo.phone : ['95666 77227', '96987 32763']).map((p) => (
                                        <a key={p} href={`tel:${p}`} className="block text-dark-700 hover:text-primary-500">{p}</a>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-primary-500" />
                                <a href={`mailto:${contactInfo?.email?.[0] || 'info.focus360degree@gmail.com'}`} className="text-dark-700 hover:text-primary-500">
                                    {contactInfo?.email?.[0] || 'info.focus360degree@gmail.com'}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaWhatsapp className="text-primary-500" />

                                <a href={`https://wa.me/91${(contactInfo?.whatsappNumber || '9566677227').replace(/\D/g, '').slice(-10)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-dark-700 hover:text-primary-500"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="rounded-xl overflow-hidden aspect-video">
                            <iframe
                                title="Location Map"
                                src={
                                    contactInfo?.googleMapsEmbedUrl ||
                                    'https://www.google.com/maps?q=Meenakshi Nagar, Kavundampalayam, Coimbatore&output=embed'
                                }
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </motion.div>
                </div >
            </section >
        </>
    );
};

export default Contact;