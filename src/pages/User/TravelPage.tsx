import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TravelPostList from '../../components/User/FindBuddy/FindBuddyList';
import AddTravelModal from '../../components/User/FindBuddy/AddTravelModal';
import NavBar from '../../components/User/Home/NavBar/NavBar';
import Pricing from '../../components/User/FindBuddy/Pricing';

const TravelPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [prime, setPrime] = useState<boolean>(false)

  const handleModalClose = () => {
    setOpen(false);
    setRefreshPosts(true); // Trigger post list refresh after modal close
  };

  const primeFn = () => {
    setPrime(true);
  }

  return (
    <>
      {
        prime ?
          <div className="relative min-h-screen bg-blue-600">
            <NavBar />
            <div className="p-4 pt-20" style={{ marginTop: '50px', }}> {/* Adjusted padding-top to avoid overlap with NavBar */}
              <Button onClick={() => setOpen(true)} variant="contained" color="success" style={{ marginLeft: '85%' }}>


                Add New Travel
              </Button>
              <AddTravelModal open={open} setOpen={setOpen} onClose={handleModalClose} />
              <TravelPostList />
              {/* <TravelPostList refresh={refreshPosts} setRefresh={setRefreshPosts} /> */}

            </div>

          </div>
          :
          <Pricing Fn={primeFn} />
      }


    </>
  );
};

export default TravelPage;
