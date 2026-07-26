import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/common/PageHeader';

const PrivacyPolicy = () => (
    <>
        <Helmet>
            <title>Privacy Policy | Focus 360 Integral Security Solutions</title>
        </Helmet>

        <PageHeader title="Privacy Policy" />

        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8 max-w-3xl prose prose-slate">
                <p className="text-dark-300 mb-6">Last updated: July 2026</p>

                <h2 className="font-heading text-xl font-semibold text-dark-900 mt-8 mb-3">Information We Collect</h2>
                <p className="text-dark-300">
                    We collect information you voluntarily provide through our contact form, including your name,
                    email, phone number, and message content, solely to respond to your enquiry.
                </p>

                <h2 className="font-heading text-xl font-semibold text-dark-900 mt-8 mb-3">How We Use Your Information</h2>
                <p className="text-dark-300">
                    Your information is used exclusively to respond to service enquiries and is never sold or
                    shared with third parties for marketing purposes.
                </p>

                <h2 className="font-heading text-xl font-semibold text-dark-900 mt-8 mb-3">Contact Us</h2>
                <p className="text-dark-300">
                    If you have questions about this policy, please contact us at info.focus360degree@gmail.com.
                </p>
            </div>
        </section>
    </>
);

export default PrivacyPolicy;