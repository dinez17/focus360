import { motion } from 'framer-motion';

const StatsBar = ({ stats }) => {
    const defaultStats = [
        { label: 'Years Experience', value: '10+' },
        { label: 'Installations', value: '500+' },
        { label: 'Happy Clients', value: '400+' },
        { label: 'Service Areas', value: '3+' },
    ];

    const displayStats = stats?.length > 0 ? stats : defaultStats;

    return (
        <section className="bg-dark-900 py-10">
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                {displayStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="text-center"
                    >
                        <div className="font-heading text-3xl md:text-4xl font-bold text-primary-400">
                            {stat.value}
                        </div>
                        <div className="text-dark-100 text-sm mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default StatsBar;