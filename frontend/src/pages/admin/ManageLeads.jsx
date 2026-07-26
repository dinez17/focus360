import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getLeadsAdmin, updateLeadStatusAdmin, deleteLeadAdmin } from '@/services/leadAdminService';
import Loader from '@/components/common/Loader';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const statusColors = { new: 'bg-primary-100 text-primary-700', contacted: 'bg-warning/10 text-warning', closed: 'bg-success/10 text-success' };

const ManageLeads = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: leads, loading } = useFetch(getLeadsAdmin, [refreshKey]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleStatusChange = async (id, status) => {
        try {
            await updateLeadStatusAdmin(id, status);
            toast.success('Status updated');
            setRefreshKey((k) => k + 1);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteLeadAdmin(deleteTarget._id);
            toast.success('Lead deleted');
            setDeleteTarget(null);
            setRefreshKey((k) => k + 1);
        } catch {
            toast.error('Failed to delete lead');
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h2 className="font-heading text-2xl font-bold text-dark-900 mb-6">Enquiries / Leads</h2>

            <div className="bg-white rounded-xl shadow-sm border border-light-400 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-light-200 text-dark-700">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Contact</th>
                            <th className="text-left px-4 py-3">Message</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Date</th>
                            <th className="text-right px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(leads || []).map((lead) => (
                            <tr key={lead._id} className="border-t border-light-300">
                                <td className="px-4 py-3 font-medium text-dark-900">{lead.name}</td>
                                <td className="px-4 py-3 text-dark-700">
                                    <div>{lead.email}</div>
                                    {lead.phone && <div className="text-xs text-dark-300">{lead.phone}</div>}
                                </td>
                                <td className="px-4 py-3 text-dark-700 max-w-xs truncate">{lead.message}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                        className={`text-xs rounded-full px-3 py-1 border-none outline-none ${statusColors[lead.status]}`}
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-dark-300 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => setDeleteTarget(lead)} className="text-danger hover:text-red-700 text-xs font-medium">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message="Delete this lead permanently?" />
        </div>
    );
};

export default ManageLeads;