import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import './Otp.css';
import axios from "axios";
import { userEndpoints } from "../../../../constraints/endpoints/userEndpoints";

const OTP = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem('otp-timer');
    return savedTimer ? parseInt(savedTimer) : 60;
  });

  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) navigate('/home')
    if (timer > 0) {
      localStorage.setItem('otp-timer', timer.toString());
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      localStorage.setItem('otp-timer', '0');
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(otp);

    const OTP = localStorage.getItem('otp');

    console.log(typeof (OTP), 'backend otp');
    let userOtp = otp.join('');

    console.log(typeof (userOtp));
    if (OTP === userOtp) {
      if (timer > 0) {
        let userData = localStorage.getItem('user');
        const result = await axios.post(userEndpoints.verifyOtp, userData);
        localStorage.removeItem('otp');
        localStorage.removeItem('otp-timer');
        if (result.data.success) {
          toast.success(result.data.data.message);
          navigate('/');
        } else {
          toast.info(result.data.data.message);
        }
      } else {
        toast.warning('OTP expired, Try resending the otp')
      }

    } else {
      console.log('else');
      toast.error('invalid otp');
    }
  };

  const handleResend = async () => {
    let userData = localStorage.getItem('user');
    const result = await axios.post(userEndpoints.resendOtp, userData);
    if (result.data.success) {
      toast.success(result.data.data.message);
      localStorage.setItem('otp', result.data.data.otp);
      setTimer(60);
      localStorage.setItem('otp-timer', '60');
    } else {
      toast.error(result.data.data.message);
    }
  };
  

  return (
    <div className='OtpContainer'>
      <div className='OtpDiv'>
        <img src="https://wallpaper.forfun.com/fetch/00/0043a0b0e55215af9fd47074c5cf9497.jpeg" alt="image" />
        <div className='OtpForm'>
          <h2>Travel Media</h2>
          <hr />
          <h6>Verify your email address</h6>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-input"
                />
              ))}
            </div>
            <p>OTP expires in {timer} seconds</p>
            <button type="submit">Submit</button>
            <button type="button" onClick={handleResend} disabled={timer > 0}>Resend</button>
          </form>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default OTP;
