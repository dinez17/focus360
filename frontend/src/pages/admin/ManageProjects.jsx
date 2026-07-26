import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getProjects } from '@/services/projectService';
import { adminCreateProject, adminUpdateProject, adminDeleteProject, adminDeleteProjectImage } from '@/services/adminService';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ImageUploader from '@/components/common/ImageUploader';
import Loader from '@/components/common/Loader';

const emptyForm = { title: '', location: '', description: '', completionDate: '', category: '', isFeatured: false };

const ManageProjects = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: projectsData, loading } = useFetch(() => getProjects({ limit: 100 }), [refreshKey]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const refresh = () => setRefreshKey((k) => k + 1);

    const openCreate = () => {
        setEditingProject(null);
        setForm(emptyForm);
        setExistingImages([]);
        setNewFiles([]);
        setModalOpen(true);
    };

    const openEdit = (project) => {
        setEditingProject(project);
        setForm({
            title: project.title,
            location: project.location || '',
            description: project.description || '',
            completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
            category: project.category || '',
            isFeatured: project.isFeatured,
        });
        setExistingImages(project.images || []);
        setNewFiles([]);
        setModalOpen(true);
    };

    const handleRemoveExistingImage = async (publicId) => {
        if (!editingProject) return;
        try {
            await adminDeleteProjectImage(editingProject._id, publicId);
            setExistingImages((imgs) => imgs.filter((img) => img.publicId !== publicId));
            toast.success('Image removed');
        } catch {
            toast.error('Failed to remove image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('location', form.location);
            formData.append('description', form.description);
            if (form.completionDate) formData.append('completionDate', form.completionDate);
            formData.append('category', form.category);
            formData.append('isFeatured', form.isFeatured);
            newFiles.forEach((file) => formData.append('images', file));

            if (editingProject) {
                await adminUpdateProject(editingProject._id, formData);
                toast.success('Project updated');
            } else {
                await adminCreateProject(formData);
                toast.success('Project created');
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
            await adminDeleteProject(deleteTarget._id);
            toast.success('Project deleted');
            setDeleteTarget(null);
            refresh();
        } catch {
            toast.error('Failed to delete project');
        }
    };

    const columns = [
        {
            key: 'image', label: 'Image',
            render: (row) => (
                <img src={row.images?.[0]?.url || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover" />
            ),
        },
        { key: 'title', label: 'Title' },
        { key: 'location', label: 'Location' },
        {
            key: 'completionDate', label: 'Completed',
            render: (row) => (row.completionDate ? new Date(row.completionDate).toLocaleDateString() : '—'),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-dark-900">Manage Projects</h2>
                <button onClick={openCreate} className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                    + Add Project
                </button>
            </div>

            {loading ? <Loader /> : <DataTable columns={columns} data={projectsData || []} onEdit={openEdit} onDelete={setDeleteTarget} />}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Edit Project' : 'Add Project'} size="lg">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Location</label>
                            <input
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Category (optional)</label>
                            <input
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                placeholder="e.g. CCTV Installation"
                                className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Completion Date</label>
                        <input
                            type="date"
                            value={form.completionDate}
                            onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Images</label>
                        <ImageUploader
                            existingImages={existingImages}
                            onExistingRemove={handleRemoveExistingImage}
                            newFiles={newFiles}
                            onNewFilesChange={setNewFiles}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-dark-700">
                        <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                        Featured Project
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60">
                            {saving ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                message={`Delete "${deleteTarget?.title}"? This will also remove its images permanently.`}
            />
        </div>
    );
};

export default ManageProjects;