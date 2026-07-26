import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useFetch from '@/hooks/useFetch';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';

const Products = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');

    const { data: categories } = useFetch(() => getCategories({ type: 'product' }), []);
    const { data: productsData, loading } = useFetch(
        () => getProducts({ category: activeCategory === 'all' ? undefined : activeCategory, search, limit: 50 }),
        [activeCategory, search]
    );

    return (
        <>
            <Helmet>
                <title>Products | Focus 360 Integral Security Solutions</title>
                <meta name="description" content="CCTV cameras, biometric systems, RO water purifiers and more — browse our full product range." />
            </Helmet>

            <PageHeader title="Our Products" subtitle="Genuine, reliable products for security and water purification" />

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Search + Category Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-light-300 text-dark-700 hover:bg-light-400'
                                    }`}
                            >
                                All
                            </button>
                            {categories?.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => setActiveCategory(cat._id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat._id ? 'bg-primary-500 text-white' : 'bg-light-300 text-dark-700 hover:bg-light-400'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-light-400 rounded-lg px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none"
                        />
                    </div>

                    {loading ? (
                        <Loader />
                    ) : !productsData || productsData.length === 0 ? (
                        <p className="text-center text-dark-300 py-10">No products found.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {productsData.map((product, i) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Link
                                        to={`/products/${product.slug}`}
                                        className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-light-400"
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
                                            <span className="text-xs text-primary-500 font-medium">
                                                {product.category?.name}
                                            </span>
                                            <h3 className="font-heading font-semibold text-dark-900 line-clamp-1 mt-1">
                                                {product.name}
                                            </h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Products;