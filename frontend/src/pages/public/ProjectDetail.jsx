import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import useFetch from '@/hooks/useFetch';
import { getProjectById } from '@/services/projectService';
import Loader from '@/components/common/Loader';

const ProjectDetail = () => {
    const { id } = useParams();
    const { data: project, loading, error } = useFetch(() => getProjectById(id), [id]);

    if (loading) return <Loader />;

    if (error || !project) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <p className="text-dark-300">Project not found.</p>
                <Link to="/projects" className="text-primary-500 font-medium mt-4 inline-block">
                    ← Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{project.title} | Focus 360 Projects</title>
            </Helmet>

            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                    <div className="text-sm text-dark-300 mb-6">
                        <Link to="/" className="hover:text-primary-500">Home</Link> /{' '}
                        <Link to="/projects" className="hover:text-primary-500">Projects</Link> /{' '}
                        <span className="text-dark-900">{project.title}</span>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-3xl font-bold text-dark-900 mb-2"
                    >
                        {project.title}
                    </motion.h1>

                    <div className="flex flex-wrap gap-4 text-sm text-dark-300 mb-8">
                        {project.location && <span>📍 {project.location}</span>}
                        {project.completionDate && (
                            <span>✅ Completed: {new Date(project.completionDate).toLocaleDateString()}</span>
                        )}
                        {project.category && <span>🏷️ {project.category}</span>}
                    </div>

                    {project.images?.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            {project.images.map((img) => (
                                <img
                                    key={img.publicId}
                                    src={img.url}
                                    alt={project.title}
                                    loading="lazy"
                                    className="w-full rounded-xl object-cover aspect-video"
                                />
                            ))}
                        </div>
                    )}

                    <p className="text-dark-300 leading-relaxed">{project.description}</p>
                </div>
            </section>
        </>
    );
};

export default ProjectDetail;