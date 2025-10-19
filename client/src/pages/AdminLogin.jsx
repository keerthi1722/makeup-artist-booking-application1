import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const navigate = useNavigate(); 
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Login failed');
      }
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
  console.log('Artist login successful', data.user);
        try { 
          // store as artist for dashboard
          localStorage.setItem('artistEmail', email);
          localStorage.setItem('artistName', data.user.fullname || data.user.name || 'Artist');
        } catch {}
        alert('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const { fullname, email, password, confirmpassword } = formData;

    if (!fullname || !email || !password || !confirmpassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmpassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/login/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Registration failed');
      }
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
  console.log('Artist registration successful', data.user);
        try { 
          // store as artist for dashboard
          localStorage.setItem('artistEmail', email);
          localStorage.setItem('artistName', fullname);
        } catch {}
        alert('Registration successful! You can now login.');
        setIsLogin(true);
        setFormData({
          fullname: '',
          email: '',
          password: '',
          confirmpassword: ''
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div 
      className="w-full min-h-screen pt-16 pb-24 flex justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://th.bing.com/th/id/OIP.RkavFHWFY_HneFqpwnisfgHaE8?w=276&h=184&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3')`
      }}
    >
      <div className="w-96 bg-black/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-600/30 relative">
        <div className="flex justify-center mb-12">
          <button
            className={`text-2xl mr-6 px-4 py-2 rounded-lg transition-all duration-300 ${
              isLogin 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`text-2xl px-4 py-2 rounded-lg transition-all duration-300 ${
              !isLogin 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <div className="space-y-6">
          {isLogin ? (
            <form id="loginForm" onSubmit={handleSubmitLogin} className="transition-opacity duration-500">
              <div className="mb-4">
                <label htmlFor="email" className="block uppercase text-sm mb-2 text-white">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block uppercase text-sm mb-2 text-white">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  required
                />
              </div>
              <input
                type="submit"
                value="Submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 uppercase font-bold rounded-xl cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              />
            </form>
          ) : (
            <form id="registerForm" onSubmit={handleSubmitRegister} className="transition-opacity duration-500">
              <div className="mb-4">
                <label htmlFor="fullname" className="block uppercase text-sm mb-2 text-white">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block uppercase text-sm mb-2 text-white">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block uppercase text-sm mb-2 text-white">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmpassword" className="block uppercase text-sm mb-2 text-white">Confirm Password</label>
                <input
                  type="password"
                  id="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  required
                />
              </div>
              <input
                type="submit"
                value="Submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 uppercase font-bold rounded-xl cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              />
            </form>
          )}
        </div>

        {isLogin && (
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Forgot Password?</a>
          </div>
        )}
      </div>
    </div>
   
  );
}

export default AdminLogin;
