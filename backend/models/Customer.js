import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        customerId: { type: String, unique: true }, // auto-generated: CUST-0001
        customerName: { type: String, required: true, trim: true },
        mobileNo: { type: String, required: true },
        whatsappNo: { type: String },
        address: { type: String },

        cctvType: { type: String }, // e.g., Dome, Bullet, Mixed
        noOfCameras: { type: Number, default: 0 },
        cameraBrand: { type: String },
        dvrNvr: { type: String }, // "DVR" or "NVR"
        dvrNvrModel: { type: String },
        hardDisk: { type: String }, // e.g., "1TB"

        installationDate: { type: Date },
        warrantyMonths: { type: Number, default: 12 },
        warrantyEndDate: { type: Date }, // auto-calculated in pre-save hook

        lastServiceDate: { type: Date },
        nextServiceDue: { type: Date },
        amcStatus: {
            type: String,
            enum: ['Active', 'Inactive', 'Not Applicable'],
            default: 'Not Applicable',
        },

        totalAmount: { type: Number, default: 0 },
        paidAmount: { type: Number, default: 0 },
        pendingAmount: { type: Number, default: 0 }, // auto-calculated
        paymentStatus: {
            type: String,
            enum: ['Paid', 'Partially Paid', 'Pending'],
            default: 'Pending',
        }, // auto-calculated

        remarks: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // tracks which telecaller/admin added this
    },
    { timestamps: true }
);

// Auto-generate sequential Customer ID (CUST-0001, CUST-0002...) — mirrors your Excel's auto-numbering
customerSchema.pre('save', async function () {
    if (!this.customerId) {
        const lastCustomer = await this.constructor.findOne().sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastCustomer?.customerId) {
            const lastNumber = parseInt(lastCustomer.customerId.split('-')[1], 10);
            nextNumber = lastNumber + 1;
        }
        this.customerId = `CUST-${String(nextNumber).padStart(4, '0')}`;
    }

    // Auto-calculate Warranty End Date = Installation Date + Warranty Months
    if (this.installationDate && this.warrantyMonths) {
        const endDate = new Date(this.installationDate);
        endDate.setMonth(endDate.getMonth() + this.warrantyMonths);
        this.warrantyEndDate = endDate;
    }

    // Auto-calculate Pending Amount and Payment Status
    this.pendingAmount = Math.max((this.totalAmount || 0) - (this.paidAmount || 0), 0);

    if (this.paidAmount >= this.totalAmount && this.totalAmount > 0) {
        this.paymentStatus = 'Paid';
    } else if (this.paidAmount > 0) {
        this.paymentStatus = 'Partially Paid';
    } else {
        this.paymentStatus = 'Pending';
    }
});

export default mongoose.model('Customer', customerSchema);