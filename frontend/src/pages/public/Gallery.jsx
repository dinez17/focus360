import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import useFetch from '@/hooks/useFetch';
import { getGalleryImages, getGalleryCategories } from '@/services/galleryService';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';

const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [lightboxImage, setLightboxImage] = useState(null);

    const { data: categories } = useFetch(getGalleryCategories, []);
    const { data: images, loading } = useFetch(
        () => getGalleryImages({ category: activeCategory === 'all' ? undefined : activeCategory }),
        [activeCategory]
    );

    return (
        <>
            <Helmet>
                <title>Gallery | Focus 360 Integral Security Solutions</title>
                <meta name="description" content="Browse photos of our CCTV installations, security systems, and RO water purification projects." />
            </Helmet>

            <PageHeader title="Gallery" subtitle="A visual look at our work and installations" />

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-light-300 text-dark-700'
                                }`}
                        >
                            All
                        </button>
                        {categories?.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-light-300 text-dark-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <Loader />
                    ) : !images || images.length === 0 ? (
                        <p className="text-center text-dark-300">Gallery images coming soon.</p>
                    ) : (
                        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                            {images.map((img, i) => (
                                <motion.div
                                    key={img._id}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: (i % 8) * 0.05 }}
                                    className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden"
                                    onClick={() => setLightboxImage(img)}
                                >
                                    <img
                                        src={img.image.url}
                                        alt={img.title || 'Gallery image'}
                                        loading="lazy"
                                        className="w-full hover:scale-105 transition-transform duration-300"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-dark-900/95 z-[100] flex items-center justify-center p-4"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white text-3xl"
                            onClick={() => setLightboxImage(null)}
                            aria-label="Close"
                        >
                            <HiX />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={lightboxImage.image.url}
                            alt={lightboxImage.title || ''}
                            className="max-h-[85vh] max-w-full rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Gallery;