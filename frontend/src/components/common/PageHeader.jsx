import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle }) => (
    <div className="bg-dark-900 py-16 md:py-20">
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 md:px-8 text-center"
        >
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-dark-100 mt-3 max-w-xl mx-auto">{subtitle}</p>}
            <div className="text-sm text-dark-100 mt-4">
                <Link to="/" className="hover:text-primary-400">Home</Link> / <span className="text-primary-400">{title}</span>
            </div>
        </motion.div>
    </div>
);

export default PageHeader;