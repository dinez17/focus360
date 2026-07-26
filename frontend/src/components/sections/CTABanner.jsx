import { motion } from 'framer-motion';
import Button from '@/components/common/Button';

const CTABanner = () => (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 py-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 md:px-8 text-center"
        >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Secure Your Home or Business?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                Get a free consultation and quote from our security and water treatment experts today.
            </p>
            <Button to="/contact" className="bg-white !text-primary-600 hover:bg-light-200">
                Get Free Consultation
            </Button>
        </motion.div>
    </section>
);

export default CTABanner;