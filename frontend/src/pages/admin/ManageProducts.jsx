import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminDeleteProductImage } from '@/services/adminService';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ImageUploader from '@/components/common/ImageUploader';
import Loader from '@/components/common/Loader';

const emptyForm = { name: '', category: '', description: '', features: '', isFeatured: false, isActive: true };

const ManageProducts = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { data: productsData, loading } = useFetch(() => getProducts({ limit: 100 }), [refreshKey]);
    const { data: categories } = useFetch(() => getCategories({ type: 'product' }), []);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const refresh = () => setRefreshKey((k) => k + 1);

    const openCreate = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setExistingImages([]);
        setNewFiles([]);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            category: product.category?._id || '',
            description: product.description,
            features: (product.features || []).join(', '),
            isFeatured: product.isFeatured,
            isActive: product.isActive,
        });
        setExistingImages(product.images || []);
        setNewFiles([]);
        setModalOpen(true);
    };

    const handleRemoveExistingImage = async (publicId) => {
        if (!editingProduct) return;
        try {
            await adminDeleteProductImage(editingProduct._id, publicId);
            setExistingImages((imgs) => imgs.filter((img) => img.publicId !== publicId));
            toast.success('Image removed');
        } catch (error) {
            toast.error('Failed to remove image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('category', form.category);
            formData.append('description', form.description);
            formData.append('features', JSON.stringify(form.features.split(',').map((f) => f.trim()).filter(Boolean)));
            formData.append('isFeatured', form.isFeatured);
            formData.append('isActive', form.isActive);
            newFiles.forEach((file) => formData.append('images', file));

            if (editingProduct) {
                await adminUpdateProduct(editingProduct._id, formData);
                toast.success('Product updated');
            } else {
                await adminCreateProduct(formData);
                toast.success('Product created');
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
            await adminDeleteProduct(deleteTarget._id);
            toast.success('Product deleted');
            setDeleteTarget(null);
            refresh();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const columns = [
        {
            key: 'image', label: 'Image',
            render: (row) => (
                <img
                    src={row.images?.[0]?.url || 'https://via.placeholder.com/40'}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                />
            ),
        },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category', render: (row) => row.category?.name || '—' },
        {
            key: 'isActive', label: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-success/10 text-success' : 'bg-light-400 text-dark-300'}`}>
                    {row.isActive ? 'Active' : 'Hidden'}
                </span>
            )
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-dark-900">Manage Products</h2>
                <button onClick={openCreate} className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                    + Add Product
                </button>
            </div>

            {loading ? <Loader /> : <DataTable columns={columns} data={productsData || []} onEdit={openEdit} onDelete={setDeleteTarget} />}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add Product'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Product Name</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Category</label>
                        <select
                            required
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
                        >
                            <option value="">Select category</option>
                            {categories?.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
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
                        <label className="block text-sm font-medium text-dark-700 mb-1">Features (comma-separated)</label>
                        <input
                            value={form.features}
                            onChange={(e) => setForm({ ...form, features: e.target.value })}
                            placeholder="Night Vision, Weatherproof, HD Recording"
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

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-dark-700">
                            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                            Featured Product
                        </label>
                        <label className="flex items-center gap-2 text-sm text-dark-700">
                            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                            Active (visible on site)
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60">
                            {saving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                message={`Delete "${deleteTarget?.name}"? This will also remove its images permanently.`}
            />
        </div>
    );
};

export default ManageProducts;