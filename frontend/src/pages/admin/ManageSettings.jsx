import { useState, useEffect } from 'react';
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

    // Branches + Service Areas — separate state since they're structured/array data, not simple text fields
    const [branches, setBranches] = useState([]);
    const [serviceAreasInput, setServiceAreasInput] = useState('');


    useEffect(() => {
        if (company) {
            setCompanyForm({
                companyName: company.companyName,
                aboutText: company.aboutText,
                mission: company.mission,
                vision: company.vision,
                yearsOfExperience: company.yearsOfExperience,
            });
        }
    }, [company]);

    useEffect(() => {
        if (contact) {
            setContactForm({
                phone: contact.phone || [],
                email: contact.email || [],
                address: contact.address,
                whatsappNumber: contact.whatsappNumber,
                googleMapsEmbedUrl: contact.googleMapsEmbedUrl,
            });
            setBranches(contact.branches || []);
            setServiceAreasInput((contact.serviceAreas || []).join(', '));
        }
    }, [contact]);

    useEffect(() => {
        if (social) {
            setSocialForm({
                facebook: social.facebook,
                instagram: social.instagram,
                linkedin: social.linkedin,
                youtube: social.youtube,
            });
        }
    }, [social]);

    // ===================== BRANCH HELPERS =====================
    const addBranch = () => {
        setBranches([...branches, { branchName: '', address: '', phone: '', isMainBranch: false }]);
    };

    const updateBranch = (index, field, value) => {
        const updated = [...branches];
        updated[index][field] = value;
        setBranches(updated);
    };

    const removeBranch = (index) => {
        setBranches(branches.filter((_, i) => i !== index));
    };

    // ===================== SAVE HANDLERS =====================
    const saveCompany = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings/company', companyForm);
            toast.success('Company info saved');
            setRefreshKey((k) => k + 1);
        } catch {
            toast.error('Failed to save');
        }
    };

    const saveContact = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings/contact', {
                phone: JSON.stringify((contactForm.phone || []).filter(Boolean)),
                email: JSON.stringify((contactForm.email || []).filter(Boolean)),
                address: contactForm.address,
                whatsappNumber: contactForm.whatsappNumber,
                googleMapsEmbedUrl: contactForm.googleMapsEmbedUrl,
                branches: JSON.stringify(branches),
                serviceAreas: JSON.stringify(
                    serviceAreasInput.split(',').map((s) => s.trim()).filter(Boolean)
                ),
            });
            toast.success('Contact info saved');
            setRefreshKey((k) => k + 1);
        } catch {
            toast.error('Failed to save');
        }
    };

    const saveSocial = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings/social', socialForm);
            toast.success('Social links saved');
            setRefreshKey((k) => k + 1);
        } catch {
            toast.error('Failed to save');
        }
    };

    return (
        <div>
            <h2 className="font-heading text-2xl font-bold text-dark-900 mb-6">Settings</h2>

            <div className="flex gap-2 mb-6 border-b border-light-400">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-light-400 p-6 max-w-2xl">
                {/* ===================== COMPANY INFO TAB ===================== */}
                {activeTab === 'Company Info' && (
                    <form onSubmit={saveCompany} className="space-y-4">
                        <input
                            placeholder="Company Name"
                            value={companyForm.companyName || ''}
                            onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <textarea
                            placeholder="About Text"
                            rows={3}
                            value={companyForm.aboutText || ''}
                            onChange={(e) => setCompanyForm({ ...companyForm, aboutText: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <textarea
                            placeholder="Mission"
                            rows={2}
                            value={companyForm.mission || ''}
                            onChange={(e) => setCompanyForm({ ...companyForm, mission: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <textarea
                            placeholder="Vision"
                            rows={2}
                            value={companyForm.vision || ''}
                            onChange={(e) => setCompanyForm({ ...companyForm, vision: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <input
                            type="number"
                            placeholder="Years of Experience"
                            value={companyForm.yearsOfExperience || ''}
                            onChange={(e) => setCompanyForm({ ...companyForm, yearsOfExperience: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <button type="submit" className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                            Save Changes
                        </button>
                    </form>
                )}

                {/* ===================== CONTACT INFO TAB ===================== */}
                {activeTab === 'Contact Info' && (
                    <form onSubmit={saveContact} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Phone (comma-separated)</label>
                            <input
                                value={(contactForm.phone || []).join(', ')}
                                onChange={(e) =>
                                    setContactForm({ ...contactForm, phone: e.target.value.split(',').map((s) => s.trim()) })
                                }
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Email (comma-separated)</label>
                            <input
                                value={(contactForm.email || []).join(', ')}
                                onChange={(e) =>
                                    setContactForm({ ...contactForm, email: e.target.value.split(',').map((s) => s.trim()) })
                                }
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Primary Address</label>
                            <textarea
                                rows={2}
                                value={contactForm.address || ''}
                                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">WhatsApp Number</label>
                            <input
                                value={contactForm.whatsappNumber || ''}
                                onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Google Maps Embed URL</label>
                            <input
                                value={contactForm.googleMapsEmbedUrl || ''}
                                onChange={(e) => setContactForm({ ...contactForm, googleMapsEmbedUrl: e.target.value })}
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                            />
                        </div>

                        <hr className="border-light-400" />
                        <p className="text-sm font-semibold text-dark-700">Branches</p>

                        {branches.length === 0 && (
                            <p className="text-xs text-dark-300">No branches added yet. Click "+ Add Branch" below.</p>
                        )}

                        {branches.map((branch, i) => (
                            <div key={i} className="border border-light-400 rounded-lg p-4 space-y-2 relative bg-light-100">
                                <button
                                    type="button"
                                    onClick={() => removeBranch(i)}
                                    className="absolute top-2 right-2 text-danger text-xs font-medium hover:underline"
                                >
                                    Remove
                                </button>
                                <input
                                    placeholder="Branch Name (e.g. Main Branch - Dindigul)"
                                    value={branch.branchName}
                                    onChange={(e) => updateBranch(i, 'branchName', e.target.value)}
                                    className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                />
                                <input
                                    placeholder="Address"
                                    value={branch.address}
                                    onChange={(e) => updateBranch(i, 'address', e.target.value)}
                                    className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                />
                                <input
                                    placeholder="Phone"
                                    value={branch.phone}
                                    onChange={(e) => updateBranch(i, 'phone', e.target.value)}
                                    className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                />
                                <label className="flex items-center gap-2 text-xs text-dark-700">
                                    <input
                                        type="checkbox"
                                        checked={branch.isMainBranch}
                                        onChange={(e) => updateBranch(i, 'isMainBranch', e.target.checked)}
                                    />
                                    Main Branch (HQ)
                                </label>
                            </div>
                        ))}

                        <button type="button" onClick={addBranch} className="text-primary-500 text-sm font-medium hover:underline">
                            + Add Branch
                        </button>

                        <hr className="border-light-400" />
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Service Areas (comma-separated)</label>
                            <input
                                value={serviceAreasInput}
                                onChange={(e) => setServiceAreasInput(e.target.value)}
                                placeholder="Dindigul, Madurai, Karur, Tirupur, Coimbatore"
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600 mt-2"
                        >
                            Save Changes
                        </button>
                    </form>
                )}

                {/* ===================== SOCIAL LINKS TAB ===================== */}
                {activeTab === 'Social Links' && (
                    <form onSubmit={saveSocial} className="space-y-4">
                        <input
                            placeholder="Facebook URL"
                            value={socialForm.facebook || ''}
                            onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <input
                            placeholder="Instagram URL"
                            value={socialForm.instagram || ''}
                            onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <input
                            placeholder="LinkedIn URL"
                            value={socialForm.linkedin || ''}
                            onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5"
                        />
                        <button type="submit" className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                            Save Changes
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ManageSettings;