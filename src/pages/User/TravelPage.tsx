import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TravelPostList from '../../components/User/FindBuddy/FindBuddyList';
import AddTravelModal from '../../components/User/FindBuddy/AddTravelModal';
import NavBar from '../../components/User/Home/NavBar/NavBar';
import Pricing from '../../components/User/FindBuddy/Pricing';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/sotre';

const TravelPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [prime, setPrime] = useState<boolean>(false);

  const member = useSelector((state: RootState) => state.userAuth.userData?.prime) || false

  const handleModalClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setPrime(member);
  })

  return (
    <>
      {
        prime ?
          <div className="relative min-h-screen bg-blue-600">
            <NavBar />
            <div className="p-4 pt-20" style={{ marginTop: '50px', }}>
              <Button onClick={() => setOpen(true)} variant="contained" color="success" style={{ marginLeft: '85%' }}>
                Add New Travel
              </Button>
              <AddTravelModal open={open} setOpen={setOpen} onClose={handleModalClose} />
              <TravelPostList />
            </div>
          </div>
          :
          <Pricing />
      }
    </>
  );
};

export default TravelPage;
