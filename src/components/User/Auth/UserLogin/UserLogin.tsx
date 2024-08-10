import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import './UserLogin.css';

const UserLogin = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('handelSubmit');

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const result: any = await axios.get('http://localhost:4000/');
            // console.log(result);
            // if (result) {
                toast.success(`Logged in successfully, message: ${result.data.message}`);
                navigate('/home')
            // }
        } catch (error) {
            toast.error('An error occurred during login');
            console.error(error);
        }
    };

    const singUp = () => {
        console.log('singUp function called');
        navigate('/Signup');
    };

    return (
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
                        <a href="#">Forgot Password?</a>
                        <button>Login</button>
                        <a onClick={singUp}>New user? SignUp</a>
                    </form>
                    <hr />
                    <p>or login with</p>
                    <button className="google-button">Google</button>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
