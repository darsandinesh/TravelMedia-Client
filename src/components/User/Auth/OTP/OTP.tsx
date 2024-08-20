import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import './Otp.css';
import axios from "axios";

const OTP = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState<number>(60);

  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(otp);

    const OTP = localStorage.getItem('otp');
    localStorage.removeItem('otp');
    console.log(typeof (OTP), 'backend otp');
    let userOtp = '';
    for (let i = 0; i < otp.length; i++) {
      userOtp += otp[i];
    }

    console.log(typeof (userOtp));
    if (OTP === userOtp) {
      let userData = localStorage.getItem('user');
      const result = await axios.post('http://localhost:4000/verifyOtp', userData);
      console.log(result, '-----------------------------------------otp');
      if (result.data.success) {
        toast.success(result.data.data.message);
        navigate('/');
      }else{
        toast.info(result.data.data.message);
      }


    } else {
      console.log('else');
      toast.error('invalid otp');
    }
  };

  const handleResend = () => {
    setTimer(60);
    toast.info('OTP resend success');
  };

  return (
    <div className='OtpContainer'>
      {/* <Toaster position="top-center" richColors /> */}
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
