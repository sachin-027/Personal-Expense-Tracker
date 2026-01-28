import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Animated Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-300 rounded-full animate-float-1"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-yellow-300 rounded-full animate-float-2"></div>
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-blue-300 rounded-full animate-float-3"></div>
          <div className="absolute top-1/3 right-20 w-3 h-3 bg-pink-300 rounded-full animate-float-4"></div>
        </div>

        {/* Main Circular Stage */}
        <div className="relative w-96 h-96 bg-white rounded-full shadow-2xl flex items-center justify-center animate-rotate-slow border-4 border-purple-100">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse-glow"></div>
          
          {/* Rupees Sign - Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-bulb-glow">
            {/* Glow rings */}
            <div className="absolute inset-0 -m-12 bg-yellow-200/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 -m-8 bg-yellow-300/50 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute inset-0 -m-4 bg-yellow-400/40 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            
            {/* Rupees Symbol - Large */}
            <div className="relative flex items-center justify-center">
              <div className="text-9xl font-bold text-yellow-500 drop-shadow-2xl filter brightness-125" style={{textShadow: '0 0 40px rgba(234, 179, 8, 0.8)'}}>₹</div>
              
              {/* Light rays around rupees */}
              <div className="absolute -left-16 top-16 w-10 h-2 bg-yellow-400 rounded-full animate-ray-pulse"></div>
              <div className="absolute -right-16 top-16 w-10 h-2 bg-yellow-400 rounded-full animate-ray-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-2 h-10 bg-yellow-400 rounded-full animate-ray-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute -left-10 top-8 w-7 h-2 bg-yellow-400 rounded-full rotate-45 animate-ray-pulse" style={{animationDelay: '0.6s'}}></div>
              <div className="absolute -right-10 top-8 w-7 h-2 bg-yellow-400 rounded-full -rotate-45 animate-ray-pulse" style={{animationDelay: '0.8s'}}></div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-2 bg-yellow-400 rounded-full animate-ray-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>

          {/* Coin Stack - Person standing on it */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-32 h-10 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-full shadow-2xl border-4 border-yellow-500 animate-coin-bob"
                style={{
                  marginTop: i === 0 ? '0' : '-6px',
                  animationDelay: `${i * 0.1}s`,
                  position: 'relative',
                  zIndex: 10 - i
                }}
              >
                {/* Coin shine */}
                <div className="absolute top-1 left-1/4 w-16 h-4 bg-yellow-100/80 rounded-full blur-sm"></div>
                {/* Coin detail */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-6 border-2 border-yellow-600/40 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Floating Coins - Animated */}
          <div className="absolute top-24 left-16 w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-2xl border-4 border-yellow-500 animate-coin-float-1">
            <div className="absolute inset-2 border-2 border-yellow-600/40 rounded-full"></div>
            <div className="absolute top-2 left-4 w-6 h-4 bg-yellow-100/80 rounded-full blur-sm"></div>
          </div>
          
          <div className="absolute top-1/2 right-12 w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-2xl border-4 border-yellow-500 animate-coin-float-2">
            <div className="absolute inset-2 border-2 border-yellow-600/40 rounded-full"></div>
            <div className="absolute top-2 left-3 w-5 h-3 bg-yellow-100/80 rounded-full blur-sm"></div>
          </div>
          
          <div className="absolute bottom-24 left-12 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-2xl border-4 border-yellow-500 animate-coin-float-3">
            <div className="absolute inset-2 border-2 border-yellow-600/40 rounded-full"></div>
            <div className="absolute top-1 left-2 w-4 h-3 bg-yellow-100/80 rounded-full blur-sm"></div>
          </div>

          {/* Small Coins flying toward bulb */}
          <div className="absolute top-28 left-24 w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-xl border-2 border-yellow-500 animate-coin-to-bulb-1"></div>
          <div className="absolute top-32 right-28 w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-xl border-2 border-yellow-500 animate-coin-to-bulb-2"></div>
        </div>

        {/* Decorative Text */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-purple-700 text-2xl font-bold drop-shadow-sm animate-fade-in">Personal Expense Tracker</p>
          <p className="text-purple-600 text-sm mt-2 drop-shadow-sm animate-fade-in" style={{animationDelay: '0.5s'}}>Smart Money Management</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Please enter your details to log in</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 Characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
              SignUp
            </Link>
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default Login;
