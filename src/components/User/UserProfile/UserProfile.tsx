import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from '../../Spinner/Spinner';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  location: string;
  joinedDate: string;
  postsCount: number;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<User>(`/userProfile`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user profile.');
        setLoading(false);
        toast.error('Unable to fetch the user details');
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div> <Spinner /> </div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-1/4 p-6 bg-white shadow-md rounded-lg" >
      <div className="flex items-start border-b border-gray-300 pb-6 mb-6">
        <img
          src="https://media.istockphoto.com/id/843408508/photo/photography-camera-lens-concept.jpg?s=612x612&w=0&k=20&c=-tm5TKrPDMakrT1vcOE-4Rlyj-iBVdzKuX4viFkd7Vo="
          alt={user?.name}
          className="w-36 h-36 rounded-full object-cover mr-6"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
              Edit Profile
            </button>
          </div>
          <div className="flex space-x-6 mb-4">
            <div>
              <span className="font-semibold">{user?.postsCount}</span> posts
            </div>
            <div>
              <span className="font-semibold">123</span> followers
            </div>
            <div>
              <span className="font-semibold">456</span> following
            </div>
          </div>
          <p className="text-gray-700">{user?.bio}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* Replace with actual post images */}
        <img src="https://via.placeholder.com/300" alt="Post 1" className="w-full h-64 object-cover rounded-lg" />
        <img src="https://via.placeholder.com/300" alt="Post 2" className="w-full h-64 object-cover rounded-lg" />
        <img src="https://via.placeholder.com/300" alt="Post 3" className="w-full h-64 object-cover rounded-lg" />
        <img src="https://via.placeholder.com/300" alt="Post 4" className="w-full h-64 object-cover rounded-lg" />
        <img src="https://via.placeholder.com/300" alt="Post 5" className="w-full h-64 object-cover rounded-lg" />
        <img src="https://via.placeholder.com/300" alt="Post 6" className="w-full h-64 object-cover rounded-lg" />
      </div>
    </div>

  );
};

export default UserProfile;
