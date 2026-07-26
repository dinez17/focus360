import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-dark-900 text-light-100">
            <div className="container mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
                <div>
                    <h3 className="font-heading text-xl font-bold mb-4">
                        Focus <span className="text-primary-400">360</span>
                    </h3>
                    <p className="text-dark-100 text-sm leading-relaxed">
                        Integral Security Solutions — trusted CCTV, security systems, and RO water
                        purification services across Coimbatore, Dindigul, and Tirupur.
                    </p>
                </div>

                <div>
                    <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-dark-100">
                        <li><Link to="/about" className="hover:text-primary-400">About Us</Link></li>
                        <li><Link to="/services" className="hover:text-primary-400">Services</Link></li>
                        <li><Link to="/products" className="hover:text-primary-400">Products</Link></li>
                        <li><Link to="/projects" className="hover:text-primary-400">Projects</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-primary-400">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
                    <ul className="space-y-3 text-sm text-dark-100">
                        <li className="flex items-start gap-2">
                            <FaMapMarkerAlt className="mt-1 text-primary-400 flex-shrink-0" />
                            4/39, Meenakshi Nagar, Kavundampalayam, Coimbatore - 641030
                        </li>
                        <li className="flex items-center gap-2">
                            <FaPhone className="text-primary-400" /> 95666 77227 (Marketing)
                        </li>
                        <li className="flex items-center gap-2">
                            <FaPhone className="text-primary-400" /> 96987 32763 (Technical)
                        </li>
                        <li className="flex items-center gap-2">
                            <FaEnvelope className="text-primary-400" /> info.focus360degree@gmail.com
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-semibold mb-4">Follow Us</h4>
                    <div className="flex gap-4 text-2xl">
                        <a href="#" aria-label="Facebook" className="hover:text-primary-400"><FaFacebook /></a>
                        <a href="#" aria-label="Instagram" className="hover:text-primary-400"><FaInstagram /></a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-primary-400"><FaLinkedin /></a>

                        <a href="https://wa.me/919566677227"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="hover:text-primary-400"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-dark-700 py-6 text-center text-sm text-dark-100">
                © {year} Focus 360 Integral Security Solutions. All rights reserved.
            </div>
        </footer >
    );
};

export default Footer;