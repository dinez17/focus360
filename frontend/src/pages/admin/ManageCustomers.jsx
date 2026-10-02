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
    productType: [],
    cctvDetails: { cctvType: '', noOfCameras: '', cameraBrand: '', dvrNvr: '', dvrNvrModel: '', hardDisk: '' },
    roDetails: { roType: '', capacityLiters: '', purificationStages: '', pumpCapacity: '', membraneCapacity: '', model: '', tdsLevel: '' },
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
    const canDelete = admin?.role !== 'telecaller';

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

    const toggleProductType = (type) => {
        setForm((prev) => {
            const current = prev.productType || [];
            const updated = current.includes(type)
                ? current.filter((t) => t !== type)
                : [...current, type];
            return { ...prev, productType: updated };
        });
    };

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
            productType: customer.productType || [],
            cctvDetails: {
                cctvType: customer.cctvType || '',
                noOfCameras: customer.noOfCameras || '',
                cameraBrand: customer.cameraBrand || '',
                dvrNvr: customer.dvrNvr || '',
                dvrNvrModel: customer.dvrNvrModel || '',
                hardDisk: customer.hardDisk || '',
            },
            roDetails: customer.roDetails || { roType: '', capacityLiters: '', purificationStages: '', pumpCapacity: '', membraneCapacity: '', model: '', tdsLevel: '' },
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
                customerName: form.customerName,
                mobileNo: form.mobileNo,
                whatsappNo: form.whatsappNo,
                address: form.address,
                productType: form.productType,
                installationDate: form.installationDate || undefined,
                warrantyMonths: Number(form.warrantyMonths) || 12,
                lastServiceDate: form.lastServiceDate || undefined,
                nextServiceDue: form.nextServiceDue || undefined,
                amcStatus: form.amcStatus,
                totalAmount: Number(form.totalAmount) || 0,
                paidAmount: Number(form.paidAmount) || 0,
                remarks: form.remarks,
            };

            if (form.productType.includes('CCTV')) {
                payload.cctvType = form.cctvDetails.cctvType;
                payload.noOfCameras = Number(form.cctvDetails.noOfCameras) || 0;
                payload.cameraBrand = form.cctvDetails.cameraBrand;
                payload.dvrNvr = form.cctvDetails.dvrNvr;
                payload.dvrNvrModel = form.cctvDetails.dvrNvrModel;
                payload.hardDisk = form.cctvDetails.hardDisk;
            }

            if (form.productType.includes('RO Water Purifier')) {
                payload.roDetails = {
                    roType: form.roDetails.roType || undefined,
                    capacityLiters: Number(form.roDetails.capacityLiters) || undefined,
                    purificationStages: Number(form.roDetails.purificationStages) || undefined,
                    pumpCapacity: form.roDetails.pumpCapacity,
                    membraneCapacity: form.roDetails.membraneCapacity,
                    model: form.roDetails.model,
                    tdsLevel: form.roDetails.tdsLevel,
                };
            }

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
        {
            key: 'productType', label: 'Product',
            render: (row) => (
                <div className="flex gap-1 flex-wrap">
                    {(row.productType || []).map((type) => (
                        <span key={type} className={`text-xs px-2 py-0.5 rounded-full ${type === 'CCTV' ? 'bg-primary-100 text-primary-700' : 'bg-success/10 text-success'}`}>
                            {type === 'RO Water Purifier' ? 'RO' : type}
                        </span>
                    ))}
                </div>
            ),
        },
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
                    <p className="text-sm font-semibold text-dark-700">Product Type</p>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-dark-700">
                            <input
                                type="checkbox"
                                checked={form.productType.includes('CCTV')}
                                onChange={() => toggleProductType('CCTV')}
                            />
                            CCTV / Security System
                        </label>
                        <label className="flex items-center gap-2 text-sm text-dark-700">
                            <input
                                type="checkbox"
                                checked={form.productType.includes('RO Water Purifier')}
                                onChange={() => toggleProductType('RO Water Purifier')}
                            />
                            RO Water Purifier
                        </label>
                    </div>

                    {form.productType.includes('CCTV') && (
                        <div className="bg-light-100 border border-light-400 rounded-lg p-4 space-y-3">
                            <p className="text-sm font-semibold text-primary-600">CCTV / Equipment Details</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">CCTV Type</label>
                                    <input
                                        value={form.cctvDetails.cctvType}
                                        onChange={(e) => setForm({ ...form, cctvDetails: { ...form.cctvDetails, cctvType: e.target.value } })}
                                        placeholder="Dome / Bullet / Mixed"
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">No. of Cameras</label>
                                    <input
                                        type="number"
                                        value={form.cctvDetails.noOfCameras}
                                        onChange={(e) => setForm({ ...form, cctvDetails: { ...form.cctvDetails, noOfCameras: e.target.value } })}
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Camera Brand</label>
                                    <input
                                        value={form.cctvDetails.cameraBrand}
                                        onChange={(e) => setForm({ ...form, cctvDetails: { ...form.cctvDetails, cameraBrand: e.target.value } })}
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">DVR/NVR</label>
                                    <select
                                        value={form.cctvDetails.dvrNvr}
                                        onChange={(e) => setForm({ ...form, cctvDetails: { ...form.cctvDetails, dvrNvr: e.target.value } })}
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="DVR">DVR</option>
                                        <option value="NVR">NVR</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Model</label>
                                    <input
                                        value={form.cctvDetails.dvrNvrModel}
                                        onChange={(e) => setForm({ ...form, cctvDetails: { ...form.cctvDetails, dvrNvrModel: e.target.value } })}
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Hard Disk</label>
                                    <input
                                        value={form.cctvDetails.hardDisk}
                                        onChange={(e) => setForm({ ...form, cctvDetails: { ...form.cctvDetails, hardDisk: e.target.value } })}
                                        placeholder="1TB"
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {form.productType.includes('RO Water Purifier') && (
                        <div className="bg-light-100 border border-light-400 rounded-lg p-4 space-y-3">
                            <p className="text-sm font-semibold text-primary-600">RO Water Purifier Details</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Type</label>
                                    <select
                                        value={form.roDetails.roType}
                                        onChange={(e) => setForm({ ...form, roDetails: { ...form.roDetails, roType: e.target.value } })}
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="Domestic">Domestic</option>
                                        <option value="Commercial/Industrial">Commercial/Industrial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Capacity (Liters)</label>
                                    <input
                                        type="number"
                                        value={form.roDetails.capacityLiters}
                                        onChange={(e) => setForm({ ...form, roDetails: { ...form.roDetails, capacityLiters: e.target.value } })}
                                        placeholder="10"
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Purification Stages</label>
                                    <input
                                        type="number"
                                        value={form.roDetails.purificationStages}
                                        onChange={(e) => setForm({ ...form, roDetails: { ...form.roDetails, purificationStages: e.target.value } })}
                                        placeholder="5"
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Pump Capacity</label>
                                    <input
                                        value={form.roDetails.pumpCapacity}
                                        onChange={(e) => setForm({ ...form, roDetails: { ...form.roDetails, pumpCapacity: e.target.value } })}
                                        placeholder="75 GPD"
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Membrane Capacity</label>
                                    <input
                                        value={form.roDetails.membraneCapacity}
                                        onChange={(e) => setForm({ ...form, roDetails: { ...form.roDetails, membraneCapacity: e.target.value } })}
                                        placeholder="100 GPD"
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-dark-700 mb-1">Model</label>
                                    <input
                                        value={form.roDetails.model}
                                        onChange={(e) => setForm({ ...form, roDetails: { ...form.roDetails, model: e.target.value } })}
                                        className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-700 mb-1">TDS Level at Installation</label>
                                <input
                                    value={form.roDetails.tdsLevel}
                                    onChange={(e) => setForm({ ...form, roDetails: { ...form.roDetails, tdsLevel: e.target.value } })}
                                    placeholder="e.g., 450 ppm"
                                    className="w-full border border-light-400 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    )}

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