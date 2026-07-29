import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getStaff, createStaff, deleteStaffAccount } from '@/services/adminService';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';

const emptyForm = { name: '', email: '', password: '', role: 'telecaller' };

const ManageStaff = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: staff, loading } = useFetch(getStaff, [refreshKey]);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const refresh = () => setRefreshKey((k) => k + 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createStaff(form);
            toast.success(`${form.role} account created successfully`);
            setModalOpen(false);
            setForm(emptyForm);
            refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteStaffAccount(deleteTarget._id);
            toast.success('Staff account removed');
            setDeleteTarget(null);
            refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'role', label: 'Role',
            render: (row) => (
                <span className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700 capitalize">{row.role}</span>
            ),
        },
        {
            key: 'lastLogin', label: 'Last Login',
            render: (row) => (row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never'),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-dark-900">Manage Staff Accounts</h2>
                <button onClick={() => setModalOpen(true)} className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                    + Add Staff Account
                </button>
            </div>

            <p className="text-dark-300 text-sm mb-4">
                Create login accounts for telecallers (Leads + Customer Database access only) or editors (full content management, no product/settings deletion restrictions).
            </p>

            {loading ? (
                <Loader />
            ) : (
                <DataTable columns={columns} data={staff || []} onEdit={() => { }} onDelete={setDeleteTarget} />
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Account" size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
                        <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5">
                            <option value="telecaller">Telecaller (Leads + Customers only)</option>
                            <option value="editor">Editor (Full content management)</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">Cancel</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60">
                            {saving ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message={`Remove staff account for "${deleteTarget?.name}"? They will immediately lose access.`} />
        </div>
    );
};

export default ManageStaff;