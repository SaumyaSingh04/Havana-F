import React, { useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaBuilding, FaUtensils, FaEye, FaEyeSlash } from 'react-icons/fa';

const DEPARTMENTS = [
  { id: 1, name: 'laundry' },
  { id: 2, name: 'reception' },
  { id: 3, name: 'maintenance' },
  { id: 4, name: 'other' },
  { id: 5, name: 'housekeeping' }
];

const departmentOptions = DEPARTMENTS.map(dep => ({ value: dep, label: `${dep.name.charAt(0).toUpperCase() + dep.name.slice(1)}` }));

const Register = ({ onSuccess }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    department: [],
    restaurantRole: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      if (form.role === 'admin') {
        payload.department = DEPARTMENTS;
      }
      if (form.role === 'STAFF' && Array.isArray(form.department)) {
        payload.department = form.department.map(dep => dep.value);
      }
      await axios.post('/api/users/add', payload);
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, type = 'text', name, value, onChange, required = false, placeholder }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Add New User</h2>
          <p className="text-blue-100 text-sm">Create a new account for team member</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <InputField
            icon={FaUser}
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
          />

          <InputField
            icon={FaEnvelope}
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserTag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white appearance-none"
              >
                <option value="">Select role</option>
                <option value="ADMIN">👑 Admin</option>
                <option value="GM">🏢 General Manager</option>
                <option value="FRONT DESK">🏨 Front Desk</option>
                <option value="ACCOUNTS">💰 Accounts</option>
                <option value="STAFF">👥 Staff</option>
              </select>
            </div>
          </div>

          {form.role === 'STAFF' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <FaBuilding className="inline h-4 w-4 mr-2" />
                Department(s)
              </label>
              <Select
                isMulti
                name="department"
                options={departmentOptions}
                value={form.department}
                onChange={selected => setForm(prev => ({
                  ...prev,
                  department: selected
                }))}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select departments..."
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '48px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    '&:hover': {
                      border: '1px solid #3b82f6'
                    },
                    '&:focus-within': {
                      backgroundColor: 'white',
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
                    }
                  })
                }}
                required
              />
              <p className="text-xs text-gray-500 mt-1">💡 Select one or more departments for this staff member</p>
            </div>
          )}

          {form.role === 'restaurant' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Restaurant Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUtensils className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="restaurantRole"
                  value={form.restaurantRole}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="">Select restaurant role</option>
                  <option value="staff">👨‍🍳 Staff</option>
                  <option value="cashier">💳 Cashier</option>
                  <option value="chef">🍳 Chef</option>
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-400 mr-3">⚠️</div>
                <div className="text-red-800 text-sm font-medium">{error}</div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaUser className="mr-2" />
                Create User Account
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
