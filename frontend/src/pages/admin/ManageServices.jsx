import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getAllServicesAdmin } from '@/services/serviceService';
import { adminCreateService, adminUpdateService, adminDeleteService } from '@/services/adminService';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ImageUploader from '@/components/common/ImageUploader';
import Loader from '@/components/common/Loader';
import api from '@/services/api';

const emptyForm = { title: '', description: '', order: 0, isActive: true };

const ManageServices = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    // getAllServicesAdmin is a protected call — add it if missing (see note below)
    const { data: services, loading } = useFetch(() => api.get('/services/admin/all'), [refreshKey]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [existingImage, setExistingImage] = useState(null); // single image, not array
    const [newFiles, setNewFiles] = useState([]); // ImageUploader still works with an array internally
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const refresh = () => setRefreshKey((k) => k + 1);

    const openCreate = () => {
        setEditingService(null);
        setForm(emptyForm);
        setExistingImage(null);
        setNewFiles([]);
        setModalOpen(true);
    };

    const openEdit = (service) => {
        setEditingService(service);
        setForm({
            title: service.title,
            description: service.description,
            order: service.order,
            isActive: service.isActive,
        });
        setExistingImage(service.image?.url ? service.image : null);
        setNewFiles([]);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('order', form.order);
            formData.append('isActive', form.isActive);
            // Single image field — only send if a new file was selected
            if (newFiles[0]) formData.append('image', newFiles[0]);

            if (editingService) {
                await adminUpdateService(editingService._id, formData);
                toast.success('Service updated');
            } else {
                await adminCreateService(formData);
                toast.success('Service created');
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
            await adminDeleteService(deleteTarget._id);
            toast.success('Service deleted');
            setDeleteTarget(null);
            refresh();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const columns = [
        {
            key: 'image', label: 'Image',
            render: (row) => (
                <img src={row.image?.url || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover" />
            ),
        },
        { key: 'title', label: 'Title' },
        { key: 'order', label: 'Order' },
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
                <h2 className="font-heading text-2xl font-bold text-dark-900">Manage Services</h2>
                <button onClick={openCreate} className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                    + Add Service
                </button>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <DataTable columns={columns} data={services?.data || services || []} onEdit={openEdit} onDelete={setDeleteTarget} />
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingService ? 'Edit Service' : 'Add Service'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Title</label>
                        <input
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Display Order</label>
                        <input
                            type="number"
                            value={form.order}
                            onChange={(e) => setForm({ ...form, order: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Image (single)</label>
                        <ImageUploader
                            existingImages={existingImage ? [existingImage] : []}
                            onExistingRemove={() => setExistingImage(null)}
                            newFiles={newFiles}
                            onNewFilesChange={(files) => setNewFiles(files.slice(0, 1))} // enforce single file
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
                            {saving ? 'Saving...' : 'Save Service'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                message={`Delete "${deleteTarget?.title}"?`}
            />
        </div>
    );
};

export default ManageServices;