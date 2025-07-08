import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import Input from './utils/Input';
import Loader from './utils/Loader';

const SignupForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('signup', formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = { url: '/api/auth/signup', method: 'post', data: formData };
    fetchData(config)
      .then(() => navigate('/login'))
      .catch((err) => {
        const message =
          err?.response?.data?.msg ||
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong';
        alert(message);
      });
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-red-500 text-sm ${formErrors[field] ? 'block' : 'hidden'}`}>
      {formErrors[field]}
    </p>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <form
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
        onSubmit={handleSubmit}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
              Create an Account
            </h2>

            <div className="mb-5">
              <label htmlFor="name" className="block font-medium text-gray-600 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                placeholder="Your full name"
                onChange={handleChange}
              />
              {fieldError('name')}
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block font-medium text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChange}
              />
              {fieldError('email')}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block font-medium text-gray-600 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                placeholder="Choose a strong password"
                onChange={handleChange}
              />
              {fieldError('password')}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded-md font-medium hover:bg-indigo-600 transition duration-200"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-500 hover:underline">
                Log in here
              </Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
