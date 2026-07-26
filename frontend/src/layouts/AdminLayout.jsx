import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    HiViewGrid, HiCube, HiTag, HiCog, HiPhotograph,
    HiOfficeBuilding, HiChatAlt2, HiMail, HiLogout, HiKey, HiMenu, HiX,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import logo from '@/assets/focus360-logo.png';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HiViewGrid },
    { name: 'Products', path: '/admin/products', icon: HiCube },
    { name: 'Categories', path: '/admin/categories', icon: HiTag },
    { name: 'Services', path: '/admin/services', icon: HiCog },
    { name: 'Projects', path: '/admin/projects', icon: HiOfficeBuilding },
    { name: 'Gallery', path: '/admin/gallery', icon: HiPhotograph },
    { name: 'Testimonials', path: '/admin/testimonials', icon: HiChatAlt2 },
    { name: 'Leads', path: '/admin/leads', icon: HiMail },
    { name: 'Settings', path: '/admin/settings', icon: HiCog },
];

const AdminLayout = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen bg-light-200 overflow-hidden">
            {/* Mobile overlay backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-dark-900/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar — fixed drawer on mobile, static on desktop */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 text-white flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                    <img src={logo} alt="Focus 360" className="h-10 w-auto object-contain" />
                    <button className="lg:hidden text-white text-2xl" onClick={closeSidebar} aria-label="Close menu">
                        <HiX />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-500 text-white'
                                    : 'text-dark-100 hover:bg-dark-700 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="text-lg" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-dark-700 space-y-1">
                    <NavLink
                        to="/admin/change-password"
                        onClick={closeSidebar}
                        className="flex items-center gap-3 px-2 py-2 text-sm text-dark-100 hover:text-white"
                    >
                        <HiKey /> Change Password
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-2 py-2 text-sm text-dark-100 hover:text-white w-full"
                    >
                        <HiLogout /> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                <header className="bg-white shadow-sm px-4 sm:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden text-dark-900 text-2xl"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <HiMenu />
                        </button>
                        <h1 className="font-heading font-semibold text-base sm:text-lg text-dark-900">Admin Panel</h1>
                    </div>
                    <span className="text-xs sm:text-sm text-dark-300 truncate max-w-[150px] sm:max-w-none">
                        Welcome, <strong>{admin?.name}</strong>
                    </span>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;