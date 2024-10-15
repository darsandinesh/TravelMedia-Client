import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Buttons from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import './TravelPostList.css'; // Import the CSS file
import axiosInstance from '../../../constraints/axios/userAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface TravelBuddy {
  _id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await axiosInstance.get(postEndpoints.getfindBuddy);
        console.log(result.data.data);

        if (result.data.success) {
          const postData = result.data.data;  // Array of posts with user data
          setPosts(postData);
        } else {
          toast.error('Something went wrong');
        }
      } catch (error) {
        console.error('Error fetching travel posts', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="travel-post-list">
      <div className="container">
        <div className="header">
          <h2>Travel Posts</h2>
        </div>

        <div className="card-container">
          {posts.map((post) => (
            <Card key={post._id} className="travel-post-card">
              <AspectRatio flex ratio="1" className="aspect-ratio">
                <img
                  src={post.mediaUrls[0] && post.mediaUrls[0] !== '' ? post.mediaUrls[0] : 'https://example.com/path/to/user-icon.png'} // User icon URL
                  loading="lazy"
                  alt={post.mediaUrls[0] && post.mediaUrls[0] !== '' ? "Travel" : "User Icon"} // Alt text based on image presence
                  style={{ objectFit: 'cover' }} // Ensures the image fits nicely within the AspectRatio box
                />
              </AspectRatio>



              <CardContent className="details">
                <div className="user-info" style={{ display: 'flex', gap: '1.5rem', padding: 5, marginTop: 4 }}>
                  <img className="user-avatar" src={post.user.avatar} alt={`${post.user.name}'s avatar`} style={{ borderRadius: '50%', height: '50px' }} />
                  <Typography className="user-name" sx={{ marginTop: '12px' }}>{post.user.name}</Typography>
                </div>

                <Typography className="location" sx={{ fontWeight: 'bold' }}>
                  Location: {post.location.split(',')[0]}
                </Typography>


                <Typography className="description" sx={{ fontSize: '500' }}>
                  Description: {post.description}
                </Typography>

                <Sheet className="info-sheet">
                  {/* Info Items with Flexbox */}
                  <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <Typography className="label">Travel Date</Typography>
                    <Typography className="value">{new Date(post.travelDate).toDateString()}</Typography>
                  </div>
                  <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <Typography className="label">Budget</Typography>
                    <Typography className="value">{post.preferences.budget}</Typography>
                  </div>
                  <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <Typography className="label">Accommodation</Typography>
                    <Typography className="value">{post.preferences.accommodation}</Typography>
                  </div>
                  <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <Typography className="label">Transport Mode</Typography>
                    <Typography className="value">{post.preferences.transportMode}</Typography>
                  </div>
                </Sheet>

                <Box className="button-group" sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                  <Buttons variant="outlined" color="neutral" onClick={() => navigate(`/chats/${post._id}`)}>
                    Chat
                  </Buttons>
                  <Buttons variant="solid" color="primary">
                    Direction
                  </Buttons>
                </Box>
              </CardContent>

            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPostList;
