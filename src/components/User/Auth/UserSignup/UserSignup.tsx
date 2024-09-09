import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserSignup.css';
import axios from "axios";
import Spinner from "../../../Spinner/Spinner";
import { userEndpoints } from "../../../../constraints/endpoints/userEndpoints";

const UserSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Error state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    number?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) navigate('/home')
  })

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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const otpTimer = localStorage.getItem('otp-timer');
    if (otpTimer === '0') {
      localStorage.removeItem('otp-timer');
    }
    e.preventDefault();
    if (validateForm()) {

      const userData = {
        name,
        email,
        number,
        password
      };
      setLoading(true);
      const result = await axios.post(userEndpoints.register, userData)

      if (result.data.data.success) {
        setLoading(false);
        localStorage.setItem('otp', result.data.data.otp);
        navigate('/otp');
      } else {
        setLoading(false);
        setErrors({ email: 'Email address already found' });
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

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
              {errors.name && <p style={{ color: 'red' }} className="error">{errors.name}</p>}
            </div>
            <div className="input">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <p style={{ color: 'red' }} className="error">{errors.email}</p>}
            </div>
            <div className="input">
              <label htmlFor="number">Phone Number</label>
              <input type="number" id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
              {errors.number && <p style={{ color: 'red' }} className="error">{errors.number}</p>}
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <p style={{ color: 'red' }} className="error">{errors.password}</p>}
            </div>
            <div className="input">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {errors.confirmPassword && <p style={{ color: 'red' }} className="error">{errors.confirmPassword}</p>}
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
