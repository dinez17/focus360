import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const FeaturedProducts = ({ products, loading }) => {
    if (loading) return <Loader />;

    const featured = products?.filter((p) => p.isFeatured).slice(0, 4) || [];

    return (
        <section className="py-16 md:py-24 bg-light-300">
            <div className="container mx-auto px-4 md:px-8">
                <SectionHeading
                    eyebrow="Top Picks"
                    title="Featured Products"
                    subtitle="Reliable, tested products for your home and business security or water needs"
                />

                {featured.length === 0 ? (
                    <p className="text-dark-300 text-center">Featured products coming soon.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link
                                    to={`/products/${product.slug}`}
                                    className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                >
                                    <div className="aspect-square bg-light-200 overflow-hidden">
                                        {product.images?.[0]?.url && (
                                            <img
                                                src={product.images[0].url}
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-heading font-semibold text-dark-900 line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-primary-500 text-sm font-medium mt-1">View Details →</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Button to="/products" variant="secondary">View All Products</Button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;