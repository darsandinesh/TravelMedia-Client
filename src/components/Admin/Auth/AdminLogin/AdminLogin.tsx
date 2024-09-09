import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { toast } from 'sonner';
import axios from 'axios';
import { adminEndpoints } from '../../../../constraints/endpoints/adminEndpoints';

const AdminLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  // Function to validate the email format
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if email and password are filled
    if (!email || !password) {
      toast.error('Both email and password are required');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }



    try {
      const result = await axios.post(adminEndpoints.login, {
        email,
        password,
      });

      if (result.data.result.success) {
        toast.success(result.data.result.message);
        console.log(result.data.result.data);
        localStorage.setItem('adminToken', result.data.result.token);
        navigate('/admin/dashboard');
      } else {
        toast.error(result.data.result.message);
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error(error);
    }
  };

  return (
    <div className="AdminLoginContainer">
      <div className="AdminLoginDiv">
        <div className="AdminLoginImage">
          <img
            src="https://worldinparis.com/wp-content/uploads/2018/06/paris-travel-planning.jpg"
            alt="Travel"
          />
        </div>
        <div className="AdminLoginForm">
          <h2>Admin Portal</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
