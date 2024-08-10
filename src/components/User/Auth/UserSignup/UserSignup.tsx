import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import './UserSignup.css';
import axios from "axios";

const UserSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = 'Email is invalid';
    }
    if (!number) newErrors.number = 'Phone number is required';
    else if (number.length < 10) newErrors.number = 'Phone number should be at least 10 digits';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password should be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    Object.keys(newErrors).forEach(key => {
      toast.error(newErrors[key]);
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {

      const userData = {
        name,
        email,
        number,
        password
      };

      const result = await axios.post('http://localhost:4000/register', userData)

      if (result.data.data.success) {
        toast.info('Verify you email address')
        localStorage.setItem('otp', result.data.data.otp);
        localStorage.setItem('user', JSON.stringify(result.data.data.user_data));
        navigate('/otp');
      } else {
        toast.error('email address already found');
      }
    }
  };

  return (
    <div className='SignupContainer'>
      <div className='SignupDiv'>
        <img
          src="https://i.pinimg.com/736x/57/d9/12/57d912449af2ec54bb79f46780854abb.jpg"
          alt="Travel"
        />
        <div className='SignupForm'>
          <h2>Travel Media</h2>
          <form onSubmit={handleSubmit}>
            <div className="input">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

            </div>
            <div className="input">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            </div>
            <div className="input">
              <label htmlFor="number">Phone Number</label>
              <input type="number" id="number" value={number} onChange={(e) => setNumber(e.target.value)} />

            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            </div>
            <div className="input">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            </div>
            <button type="submit">Sign Up</button>
            <a onClick={() => navigate('/')}>Already have an account? Login</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
