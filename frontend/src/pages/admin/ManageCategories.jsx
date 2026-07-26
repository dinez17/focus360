import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getCategories } from '@/services/categoryService';
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/services/adminService';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';

const ManageCategories = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: categories, loading } = useFetch(getCategories, [refreshKey]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', type: 'product' });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const refresh = () => setRefreshKey((k) => k + 1);

    const openEdit = (cat) => {
        setEditing(cat);
        setForm({ name: cat.name, type: cat.type });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                await adminUpdateCategory(editing._id, form);
                toast.success('Category updated');
            } else {
                await adminCreateCategory(form);
                toast.success('Category created');
            }
            setModalOpen(false);
            refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminDeleteCategory(deleteTarget._id);
            toast.success('Category deleted');
            setDeleteTarget(null);
            refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cannot delete — category may still be in use');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-dark-900">Manage Categories</h2>
                <button
                    onClick={() => { setEditing(null); setForm({ name: '', type: 'product' }); setModalOpen(true); }}
                    className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600"
                >
                    + Add Category
                </button>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <DataTable
                    columns={[{ key: 'name', label: 'Name' }, { key: 'type', label: 'Type' }]}
                    data={categories || []}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                />
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Name</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Type</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        >
                            <option value="product">Product</option>
                            <option value="service">Service</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">Cancel</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message={`Delete "${deleteTarget?.name}"?`} />
        </div>
    );
};

export default ManageCategories;