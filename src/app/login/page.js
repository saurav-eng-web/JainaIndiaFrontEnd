


'use client';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/slices/authSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = e.target.username.value;
    const uPassword = e.target.password.value;
    dispatch(loginUser({ userName, uPassword }));
  };

  useEffect(() => {
    if (user) {
      const role = user.roleName?.toLowerCase();
      if (role === 'br') {
        router.push('/search-complaint');
      } else if (role === 'cc') {
        router.push('/test');
      } else if (role === 'technician') {
        router.push('/technician/jobs');
      } else {
        router.push('/search-complaint');
      }
    }
  }, [user]);

  return (
    <div className="flex h-screen font-sans">
      {/* Left Section */}
      <div
        className="flex-1 bg-cover bg-center text-white flex flex-col justify-center p-16 relative"
        style={{ backgroundImage: "url('/Banner.png')" }}
      >
        {/* <div className="relative">
          <div className="text-lg font-bold mb-8">CRM Portal</div>
          <h1 className="text-3xl font-semibold mb-4">Welcome Back</h1>
          <p className="text-base opacity-90">
            Manage your complaints, jobs, and more efficiently.
          </p>
        </div> */}
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white flex justify-center items-center">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-2">Sign in to your account</h2>
          <p className="text-sm text-gray-600 mb-6">
            
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your Username"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
              />
            </div>

            {/* Sign In Button */}
            <button
  type="submit"
  className="w-full text-white py-3 rounded-lg transition duration-200 hover:opacity-90"
  style={{ backgroundColor: '#714b67' }}
  disabled={loading}
>
  {loading ? 'Logging in...' : 'Sign in'}
</button>
            {/* Error */}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
