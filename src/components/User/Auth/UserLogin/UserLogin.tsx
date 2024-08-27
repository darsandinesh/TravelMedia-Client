import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Spinner from '../../../Spinner/Spinner';
import Swal from 'sweetalert2'
import './UserLogin.css';

interface DecodedToken {
    iss: string;
    nbf: number;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    azp: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
}

const UserLogin = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (userToken) navigate('/home')
    })

    const handleSuccess = async (credentialResponse: any) => {
        console.log(credentialResponse);

        if (credentialResponse.credential) {
            // Decode the JWT token
            const decoded: DecodedToken = jwtDecode<DecodedToken>(credentialResponse.credential);
            console.log(decoded);

            const userData = {
                email: decoded.email,
                fullname: decoded.name,
            };

            try {
                // Send the extracted data to your backend
                const result = await axios.post('http://localhost:4000/google-login', userData);

                if (result.data.success) {
                    toast.success(result.data.message);
                    localStorage.setItem('userToken', result.data.token);
                    navigate('/home');
                } else {
                    toast.error(result.data.message);
                }
            } catch (error) {
                toast.error('An error occurred during registration');
                console.error(error);
            }
        } else {
            console.error('Credential response does not contain a valid JWT token');
        }
    };


    const handleError = () => {
        toast.info('Login Failed');
    };

    const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('handelSubmit');

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {

            const result = await axios.post('http://localhost:4000/login', {
                email,
                password,
            });
            console.log(result)
            if (result.data.success) {
                toast.success(result.data.message);
                localStorage.setItem('userToken', result.data.token);
                navigate('/home')
            } else {
                toast.error(result.data.message);
            }
        } catch (error) {
            toast.error('An error occurred during login');
            console.error(error);
        }
    };

    const singUp = () => {
        console.log('singUp function called');
        navigate('/Signup');
    };


    const forgotPassword = async () => {
        try {
            const { value: email } = await Swal.fire({
                title: "Forgot Password",
                input: "email",
                inputLabel: "Enter your email address",
                inputPlaceholder: "Enter your email address",
                showCloseButton: true,
            });

            if (email) {
                setLoading(true);
                const verifyResponse = await axios.post('http://localhost:4000/verifyEmail', { email });
                console.log('Full Response:', verifyResponse.data);

                // Check if verifyResponse.data and verifyResponse.data.data exist
                if (verifyResponse.data.success) {
                    setLoading(false);
                    localStorage.setItem('verifyEmail', verifyResponse.data.user_data.otp);

                    if (verifyResponse.data.success) {
                        const { value: otp } = await Swal.fire({
                            title: "OTP Verification",
                            input: "text",
                            inputLabel: "Enter the OTP sent to your email",
                            inputPlaceholder: "OTP",
                            confirmButtonText: "Verify",
                            showCancelButton: true,
                            inputValidator: (value) => {
                                if (!value) {
                                    return "You need to enter the OTP!";
                                }
                                if (value != verifyResponse.data.user_data.otp) {
                                    return "Invalid otp"
                                }
                            }
                        });

                        console.log(otp, '------------------otp');

                        if (otp) {
                            const localOtp = otp.trim();
                            const OTP = localStorage.getItem('verifyEmail')?.trim();
                            localStorage.removeItem('verifyEmail');
                            console.log(OTP, '---------------------', localOtp);

                            if (OTP === localOtp) {
                                const { value: formValues } = await Swal.fire({
                                    title: "Reset Password",
                                    html:
                                        '<input id="swal-input1" type="password" class="swal2-input" placeholder="New Password">' +
                                        '<input id="swal-input2" type="password" class="swal2-input" placeholder="Confirm Password">',
                                    focusConfirm: false,
                                    confirmButtonText: "Change Password",
                                    showCancelButton: true,
                                    preConfirm: () => {
                                        const password = (document.getElementById('swal-input1') as HTMLInputElement).value;
                                        const confirmPassword = (document.getElementById('swal-input2') as HTMLInputElement).value;

                                        if (!password || !confirmPassword) {
                                            Swal.showValidationMessage('Both fields are required!');
                                            return;
                                        }

                                        if (password !== confirmPassword) {
                                            Swal.showValidationMessage('Passwords do not match!');
                                            return;
                                        }

                                        return { password, confirmPassword };
                                    }
                                });

                                if (formValues) {
                                    const { password } = formValues;
                                    setLoading(true);
                                    const resetResponse = await axios.post('http://localhost:4000/resetPassword', {
                                        email,
                                        newPassword: password
                                    });

                                    if (resetResponse.data.success) {
                                        setLoading(false);
                                        Swal.fire({
                                            title: "Success",
                                            text: "Your password has been reset!",
                                            icon: "success",
                                            confirmButtonText: "OK",
                                        });
                                        navigate('/');
                                    } else {
                                        toast.error(resetResponse.data.message);
                                    }
                                }
                            } else {
                                await Swal.fire({
                                    title: "Invalid OTP",
                                    text: "The OTP you entered is incorrect. Please try again.",
                                    icon: "error",
                                    confirmButtonText: "Retry"
                                });
                            }

                        }
                    } else {
                        toast.error(verifyResponse.data.message);
                    }
                } else {
                    toast.error(verifyResponse.data.message);
                }
            }
        } catch (error) {
            toast.error('An error occurred during the process.');
            console.error(error);
        }
    };




    // const forgotPassword = async () => {
    //     const { value: email } = await Swal.fire({
    //         title: "Email Address",
    //         input: "email",
    //         inputLabel: "Your email address",
    //         inputPlaceholder: "Enter your email address",
    //         showCloseButton: true
    //     });
    //     if (email) {
    //         Swal.fire('verifying your email address');
    //         const result = await axios.post('http://localhost:4000/verifyEmail', {
    //             email,
    //         });
    //         if(result.data.success){
    //             navigate('/otp')
    //         }
    //         console.log(result);
    //     }
    // }

    return (

        <>
            {
                loading
                    ?
                    <Spinner />
                    :
                    <div className='LoginContainer'>
                        <div className='LoginDiv'>
                            <img src="https://thumbs.dreamstime.com/b/family-travel-lifestyle-father-hiking-child-mountain-adventures-norway-healthy-outdoor-active-vacations-dad-kid-together-307407296.jpg" alt="image" />
                            <div className='LoginForm'>
                                <h2>Travel Media</h2>
                                <form onSubmit={handelSubmit}>
                                    <div className="input-container">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <i className="icon user-icon"></i>
                                    </div>
                                    <div className="input-container">
                                        <label htmlFor="password">Password</label>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" />
                                        <i className="icon password-icon"></i>
                                    </div>
                                    <a onClick={forgotPassword}>Forgot Password?</a>
                                    <button>Login</button>
                                    <a onClick={singUp}>New user? SignUp</a>
                                </form>
                                <hr />
                                <p>or login with</p>
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

export default UserLogin;
