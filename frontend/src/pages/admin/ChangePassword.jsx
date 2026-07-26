import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/services/api';

const ChangePassword = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await api.put('/auth/change-password', data);
            toast.success('Password changed successfully');
            reset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="max-w-md">
            <h2 className="font-heading text-2xl font-bold text-dark-900 mb-6">Change Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-light-400 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">Current Password</label>
                    <input type="password" {...register('currentPassword', { required: true })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">New Password</label>
                    <input type="password" {...register('newPassword', { required: true, minLength: 6 })} className="w-full border border-light-400 rounded-lg px-4 py-2.5" />
                    {errors.newPassword && <p className="text-danger text-xs mt-1">Minimum 6 characters</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="bg-primary-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-60">
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;