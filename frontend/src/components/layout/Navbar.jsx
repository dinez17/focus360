import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/focus360-logo.png';
import { HiOutlineUser } from 'react-icons/hi';
const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
                }`}
        >
            <nav className="container mx-auto px-4 md:px-8 flex items-center justify-between h-20">


                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Focus 360 Integral Security Solutions" className="h-32 w-auto object-contain" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `font-body font-medium transition-colors ${isActive ? 'text-primary-500' : 'text-dark-700 hover:text-primary-500'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    {/*  admin page link */}
                    <Link
                        to="/admin/login"
                        className="text-dark-300 hover:text-primary-500 transition-colors"
                        aria-label="Admin Login"
                        title="Admin Login"
                    >
                        <HiOutlineUser className="text-xl" />
                    </Link>

                    <a href="tel:+919566677227"
                        className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-md"
                    >
                        Call Now
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-dark-900 text-3xl"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <HiX /> : <HiMenu />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-white border-t border-light-400 overflow-hidden"
                    >
                        <div className="flex flex-col px-4 py-4 gap-3">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 font-body font-medium ${isActive ? 'text-primary-500' : 'text-dark-700'}`
                                    }
                                >
                                    {link.name}
                                </NavLink>

                            ))}

                            {/* added the link to admin login page - for mobile screen */}
                            <Link
                                to="/admin/login"
                                onClick={() => setIsOpen(false)}
                                className="py-2 font-body font-medium text-dark-300 border-t border-light-400 mt-2 pt-4"
                            >
                                Admin Login
                            </Link>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </header>
    );
};

export default Navbar;