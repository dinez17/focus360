import asyncHandler from '../utils/asyncHandler.js';
import Customer from '../models/Customer.js';

// @desc    Get all customers, with search + filters
// @route   GET /api/v1/customers
// @access  Protected (superadmin, editor, telecaller)
export const getCustomers = asyncHandler(async (req, res) => {
    const { search, amcStatus, paymentStatus, page = 1, limit = 50 } = req.query;

    const query = {};
    if (search) {
        query.$or = [
            { customerName: { $regex: search, $options: 'i' } },
            { mobileNo: { $regex: search, $options: 'i' } },
            { customerId: { $regex: search, $options: 'i' } },
        ];
    }
    if (amcStatus) query.amcStatus = amcStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const customers = await Customer.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Customer.countDocuments(query);

    res.status(200).json({
        success: true,
        data: customers,
        pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
});

// @desc    Get single customer
// @route   GET /api/v1/customers/:id
// @access  Protected
export const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }
    res.status(200).json({ success: true, data: customer });
});

// @desc    Create customer
// @route   POST /api/v1/customers
// @access  Protected
export const createCustomer = asyncHandler(async (req, res) => {
    const { customerName, mobileNo } = req.body;

    if (!customerName || !mobileNo) {
        res.status(400);
        throw new Error('Customer name and mobile number are required');
    }

    const customer = await Customer.create({ ...req.body, createdBy: req.admin._id });

    res.status(201).json({ success: true, message: 'Customer added successfully', data: customer });
});

// @desc    Update customer
// @route   PUT /api/v1/customers/:id
// @access  Protected
export const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    Object.assign(customer, req.body);
    await customer.save(); // triggers pre-save recalculation of warranty/pending amount

    res.status(200).json({ success: true, message: 'Customer updated successfully', data: customer });
});

// @desc    Delete customer
// @route   DELETE /api/v1/customers/:id
// @access  Protected (superadmin, editor only — not telecaller)
export const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }
    await customer.deleteOne();
    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
});

// @desc    Dashboard summary stats — mirrors your Excel's Dashboard sheet exactly
// @route   GET /api/v1/customers/stats/summary
// @access  Protected
export const getCustomerStats = asyncHandler(async (req, res) => {
    const totalCustomers = await Customer.countDocuments();

    const amounts = await Customer.aggregate([
        {
            $group: {
                _id: null,
                totalInstallationValue: { $sum: '$totalAmount' },
                totalPaid: { $sum: '$paidAmount' },
                totalPending: { $sum: '$pendingAmount' },
            },
        },
    ]);

    const warrantyExpired = await Customer.countDocuments({ warrantyEndDate: { $lt: new Date() } });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const serviceDueSoon = await Customer.countDocuments({
        nextServiceDue: { $gte: new Date(), $lte: thirtyDaysFromNow },
    });

    res.status(200).json({
        success: true,
        data: {
            totalCustomers,
            totalInstallationValue: amounts[0]?.totalInstallationValue || 0,
            totalPaid: amounts[0]?.totalPaid || 0,
            totalPending: amounts[0]?.totalPending || 0,
            warrantyExpired,
            serviceDueSoon,
        },
    });
});