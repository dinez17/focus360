import { Helmet } from 'react-helmet-async';
import useFetch from '@/hooks/useFetch';
import { getHomepageSettings } from '@/services/settingsService';
import { getServices } from '@/services/serviceService';
import { getProducts } from '@/services/productService';
import { getTestimonials } from '@/services/testimonialService';

import HomeHero from '@/components/sections/HomeHero';
import StatsBar from '@/components/sections/StatsBar';
import ServicesPreview from '@/components/sections/ServicesPreview';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import TestimonialsSlider from '@/components/sections/TestimonialsSlider';
import CTABanner from '@/components/sections/CTABanner';

const Home = () => {
    const { data: homepageSettings } = useFetch(getHomepageSettings, []);
    const { data: services, loading: servicesLoading } = useFetch(getServices, []);
    const { data: productsData, loading: productsLoading } = useFetch(
        () => getProducts({ limit: 50 }),
        []
    );
    const { data: testimonials, loading: testimonialsLoading } = useFetch(getTestimonials, []);

    return (
        <>
            <Helmet>
                <title>Focus 360 Integral Security Solutions | CCTV & RO Water Purifiers in Coimbatore</title>
                <meta
                    name="description"
                    content="Trusted CCTV, security systems, and RO water purification services in Coimbatore, Dindigul, and Tirupur. Free consultation available."
                />
            </Helmet>

            <HomeHero banner={homepageSettings?.heroBanner} />
            <StatsBar stats={homepageSettings?.highlightStats} />
            <ServicesPreview services={services} loading={servicesLoading} />
            <FeaturedProducts products={productsData} loading={productsLoading} />
            <TestimonialsSlider testimonials={testimonials} loading={testimonialsLoading} />
            <CTABanner />
        </>
    );
};

export default Home;