import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

interface TravelBuddy {
  _id: string;
  userId: string;
  travelDate: Date;
  travelType: string;
  location: string;
  description: string;
  interests: {
    userId: string;
    interestedOn: Date;
  }[];
  participants: {
    userId: string;
    joinedOn: Date;
  }[];
  maxParticipants: number;
  created_at: Date;
  isPrivate: boolean;
  travelDuration: number;
  preferences: {
    budget: string;
    accommodation: string;
    transportMode: string;
  };
  travelStatus: string;
  mediaUrls: string[];
}

const TravelPostList: React.FC = () => {
  const [posts, setPosts] = useState<TravelBuddy[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Replace this with your actual API call
        // const response = await axios.get('/api/travel-buddies');
        // setPosts(response.data);

        // Dummy data for demonstration
        setPosts([
          {
            _id: '1',
            userId: 'User1',
            travelDate: new Date('2024-05-15'),
            travelType: 'solo',
            location: 'Paris, France',
            description: 'Exploring the Eiffel Tower and the city of lights!',
            interests: [{ userId: 'User2', interestedOn: new Date() }],
            participants: [{ userId: 'User3', joinedOn: new Date() }],
            maxParticipants: 5,
            created_at: new Date(),
            isPrivate: false,
            travelDuration: 5,
            preferences: { budget: 'medium', accommodation: 'hotel', transportMode: 'flight' },
            travelStatus: 'upcoming',
            mediaUrls: [],
          },
          {
            _id: '2',
            userId: 'User4',
            travelDate: new Date('2024-06-10'),
            travelType: 'family',
            location: 'Tokyo, Japan',
            description: 'Vibrant culture and sushi in Tokyo!',
            interests: [{ userId: 'User5', interestedOn: new Date() }],
            participants: [{ userId: 'User6', joinedOn: new Date() }],
            maxParticipants: 4,
            created_at: new Date(),
            isPrivate: true,
            travelDuration: 7,
            preferences: { budget: 'high', accommodation: 'hotel', transportMode: 'train' },
            travelStatus: 'upcoming',
            mediaUrls: [],
          },
        ]);
      } catch (error) {
        console.error('Error fetching travel posts', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-blue-400 py-8 mt-11">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Travel Posts</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Explore travel posts shared by our community.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="travel-post bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mb-5 flex flex-col">
              {/* Image */}
              <img
                alt={post.location}
                src="https://via.placeholder.com/300?text=Traveling"
                className="w-full h-60 object-cover"
              />

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div className="px-4 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">{post.location}</h3>
                  <p className="mt-2 text-sm text-gray-600">{post.description}</p>
                  <p className="mt-2 text-sm text-gray-600">Type: {post.travelType}</p>
                  <p className="mt-2 text-sm text-gray-600">Status: {post.travelStatus}</p>
                  <p className="mt-2 text-sm text-gray-600">Participants: {post.participants.length}/{post.maxParticipants}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Travel Date: {new Date(post.travelDate).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Duration: {post.travelDuration} days</p>
                </div>

                {/* Buttons at the bottom */}
                <div className="flex flex-wrap gap-2 mt-4 px-4 py-4">
                  <Button variant="contained" className="bg-blue-500 text-white hover:bg-blue-600">Add to Community</Button>
                  <Button variant="contained" className="bg-blue-500 text-white hover:bg-blue-600">Chat</Button>
                  <Button variant="contained" className="bg-blue-500 text-white hover:bg-blue-600">Show Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPostList;