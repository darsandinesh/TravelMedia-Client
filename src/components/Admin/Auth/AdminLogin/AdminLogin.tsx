import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // Import the CSS file

const AdminLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, '---', password);
    navigate('/admin/dashboard');
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
