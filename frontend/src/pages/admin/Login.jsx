import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Login successful');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-200 px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="font-heading font-bold text-2xl text-dark-900">
                        Focus <span className="text-primary-500">360</span>
                    </h1>
                    <p className="text-dark-300 text-sm mt-1">Admin Panel Login</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none"
                            placeholder="admin@focus360degree.com"
                        />
                        {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full border border-light-400 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 text-white py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;