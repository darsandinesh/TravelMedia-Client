import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/Admin/Home/NavBar/NavBar';
import AdminPostList from '../../components/Admin/Home/AdminPostList';

const PostList = () => {
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin');
        return;
      }
    
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-grow">
        <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
          <AdminPostList />
        </main>
      </div>
    </div>
  );
};

export default PostList;
