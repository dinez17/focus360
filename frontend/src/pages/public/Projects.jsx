import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useFetch from '@/hooks/useFetch';
import { getProjects } from '@/services/projectService';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';

const Projects = () => {
    const { data: projectsData, loading } = useFetch(() => getProjects({ limit: 50 }), []);

    return (
        <>
            <Helmet>
                <title>Our Projects | Focus 360 Integral Security Solutions</title>
                <meta name="description" content="Completed CCTV installation and RO water purification projects across Coimbatore, Dindigul, and Tirupur." />
            </Helmet>

            <PageHeader title="Our Projects" subtitle="A showcase of our completed installations and on-site work" />

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    {loading ? (
                        <Loader />
                    ) : !projectsData || projectsData.length === 0 ? (
                        <p className="text-center text-dark-300">Project showcase coming soon.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectsData.map((project, i) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Link
                                        to={`/projects/${project._id}`}
                                        className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                    >
                                        <div className="aspect-video bg-light-200 overflow-hidden">
                                            {project.images?.[0]?.url && (
                                                <img
                                                    src={project.images[0].url}
                                                    alt={project.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-heading font-semibold text-dark-900">{project.title}</h3>
                                            {project.location && (
                                                <p className="text-dark-300 text-sm mt-1">📍 {project.location}</p>
                                            )}
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

export default Projects;