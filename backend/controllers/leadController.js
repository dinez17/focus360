import asyncHandler from '../utils/asyncHandler.js';
import Lead from '../models/Lead.js';

// @desc    Submit contact form (public)
// @route   POST /api/v1/contact-form/submit
// @access  Public
export const submitLead = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Name, email, and message are required');
    }

    const lead = await Lead.create({ name, email, phone, message });

    // Email notification (Nodemailer) will be added here once Phase 13 email setup is confirmed —
    // flagged separately below since it needs an SMTP/service decision from you.

    res.status(201).json({ success: true, message: 'Thank you! We will get back to you soon.', data: lead });
});

// @desc    Get all leads (admin)
// @route   GET /api/v1/leads
// @access  Protected
export const getLeads = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
});

// @desc    Update lead status
// @route   PUT /api/v1/leads/:id
// @access  Protected
export const updateLeadStatus = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
        res.status(404);
        throw new Error('Lead not found');
    }

    const { status } = req.body;
    if (status) lead.status = status;

    await lead.save();

    res.status(200).json({ success: true, message: 'Lead updated successfully', data: lead });
});

// @desc    Delete lead
// @route   DELETE /api/v1/leads/:id
// @access  Protected
export const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
        res.status(404);
        throw new Error('Lead not found');
    }

    await lead.deleteOne();

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
});