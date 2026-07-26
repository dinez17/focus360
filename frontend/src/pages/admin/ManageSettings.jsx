import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getCompanyInfo, getContactInfo, getSocialLinks } from '@/services/settingsService';
import api from '@/services/api';

const tabs = ['Company Info', 'Contact Info', 'Social Links'];

const ManageSettings = () => {
    const [activeTab, setActiveTab] = useState('Company Info');
    const [refreshKey, setRefreshKey] = useState(0);

    const { data: company } = useFetch(getCompanyInfo, [refreshKey]);
    const { data: contact } = useFetch(getContactInfo, [refreshKey]);
    const { data: social } = useFetch(getSocialLinks, [refreshKey]);

    const [companyForm, setCompanyForm] = useState({});
    const [contactForm, setContactForm] = useState({});
    const [socialForm, setSocialForm] = useState({});

    // Sync fetched data into editable form state once loaded
    useState(() => {
        if (company) setCompanyForm({ companyName: company.companyName, aboutText: company.aboutText, mission: company.mission, vision: company.vision, yearsOfExperience: company.yearsOfExperience });
    }, [company]);

    const saveCompany = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings/company', companyForm);
            toast.success('Company info saved');
            setRefreshKey((k) => k + 1);
        } catch { toast.error('Failed to save'); }
    };

    const saveContact = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings/contact', {
                phone: JSON.stringify((contactForm.phone || contact?.phone || []).filter(Boolean)),
                email: JSON.stringify((contactForm.email || contact?.email || []).filter(Boolean)),
                address: contactForm.address ?? contact?.address,
                whatsappNumber: contactForm.whatsappNumber ?? contact?.whatsappNumber,
                googleMapsEmbedUrl: contactForm.googleMapsEmbedUrl ?? contact?.googleMapsEmbedUrl,
            });
            toast.success('Contact info saved');
            setRefreshKey((k) => k + 1);
        } catch { toast.error('Failed to save'); }
    };

    const saveSocial = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings/social', socialForm);
            toast.success('Social links saved');
            setRefreshKey((k) => k + 1);
        } catch { toast.error('Failed to save'); }
    };

    return (
        <div>
            <h2 className="font-heading text-2xl font-bold text-dark-900 mb-6">Settings</h2>

            <div className="flex gap-2 mb-6 border-b border-light-400">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-light-400 p-6 max-w-2xl">
                {activeTab === 'Company Info' && (
                    <form onSubmit={saveCompany} className="space-y-4">
                        <input placeholder="Company Name" defaultValue={company?.companyName} onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <textarea placeholder="About Text" rows={3} defaultValue={company?.aboutText} onChange={(e) => setCompanyForm({ ...companyForm, aboutText: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <textarea placeholder="Mission" rows={2} defaultValue={company?.mission} onChange={(e) => setCompanyForm({ ...companyForm, mission: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <textarea placeholder="Vision" rows={2} defaultValue={company?.vision} onChange={(e) => setCompanyForm({ ...companyForm, vision: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <input type="number" placeholder="Years of Experience" defaultValue={company?.yearsOfExperience} onChange={(e) => setCompanyForm({ ...companyForm, yearsOfExperience: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <button type="submit" className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">Save Changes</button>
                    </form>
                )}

                {activeTab === 'Contact Info' && (
                    <form onSubmit={saveContact} className="space-y-4">
                        <input placeholder="Phone (comma-separated)" defaultValue={contact?.phone?.join(', ')} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value.split(',').map(s => s.trim()) })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <input placeholder="Email (comma-separated)" defaultValue={contact?.email?.join(', ')} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value.split(',').map(s => s.trim()) })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <textarea placeholder="Address" rows={2} defaultValue={contact?.address} onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <input placeholder="WhatsApp Number" defaultValue={contact?.whatsappNumber} onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <input placeholder="Google Maps Embed URL" defaultValue={contact?.googleMapsEmbedUrl} onChange={(e) => setContactForm({ ...contactForm, googleMapsEmbedUrl: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <button type="submit" className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">Save Changes</button>
                    </form>
                )}

                {activeTab === 'Social Links' && (
                    <form onSubmit={saveSocial} className="space-y-4">
                        <input placeholder="Facebook URL" defaultValue={social?.facebook} onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <input placeholder="Instagram URL" defaultValue={social?.instagram} onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <input placeholder="LinkedIn URL" defaultValue={social?.linkedin} onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        <button type="submit" className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">Save Changes</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ManageSettings;