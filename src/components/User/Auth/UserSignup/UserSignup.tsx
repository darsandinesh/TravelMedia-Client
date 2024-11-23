import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserSignup.css';
import axios from "axios";
import Spinner from "../../../Spinner/Spinner";
import { userEndpoints } from "../../../../constraints/endpoints/userEndpoints";
import { toast } from "sonner";
import Tooltip from '@mui/joy/Tooltip';


const UserSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strength, setStrength] = useState<boolean>(false);

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
    else if (number.length < 10 || number.length > 10) {
      newErrors.number = 'Phone number should be at least 10 digits';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }


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
        if (result.data.data.message == "Validation errors") {
          const errors = result.data.data.errors || {};
          Object.keys(errors).forEach((key) => {
            toast.error(errors[key]);
          });
        } else {
          setErrors({ email: 'Email address already found' });
        }
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[@$!%*?&#]/.test(password)) strength += 1;
    return strength;
  };

  const getStrengthColorClass = () => {
    switch (passwordStrength) {
      case 1:
        return 'password-strength-weak';
      case 2:
      case 3:
        return 'password-strength-medium';
      case 4:
        return 'password-strength-strong';
      default:
        return '';
    }
  };

  const getStrengthLabelColorClass = () => {
    switch (passwordStrength) {
      case 1:
        return 'password-strength-weak-text';
      case 2:
      case 3:
        return 'password-strength-medium-text';
      case 4:
        return 'password-strength-strong-text';
      default:
        return '';
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 1:
        return 'Weak';
      case 2:
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      default:
        return 'Too Short';
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0) setStrength(true);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  return (
    <div className='SignupContainer'>
      <div className='SignupDiv'>

        <div className='SignupForm'>
          <h2>Travel Media</h2>
          <form onSubmit={handleSubmit}>
            <div className="input">
              <label htmlFor="name">Name</label>
              <div className="input-wrapper">
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
            </div>
            <div className="input">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
            </div>
            <div className="input">
              <label htmlFor="number">Phone Number</label>
              <div className="input-wrapper">
                <input type="number" id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                {errors.number && <p className="error">{errors.number}</p>}
              </div>
            </div>
            <div className="input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => handlePasswordChange(e)}
              />
              <Tooltip
                title={
                  <div style={{ textAlign: 'left', padding: '8px' }}>
                    <p><strong>Password Criteria:</strong></p>
                    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                      <li>Minimum 8 characters</li>
                      <li>At least one uppercase letter (A-Z)</li>
                      <li>At least one number (0-9)</li>
                      <li>At least one special character (@, $, !, %, *, ?, &, #)</li>
                    </ul>
                  </div>
                }
                arrow
                color="success"
              >
                <i style={{marginLeft:'95%',cursor:'pointer'}} color="success">
                ❓
                </i>
              </Tooltip>
              {
                strength && (
                  <>
                    <div className="password-strength-container">
                      <div className="password-strength-bar">
                        <div
                          className={`password-strength-bar-fill ${getStrengthColorClass()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <div
                        className={`password-strength-label ${getStrengthLabelColorClass()}`}
                      >
                        {getStrengthLabel()}
                      </div>
                    </div>
                  </>
                )
              }

            </div>
            <div className="input">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="input-wrapper">
                <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              </div>
            </div>
            <button type="submit">Sign Up</button>
            <a onClick={() => navigate('/login')}>Already have an account? Login</a>
          </form>
        </div>
      </div>
    </div>



  );
};

export default UserSignup;
