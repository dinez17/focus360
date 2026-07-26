import { Link } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/services/productService';
import { getAllServicesAdmin } from '@/services/serviceService';
import { getProjects } from '@/services/projectService';
import { getLeadsAdmin } from '@/services/leadAdminService';
import Loader from '@/components/common/Loader';
import { HiCube, HiCog, HiOfficeBuilding, HiMail } from 'react-icons/hi';

const Dashboard = () => {
    const { admin } = useAuth();
    const { data: products, loading: pLoading } = useFetch(() => getProducts({ limit: 100 }), []);
    const { data: services, loading: sLoading } = useFetch(getAllServicesAdmin, []);
    const { data: projects, loading: prLoading } = useFetch(() => getProjects({ limit: 100 }), []);
    const { data: leads, loading: lLoading } = useFetch(getLeadsAdmin, []);

    const stats = [
        { label: 'Products', value: products?.length ?? 0, icon: HiCube, to: '/admin/products' },
        { label: 'Services', value: services?.length ?? 0, icon: HiCog, to: '/admin/services' },
        { label: 'Projects', value: projects?.length ?? 0, icon: HiOfficeBuilding, to: '/admin/projects' },
        { label: 'New Leads', value: leads?.filter((l) => l.status === 'new').length ?? 0, icon: HiMail, to: '/admin/leads' },
    ];

    const recentLeads = leads?.slice(0, 5) || [];
    const anyLoading = pLoading || sLoading || prLoading;

    return (
        <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-dark-900 mb-1">
                Welcome back, {admin?.name}
            </h2>
            <p className="text-dark-300 mb-8 text-sm sm:text-base">
                Here's what's happening with your site today.
            </p>

            {anyLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    {stats.map((stat) => (
                        <Link
                            key={stat.label}
                            to={stat.to}
                            className="bg-white rounded-xl shadow-sm border border-light-400 p-4 sm:p-6 hover:shadow-md transition-shadow"
                        >
                            <stat.icon className="text-xl sm:text-2xl text-primary-500 mb-2 sm:mb-3" />
                            <div className="font-heading text-xl sm:text-2xl font-bold text-dark-900">{stat.value}</div>
                            <div className="text-dark-300 text-xs sm:text-sm">{stat.label}</div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-light-400 p-4 sm:p-6">
                <h3 className="font-heading font-semibold text-base sm:text-lg text-dark-900 mb-4">
                    Recent Enquiries
                </h3>
                {lLoading ? (
                    <Loader small />
                ) : recentLeads.length === 0 ? (
                    <p className="text-dark-300 text-sm">No enquiries yet.</p>
                ) : (
                    <div className="space-y-3">
                        {recentLeads.map((lead) => (
                            <div
                                key={lead._id}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-light-300 pb-3 last:border-0"
                            >
                                <div>
                                    <p className="font-medium text-dark-900 text-sm">{lead.name}</p>
                                    <p className="text-dark-300 text-xs">{lead.email} • {lead.phone}</p>
                                </div>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full w-fit ${lead.status === 'new' ? 'bg-primary-100 text-primary-700' : 'bg-light-300 text-dark-300'
                                        }`}
                                >
                                    {lead.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <Link to="/admin/leads" className="text-primary-500 text-sm font-medium mt-4 inline-block">
                    View all enquiries →
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;