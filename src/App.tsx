import { Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='/*' element={<UserRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
