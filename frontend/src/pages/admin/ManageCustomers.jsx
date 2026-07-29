import { useState } from 'react';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { useAuth } from '@/context/AuthContext';
import { getCustomers, getCustomerStats, createCustomer, updateCustomer, deleteCustomer } from '@/services/customerService';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';
import { HiUserGroup, HiCash, HiExclamationCircle, HiClock } from 'react-icons/hi';

const emptyForm = {
    customerName: '', mobileNo: '', whatsappNo: '', address: '',
    cctvType: '', noOfCameras: '', cameraBrand: '', dvrNvr: '', dvrNvrModel: '', hardDisk: '',
    installationDate: '', warrantyMonths: 12, lastServiceDate: '', nextServiceDue: '', amcStatus: 'Not Applicable',
    totalAmount: '', paidAmount: '', remarks: '',
};

const paymentStatusColors = {
    Paid: 'bg-success/10 text-success',
    'Partially Paid': 'bg-warning/10 text-warning',
    Pending: 'bg-danger/10 text-danger',
};

const ManageCustomers = () => {
    const { admin } = useAuth();
    const canDelete = admin?.role !== 'telecaller'; // telecallers can add/edit but not delete

    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState('');
    const { data: customersData, loading } = useFetch(() => getCustomers({ search, limit: 100 }), [refreshKey, search]);
    const { data: stats } = useFetch(getCustomerStats, [refreshKey]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const refresh = () => setRefreshKey((k) => k + 1);

    const formatDateForInput = (date) => (date ? date.split('T')[0] : '');

    const openCreate = () => {
        setEditingCustomer(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (customer) => {
        setEditingCustomer(customer);
        setForm({
            customerName: customer.customerName || '',
            mobileNo: customer.mobileNo || '',
            whatsappNo: customer.whatsappNo || '',
            address: customer.address || '',
            cctvType: customer.cctvType || '',
            noOfCameras: customer.noOfCameras || '',
            cameraBrand: customer.cameraBrand || '',
            dvrNvr: customer.dvrNvr || '',
            dvrNvrModel: customer.dvrNvrModel || '',
            hardDisk: customer.hardDisk || '',
            installationDate: formatDateForInput(customer.installationDate),
            warrantyMonths: customer.warrantyMonths || 12,
            lastServiceDate: formatDateForInput(customer.lastServiceDate),
            nextServiceDue: formatDateForInput(customer.nextServiceDue),
            amcStatus: customer.amcStatus || 'Not Applicable',
            totalAmount: customer.totalAmount || '',
            paidAmount: customer.paidAmount || '',
            remarks: customer.remarks || '',
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form, noOfCameras: Number(form.noOfCameras) || 0, warrantyMonths: Number(form.warrantyMonths) || 12,
                totalAmount: Number(form.totalAmount) || 0, paidAmount: Number(form.paidAmount) || 0
            };

            if (editingCustomer) {
                await updateCustomer(editingCustomer._id, payload);
                toast.success('Customer updated');
            } else {
                await createCustomer(payload);
                toast.success('Customer added');
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
            await deleteCustomer(deleteTarget._id);
            toast.success('Customer deleted');
            setDeleteTarget(null);
            refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete customer');
        }
    };

    const columns = [
        { key: 'customerId', label: 'ID' },
        { key: 'customerName', label: 'Name' },
        { key: 'mobileNo', label: 'Mobile' },
        { key: 'cctvType', label: 'CCTV Type' },
        {
            key: 'warrantyEndDate', label: 'Warranty Ends',
            render: (row) => row.warrantyEndDate ? new Date(row.warrantyEndDate).toLocaleDateString() : '—',
        },
        {
            key: 'paymentStatus', label: 'Payment',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${paymentStatusColors[row.paymentStatus]}`}>
                    {row.paymentStatus}
                </span>
            ),
        },
    ];

    const statCards = [
        { label: 'Total Customers', value: stats?.totalCustomers ?? 0, icon: HiUserGroup },
        { label: 'Total Pending (₹)', value: stats?.totalPending?.toLocaleString() ?? 0, icon: HiCash },
        { label: 'Warranty Expired', value: stats?.warrantyExpired ?? 0, icon: HiExclamationCircle },
        { label: 'Service Due (30d)', value: stats?.serviceDueSoon ?? 0, icon: HiClock },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h2 className="font-heading text-2xl font-bold text-dark-900">Customer Database</h2>
                <button onClick={openCreate} className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600">
                    + Add Customer
                </button>
            </div>

            {/* Stats cards from Excel's Dashboard sheet */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-light-400 p-4">
                        <stat.icon className="text-xl text-primary-500 mb-2" />
                        <div className="font-heading text-xl font-bold text-dark-900">{stat.value}</div>
                        <div className="text-dark-300 text-xs">{stat.label}</div>
                    </div>
                ))}
            </div>

            <input
                type="text"
                placeholder="Search by name, mobile, or Customer ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 border border-light-400 rounded-lg px-4 py-2.5 mb-4 outline-none focus:ring-2 focus:ring-primary-400"
            />

            {loading ? (
                <Loader />
            ) : (
                <DataTable
                    columns={columns}
                    data={customersData || []}
                    onEdit={openEdit}
                    onDelete={canDelete ? setDeleteTarget : () => toast.error('You do not have permission to delete customers')}
                />
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCustomer ? 'Edit Customer' : 'Add Customer'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Customer Name *</label>
                            <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Mobile No *</label>
                            <input required value={form.mobileNo} onChange={(e) => setForm({ ...form, mobileNo: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">WhatsApp No</label>
                            <input value={form.whatsappNo} onChange={(e) => setForm({ ...form, whatsappNo: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Address</label>
                            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                    </div>

                    <hr className="border-light-400" />
                    <p className="text-sm font-semibold text-dark-700">CCTV / Equipment Details</p>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">CCTV Type</label>
                            <input value={form.cctvType} onChange={(e) => setForm({ ...form, cctvType: e.target.value })} placeholder="Dome / Bullet / Mixed" className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">No. of Cameras</label>
                            <input type="number" value={form.noOfCameras} onChange={(e) => setForm({ ...form, noOfCameras: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Camera Brand</label>
                            <input value={form.cameraBrand} onChange={(e) => setForm({ ...form, cameraBrand: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">DVR/NVR</label>
                            <select value={form.dvrNvr} onChange={(e) => setForm({ ...form, dvrNvr: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5">
                                <option value="">Select</option>
                                <option value="DVR">DVR</option>
                                <option value="NVR">NVR</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Model</label>
                            <input value={form.dvrNvrModel} onChange={(e) => setForm({ ...form, dvrNvrModel: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Hard Disk</label>
                            <input value={form.hardDisk} onChange={(e) => setForm({ ...form, hardDisk: e.target.value })} placeholder="1TB" className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                    </div>

                    <hr className="border-light-400" />
                    <p className="text-sm font-semibold text-dark-700">Warranty & Service</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Installation Date</label>
                            <input type="date" value={form.installationDate} onChange={(e) => setForm({ ...form, installationDate: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Warranty (Months)</label>
                            <input type="number" value={form.warrantyMonths} onChange={(e) => setForm({ ...form, warrantyMonths: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Last Service Date</label>
                            <input type="date" value={form.lastServiceDate} onChange={(e) => setForm({ ...form, lastServiceDate: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Next Service Due</label>
                            <input type="date" value={form.nextServiceDue} onChange={(e) => setForm({ ...form, nextServiceDue: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">AMC Status</label>
                            <select value={form.amcStatus} onChange={(e) => setForm({ ...form, amcStatus: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5">
                                <option value="Not Applicable">Not Applicable</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <hr className="border-light-400" />
                    <p className="text-sm font-semibold text-dark-700">Payment Details</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Total Amount (₹)</label>
                            <input type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">Paid Amount (₹)</label>
                            <input type="number" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                        </div>
                    </div>
                    <p className="text-xs text-dark-300">
                        Pending amount and payment status are calculated automatically once saved.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Remarks</label>
                        <textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-light-400 text-dark-700">Cancel</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60">
                            {saving ? 'Saving...' : 'Save Customer'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} message={`Delete customer "${deleteTarget?.customerName}"? This cannot be undone.`} />
        </div>
    );
};

export default ManageCustomers;