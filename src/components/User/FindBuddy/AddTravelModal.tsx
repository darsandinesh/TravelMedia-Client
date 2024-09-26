import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './AddTravelModal.css'; // Import the CSS file
import { IoMdClose } from "react-icons/io";
import { toast } from 'sonner';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/sotre';
import axiosInstance from '../../../constraints/axios/userAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';

interface AddTravelModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const AddTravelModal: React.FC<AddTravelModalProps> = ({ open, setOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState<boolean>(false)

  const user = useSelector((state: RootState) => state.userAuth.userData?._id);
  const [formData, setFormData] = useState({
    travelDate: '',
    location: '',
    description: '',
    maxParticipants: 5,
    isPrivate: false,
    travelDuration: 1,
    preferences: {
      budget: 'medium',
      accommodation: 'hotel',
      transportMode: 'car',
      travelType: 'solo'
    },
    mediaUrls: [] as string[],
    files: [] as File[],
    userId: user
  });

  const validateStep1 = () => {
    const { travelDate, location, description, travelDuration } = formData;
    if (!travelDate || !location || !description || !travelDuration) {
      return 'Please fill in all required fields in Step 1.';
    }
    return null;
  };

  const validateStep2 = () => {
    const { preferences } = formData;
    if (!preferences.budget || !preferences.accommodation || !preferences.transportMode || !preferences.travelType) {
      return 'Please select all preferences in Step 2.';
    }
    return null;
  };

  const validateStep3 = () => {
    if (formData.mediaUrls.length === 0) {
      return 'Please upload at least one media file in Step 3.';
    }
    return null;
  };

  const validateForm = () => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return null;
    }
  };

  const handleNextStep = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.info('Fill all fields, all are required')
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(file => URL.createObjectURL(file));
    setFormData({ ...formData, files, mediaUrls: urls });
  }

  const handleSubmit = async (data: typeof formData) => {

    setLoading(true)
    const formDataToSend = new FormData();
    formDataToSend.append('travelDate', formData.travelDate);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('maxParticipants', formData.maxParticipants.toString());
    formDataToSend.append('isPrivate', formData.isPrivate.toString());
    formDataToSend.append('travelDuration', formData.travelDuration.toString());
    formDataToSend.append('preferences', JSON.stringify(formData.preferences));
    formDataToSend.append('userId', user);

    // Append files
    formData.files.forEach(file => {
      formDataToSend.append('files', file);
    });

    try {
      const response = await axiosInstance.post(postEndpoints.findBuddy, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.status === 200) {
        toast.success("Travel Post uploaded successful");
        onClose();
        resetForm()
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong');
      onClose();
    }


  };


  const resetForm = () => {
    setFormData({
      travelDate: '',
      location: '',
      description: '',
      maxParticipants: 5,
      isPrivate: false,
      travelDuration: 1,
      preferences: {
        budget: 'medium',
        accommodation: 'hotel',
        transportMode: 'car',
        travelType: 'solo'
      },
      mediaUrls: [],
      files: [],
      userId: ''
    });
    setStep(1);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      {
        loading ?
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
          :
          <div className="modal-container">
            {/* Close button */}
            <div className="close-button" onClick={() => {
              setOpen(false);
              resetForm();
            }}>
              <IoMdClose size={25} />
            </div>

            {/* Modal Content */}
            <div className="step-content">
              {/* Step Content */}
              <div className="modal-header">
                {step === 1 && <h2>Travel Info</h2>}
                {step === 2 && <h2>Preferences</h2>}
                {step === 3 && <h2>Media Upload</h2>}
                {step === 4 && <h2>Review and Submit</h2>}
              </div>

              {step === 1 && (
                <div className="form-content">
                  <hr />
                  <label>Travel Date</label>
                  <input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  />
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <label>Duration</label>
                  <input
                    type="number"
                    max={10}
                    min={1}
                    value={formData.travelDuration}
                    onChange={(e) => setFormData({ ...formData, travelDuration: Number(e.target.value) })}
                  />
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              )}

              {step === 2 && (
                <div className="form-content">
                  <hr />
                  <label>Budget</label>
                  <select
                    value={formData.preferences.budget}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, budget: e.target.value },
                    })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <label>Travel Type</label>
                  <select
                    value={formData.preferences.travelType}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, travelType: e.target.value },
                    })}
                  >
                    <option value="solo">Solo</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                  </select>
                  <label>Accommodation</label>
                  <select
                    value={formData.preferences.accommodation}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, accommodation: e.target.value },
                    })}
                  >
                    <option value="hotel">Hotel</option>
                    <option value="hostel">Hostel</option>
                    <option value="airbnb">Airbnb</option>
                  </select>
                  <label>Transport Mode</label>
                  <select
                    value={formData.preferences.transportMode}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, transportMode: e.target.value },
                    })}
                  >
                    <option value="car">Car</option>
                    <option value="train">Train</option>
                    <option value="plane">Plane</option>
                  </select>
                </div>
              )}

              {step === 3 && (
                <div className="form-content">
                  <hr />
                  <label>Upload Media</label>
                  <input
                    type="file"
                    multiple
                    accept='image/*,video/*'

                    onChange={handelFileChange}
                  />
                  <div className="media-preview">
                    {formData.mediaUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Upload ${index}`} />
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-content">
                  <hr />
                  <h3>Travel Date: {formData.travelDate}</h3>
                  <h3>Location: {formData.location}</h3>
                  <h3>Description: {formData.description}</h3>
                  <h3>Preferences:</h3>
                  <p>Budget: {formData.preferences.budget}</p>
                  <p>Accommodation: {formData.preferences.accommodation}</p>
                  <p>Transport Mode: {formData.preferences.transportMode}</p>
                  <h3>Media:</h3>
                  <div className="media-preview">
                    {formData.mediaUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Review ${index}`} />
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="navigation-buttons">
                {step > 1 && (
                  <button
                    className="previous-button"
                    onClick={handlePrevStep}
                  >
                    Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    className="next-button"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="submit-button"
                    onClick={() => handleSubmit(formData)}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
      }

    </div>
  );
};

export default AddTravelModal;
