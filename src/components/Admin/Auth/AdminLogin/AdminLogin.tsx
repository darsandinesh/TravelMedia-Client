import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { toast } from 'sonner';
import axios from 'axios';
import Button from '@mui/joy/Button';
import { adminEndpoints } from '../../../../constraints/endpoints/adminEndpoints';

const AdminLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

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
    setLoading(true)
    if (!email || !password) {
      toast.error('Both email and password are required');
      setLoading(false)
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      setLoading(false)
      return;
    }

    try {
      const result = await axios.post(adminEndpoints.login, { email, password });
      console.log(result.data.result,'---------login data deatils of the admin')
      if (result.data.result.success) {
        toast.success(result.data.result.message);
        setLoading(false)
        localStorage.setItem('adminToken', result.data.result.token);
        navigate('/admin/dashboard');
      } else {
        setLoading(false)
        toast.error(result.data.result.message);
      }
    } catch (error) {
      setLoading(false)
      toast.error('An error occurred during login');
      console.error(error);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h2>Admin Portal</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? '🐵' : '🙈'}
            </span>
          </div>
          <div className="button-container">
            {
              loading ?
                <Button loading>Loading</Button>
                :
                <button type="submit">Login</button>
            }

          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
