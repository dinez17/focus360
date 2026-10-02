import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import useFetch from '@/hooks/useFetch';
import { getContactInfo, getSocialLinks } from '@/services/settingsService';

const Footer = () => {
    const year = new Date().getFullYear();
    const { data: contactInfo } = useFetch(getContactInfo, []);
    const { data: social } = useFetch(getSocialLinks, []);

    const branches = contactInfo?.branches?.length > 0 ? contactInfo.branches : [
        { branchName: 'Main Branch - Dindigul', address: 'Ranas L-154, RM Colony, Dindigul', phone: '9566677227' },
        { branchName: 'Coimbatore Branch', address: '4/39, Meenakshi Nagar, Kavundampalayam, Coimbatore - 641030', phone: '9698732763' },
    ];

    const serviceAreas = contactInfo?.serviceAreas?.length > 0
        ? contactInfo.serviceAreas
        : ['Dindigul', 'Madurai', 'Karur', 'Tirupur', 'Coimbatore'];

    return (
        <footer className="bg-dark-900 text-light-100">
            <div className="container mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
                <div>
                    <h3 className="font-heading text-xl font-bold mb-4">
                        Focus <span className="text-primary-400">360</span>
                    </h3>
                    <p className="text-dark-100 text-sm leading-relaxed mb-4">
                        Integral Security Solutions — trusted CCTV, security systems, and RO water
                        purification services.
                    </p>
                    {/* Service Areas as tags */}
                    <div className="flex flex-wrap gap-2">
                        {serviceAreas.map((area) => (
                            <span key={area} className="text-xs bg-dark-700 text-dark-100 px-2.5 py-1 rounded-full">
                                📍 {area}
                            </span>
                        ))}
                    </div>
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

                {/* Branches — now supports multiple */}
                <div>
                    <h4 className="font-heading font-semibold mb-4">Our Branches</h4>
                    <ul className="space-y-4 text-sm text-dark-100">
                        {branches.map((branch) => (
                            <li key={branch.branchName}>
                                <p className="font-medium text-white flex items-center gap-1">
                                    {branch.branchName}
                                    {branch.isMainBranch && (
                                        <span className="text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded ml-1">HQ</span>
                                    )}
                                </p>
                                <p className="flex items-start gap-2 mt-1">
                                    <FaMapMarkerAlt className="mt-1 text-primary-400 flex-shrink-0" />
                                    {branch.address}
                                </p>
                                {branch.phone && (
                                    <p className="flex items-center gap-2 mt-1">
                                        <FaPhone className="text-primary-400" /> {branch.phone}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-semibold mb-4">Follow Us</h4>
                    <div className="flex gap-4 text-2xl mb-6">
                        {social?.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary-400"><FaFacebook /></a>}
                        {social?.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary-400"><FaInstagram /></a>}
                        {social?.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary-400"><FaLinkedin /></a>}
                        <a href={`https://wa.me/91${(contactInfo?.whatsappNumber || '9566677227').replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-primary-400">
                            <FaWhatsapp />
                        </a>
                    </div>
                    <a href="mailto:info.focus360degree@gmail.com" className="text-sm text-dark-100 hover:text-primary-400 block">
                        info.focus360degree@gmail.com
                    </a>
                </div>
            </div>

            <div className="border-t border-dark-700 py-6 text-center text-sm text-dark-100">
                © {year} Focus 360 Integral Security Solutions. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;