import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        customerId: { type: String, unique: true },
        customerName: { type: String, required: true, trim: true },
        mobileNo: { type: String, required: true },
        whatsappNo: { type: String },
        address: { type: String },

        // NEW: product type selection
        productType: [{ type: String, enum: ['CCTV', 'RO Water Purifier'] }],

        //CCTV - specific details

        cctvType: { type: String },
        noOfCameras: { type: Number, default: 0 },
        cameraBrand: { type: String },
        dvrNvr: { type: String },
        dvrNvrModel: { type: String },
        hardDisk: { type: String },

        // NEW: RO Water Purifier-specific details 
        roDetails: {
            roType: { type: String, enum: ['Domestic', 'Commercial/Industrial'] },
            capacityLiters: { type: Number }, // e.g., 10 Liter capacity
            purificationStages: { type: Number }, // e.g., 5-stage
            pumpCapacity: { type: String }, // e.g., "75 GPD"
            membraneCapacity: { type: String }, // e.g., "100 GPD"
            model: { type: String },
            tdsLevel: { type: String }, // TDS reading at installation, useful for service history
        },

        installationDate: { type: Date },
        warrantyMonths: { type: Number, default: 12 },
        warrantyEndDate: { type: Date },

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