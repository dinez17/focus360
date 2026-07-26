import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import useFetch from '@/hooks/useFetch';
import { getProductBySlug } from '@/services/productService';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';

const ProductDetail = () => {
    const { slug } = useParams();
    const { data: product, loading, error } = useFetch(() => getProductBySlug(slug), [slug]);
    const [activeImage, setActiveImage] = useState(0);

    if (loading) return <Loader />;

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <p className="text-dark-300">Product not found.</p>
                <Link to="/products" className="text-primary-500 font-medium mt-4 inline-block">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{product.name} | Focus 360 Integral Security Solutions</title>
                <meta name="description" content={product.description?.slice(0, 155)} />
            </Helmet>

            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-sm text-dark-300 mb-8">
                        <Link to="/" className="hover:text-primary-500">Home</Link> /{' '}
                        <Link to="/products" className="hover:text-primary-500">Products</Link> /{' '}
                        <span className="text-dark-900">{product.name}</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <div className="aspect-square bg-light-200 rounded-xl overflow-hidden mb-4">
                                {product.images?.[activeImage]?.url && (
                                    <img
                                        src={product.images[activeImage].url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            {product.images?.length > 1 && (
                                <div className="flex gap-3">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={img.publicId}
                                            onClick={() => setActiveImage(i)}
                                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-primary-500' : 'border-transparent'
                                                }`}
                                        >
                                            <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Details */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            {product.category?.name && (
                                <span className="text-primary-500 font-medium text-sm">{product.category.name}</span>
                            )}
                            <h1 className="font-heading text-3xl font-bold text-dark-900 mt-2 mb-4">{product.name}</h1>
                            <p className="text-dark-300 leading-relaxed mb-6">{product.description}</p>

                            {product.features?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-heading font-semibold text-dark-900 mb-3">Features</h3>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-dark-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {product.specifications?.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-heading font-semibold text-dark-900 mb-3">Specifications</h3>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {product.specifications.map((spec, i) => (
                                                <tr key={i} className="border-b border-light-400">
                                                    <td className="py-2 font-medium text-dark-700 w-1/3">{spec.key}</td>
                                                    <td className="py-2 text-dark-300">{spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <Button to="/contact">Enquire Now</Button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetail;