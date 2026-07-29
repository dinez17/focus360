import asyncHandler from '../utils/asyncHandler.js';
import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';

// @desc    Login admin
// @route   POST /api/v1/auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        },
    });
});

// @desc    Get currently logged-in admin's profile
// @route   GET /api/v1/auth/me
// @access  Protected
export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.admin,
    });
});

// @desc    Logout admin
// @route   POST /api/v1/auth/logout
// @access  Protected
export const logoutAdmin = asyncHandler(async (req, res) => {
    // Since we use stateless JWT (not sessions), logout is handled client-side
    // by deleting the token from localStorage. This endpoint exists mainly
    // for consistency and to allow future token-blacklisting if ever needed.
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Protected
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide current and new password');
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
    }

    const admin = await Admin.findById(req.admin._id);

    if (!(await admin.matchPassword(currentPassword))) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    admin.password = newPassword; // pre('save') hook will hash this automatically
    await admin.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    });
});

// @desc    Create a new staff account (editor or telecaller) — superadmin only
// @route   POST /api/v1/auth/create-staff
// @access  Protected (superadmin only)
export const createStaff = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('Name, email, password, and role are required');
    }

    if (!['editor', 'telecaller'].includes(role)) {
        res.status(400);
        throw new Error('Role must be editor or telecaller');
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
        res.status(400);
        throw new Error('An account with this email already exists');
    }

    const staff = await Admin.create({ name, email, password, role });

    res.status(201).json({
        success: true,
        message: `${role} account created successfully`,
        data: { id: staff._id, name: staff.name, email: staff.email, role: staff.role },
    });
});

// @desc    Get all staff accounts — superadmin only
// @route   GET /api/v1/auth/staff
// @access  Protected (superadmin only)
export const getStaff = asyncHandler(async (req, res) => {
    const staff = await Admin.find({ role: { $ne: 'superadmin' } }).select('-password');
    res.status(200).json({ success: true, data: staff });
});

// @desc    Delete a staff account — superadmin only
// @route   DELETE /api/v1/auth/staff/:id
// @access  Protected (superadmin only)
export const deleteStaff = asyncHandler(async (req, res) => {
    const staff = await Admin.findById(req.params.id);
    if (!staff) {
        res.status(404);
        throw new Error('Staff account not found');
    }
    if (staff.role === 'superadmin') {
        res.status(400);
        throw new Error('Cannot delete a superadmin account');
    }
    await staff.deleteOne();
    res.status(200).json({ success: true, message: 'Staff account deleted' });
});