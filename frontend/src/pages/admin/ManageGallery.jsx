import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getGalleryImages } from '@/services/galleryService';
import { adminUploadGalleryImages, adminUpdateGalleryImage, adminDeleteGalleryImage } from '@/services/adminService';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';
import { HiPencil, HiTrash, HiUpload } from 'react-icons/hi';

const ManageGallery = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: images, loading } = useFetch(getGalleryImages, [refreshKey]);

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', category: 'General' });
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', category: '' });

    const [deleteTarget, setDeleteTarget] = useState(null);

    const refresh = () => setRefreshKey((k) => k + 1);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (uploadFiles.length === 0) {
            toast.error('Please select at least one image');
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', uploadForm.title);
            formData.append('category', uploadForm.category);
            uploadFiles.forEach((file) => formData.append('images', file));

            await adminUploadGalleryImages(formData);
            toast.success('Images uploaded successfully');
            setUploadModalOpen(false);
            setUploadForm({ title: '', category: 'General' });
            setUploadFiles([]);
            refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const openEdit = (img) => {
        setEditTarget(img);
        setEditForm({ title: img.title || '', category: img.category || 'General' });
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            await adminUpdateGalleryImage(editTarget._id, editForm);
            toast.success('Updated successfully');
            setEditTarget(null);
            refresh();
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async () => {
        try {
            await adminDeleteGalleryImage(deleteTarget._id);
            toast.success('Image deleted');
            setDeleteTarget(null);
            refresh();
        } catch {
            toast.error('Failed to delete image');
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-dark-900">Manage Gallery</h2>
                <button
                    onClick={() => setUploadModalOpen(true)}
                    className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600"
                >
                    + Upload Images
                </button>
            </div>

            {!images || images.length === 0 ? (
                <p className="text-dark-300 text-center py-10">No gallery images yet.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((img) => (
                        <div key={img._id} className="relative group rounded-xl overflow-hidden border border-light-400">
                            <img src={img.image.url} alt={img.title || ''} className="w-full aspect-square object-cover" />
                            <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <button onClick={() => openEdit(img)} className="bg-white rounded-full p-2 text-primary-500" aria-label="Edit">
                                    <HiPencil />
                                </button>
                                <button onClick={() => setDeleteTarget(img)} className="bg-white rounded-full p-2 text-danger" aria-label="Delete">
                                    <HiTrash />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-dark-900/70 text-white text-xs px-2 py-1 truncate">
                                {img.category}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Upload Gallery Images">
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Caption (optional, applies to all)</label>
                        <input
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Category</label>
                        <input
                            value={uploadForm.category}
                            onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                            placeholder="e.g. Installation, Products, Events"
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Select Images (multiple allowed)</label>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-light-400 rounded-lg py-8 cursor-pointer hover:border-primary-400">
                            <HiUpload className="text-2xl text-dark-300 mb-2" />
                            <span className="text-sm text-dark-300">
                                {uploadFiles.length > 0 ? `${uploadFiles.length} file(s) selected` : 'Click to select images'}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setUploadFiles(Array.from(e.target.files))}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setUploadModalOpen(false)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">
                            Cancel
                        </button>
                        <button type="submit" disabled={uploading} className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60">
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Caption/Category Modal */}
            <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Image Details" size="sm">
                <form onSubmit={handleEditSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Caption</label>
                        <input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Category</label>
                        <input
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEditTarget(null)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">
                            Cancel
                        </button>
                        <button type="submit" className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                message="Delete this gallery image permanently?"
            />
        </div>
    );
};

export default ManageGallery;