import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, title, subtitle, center = true }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`mb-12 ${center ? 'text-center' : ''}`}
    >
        {eyebrow && (
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wide">
                {eyebrow}
            </span>
        )}
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-900 mt-2">{title}</h2>
        {subtitle && <p className="text-dark-300 mt-3 max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
);

export default SectionHeading;