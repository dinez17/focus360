import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import api from '@/services/api';
import { adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial } from '@/services/adminService';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ImageUploader from '@/components/common/ImageUploader';
import Loader from '@/components/common/Loader';

const emptyForm = { clientName: '', clientDesignation: '', message: '', rating: 5, isActive: true };

const ManageTestimonials = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: testimonials, loading } = useFetch(() => api.get('/testimonials/admin/all'), [refreshKey]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [existingImage, setExistingImage] = useState(null);
    const [newFiles, setNewFiles] = useState([]);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const refresh = () => setRefreshKey((k) => k + 1);

    const openCreate = () => {
        setEditingTestimonial(null);
        setForm(emptyForm);
        setExistingImage(null);
        setNewFiles([]);
        setModalOpen(true);
    };

    const openEdit = (t) => {
        setEditingTestimonial(t);
        setForm({
            clientName: t.clientName,
            clientDesignation: t.clientDesignation || '',
            message: t.message,
            rating: t.rating,
            isActive: t.isActive,
        });
        setExistingImage(t.image?.url ? t.image : null);
        setNewFiles([]);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('clientName', form.clientName);
            formData.append('clientDesignation', form.clientDesignation);
            formData.append('message', form.message);
            formData.append('rating', form.rating);
            formData.append('isActive', form.isActive);
            if (newFiles[0]) formData.append('image', newFiles[0]);

            if (editingTestimonial) {
                await adminUpdateTestimonial(editingTestimonial._id, formData);
                toast.success('Testimonial updated');
            } else {
                await adminCreateTestimonial(formData);
                toast.success('Testimonial created');
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
            await adminDeleteTestimonial(deleteTarget._id);
            toast.success('Testimonial deleted');
            setDeleteTarget(null);
            refresh();
        } catch {
            toast.error('Failed to delete testimonial');
        }
    };

    const columns = [
        {
            key: 'image', label: 'Photo',
            render: (row) => (
                <img
                    src={row.image?.url || 'https://via.placeholder.com/40'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                />
            ),
        },
        { key: 'clientName', label: 'Client Name' },
        { key: 'rating', label: 'Rating', render: (row) => '⭐'.repeat(row.rating) },
        {
            key: 'isActive', label: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-success/10 text-success' : 'bg-light-400 text-dark-300'}`}>
                    {row.isActive ? 'Active' : 'Hidden'}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-dark-900">Manage Testimonials</h2>
                <button onClick={openCreate} className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                    + Add Testimonial
                </button>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <DataTable columns={columns} data={testimonials?.data || testimonials || []} onEdit={openEdit} onDelete={setDeleteTarget} />
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Client Name</label>
                            <input
                                required
                                value={form.clientName}
                                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Designation (optional)</label>
                            <input
                                value={form.clientDesignation}
                                onChange={(e) => setForm({ ...form, clientDesignation: e.target.value })}
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Message</label>
                        <textarea
                            required
                            rows={3}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Rating</label>
                        <select
                            value={form.rating}
                            onChange={(e) => setForm({ ...form, rating: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        >
                            {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Client Photo (optional)</label>
                        <ImageUploader
                            existingImages={existingImage ? [existingImage] : []}
                            onExistingRemove={() => setExistingImage(null)}
                            newFiles={newFiles}
                            onNewFilesChange={(files) => setNewFiles(files.slice(0, 1))}
                            multiple={false}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-dark-700">
                        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                        Active (visible on site)
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60">
                            {saving ? 'Saving...' : 'Save Testimonial'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                message={`Delete testimonial from "${deleteTarget?.clientName}"?`}
            />
        </div>
    );
};

export default ManageTestimonials;